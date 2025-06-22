/* eslint-disable react/no-unescaped-entities */


"use client"
import React, { useState, useEffect } from 'react';
import { Heart, X, Sparkles, Mail } from 'lucide-react';
import { loveMessageOperations } from '../../../firebase/smsService';
import { getFriendsFamily } from '../../../firebase/getFriendsFamily';

// Types matching your interface
interface LovedOnes {
  id: string;
  name: string;
  phoneNumber: string;
  personalMessage: string;
  totalAttempts: number;
  firstViewedAt: any;
  lastViewedAt: any;
  viewCount?: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

type Step = 'intro' | 'name' | 'otp' | 'letter';

const FloatingLoveButton: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [step, setStep] = useState<Step>('intro');
  const [name, setName] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
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
        console.log("Loaded loved ones: ",lovedOnes);
      } catch (error) {
        console.error('Error loading loved ones:', error);
      }
    };
    loadLovedOnes();
  }, []);

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
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(`Verification failed: ${err.message}`);
    }
    
    setLoading(false);
  };

  const resetModal = () => {
    setShowModal(false);
    setStep('intro');
    setName('');
    setOtp('');
    setCurrentPerson(null);
    setError('');
    setShowConfetti(false);
    setConfetti([]);
    
    // Clean up reCAPTCHA
    loveMessageOperations.clearRecaptcha();
  };

  return (
    <div className="relative">
      {/* Debug Info */}
      {/* <div className="fixed top-4 left-4 bg-black text-white p-2 rounded text-xs z-50 opacity-75">
        Button Status: {buttonClicked ? 'CLICKED!' : 'Waiting for click...'}
        <br />
        Modal: {showModal ? 'Open' : 'Closed'}
        <br />
        Step: {step}
        <br />
        Loaded: {lovedOnes.length} people
      </div> */}

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
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4"
          style={{ zIndex: 10000 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              resetModal();
            }
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden transform transition-all duration-300 scale-100">
            
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
                <div className="text-6xl mb-4">💕</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Hey Beautiful Soul!</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  I've written something special just for you. It's a little secret message 
                  that shows how much you mean to me. Ready to discover it?
                </p>
                
                <button
                  onClick={() => setStep('name')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Let's Go! ✨
                </button>
              </div>
            )}

            {/* Step 2: Name Input */}
            {step === 'name' && (
              <div className="text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Who are you?</h2>
                <p className="text-gray-600 mb-6">Tell me your name to unlock your personal message!</p>
                
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your beautiful name"
                  className="w-full p-4 border-2 border-pink-200 rounded-xl focus:border-pink-500 focus:outline-none text-center text-lg mb-4"
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
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Almost there, {currentPerson.name}!</h2>
                <p className="text-gray-600 mb-2">I've sent a verification code to:</p>
                <p className="text-pink-600 font-semibold mb-4">{currentPerson.phoneNumber}</p>
                <p className="text-sm text-gray-500 mb-6">Check your SMS and enter the 6-digit code!</p>
                
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none text-center text-3xl tracking-wider mb-4 font-mono"
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

            {/* Step 4: Love Letter */}
            {step === 'letter' && currentPerson && (
              <div className="text-center">
                <div className="mb-6 relative">
                  <div className="text-8xl mb-4 animate-bounce">🎉</div>
                  {playSound && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl animate-ping">🎊</div>
                    </div>
                  )}
                  <h2 className="text-3xl font-bold text-purple-800 mb-2">
                    Dear {currentPerson.name},
                  </h2>
                  <div className="flex justify-center space-x-2 text-2xl mb-4">
                    <Mail className="text-pink-500" />
                    <Sparkles className="text-yellow-500 animate-spin" />
                    <Heart className="text-red-500 animate-pulse" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6 rounded-2xl border-2 border-pink-200 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"></div>
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    {currentPerson.personalMessage}
                  </p>
                  <div className="mt-4 text-right">
                    <p className="text-pink-600 font-semibold">With all my love 💕</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3 text-4xl mb-6">
                  <span className="animate-pulse">💖</span>
                  <span className="animate-pulse" style={{animationDelay: '0.5s'}}>✨</span>
                  <span className="animate-pulse" style={{animationDelay: '1s'}}>🌟</span>
                  <span className="animate-pulse" style={{animationDelay: '1.5s'}}>💝</span>
                </div>
                
                <button
                  onClick={resetModal}
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg transform hover:scale-105"
                >
                  This made my day! 😊✨
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