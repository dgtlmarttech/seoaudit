'use client';
import React, { useState } from 'react';
import { generatePDF } from '../utils/DownloadPDF';
import PopupForm from '../utils/email';
import {
  checkMetaTags,
  checkIndexation,
  checkSearchOptimization,
  checkSocialNetworks,
  checkCustom404,
  checkDomains,
  checkHeadingTags,
  checkSecurity,
} from '../utils/seoCheck';
import Part from '../component/part';

const Home = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [allResults, setAllResults] = useState({});
  const [selectedPart, setSelectedPart] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);


  const parts = [
    { name: 'Meta Tags', util: checkMetaTags },
    { name: 'Indexation', util: checkIndexation },
    { name: 'Search Optimization', util: checkSearchOptimization },
    { name: 'Social Networks', util: checkSocialNetworks },
    { name: 'Custom 404 Page', util: checkCustom404 },
    { name: 'Domains', util: checkDomains },
    { name: 'Heading Tags', util: checkHeadingTags },
    { name: 'Security', util: checkSecurity },
  ];

  const checkIfFormSubmitted = () => {
    return typeof window !== 'undefined' && localStorage.getItem('formSubmitted') !== 'true';
  };


  const handleAnalyze = async () => {
    if (!url) return alert('Please enter a valid URL!');

    if (checkIfFormSubmitted()) {
      setIsPopupVisible(true);
    } else {
      setIsAnalyzing(true);
      try {
        const response = await fetch(`/api/proxy-fetch?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to fetch source code');

        const data = await response.json();
        const results = parts.reduce((acc, part) => {
          acc[part.name] = part.util(data.sourceCode, url, data.robots, data.sitemap, data.page404);
          return acc;
        }, {});

        setAllResults(results);
        setIsAnalyzed(true);
      } catch (error) {
        alert('Failed to fetch source code. Please check the URL and try again.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleDownloadReportPDF = () => {
    const reportField = document.querySelector('.report-field');
    if (!reportField) return alert('No report available to download!');
    generatePDF('report-field', url);
  };

  const handleFormSubmission = () => {
    setIsPopupVisible(false);
  };

  const handleDownload = () => {
    handleDownloadReportPDF();
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* SEO Intro Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">SEO Analysis Tool</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Enter a URL to analyze its SEO performance. This tool checks various aspects of your
          webpage, such as Meta Tags, Security, and more. Click "Analyze" to start the process and
          explore detailed results for each part.
        </p>
      </div>

      {/* URL Input Section */}
      <div className="flex flex-col sm:flex-row items-center w-full max-w-2xl mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Enter URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
        />
        <button
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Loading Screen */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg w-full max-w-md">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-lg text-gray-700">Loading, please wait...</p>
        </div>
      )}

      {/* Analysis Parts Selection */}
      {isAnalyzed && (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Select a Part to Analyze:</h3>
          <p className="text-md text-gray-600 mb-6">Choose from the following sections to see detailed analysis of each SEO aspect:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {parts.map((part, index) => (
              <button
                key={index}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200
                          ${selectedPart === part
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-700'
                          }`}
                onClick={() => setSelectedPart(part)}
              >
                {part.name}
              </button>
            ))}
            <button
              className={`px-5 py-2 rounded-full font-medium transition-all duration-200
                        ${selectedPart === null
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-800 hover:bg-blue-100 hover:text-blue-700'
                        }`}
              onClick={() => setSelectedPart(null)}
            >
              All
            </button>
          </div>
        </div>
      )}

      {/* Report Display Section */}
      {(selectedPart === null && isAnalyzed) && (
        <div className="w-full max-w-4xl">
          <button
            className="mb-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 w-full"
            onClick={handleDownload}
          >
            Download Full Report as PDF
          </button>
          <div className="report-field bg-white p-6 rounded-xl shadow-lg">
            {parts.map((part) => (
              <div key={part.name}>
                <Part partName={part.name} result={allResults[part.name]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPart && (
        <div className="w-full max-w-4xl">
          <button
            className="mb-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 w-full"
            onClick={handleDownload}
          >
            Download Report as PDF
          </button>
          <div className="report-field bg-white p-6 rounded-xl shadow-lg">
            <Part partName={selectedPart.name} result={allResults[selectedPart.name]} />
          </div>
        </div>
      )}

      {/* Popup Form */}
      {isPopupVisible && (
        <PopupForm onSubmit={handleFormSubmission} setIsPopupVisible={setIsPopupVisible} />
      )}
    </div>
  );
};

export default Home;
