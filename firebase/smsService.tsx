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

// Setup reCAPTCHA verifier
export const setupRecaptcha = (containerId: string = 'recaptcha-container'): RecaptchaVerifier => {
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: (response: any) => {
      console.log('reCAPTCHA resolved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });

  window.recaptchaVerifier.render().then((widgetId: any) => {
    console.log('reCAPTCHA rendered with widgetId:', widgetId);
  });

  return window.recaptchaVerifier;
};


// Send OTP using Firebase Phone Auth
export async function sendOTPViaFirebase(
  phoneNumber: string,
  personId: string
): Promise<boolean> {
  try {
    // Initialize reCAPTCHA if not already done
    if (!window.recaptchaVerifier) {
      setupRecaptcha();
    }

    const appVerifier = window.recaptchaVerifier;
if (!appVerifier) {
  throw new Error("reCAPTCHA verifier not initialized.");
}

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

    // Reset reCAPTCHA if there's an error
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }

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
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ OTP verification failed:", error);
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

  // Add this to your smsService.js file
  updateFeedback: async (personId:string, feedbackText:string) => {
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
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    confirmationResults.clear();
  },
};

// Add this to global types
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}
