/* eslint-disable react/no-unescaped-entities */

// firebase/smsService.ts
import {
  collection,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { db, auth } from "./config";
import { LovedOnes } from "./getFriendsFamily";

// Global map to store confirmation results
let confirmationResults: Map<string, ConfirmationResult> = new Map();

// Setup reCAPTCHA verifier with proper cleanup
export const setupRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
  // Clear any existing reCAPTCHA first
  clearRecaptchaCompletely();

  // Ensure the container exists and is empty
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = ''; // Clear any existing content
  }

  try {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: (response: any) => {
        console.log('reCAPTCHA resolved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
        // Clear and reinitialize on expiry
        clearRecaptchaCompletely();
      }
    });

    return window.recaptchaVerifier;
  } catch (error) {
    console.error('Error setting up reCAPTCHA:', error);
    clearRecaptchaCompletely();
    throw error;
  }
};

// Comprehensive reCAPTCHA cleanup function
const clearRecaptchaCompletely = (): void => {
  try {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    
    // Clear the container
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
    }
    
    // Clear any global reCAPTCHA variables that might exist
    if (typeof window !== 'undefined' && (window as any).grecaptcha) {
      try {
        (window as any).grecaptcha.reset();
      } catch (e) {
        // Ignore reset errors
      }
    }
  } catch (error) {
    console.error('Error clearing reCAPTCHA:', error);
  }
};

// Send OTP using Firebase Phone Auth with improved error handling
export async function sendOTPViaFirebase(
  phoneNumber: string,
  personId: string
): Promise<boolean> {
  try {
    // Always clear and reinitialize reCAPTCHA for fresh start
    clearRecaptchaCompletely();
    
    // Wait a bit to ensure cleanup is complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const appVerifier = setupRecaptcha();
    
    if (!appVerifier) {
      throw new Error("Failed to initialize reCAPTCHA verifier");
    }

    // Render the reCAPTCHA before using it
    await appVerifier.render();

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    );

    confirmationResults.set(personId, confirmationResult);
    console.log("✅ OTP sent successfully via Firebase");
    return true;
    
  } catch (error: any) {
    console.error("❌ Error sending OTP via Firebase:", error);
    
    // Handle specific reCAPTCHA errors
    if (error.message?.includes('reCAPTCHA has already been rendered')) {
      console.log('Attempting to recover from reCAPTCHA render error...');
      clearRecaptchaCompletely();
      
      // Try once more after clearing
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const appVerifier = setupRecaptcha();
        await appVerifier.render();
        
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          appVerifier
        );
        
        confirmationResults.set(personId, confirmationResult);
        console.log("✅ OTP sent successfully via Firebase (retry)");
        return true;
      } catch (retryError) {
        console.error("❌ Retry also failed:", retryError);
      }
    }

    // Always clear on error
    clearRecaptchaCompletely();
    return false;
  }
}

// Verify OTP
export async function verifyFirebaseOTP(
  personId: string,
  otp: string
): Promise<boolean> {
  try {
    const confirmationResult = confirmationResults.get(personId);

    if (!confirmationResult) {
      console.error("No confirmation result found for:", personId);
      return false;
    }

    const result = await confirmationResult.confirm(otp);

    if (result.user) {
      console.log("✅ OTP verified successfully");
      confirmationResults.delete(personId);
      await auth.signOut();
      
      // Clear reCAPTCHA after successful verification
      clearRecaptchaCompletely();
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ OTP verification failed:", error);
    
    // Clean up on verification failure
    confirmationResults.delete(personId);
    clearRecaptchaCompletely();
    return false;
  }
}

// Firebase operations
export const loveMessageOperations = {
  generateAndSendOTP: async (
    personName: string
  ): Promise<{ person: LovedOnes | null; success: boolean }> => {
    try {
      const q = query(
        collection(db, "lovedones"),
        where("name", "==", personName)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const personDoc = querySnapshot.docs[0];
        const personData = personDoc.data() as LovedOnes;

        await updateDoc(personDoc.ref, {
          totalAttempts: increment(1),
          lastAttemptAt: serverTimestamp(),
        });

        const success = await sendOTPViaFirebase(
          personData.phoneNumber,
          personDoc.id
        );

        return {
          person: { ...personData, id: personDoc.id },
          success,
        };
      }

      return { person: null, success: false };
    } catch (error) {
      console.error("Error generating OTP:", error);
      throw error;
    }
  },

  verifyOTP: async (personId: string, enteredOTP: string): Promise<boolean> => {
    try {
      const isValid = await verifyFirebaseOTP(personId, enteredOTP);

      if (isValid) {
        const personRef = doc(db, "lovedones", personId);
        await updateDoc(personRef, {
          lastVerifiedAt: serverTimestamp(),
        });
      }

      return isValid;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return false;
    }
  },

  incrementViewCount: async (personId: string): Promise<void> => {
    try {
      const personRef = doc(db, "lovedones", personId);

      const q = query(
        collection(db, "lovedones"),
        where("__name__", "==", personId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const currentData = querySnapshot.docs[0].data();
        const isFirstView = !currentData.viewCount || currentData.viewCount === 0;

        const updateData: any = {
          viewCount: increment(1),
          lastViewedAt: serverTimestamp(),
        };

        if (isFirstView) {
          updateData.firstViewedAt = serverTimestamp();
        }

        await updateDoc(personRef, updateData);
      }
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  },

  updateFeedback: async (personId: string, feedbackText: string) => {
    try {
      const personRef = doc(db, 'lovedones', personId);
      
      await updateDoc(personRef, {
        feedback: feedbackText
      });
      
      console.log('Feedback updated successfully for person:', personId);
      return { success: true };
    } catch (error) {
      console.error('Error updating feedback:', error);
      throw error;
    }
  },

  clearRecaptcha: (): void => {
    clearRecaptchaCompletely();
    confirmationResults.clear();
  },
};

// Add this to global types
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}