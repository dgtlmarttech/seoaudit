'use client'
import React, { useState, useEffect } from 'react';
import { generatePDF } from '../../utils/DownloadPDF';
import PopupForm from '../../utils/email';

const PageSpeedInsights = () => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [view, setView] = useState('mobile'); // Default view is 'mobile'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [experienceView, setExperienceView] = useState('loadingExperience'); // Default is 'loadingExperience'
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [loadTimes, setLoadTimes] = useState([]); // Track loading times
  const [averageLoadTime, setAverageLoadTime] = useState(null);
  const [isOldUser, setIsOldUser] = useState(false);


  // Effect to check localStorage only on client-side mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOldUser(localStorage.getItem('formSubmitted') === 'true');
    }
  }, []);

  const fetchPageSpeedData = async () => {
    if (!isOldUser) {
      setIsPopupVisible(true)
    }
    else {
      setLoading(true);
      setError(null);
      setData(null);
      const startTime = Date.now();
      try {
        const response = await fetch(
          `/api/pagespeed?url=${encodeURIComponent(url)}`
        );
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        const endTime = Date.now(); // Record end time
        const loadTime = endTime - startTime; // Calculate load time
        setLoadTimes(prev => [...prev, loadTime]); // Store individual load time
        setAverageLoadTime(loadTimes.reduce((acc, time) => acc + time, 0) / loadTimes.length); // Calculate average
        setLoading(false);
      }
    }
  };

  const handleDownloadReportPDF = () => {

    const reportField = document.querySelector('.both-view');
    if (!reportField) {
      alert('No report available to download!');
      return;
    }
    generatePDF('both-view', url);
  };

  const handleFormSubmission = () => {
    setIsPopupVisible(false); // Close the popup form
  };


  const handleDownload = () => {
    handleDownloadReportPDF();
  }


  const checkCoreVitals = (experienceData) => {
    if (!experienceData?.metrics) return 'N/A';

    const lcpCategory = experienceData.metrics.LARGEST_CONTENTFUL_PAINT_MS?.category || 'N/A';
    const inpCategory = experienceData.metrics.INTERACTION_TO_NEXT_PAINT?.category || 'N/A';
    const clsCategory = experienceData.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.category || 'N/A';

    const isLCPPass = lcpCategory === 'FAST';
    const isINPPass = inpCategory === 'FAST';
    const isCLSPass = clsCategory === 'FAST';

    return isLCPPass && isINPPass && isCLSPass ? 'Pass' : 'Fail';
  };

  const CircularScore = ({ score, title }) => {
    let color, bgColor;

    if (score <= 50) {
      color = '#ef4444';
      bgColor = 'bg-red-500';
    } else if (score <= 90) {
      color = '#f59e0b';
      bgColor = 'bg-yellow-500';
    } else {
      color = '#22c55e';
      bgColor = 'bg-green-500';
    }

    return (
      <div className="flex flex-col items-center gap-3">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white transition-all duration-300 ${bgColor}`}>
          {score}
        </div>
        <div className="text-lg font-semibold text-gray-700 text-center">
          {title}
        </div>
      </div>
    );
  };



  const renderDiagnose = (lighthouseResult) => {
    const categories = lighthouseResult.categories;

    const scores = [
      {
        title: "Performance",
        score: Math.round(categories.performance.score * 100) || 0,
      },
      {
        title: "Accessibility",
        score: Math.round(categories.accessibility.score * 100) || 0,
      },
      {
        title: "Best Practices",
        score: Math.round(categories['best-practices'].score * 100) || 0,
      },
      {
        title: "SEO",
        score: Math.round(categories.seo.score * 100) || 0,
      },
    ];

    return (
      <div className="diagnose p-6 bg-white rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Diagnose Performance Issues</h2>
        <div className="flex flex-wrap justify-center gap-8 mt-8">
          {scores.map((item, index) => (
            <CircularScore
              key={index}
              title={item.title}
              score={item.score}
            />
          ))}
        </div>
      </div>
    );
  };


  const renderMetrics = (experienceData) => {
    if (!experienceData?.metrics) return <p className="text-gray-600 text-center">No data available.</p>;

    const { metrics } = experienceData;

    const metricData = [
      {
        name: 'Largest Contentful Paint (LCP)',
        value: (metrics.LARGEST_CONTENTFUL_PAINT_MS?.percentile / 1000) || 0,
        unit: 'sec',
        ranges: { good: [0, 2.5], average: [2.5, 4], poor: [4, Infinity] },
      },
      {
        name: 'Interaction to Next Paint (INP)',
        value: metrics.INTERACTION_TO_NEXT_PAINT?.percentile || 0,
        unit: 'ms',
        ranges: { good: [0, 200], average: [200, 500], poor: [500, Infinity] },
      },
      {
        name: 'First Contentful Paint (FCP)',
        value: (metrics.FIRST_CONTENTFUL_PAINT_MS?.percentile / 1000) || 0,
        unit: 'sec',
        ranges: { good: [0, 1.8], average: [1.8, 3], poor: [3, Infinity] },
      },
      {
        name: 'Experimental Time to First Byte (TTFB)',
        value: (metrics.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile / 1000) || 0,
        unit: 'sec',
        ranges: { good: [0, 1], average: [1, 1.5], poor: [1.5, Infinity] },
      },
      {
        name: 'Cumulative Layout Shift (CLS)',
        value: (metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || 0) / 100,
        unit: '',
        ranges: { good: [0, 0.1], average: [0.1, 0.25], poor: [0.25, Infinity] },
      },
    ];

    function getRangeColor(value, ranges) {
      if (value >= ranges.good[0] && value <= ranges.good[1]) {
        return "good";
      } else if (value >= ranges.average[0] && value <= ranges.average[1]) {
        return "average";
      } else {
        return "poor";
      }
    }

    return (
      <>
        <div
          className={`p-3 rounded-lg font-semibold text-center mb-6 ${checkCoreVitals(experienceData) === 'Pass' ? 'bg-green-100 text-green-800' :
              checkCoreVitals(experienceData) === 'Fail' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-600'
            }`}
        >
          Core Web Vitals Assessment: {checkCoreVitals(experienceData)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metricData.map((metric, index) => {
            const rangeColor = getRangeColor(metric.value, metric.ranges);
            return (
              <div className="bg-gray-50 p-5 rounded-lg shadow-sm border border-gray-200" key={index}>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">{metric.name}</h4>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rangeColor === 'good' ? 'bg-green-500' :
                          rangeColor === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{
                        width: `${Math.min((metric.value / (metric.ranges.poor[0] === Infinity ? metric.ranges.average[1] * 1.5 : metric.ranges.poor[0])) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {metric.value.toFixed(metric.unit === 'ms' ? 0 : 2)} {metric.unit}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  <p className="flex items-center gap-1 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block bg-green-500"></span>
                    Good: {metric.ranges.good.join(' - ')} {metric.unit}
                  </p>
                  <p className="flex items-center gap-1 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block bg-yellow-500"></span>
                    Average: {metric.ranges.average.join(' - ')} {metric.unit}
                  </p>
                  <p className="flex items-center gap-1 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full inline-block bg-red-500"></span>
                    Poor: {metric.ranges.poor[0]}{metric.ranges.poor[1] === Infinity ? '+' : ` - ${metric.ranges.poor[1]}`} {metric.unit}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const renderData = (view) => {
    if (!data?.[view]) return <p className="text-gray-600 text-center">No data available for {view} view.</p>;

    return (
      <div className="mb-8">
        <h4 className="text-xl font-bold mb-4 text-blue-600">
          {experienceView === 'loadingExperience' ? 'This URL' : 'Origin'} Data
        </h4>
        {renderMetrics(data[view][experienceView])}
        {renderDiagnose(data[view]['lighthouseResult'])}
      </div>
    );
  };

  const renderBothData = () => {
    if (!data) return <p className="text-gray-600 text-center">No data available.</p>;

    return (
      <>
        <button
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 mb-6"
          onClick={handleDownload}
        >
          Download Report as PDF
        </button>

        {/* Changed from lg:grid-cols-2 to grid-cols-1 to stack vertically */}
        <div className="grid grid-cols-1 gap-8 w-full mt-4 both-view">
          {/* Mobile View Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Mobile View</h2>

            <div className="space-y-8"> {/* Use space-y for vertical stacking of sections */}
              {/* This URL Data for Mobile */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">This URL</h3>
                {renderMetrics(data['mobile']?.loadingExperience)}
              </div>
              {/* Origin Data for Mobile */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">Origin</h3>
                {renderMetrics(data['mobile']?.originLoadingExperience)}
              </div>
            </div>

            {/* Diagnose section applies to the entire mobile view */}
            <div className="mt-8"> {/* Add margin top to separate from metrics */}
              {renderDiagnose(data['mobile']['lighthouseResult'])}
            </div>
          </div>

          {/* Desktop View Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Desktop View</h2>

            <div className="space-y-8"> {/* Use space-y for vertical stacking of sections */}
              {/* This URL Data for Desktop */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">This URL</h3>
                {renderMetrics(data['desktop']?.loadingExperience)}
              </div>
              {/* Origin Data for Desktop */}
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-600">Origin</h3>
                {renderMetrics(data['desktop']?.originLoadingExperience)}
              </div>
            </div>

            {/* Diagnose section applies to the entire desktop view */}
            <div className="mt-8"> {/* Add margin top to separate from metrics */}
              {renderDiagnose(data['desktop']['lighthouseResult'])}
            </div>
          </div>
        </div>
      </>
    );
  };


  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
  };

  const renderLoadingScreen = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-lg text-gray-700">
        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin mb-4"></div>
        <p>Analyzing website performance...</p>
        <p className="text-sm text-gray-500 mt-2">
          Average load time: {averageLoadTime ? (averageLoadTime / 1000).toFixed(2) + 's' : 'Calculating...'}
        </p>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-blue-50 rounded-xl shadow-md p-6 md:p-8 mb-8 border border-blue-200">
        <h3 className="text-xl font-semibold mb-3 text-blue-800">Why Core Vitals are Important</h3>
        <p className="mb-4 leading-relaxed text-blue-900">
          Core Web Vitals are essential for measuring the user experience on your website. They focus on key aspects like loading performance, interactivity, and visual stability. By optimizing these factors, you can ensure a smooth and efficient experience for users, which directly impacts your website's engagement, retention, and SEO performance.
        </p>
        <p className="leading-relaxed text-blue-900">
          By analyzing Core Vitals, you can identify bottlenecks in your website's performance and make improvements that can boost user satisfaction and search rankings.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3 text-blue-800">Download Your Report</h3>
        <p className="leading-relaxed text-blue-900">
          You can download this detailed report as a PDF for free by clicking on the download button. Choose 'Both' view to see the download option. Keep it for your records or share it with your team to improve your website's performance.
        </p>
      </div>

      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl p-6 md:p-8 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-blue-700">Core Vitals Analysis</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Enter a URL (e.g., https://www.google.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button
            onClick={fetchPageSpeedData}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {loading && renderLoadingScreen()}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600 text-center text-lg">{error}</p>
          </div>
        )}

        {data && (
          <div className="results-section">
            <div className="flex justify-center gap-4 mb-6 p-1 bg-gray-200 rounded-full shadow-inner">
              <button
                onClick={() => setView('mobile')}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${view === 'mobile' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Mobile
              </button>
              <button
                onClick={() => setView('desktop')}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${view === 'desktop' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setView('both')}
                className={`px-5 py-2 rounded-full font-medium transition-all duration-200 ${view === 'both' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-300'
                  }`}
              >
                Both
              </button>
            </div>

            {view !== 'both' && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={() =>
                    setExperienceView((prev) =>
                      prev === 'loadingExperience' ? 'originLoadingExperience' : 'loadingExperience'
                    )
                  }
                  className="px-5 py-2 rounded-full font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200 shadow-inner"
                >
                  Switch to{' '}
                  {experienceView === 'loadingExperience' ? 'Origin' : 'This URL'}
                </button>
              </div>
            )}

            <div className="text-sm text-gray-600 text-center mb-6">
              <p>
                <strong>Report generated:</strong> {formatTimestamp(data[view === 'both' ? 'mobile' : view]?.analysisUTCTimestamp)}
              </p>
            </div>

            {view === 'both' ? renderBothData() : renderData(view)}
          </div>
        )}

        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <PopupForm onSubmit={handleFormSubmission} setIsPopupVisible={setIsPopupVisible} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageSpeedInsights;
