'use client';
import React, { useState } from 'react';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('/');
  
  const handleLinkClick = (path) => {
    setActiveLink(path);
  };
  
  const isActive = (path) => activeLink === path;
  
  return (
    <nav className="w-full bg-white shadow-md py-3 sticky top-0 z-50">
      <div className="max-w-[90%] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        {/* Logo */}
        <a href="/" className="flex-shrink-0" onClick={() => handleLinkClick('/')}>
          <img
            src="/logo.jpg" 
            alt="Site Logo"
            className="w-[120px] h-auto block sm:w-[100px] rounded-md" 
          />
        </a>
        
        {/* Nav Links */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto mt-3 sm:mt-0">
          <a
            href="/"
            onClick={() => handleLinkClick('/')}
            className={`px-5 py-3 rounded-lg text-sm font-medium no-underline transition-all duration-200 text-center
                       shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                         isActive('/') 
                           ? 'bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg' 
                           : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-px focus:ring-indigo-500'
                       }`}
          >
            SEO Analysis
          </a>
          
          <a
            href="/core-vitals"
            onClick={() => handleLinkClick('/core-vitals')}
            className={`px-5 py-3 rounded-lg text-sm font-medium no-underline transition-all duration-200 text-center
                       shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                         isActive('/core-vitals') 
                           ? 'bg-indigo-700 text-white focus:ring-indigo-500 shadow-lg' 
                           : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-px focus:ring-indigo-500'
                       }`}
          >
            Core Vitals
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;