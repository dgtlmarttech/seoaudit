import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

const Indexation = ({ result }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (result) {
          const resolvedData = await result;
          setData(resolvedData);
        } else {
          setError(new Error("No result prop provided to Indexation component."));
        }
      } catch (err) {
        console.error('Error resolving data:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [result]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading indexation report...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-red-800">Error</h2>
          <p className="text-lg text-red-700">{error.message || 'An unexpected error occurred.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">No data available</p>
        </div>
      </div>
    );
  }

  // Determine success status
  const isRobotsSuccess = data.robotsContent !== 'No /robots.txt found';
  const isSitemapSuccess = data.sitemapConfirmation !== 'No /sitemap.xml found';
  const overallSuccess = isRobotsSuccess && isSitemapSuccess;

  // Status icon component
  const StatusIcon = ({ success }) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-600 inline mr-2" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600 inline mr-2" />
    );
  };

  // Status badge component
  const StatusBadge = ({ success, label }) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        <StatusIcon success={success} />
        {success ? 'Success' : 'Failure'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 font-sans antialiased">
      <div className="max-w-4xl mx-auto">
        {/* Header with overall status */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">SEO Indexation Report</h1>
            <div className="flex items-center justify-center">
              <StatusIcon success={overallSuccess} />
              <span className={`text-xl font-semibold ${overallSuccess ? 'text-green-700' : 'text-red-700'}`}>
                Overall Status: {overallSuccess ? 'Healthy' : 'Needs Attention'}
              </span>
            </div>
          </div>
          
          {/* Quick summary */}
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Robots.txt</h3>
              <StatusBadge success={isRobotsSuccess} />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Sitemap.xml</h3>
              <StatusBadge success={isSitemapSuccess} />
            </div>
          </div>
        </div>

        {/* Detailed Robots.txt Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <StatusIcon success={isRobotsSuccess} />
            <h2 className="text-3xl font-bold text-gray-800">Robots.txt Analysis</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700 w-1/4">
                    File Present
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <StatusIcon success={isRobotsSuccess} />
                      <span className={`font-medium ${isRobotsSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isRobotsSuccess ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700 align-top">
                    Content
                  </td>
                  <td className="py-4 px-6">
                    <pre className="whitespace-pre-wrap break-words text-sm bg-gray-100 p-3 rounded-md max-h-40 overflow-y-auto">
                      {data.robotsContent}
                    </pre>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700">
                    Status
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge success={isRobotsSuccess} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Why is robots.txt important?
            </h3>
            <p className="text-blue-700 leading-relaxed">
              The robots.txt file serves as a roadmap for search engine crawlers, directing them toward important content while protecting sensitive areas of your website. It helps optimize crawl budget, improves SEO performance, and ensures search engines focus on your most valuable pages.
            </p>
          </div>
        </div>

        {/* Detailed Sitemap Section */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <StatusIcon success={isSitemapSuccess} />
            <h2 className="text-3xl font-bold text-gray-800">Sitemap.xml Analysis</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700 w-1/4">
                    File Present
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <StatusIcon success={isSitemapSuccess} />
                      <span className={`font-medium ${isSitemapSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSitemapSuccess ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700">
                    Status
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge success={isSitemapSuccess} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
            <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Why is sitemap.xml essential?
            </h3>
            <p className="text-green-700 leading-relaxed">
              A sitemap.xml file acts as a comprehensive directory of your website's structure, helping search engines discover, crawl, and index your content more efficiently. It's particularly crucial for large websites, new sites, or pages with limited internal linking, significantly improving search engine visibility and rankings.
            </p>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommendations</h2>
          
          {!isRobotsSuccess && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <h3 className="font-semibold text-red-800 mb-2">Missing robots.txt file</h3>
              <p className="text-red-700 mb-3">
                Your website is missing a robots.txt file. This could lead to inefficient crawling and indexing.
              </p>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Create a robots.txt file in your website's root directory</li>
                <li>• Include directives for search engine crawlers</li>
                <li>• Reference your sitemap.xml location</li>
              </ul>
            </div>
          )}

          {!isSitemapSuccess && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
              <h3 className="font-semibold text-red-800 mb-2">Missing sitemap.xml file</h3>
              <p className="text-red-700 mb-3">
                Your website is missing a sitemap.xml file. This may hinder search engine discovery of your content.
              </p>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Generate a comprehensive sitemap.xml file</li>
                <li>• Include all important pages and their metadata</li>
                <li>• Submit the sitemap to search engines via their webmaster tools</li>
              </ul>
            </div>
          )}

          {overallSuccess && (
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="font-semibold text-green-800 mb-2">Great job! Your indexation setup looks healthy</h3>
              <p className="text-green-700 mb-3">
                Both robots.txt and sitemap.xml files are present. Here are some additional optimization tips:
              </p>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Regularly update your sitemap.xml with new content</li>
                <li>• Monitor crawl errors in search console</li>
                <li>• Review and optimize your robots.txt directives periodically</li>
                <li>• Consider implementing structured data markup</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Indexation;