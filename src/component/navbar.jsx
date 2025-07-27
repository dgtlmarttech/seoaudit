'use client';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-white shadow-md py-3 sticky top-0 z-50">
      <div className="max-w-[90%] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        {/* Logo */}
        {/* Replace the src with your actual logo path, e.g., src="/path/to/your/logo.jpg" */}
        {/* If using react-router-dom, change <a> to <Link to="/"> */}
        <a href="/" className="flex-shrink-0">
          <img
            src="./logo.jpg" 
            alt="Site Logo"
            className="w-[25%] h-auto block sm:w-[20%] rounded-md" 
          />
        </a>
        
        {/* Nav Links */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto mt-3 sm:mt-0">
          {/* If using react-router-dom, change <a> to <Link to="/"> */}
          <a
            href="/"
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg text-sm font-medium no-underline transition-all duration-200 text-center
                       hover:bg-indigo-700 hover:-translate-y-px shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            SEO Analysis
          </a>
          {/* If using react-router-dom, change <a> to <Link to="/add-on"> */}
          <a
            href="/add-on"
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg text-sm font-medium no-underline transition-all duration-200 text-center
                       hover:bg-indigo-700 hover:-translate-y-px shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Addon SEO Analysis
          </a>
          {/* If using react-router-dom, change <a> to <Link to="/core-vitals"> */}
          <a
            href="/core-vitals"
            className="bg-indigo-600 text-white px-5 py-3 rounded-lg text-sm font-medium no-underline transition-all duration-200 text-center
                       hover:bg-indigo-700 hover:-translate-y-px shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Core Vitals
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
