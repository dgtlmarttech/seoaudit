'use client';
import React, { useState } from 'react';
import {
  Search,
  BarChart3,
  Shield,
  Globe,
  FileText,
  TrendingUp,
  Eye,
  Hash,
  Users,
  AlertTriangle,
  Download,
  Loader2,
  Star,
  Zap, // For Fast Analysis
  Target, // For Accurate Results
  AlertCircle, // For popup
   Link
} from 'lucide-react';

// Import your actual utility functions
import { generatePDF } from '../utils/DownloadPDF';
import PopupForm from '../utils/email'; // Assuming this is your PopupForm component
import {
  checkMetaTags,
  checkIndexation,
  checkSearchOptimization,
  checkSocialNetworks,
  checkCustom404,
  checkDomains,
  checkHeadingTags,
  checkSecurity,
  // Add other check functions if they exist and are used in 'parts'
  checkLinks, // Assuming you have this one based on your Part.js
  checkOpenGraph, // Assuming you have this one
  checkTwitterCards, // Assuming you have this one
  checkImageTags, // Assuming you have this one
  checkURLVulnerability // Assuming you have this one
} from '../utils/seoCheck'; // Assuming all your check functions are in seoCheck.js

import Part from '../component/part'; // Your Part component

const Home = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [allResults, setAllResults] = useState({});
  const [selectedPart, setSelectedPart] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0); // For a simple progress bar
  const [currentAnalyzing, setCurrentAnalyzing] = useState(''); // For current analysis step text

  // Enhanced parts configuration with actual utility functions
  const parts = [
    {
      name: 'Meta Tags',
      icon: FileText,
      color: 'blue',
      description: 'Title tags, meta descriptions, and other meta elements.',
      util: checkMetaTags,
    },
    {
      name: 'Indexation',
      icon: Search,
      color: 'green',
      description: 'Search engine visibility and crawling status.',
      util: checkIndexation,
    },
    {
      name: 'Search Optimization',
      icon: TrendingUp,
      color: 'purple',
      description: 'Keyword optimization, canonicals, and schema markup.',
      util: checkSearchOptimization,
    },
    {
      name: 'Social Networks',
      icon: Users,
      color: 'pink',
      description: 'Social media integration and Open Graph tags.',
      util: checkSocialNetworks,
    },
    {
      name: 'Custom 404 Page',
      icon: AlertTriangle,
      color: 'orange',
      description: 'Error page handling and user experience for broken links.',
      util: checkCustom404,
    },
    {
      name: 'Domains',
      icon: Globe,
      color: 'cyan',
      description: 'Domain authority, length, and technical configuration.',
      util: checkDomains,
    },
    {
      name: 'Heading Tags',
      icon: Hash,
      color: 'indigo',
      description: 'H1-H6 structure and content hierarchy for readability.',
      util: checkHeadingTags,
    },
    {
      name: 'Security',
      icon: Shield,
      color: 'red',
      description: 'HTTPS, security headers, and common vulnerabilities.',
      util: checkSecurity,
    },
    {
      name: 'Links', // Added based on your Part.js
      icon: Link,
      color: 'yellow',
      description: 'Internal and external link analysis, nofollow attributes.',
      util: checkLinks,
    },
    {
      name: 'Open Graph', // Added based on your Part.js
      icon: BarChart3, // Using BarChart3 for OG for now, pick suitable icon
      color: 'emerald',
      description: 'Open Graph protocol for social media sharing.',
      util: checkOpenGraph,
    },
    {
      name: 'Twitter Cards', // Added based on your Part.js
      icon: Star, // Using Star for Twitter Cards for now
      color: 'sky',
      description: 'Twitter Card meta tags for rich tweets.',
      util: checkTwitterCards,
    },
    {
      name: 'Image Tags', // Added based on your Part.js
      icon: Eye, // Using Eye for Image Tags for now
      color: 'teal',
      description: 'Alt attributes, image sources, and favicons.',
      util: checkImageTags,
    },
    {
      name: 'URL Vulnerability', // Added based on your Part.js
      icon: AlertCircle, // Using AlertCircle for URL Vulnerability
      color: 'fuchsia',
      description: 'Checks for problematic URL structures (e.g., underscores, duplicate slashes).',
      util: checkURLVulnerability,
    },
  ];


  const checkIfFormSubmitted = () => {
    // In a real app, this would check localStorage or a backend flag.
    // For demonstration, let's make it show the popup every 3rd attempt.
    const attempts = parseInt(sessionStorage.getItem('analysisAttempts') || '0', 10);
    sessionStorage.setItem('analysisAttempts', (attempts + 1).toString());
    return attempts % 3 === 0; // Show popup every 3rd attempt
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAnalyze = async () => {
    if (!url || !isValidUrl(url)) {
      alert('Please enter a valid and complete URL (e.g., https://www.example.com)!');
      return;
    }

    if (checkIfFormSubmitted()) {
      setIsPopupVisible(true);
      return; // Stop analysis if popup is shown
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalyzing('Starting analysis...');
    setAllResults({}); // Clear previous results
    setIsAnalyzed(false);
    setSelectedPart(null); // Reset selected part

    try {
      // Step 1: Fetch source code and other data from proxy
      setCurrentAnalyzing('Fetching webpage content...');
      setAnalysisProgress(10);
      const response = await fetch(`/api/proxy-fetch?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch source code: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      // console.log('Fetched Data:', data); // For debugging

      const newResults = {};
      let completedParts = 0;

      // Step 2: Run each SEO check utility function
      for (const part of parts) {
        setCurrentAnalyzing(`Analyzing ${part.name.toLowerCase()}...`);
        // Calculate progress based on number of parts
        setAnalysisProgress(10 + Math.round((completedParts / parts.length) * 80)); // 10% for fetch, 80% for analysis

        let result;
        try {
          // Pass all relevant data to the utility functions.
          // Each utility function should selectively use the arguments it needs.
          // data.url from proxy is often more canonical than the user's input `url` state.
          result = part.util(data.sourceCode, data.url || url, data.robots, data.sitemap, data.page404);
        } catch (utilError) {
          console.error(`Error in ${part.name} utility:`, utilError);
          // Return a structured error object if a utility fails
          result = {
            status: 'error',
            score: 0,
            message: `Error during ${part.name} analysis: ${utilError.message}`,
            report: 'An unexpected error occurred during this analysis step.',
          };
        }
        newResults[part.name] = result;
        completedParts++;
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for progress bar animation
      }

      setCurrentAnalyzing('Compiling final report...');
      setAnalysisProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200)); // Final compilation delay

      setAllResults(newResults);
      setIsAnalyzed(true);

    } catch (error) {
      console.error('Home.js: Analysis error:', error);
      alert('Failed to analyze URL. Please check the URL and try again. Error: ' + error.message);
      setIsAnalyzed(false); // Ensure analysis state is reset on error
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentAnalyzing('');
    }
  };

  const handleDownloadReportPDF = () => {
    const reportField = document.querySelector('.report-field');
    if (!reportField) {
      alert('No report available to download!');
      return;
    }
    generatePDF('report-field', url);
  };

  const handleFormSubmission = () => {
    setIsPopupVisible(false);
    // Optionally trigger analysis again after form submission
    // handleAnalyze(); // Uncomment if you want analysis to resume after popup
  };

  const handleDownload = () => {
    handleDownloadReportPDF();
  };

  // Helper functions for status colors/backgrounds
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getOverallScore = () => {
    if (!isAnalyzed || Object.keys(allResults).length === 0) return 0;
    const scores = Object.values(allResults).map(result => result.score || 0);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans text-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>
        <div className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-8 shadow-xl animate-scale-in">
            <BarChart3 className="text-white" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight animate-fade-in-up">
            Deep Dive SEO Analysis
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10 animate-fade-in-up animation-delay-200">
            Comprehensive website analysis to boost your search engine rankings.
            Get detailed insights on meta tags, security, performance, and more.
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            {[
              { icon: Zap, label: 'Fast Analysis' },
              { icon: Target, label: 'Accurate Results' },
              { icon: Eye, label: 'Detailed Reports' },
              { icon: Download, label: 'PDF Export' }
            ].map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 transform transition-transform duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${200 * (index + 3)}ms` }}
                >
                  <FeatureIcon className="text-blue-600 mb-2" size={24} />
                  <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">

          {/* URL Input Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 animate-fade-in-up animation-delay-800">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Website URL</h2>
              <p className="text-gray-600">Start your comprehensive SEO analysis</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="https://www.example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-gray-800 text-lg"
                  disabled={isAnalyzing}
                />
              </div>
              <button
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-[140px] shadow-lg hover:shadow-xl"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Analyzing</span>
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 animate-fade-in-up">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 animate-pulse-loader">
                  <Loader2 className="text-blue-600 animate-spin" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Website</h3>
                <p className="text-gray-600">{currentAnalyzing}</p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(analysisProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Results Overview */}
          {isAnalyzed && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 animate-fade-in-up">
              <div className="text-center mb-8">
                {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce-once">
                  <div className="text-3xl font-bold text-green-600">{getOverallScore()}</div>
                </div> */}
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
                {/* <p className="text-gray-600 text-lg">Overall SEO Score: {getOverallScore()}/100</p> */}
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {parts.map((part) => {
                  const result = allResults[part.name];
                  const PartIcon = part.icon;
                  return (
                    <button
                      key={part.name}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg cursor-pointer flex flex-col items-start text-left ${getStatusBg(result?.status)}`}
                      onClick={() => setSelectedPart(part)}
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <PartIcon className={getStatusColor(result?.status)} size={24} />
                        {/* <span className="text-2xl font-bold text-gray-800">{result?.score || 'N/A'}</span> */}
                      </div>
                      <h4 className="font-semibold text-gray-900 text-base mb-1">{part.name}</h4>
                      <p className="text-xs text-gray-600 leading-tight">{part.description}</p>
                    </button>
                  );
                })}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  onClick={handleDownload}
                >
                  <Download size={20} />
                  <span>Download Full Report</span>
                </button>
                <button
                  className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75"
                  onClick={() => setSelectedPart(null)}
                >
                  <Eye size={20} />
                  <span>View All Sections</span>
                </button>
              </div>
            </div>
          )}

          {/* Detailed Analysis / Selected Part Details */}
          {selectedPart && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <selectedPart.icon className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedPart.name}</h3>
                    <p className="text-gray-600">{selectedPart.description}</p>
                  </div>
                </div>
                {/* <div className="text-right">
                  <div className="text-3xl font-bold text-gray-800">{allResults[selectedPart.name]?.score || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Score</div>
                </div> */}
              </div>

              {/* Render the specific Part component here */}
              <div className="bg-gray-50 rounded-xl border border-gray-200">
                <Part partName={selectedPart.name} result={allResults[selectedPart.name]} />
              </div>
            </div>
          )}

          {/* All Results View (when "View All Sections" is clicked or initially selected) */}
          {selectedPart === null && isAnalyzed && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-2xl font-bold text-gray-900">Complete Analysis Report</h3>
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="report-field space-y-6">
                {parts.map((part) => {
                  const PartIcon = part.icon;
                  const result = allResults[part.name];
                  return (
                    <div key={part.name} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusBg(result?.status)}`}>
                            <PartIcon className={getStatusColor(result?.status)} size={20} />
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{part.name}</h4>
                            <p className="text-gray-600 text-sm">{part.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">{result?.score || 'N/A'}</div>
                          <div className="text-sm text-gray-600">Score</div>
                        </div>
                      </div>

                      {/* Render the actual Part component for detailed view */}
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <Part partName={part.name} result={allResults[part.name]} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Popup Form */}
      {isPopupVisible && (
        <PopupForm onSubmit={handleFormSubmission} setIsPopupVisible={setIsPopupVisible} />
      )}

      {/* Global CSS for animations (if not already in globals.css) */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes pulseLoader {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-pulse-loader {
          animation: pulseLoader 1.5s infinite ease-in-out;
        }

        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          20% { transform: translateY(-10px); }
          40% { transform: translateY(0); }
          60% { transform: translateY(-5px); }
          80% { transform: translateY(0); }
        }
        .animate-bounce-once {
          animation: bounceOnce 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
