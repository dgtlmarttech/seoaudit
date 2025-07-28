"use client"
import React, { useState, useEffect } from 'react';
import Part from '../../component/part';
import { generatePDF } from '../../utils/DownloadPDF';
import PopupForm from '../../utils/email';

import { 
  checkTwitterCards, 
  checkOpenGraph, 
  checkImageTags, 
  checkLinks, 
  checkURLVulnerability, 
} from '../../utils/seoCheck';

const SEOAnalysis2 = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [robots, setRobots] = useState('');
  const [sitemap, setSitemap] = useState('');
  const [page404, setPage404] = useState('');
  const [selectedPart, setSelectedPart] = useState(null);
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [allResults, setAllResults] = useState({});
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isOldUser, setIsOldUser] = useState(false);

  // Effect to check localStorage only on client-side mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOldUser(localStorage.getItem('formSubmitted') === 'true');
    }
  }, []);

  const handleAnalyze = async () => {
    if (!url) {
      alert('Please enter a valid URL!');
      return;
    }

    if(!isOldUser){
      setIsPopupVisible(true)
    }
    else{

    setIsAnalyzing(true);

    try {
      const proxyUrl = `/api/proxy-fetch?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch source code: ${response.statusText}`);
      }

      const data = await response.json();
      setSourceCode(data.sourceCode);
      setRobots(data.robots);
      setSitemap(data.sitemap);
      setPage404(data.page404);

      setIsAnalyzed(true);
      setSelectedPart(null);

      const results = {};
      parts.forEach((part) => {
        results[part.name] = part.util(data.sourceCode, url, robots, sitemap, page404);
      });
      setAllResults(results);

    } catch (error) {
      console.error(error);
      alert('Failed to fetch source code. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }
  };

  const parts = [

    { name: 'Twitter Cards', util: checkTwitterCards },
    { name: 'Open Graph', util: checkOpenGraph },
    { name: 'Image Tags', util: checkImageTags },
    
    { name: 'Links', util: checkLinks },

    { name: 'URL Vulnerability', util: checkURLVulnerability },
  ];

  const handleDownloadReportPDF = () => {
    const reportField = document.querySelector('.report-field');
    if (!reportField) {
      alert('No report available to download!');
      return;
    }
    generatePDF('report-field', url);
  };

  const handleAllParts = () => {
    setSelectedPart(null);
  };

  const handleFormSubmission = () => {
    setIsPopupVisible(false);
  };


  const handleDownload=()=>{
      handleDownloadReportPDF();

  }


  return (
    <div className="flex flex-col items-center p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* SEO Intro Section */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl text-center mb-8">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4">Add-on SEO Analysis Tool</h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          Enter a URL to analyze its SEO performance. This tool checks various aspects of your webpage,
          such as Twitter Cards, Open Graph, Images Tag, Links, and URL Vulnerability.
        </p>
      </div>

      {/* URL Input Section */}
      <div className="flex flex-col sm:flex-row items-center w-full max-w-xl mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Enter URL to analyze..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 w-full"
        />
        <button
          className={`px-6 py-3 rounded-lg font-semibold text-white transition duration-300 ease-in-out transform hover:scale-105
            ${isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {/* Loading Screen */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-gray-700">Loading, please wait...</p>
        </div>
      )}

      {/* Analysis Parts Selection */}
      {isAnalyzed && (
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Select a Part to Analyze:</h3>
          <p className="text-gray-600 mb-6">Choose from the following sections to see detailed analysis of each SEO aspect:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {parts.map((part, index) => (
              <button
                className={`px-5 py-2 rounded-full font-medium transition duration-200 ease-in-out
                  ${selectedPart === part ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                key={index}
                onClick={() => setSelectedPart(part)}
              >
                {part.name}
              </button>
            ))}
            <button
              className={`px-5 py-2 rounded-full font-medium transition duration-200 ease-in-out
                ${selectedPart === "All" ? "bg-blue-600 text-white shadow-md" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              onClick={() => {
                setSelectedPart("All");
                handleAllParts();
              }}
            >
              All
            </button>
          </div>
        </div>
      )}

      {/* Report Field - All Parts */}
      {selectedPart === null && isAnalyzed && (
        <div className="w-full max-w-4xl">
          <button
            className="mb-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleDownload}
          >
            Download Report as PDF
          </button>
          <div className="report-field bg-gray-100 p-6 rounded-lg shadow-inner">
            {parts.map((part) => (
              <div key={part.name}>
                <Part partName={part.name} result={allResults[part.name]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report Field - Selected Part */}
      {selectedPart && (
        <div className="w-full max-w-4xl">
          <button
            className="mb-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            onClick={handleDownload}
          >
            Download Report as PDF
          </button>
          <div className="report-field bg-gray-100 p-6 rounded-lg shadow-inner">
            <Part
              partName={selectedPart.name}
              result={selectedPart.util(sourceCode, url, robots, sitemap, page404)}
            />
          </div>
        </div>
      )}

      {/* Popup Overlay */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PopupForm onSubmit={handleFormSubmission} setIsPopupVisible={setIsPopupVisible} />
        </div>
      )}
    </div>
  );
};

export default SEOAnalysis2;
