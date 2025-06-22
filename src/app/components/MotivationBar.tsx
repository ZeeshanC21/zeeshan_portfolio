"use client";
import { useEffect, useState } from "react";

const quotes = [
  "Keep going. Everything you need will come to you at the perfect time.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Stay focused and never give up on your dreams.",
  "Push yourself, because no one else is going to do it for you.",
  "Don't watch the clock; do what it does. Keep going.",
  "Believe in yourself and all that you are.",
  "Discipline is the bridge between goals and accomplishment."
];

export default function MotivationBar() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // Start as false
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setMobile(mobile);
      console.log(isMobile);
      // Set visibility based on device type
      if (!mobile) {
        setIsVisible(true); // Show by default on desktop
      } else {
        setIsVisible(false); // Hide by default on mobile
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleShow = () => {
    setIsVisible(true);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50 sm:block">
        <button
          onClick={handleShow}
          className="rounded-full bg-black p-3 text-white shadow-lg transition-all hover:bg-blue-300 hover:scale-105"
          aria-label="Show motivation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-5 w-5 sm:h-8 sm:w-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 3.75a24.016 24.016 0 0 1-4.5 0m0 0V9.75a5.25 5.25 0 0 1 10.5 0V15a24.38 24.38 0 0 1-4.5 0M12 12.75V9.75a5.25 5.25 0 0 1 10.5 0v2.25" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:block">
      <div className="relative mx-auto max-w-4xl">
        <div className="flex items-center justify-center rounded-lg bg-black/20 backdrop-blur-sm px-6 py-4 shadow-lg">
          
          <p className="text-center font-medium text-sm sm:text-base md:text-lg text-white leading-relaxed">
            {quotes[quoteIndex]}
          </p>

          <button
            onClick={handleDismiss}
            type="button"
            aria-label="Dismiss"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black p-2 shadow-sm transition-all hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}