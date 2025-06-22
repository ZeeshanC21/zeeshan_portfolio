/* eslint-disable react/no-unescaped-entities */

"use client"
import React, { useState, useEffect } from 'react';
import { Heart, X, Sparkles, Mail } from 'lucide-react';
import { loveMessageOperations } from '../../../firebase/smsService';
import { getFriendsFamily } from '../../../firebase/getFriendsFamily';
import { Timestamp } from 'firebase/firestore';

// Types matching your interface
interface LovedOnes {
  id: string;
  name: string;
  phoneNumber: string;
  personalMessage: string;
  totalAttempts: number;
  firstViewedAt: Timestamp | null;
  lastViewedAt: Timestamp | null;
  viewCount?: number;
  feedback?: string;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

type Step = 'intro' | 'name' | 'otp' | 'letter' | 'feedback';

const FloatingLoveButton: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [step, setStep] = useState<Step>('intro');
  const [name, setName] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [currentPerson, setCurrentPerson] = useState<LovedOnes | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lovedOnes, setLovedOnes] = useState<LovedOnes[]>([]);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  
  // Animation states
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [playSound, setPlaySound] = useState<boolean>(false);

  // Load loved ones on component mount
  useEffect(() => {
  const loadLovedOnes = async () => {
    try {
      const data = await getFriendsFamily();
      setLovedOnes(data);
      console.log('Loaded loved ones:', data);
    } catch (error) {
      console.error('Error loading loved ones:', error);
    }
  };
  loadLovedOnes();
}, []);

useEffect(() => {
  console.log('Updated loved ones:', lovedOnes);
}, [lovedOnes]);

  // Add reCAPTCHA container to DOM when modal opens
  useEffect(() => {
    if (showModal && step === 'name') {
      if (!document.getElementById('recaptcha-container')) {
        const recaptchaDiv = document.createElement('div');
        recaptchaDiv.id = 'recaptcha-container';
        recaptchaDiv.style.position = 'absolute';
        recaptchaDiv.style.top = '-9999px';
        recaptchaDiv.style.left = '-9999px';
        recaptchaDiv.style.width = '1px';
        recaptchaDiv.style.height = '1px';
        recaptchaDiv.style.zIndex = '-1';
        recaptchaDiv.style.opacity = '0';
        recaptchaDiv.style.pointerEvents = 'none';
        document.body.appendChild(recaptchaDiv);
      }
    }
  }, [showModal, step]);

  // Create confetti animation
  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    const newConfetti: Confetti[] = [];
    
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: Math.random(),
        x: Math.random() * 400,
        y: Math.random() * 400,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 2,
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6
        }
      });
    }
    
    setConfetti(newConfetti);
    setShowConfetti(true);
    
    setTimeout(() => {
      setShowConfetti(false);
      setConfetti([]);
    }, 3000);
  };

  const playCelebrationSound = () => {
    setPlaySound(true);
    console.log('🎉 CELEBRATION SOUND! 🎉');
    setTimeout(() => setPlaySound(false), 1000);
  };

  // Debug function for button click
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked!');
    setButtonClicked(true);
    setShowModal(true);
    
    // Reset debug state after a moment
    setTimeout(() => setButtonClicked(false), 300);
  };

  const handleNameSubmit = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('=== DEBUG INFO ===');
      console.log('Name entered:', name.trim());
      console.log('Attempting to send OTP for:', name.trim());
      
      // Use actual Firebase operations
      const result = await loveMessageOperations.generateAndSendOTP(name.trim());
      
      if (result.success && result.person) {
        console.log('OTP sent successfully to:', result.person.phoneNumber);
        setCurrentPerson(result.person);
        setStep('otp');
      } else {
        setError('Hmm, I don\'t think I have a special message for that name. Try again! 🤔');
      }
    }catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to send verification code: ${err.message}`);
      } else {
        setError('An unexpected error occurred.');
      }
}

    
    setLoading(false);
  };

  const handleOTPSubmit = async () => {
    if (!otp.trim() || otp.length !== 6 || !currentPerson) return;
    
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting to verify OTP:', otp.trim());
      
      // Use actual Firebase operations
      const isValid = await loveMessageOperations.verifyOTP(currentPerson.id, otp.trim());
      
      if (isValid) {
        console.log('OTP verified successfully!');
        playCelebrationSound();
        createConfetti();
        setStep('letter');
        
        // Increment view count
        await loveMessageOperations.incrementViewCount(currentPerson.id);
      } else {
        setError('Oops! Wrong code. Check your messages and try again! 🔄');
        setOtp('');
      }
    } catch (err:unknown) {
      console.error('Error verifying OTP:', err);
      setError(`Verification failed due to unknown error`);
    }
    
    setLoading(false);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim() || !currentPerson) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Update the person's document with feedback
      await loveMessageOperations.updateFeedback(currentPerson.id, feedback.trim());
      
      console.log('Feedback submitted successfully!');
      
      // Show success and close modal
      setTimeout(() => {
        resetModal();
      }, 1500);
      
    } catch (err: unknown) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    }
    
    setLoading(false);
  };

  const resetModal = () => {
    setShowModal(false);
    setStep('intro');
    setName('');
    setOtp('');
    setFeedback('');
    setCurrentPerson(null);
    setError('');
    setShowConfetti(false);
    setConfetti([]);
    
    // Clean up reCAPTCHA
    loveMessageOperations.clearRecaptcha();
  };

  return (
    <div className="relative font-[Book_Antiqua]">
      {/* Floating Button - Fixed positioning with higher z-index */}
      <button
        onClick={handleButtonClick}
        onMouseDown={() => console.log('Mouse down on button')}
        onMouseUp={() => console.log('Mouse up on button')}
        className={`
          fixed bottom-6 left-6 w-16 h-16 
          bg-gradient-to-r from-pink-500 to-red-500 
          hover:from-pink-600 hover:to-red-600 
          text-white rounded-full shadow-lg hover:shadow-xl 
          transform hover:scale-110 transition-all duration-300 
          z-[9999] flex items-center justify-center
          ${buttonClicked ? 'scale-110 bg-green-500' : 'animate-pulse'}
          cursor-pointer select-none
        `}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999
        }}
        type="button"
      >
        <Heart size={24} className={buttonClicked ? 'text-white' : 'animate-pulse'} />
      </button>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/80 bg-opacity-60 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetModal();
            }
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden transform transition-all duration-300 scale-125">
            
            {/* Confetti Animation */}
            {showConfetti && confetti.map((piece) => (
              <div
                key={piece.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${piece.x}px`,
                  top: `${piece.y}px`,
                  backgroundColor: piece.color,
                  width: `${piece.size}px`,
                  height: `${piece.size}px`,
                  animation: `confettiFall 3s ease-out forwards`
                }}
              />
            ))}

            {/* Close button */}
            <button
              onClick={resetModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <X size={24} />
            </button>

            {/* Step 1: Introduction */}
            {step === 'intro' && (
              <div className="text-center">
                <div className="text-6xl mb-4">🫂</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Hey there!</h2>
                <p className="text-gray-600 mb-8 leading-relaxed justify-center text-center">
                  I&apos;ve put together something a little personal<br></br>
                  Just a small touch that shows what you mean to me.<br></br>
                  Feel free to check it out when you&apos;ve got a sec!
                </p>
                
                <button
                  onClick={() => setStep('name')}
                  className="bg-gradient-to-t from-black/80 to-blue-300 hover:bg-blue-300 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Click Here !
                </button>
              </div>
            )}

            {/* Step 2: Name Input */}
            {step === 'name' && (
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Just need your name real quick</h2>
                <p className="text-gray-600 mb-6">Had to do a lil something to appreciate all you&apos;ve been to me.</p>
                
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none text-center text-lg mb-4 text-black"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                />
                
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                
                <button
                  onClick={handleNameSubmit}
                  disabled={loading || !name.trim()}
                  className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
                >
                  {loading ? 'Sending code...' : 'Find My Message 💕'}
                </button>
                
                <p className="text-xs text-gray-500 mt-3">
                  📱 We'll send a verification code to your phone
                </p>
                
                {/* Hidden reCAPTCHA container */}
                <div id="recaptcha-container" style={{ 
                  position: 'absolute', 
                  top: '-9999px', 
                  left: '-9999px',
                  width: '1px',
                  height: '1px',
                  zIndex: -1,
                  opacity: 0,
                  pointerEvents: 'none'
                }}></div>
              </div>
            )}

            {/* Step 3: OTP Input */}
            {step === 'otp' && currentPerson && (
              <div className="text-center font-[Book_Antiqua]">
                <div className="text-4xl mb-4">📱</div>
                <h2 className="text-2xl font-bold text-black mb-4">Almost there, {currentPerson.name}!</h2>
                <p className="text-gray-600 mb-2">I've sent a verification code to:</p>
                <p className="text-pink-600 font-semibold mb-4">{currentPerson.phoneNumber}</p>
                <p className="text-sm text-gray-500 mb-6">Check your SMS and enter the 6-digit code!</p>
                
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-center text-3xl tracking-wider mb-4 font-mono text-black"
                  disabled={loading}
                  onKeyPress={(e) => e.key === 'Enter' && handleOTPSubmit()}
                />
                
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                
                <button
                  onClick={handleOTPSubmit}
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
                >
                  {loading ? 'Verifying...' : 'Open My Letter 💌'}
                </button>
                
                <button
                  onClick={() => setStep('name')}
                  className="w-full mt-3 text-purple-600 hover:text-purple-800 text-sm underline"
                >
                  ← Try a different name
                </button>
              </div>
            )}

            {/* Step 4: Love Letter - Minimal Version */}
            {step === 'letter' && currentPerson && (
              <div className="text-center">
                <div className="mb-6 relative">
                  <div className="text-4xl mb-4">💌</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Dear {currentPerson.name},
                  </h2>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentPerson.personalMessage}
                  </p>
                  <div className="mt-4 text-right">
                    <p className="text-gray-600 font-medium">With love 💕</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setStep('feedback')}
                  className="bg-black hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors text-sm"
                >
                  Hope you liked it, got time for feedback?
                </button>
              </div>
            )}

            {/* Step 5: Feedback */}
            {step === 'feedback' && currentPerson && (
              <div className="text-center">
                <div className="text-4xl mb-4">💭</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your thoughts?</h2>
                <p className="text-gray-600 mb-6">I'd love to hear what you think!</p>
                
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts here..."
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-700 resize-none mb-4"
                  disabled={loading}
                />
                
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep('letter')}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleFeedbackSubmit}
                    disabled={loading || !feedback.trim()}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    {loading ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
                
                <button
                  onClick={resetModal}
                  className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm underline"
                >
                  Skip feedback
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(300px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingLoveButton;