'use client';
import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { CheckCircle, Home, ArrowRight, Clock, Sparkles, Gift, X } from 'lucide-react'; // Added X for dismiss button
import { useRouter } from 'next/navigation';

const ThankYou = () => {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);
    const [isCardVisible, setIsCardVisible] = useState(false); // Renamed for clarity
    const [showConfetti, setShowConfetti] = useState(false);
    const redirectTimerRef = useRef(null); // Ref to store the interval ID
    const confettiTimerRef = useRef(null); // Ref to store the confetti timeout ID
    const [redirectDismissed, setRedirectDismissed] = useState(false); // New state to manage dismissal

    // Function to clear the redirect timer
    const clearRedirectTimer = () => {
        if (redirectTimerRef.current) {
            clearInterval(redirectTimerRef.current);
            redirectTimerRef.current = null; // Clear the ref
            setCountdown(0); // Optionally set countdown to 0 to stop display
            setRedirectDismissed(true); // Mark redirect as dismissed
            console.log('Auto-redirect dismissed.');
        }
    };

    useEffect(() => {
        // Trigger entrance animation
        setIsCardVisible(true);
        setShowConfetti(true);

        // Start countdown timer
        if (!redirectDismissed) { // Only start countdown if not dismissed
            redirectTimerRef.current = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }


        // Hide confetti after animation
        confettiTimerRef.current = setTimeout(() => {
            setShowConfetti(false);
        }, 3000); // Confetti animation duration

        // Cleanup function for unmounting
        return () => {
            clearRedirectTimer(); // Clear on unmount
            if (confettiTimerRef.current) {
                clearTimeout(confettiTimerRef.current);
            }
        };
    }, [redirectDismissed]); // Re-run if dismissal state changes

    // New useEffect to handle redirection based on countdown
    useEffect(() => {
        if (countdown <= 0 && !redirectDismissed) {
            router.push('/');
        }
    }, [countdown, redirectDismissed, router]); // Depend on countdown and dismissed state

    const handleGoHome = () => {
        clearRedirectTimer(); // Clear timer before manual redirect
        router.push('/');
    };

    const handleStayHere = () => {
        clearRedirectTimer(); // Clear timer to stay on page
    };

    // New Confetti Component - for better control and reusability
    const Confetti = ({ active }) => {
        if (!active) return null;
        return (
            <div className="confetti-container">
                {[...Array(50)].map((_, i) => ( // More confetti
                    <div
                        key={i}
                        className="confetti"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${-Math.random() * 20}%`, // Start above screen
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 3}s`,
                            backgroundColor: `hsl(${Math.random() * 360}, 70%, 70%)`, // Random colors
                            transform: `rotate(${Math.random() * 360}deg)`,
                            animationName: `fall-${Math.random() > 0.5 ? 'left' : 'right'}` // Different fall directions
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 font-sans antialiased flex items-center justify-center p-4 relative overflow-hidden" // Added overflow-hidden here
            onClick={clearRedirectTimer} // Click anywhere to dismiss redirect
        >
            <style jsx>{`
                @keyframes fall-left {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(120vh) translateX(-50px) rotate(360deg) scale(0.5);
                        opacity: 0;
                    }
                }
                @keyframes fall-right {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(120vh) translateX(50px) rotate(360deg) scale(0.5);
                        opacity: 0;
                    }
                }
                .confetti-container {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0; /* Behind the card */
                }
                .confetti {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%; /* Circles */
                    opacity: 0;
                    animation: var(--animation-name) var(--animation-duration) var(--animation-delay) forwards;
                    box-shadow: 0 0 5px rgba(0,0,0,0.1);
                }
                /* You can add more complex shapes if desired, e.g., for squares */
                .confetti:nth-child(even) {
                    border-radius: 2px; /* Small squares for variety */
                }
            `}</style>

            {/* Animated Background Elements (more vibrant) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-emerald-300 rounded-full opacity-10 animate-blob mix-blend-multiply filter blur-xl"></div>
                <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-300 rounded-full opacity-10 animate-blob animation-delay-2000 mix-blend-multiply filter blur-xl"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-72 h-72 bg-cyan-300 rounded-full opacity-10 animate-blob animation-delay-4000 mix-blend-multiply filter blur-xl"></div>
            </div>

            {/* Confetti Effect */}
            <Confetti active={showConfetti} />

            {/* Main Content Card */}
            <div className={`relative z-10 transform transition-all duration-1000 ${
                isCardVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
            }`}>
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg mx-auto overflow-hidden border border-emerald-100 transform hover:scale-[1.01] transition-transform duration-300 ease-out">

                    {/* Header Section with Success Icon */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-10 text-center relative">
                        <div className="absolute inset-0 bg-black opacity-10"></div> {/* Slightly more opaque overlay */}
                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 shadow-lg transform scale-100 hover:scale-105 transition-transform duration-200">
                                <CheckCircle className="text-emerald-500" size={48} />
                            </div>
                            <h1 className="text-3xl md:text-4xl text-white font-extrabold mb-2 tracking-tight"> {/* Stronger font */}
                                Thank You!
                            </h1>
                            <p className="text-emerald-100 text-lg font-medium opacity-90"> {/* Slightly less opaque */}
                                Your form has been successfully submitted.
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-8 text-center space-y-6">

                        {/* Main Message */}
                        <div className="space-y-3">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 rounded-full mb-4 animate-bounce-subtle"> {/* Subtle bounce */}
                                <Gift className="text-emerald-500" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 leading-tight">
                                Welcome to Full Access!
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                You can now explore all features and tools available on our platform.
                            </p>
                        </div>

                        {/* Benefits List */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 text-left"> {/* Changed to text-left */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" /> {/* Added sparkle icon */}
                                What's unlocked:
                            </h3>
                            <div className="space-y-3">
                                {[
                                    'Full access to all premium features without limits.',
                                    'Advanced analytics and comprehensive SEO reports.',
                                    'Exclusive tools and resources for optimal performance.'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-start space-x-3"> {/* Changed to items-start for multiline */}
                                        <div className="flex-shrink-0 mt-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></div> {/* Slightly larger dot */}
                                        <span className="text-gray-700 text-base font-medium">{benefit}</span> {/* Slightly larger text */}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Countdown and Action Buttons */}
                        <div className="space-y-4">

                            {/* Countdown Display */}
                            {countdown > 0 && !redirectDismissed && ( // Only show countdown if active and not dismissed
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                                        <Clock size={20} className="text-blue-500" /> {/* Blue clock icon */}
                                        <span className="text-sm font-medium">
                                            Auto-redirecting in
                                            <span className="mx-2 inline-flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full text-lg font-bold animate-pulse-count"> {/* Pulsing count */}
                                                {countdown}
                                            </span>
                                            seconds
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 rounded-full transition-all duration-1000 ease-linear"
                                            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleGoHome}
                                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
                                >
                                    <Home size={20} />
                                    <span>Go to Homepage</span>
                                    <ArrowRight size={16} />
                                </button>

                                <button
                                    onClick={handleStayHere}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
                                >
                                    Stay Here
                                </button>
                            </div>
                        </div>

                        {/* Footer Message */}
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-gray-500 text-sm">
                                Need help getting started?
                                <button
                                    className="text-emerald-600 hover:text-emerald-700 font-medium ml-1 underline"
                                    onClick={() => router.push('https://dgtlmart.com/contact')}
                                >
                                    Contact Support
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Action Hint */}
            {countdown > 0 && !redirectDismissed && ( // Only show hint if countdown is active and not dismissed
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center space-x-2 text-gray-600 text-sm animate-fade-in-up">
                        <X size={14} className="text-gray-400 cursor-pointer" onClick={clearRedirectTimer} /> {/* Dismiss icon */}
                        <span>Click anywhere or "Stay Here" to dismiss auto-redirect</span>
                    </div>
                </div>
            )}

            {/* Tailwind CSS Custom Animations */}
            <style jsx global>{`
                @keyframes pulse-count {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.9; }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite cubic-bezier(0.64, 0.04, 0.35, 1);
                }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }

                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s infinite ease-in-out;
                }

                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(20px); }
                    10% { opacity: 1; transform: translateY(0); }
                    90% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-20px); }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ThankYou;