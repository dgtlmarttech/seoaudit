'use client'
'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js App Router

const ThankYou = () => {
  const router = useRouter(); // Initialize the router using the hook

  useEffect(() => {
    // In a real project, you would likely set this based on actual form submission success
    localStorage.setItem('formSubmitted', 'true'); 
    console.log('Form submitted: true'); // Log for demonstration

    const timer = setTimeout(() => {
      router.push('/'); // Use router.push() for navigation in Next.js
    }, 3000);

    // Cleanup the timer if the component unmounts before the redirect
    return () => clearTimeout(timer);
  }, [router]); // Depend on router to ensure effect re-runs if router changes

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center p-5 bg-white rounded-lg shadow-xl max-w-md mx-auto">
        <h1 className="text-3xl md:text-4xl text-teal-600 font-extrabold mb-4 animate-fade-in-down">
          Thank you for submitting the form!
        </h1>
        <p className="text-lg text-gray-700 mb-2 animate-fade-in-up">
          You can now freely use our website.
        </p>
        <p className="text-md text-gray-500 animate-fade-in-up delay-100">
          Redirecting to homepage in 3 seconds...
        </p>
      </div>
    </div>
  );
};

export default ThankYou;
