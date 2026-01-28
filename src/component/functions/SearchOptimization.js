import React from "react";

const SearchOptimization = ({ result }) => {
  try {
    if (!result || typeof result !== "object") {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-blue-500 text-6xl mb-4">🔍</div>
            <p className="text-lg text-gray-700">No search optimization data available to display.</p>
          </div>
        </div>
      );
    }

    const { canonicalLinks, alternateLinks, headSchema, bodySchema } = result;

    // Helper to extract href from link string
    const extractHref = (linkString) => {
      const match = linkString.match(/href="([^"]+)"/);
      return match ? match[1] : 'N/A';
    };

    // Helper to extract additional attributes from link string
    const extractLinkDetails = (linkString) => {
      const hrefMatch = linkString.match(/href="([^"]+)"/);
      const hreflangMatch = linkString.match(/hreflang="([^"]+)"/);
      const relMatch = linkString.match(/rel="([^"]+)"/);
      
      return {
        href: hrefMatch ? hrefMatch[1] : 'N/A',
        hreflang: hreflangMatch ? hreflangMatch[1] : null,
        rel: relMatch ? relMatch[1] : null
      };
    };

    // Analyze optimization status
    const isCanonicalSuccess = canonicalLinks && canonicalLinks.length > 0;
    const isAlternateSuccess = alternateLinks && alternateLinks.length > 0;
    const isSchemaSuccess = headSchema && headSchema.length > 0;
    const isSchemaWarning = !isSchemaSuccess && bodySchema && bodySchema.length > 0;
    const hasAnySchema = isSchemaSuccess || isSchemaWarning;

    // Calculate optimization score
    const calculateOptimizationScore = () => {
      let score = 0;
      let maxScore = 3;
      
      if (isCanonicalSuccess) score += 1;
      if (isAlternateSuccess) score += 1;
      if (isSchemaSuccess) score += 1;
      else if (isSchemaWarning) score += 0.5;
      
      return Math.round((score / maxScore) * 100);
    };

    const optimizationScore = calculateOptimizationScore();
    
    const getOptimizationLevel = (score) => {
      if (score >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
      if (score >= 70) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
      if (score >= 50) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
    };

    const optimizationLevel = getOptimizationLevel(optimizationScore);

    // Count implementations
    const implementedFeatures = [isCanonicalSuccess, isAlternateSuccess, hasAnySchema].filter(Boolean).length;
    const totalFeatures = 3;

    // Common Tailwind classes
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r break-words";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";
    
    const outputStatusClasses = (isSuccess, isWarning = false) => {
      let baseClasses = "inline-block px-3 py-1 rounded-full text-sm font-medium";
      if (isWarning) return `${baseClasses} bg-yellow-100 text-yellow-800`;
      if (isSuccess) return `${baseClasses} bg-green-100 text-green-800`;
      return `${baseClasses} bg-red-100 text-red-800`;
    };

    const StatusIcon = ({ success, warning = false }) => {
      if (success) return <span className="text-green-500 text-lg">✅</span>;
      if (warning) return <span className="text-yellow-500 text-lg">⚠️</span>;
      return <span className="text-red-500 text-lg">❌</span>;
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Search Optimization Analysis</h2>
              <p className="text-gray-600">Technical SEO elements assessment for better search visibility</p>
            </div>

            {/* Optimization Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className={`${optimizationLevel.bg} border border-opacity-30 rounded-lg p-4 text-center`}>
                <div className={`text-2xl font-bold ${optimizationLevel.color}`}>{optimizationScore}%</div>
                <div className={`text-sm ${optimizationLevel.color}`}>SEO Score</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{implementedFeatures}/{totalFeatures}</div>
                <div className="text-sm text-blue-700">Features</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {[isCanonicalSuccess, isAlternateSuccess, isSchemaSuccess].filter(Boolean).length}
                </div>
                <div className="text-sm text-green-700">Optimized</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {isSchemaWarning && !isSchemaSuccess ? 1 : 0}
                </div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
            </div>

            {/* Optimization Level Indicator */}
            <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Optimization Level</h3>
                  <p className="text-gray-600">Based on technical SEO implementation</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${optimizationLevel.color} ${optimizationLevel.bg}`}>
                  {optimizationLevel.level}
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      optimizationScore >= 80 ? 'bg-green-500' : 
                      optimizationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${optimizationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Canonical Link Tag Section */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4">
                <StatusIcon success={isCanonicalSuccess} />
                <h3 className={`${sectionHeadingClasses} mb-0 ml-3`}>Canonical Link Tag</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className={tableClasses}>
                  <thead>
                    <tr>
                      <th className={thClasses}>Status</th>
                      <th className={thClasses}>Canonical URL</th>
                      <th className={thClasses}>Domain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isCanonicalSuccess ? (
                      <tr className="bg-green-50">
                        <td className={tdClasses}>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            Found
                          </span>
                        </td>
                        <td className={tdClasses}>
                          <a 
                            href={extractHref(canonicalLinks[0])} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline break-all"
                          >
                            {extractHref(canonicalLinks[0])}
                          </a>
                        </td>
                        <td className={tdClasses}>
                          {(() => {
                            try {
                              return new URL(extractHref(canonicalLinks[0])).hostname;
                            } catch {
                              return 'Invalid URL';
                            }
                          })()}
                        </td>
                      </tr>
                    ) : (
                      <tr className="bg-red-50">
                        <td colSpan="3" className={`${tdClasses} text-center text-red-600`}>
                          <div className="flex flex-col items-center py-4">
                            <span className="text-3xl mb-2">⚠️</span>
                            <span>No canonical link tag found</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700">Assessment</h4>
                  <span className={outputStatusClasses(isCanonicalSuccess)}>
                    {isCanonicalSuccess ? 'Implemented' : 'Missing'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {isCanonicalSuccess
                    ? "✅ Canonical tag is properly implemented, helping prevent duplicate content issues and consolidating ranking signals."
                    : "❌ Missing canonical tag may lead to duplicate content issues and diluted ranking authority."}
                </p>
              </div>
            </div>

            {/* Alternate Links Section */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4">
                <StatusIcon success={isAlternateSuccess} />
                <h3 className={`${sectionHeadingClasses} mb-0 ml-3`}>Alternate Links (Internationalization)</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className={tableClasses}>
                  <thead>
                    <tr>
                      <th className={thClasses}>S.No</th>
                      <th className={thClasses}>URL</th>
                      <th className={thClasses}>Language/Region</th>
                      <th className={thClasses}>Relationship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isAlternateSuccess ? (
                      alternateLinks.map((link, index) => {
                        const details = extractLinkDetails(link);
                        return (
                          <tr key={index} className="bg-green-50">
                            <td className={tdClasses}>{index + 1}</td>
                            <td className={tdClasses}>
                              <a 
                                href={details.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline break-all"
                              >
                                {details.href.length > 50 ? `${details.href.substring(0, 50)}...` : details.href}
                              </a>
                            </td>
                            <td className={tdClasses}>
                              {details.hreflang ? (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                  {details.hreflang}
                                </span>
                              ) : (
                                <span className="text-gray-500">Not specified</span>
                              )}
                            </td>
                            <td className={tdClasses}>
                              <span className="text-sm text-gray-600">{details.rel || 'alternate'}</span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="bg-yellow-50">
                        <td colSpan="4" className={`${tdClasses} text-center text-yellow-600`}>
                          <div className="flex flex-col items-center py-4">
                            <span className="text-3xl mb-2">🌐</span>
                            <span>No alternate links found - Consider adding for international SEO</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700">International SEO Status</h4>
                  <span className={outputStatusClasses(isAlternateSuccess)}>
                    {isAlternateSuccess ? `${alternateLinks.length} Links` : 'Not Implemented'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {isAlternateSuccess
                    ? `✅ ${alternateLinks.length} alternate link${alternateLinks.length > 1 ? 's' : ''} configured for international targeting and improved global search visibility.`
                    : "💡 Consider adding alternate links if your site serves multiple languages or regions to improve international SEO."}
                </p>
              </div>
            </div>

            {/* Schema Markup Section */}
            <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4">
                <StatusIcon success={isSchemaSuccess} warning={isSchemaWarning} />
                <h3 className={`${sectionHeadingClasses} mb-0 ml-3`}>Schema Markup (Structured Data)</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg border-2 ${isSchemaSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700">HEAD Section</h4>
                    <StatusIcon success={headSchema && headSchema.length > 0} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {headSchema && headSchema.length > 0 
                      ? `✅ ${headSchema.length} schema markup${headSchema.length > 1 ? 's' : ''} found (Recommended placement)`
                      : "❌ No schema markup in HEAD section"}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg border-2 ${bodySchema && bodySchema.length > 0 ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700">BODY Section</h4>
                    <StatusIcon success={false} warning={bodySchema && bodySchema.length > 0} />
                  </div>
                  <p className="text-sm text-gray-600">
                    {bodySchema && bodySchema.length > 0 
                      ? `⚠️ ${bodySchema.length} schema markup${bodySchema.length > 1 ? 's' : ''} found (Consider moving to HEAD)`
                      : "No schema markup in BODY section"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-700">Structured Data Status</h4>
                  <span className={outputStatusClasses(isSchemaSuccess, isSchemaWarning)}>
                    {isSchemaSuccess ? 'Optimal' : isSchemaWarning ? 'Suboptimal' : 'Missing'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">
                  {isSchemaSuccess
                    ? "✅ Schema markup is optimally placed in the HEAD section for best SEO performance and rich snippet eligibility."
                    : isSchemaWarning
                      ? "⚠️ Schema markup found in BODY section. While functional, placing it in HEAD section is recommended for better SEO practices."
                      : "❌ No structured data found. Adding schema markup can significantly improve search visibility and enable rich snippets."}
                </p>
              </div>
            </div>

            {/* Overall Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Optimization Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Current Implementation</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Canonical Tag</span>
                      <span className={isCanonicalSuccess ? 'text-green-600' : 'text-red-600'}>
                        {isCanonicalSuccess ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Alternate Links</span>
                      <span className={isAlternateSuccess ? 'text-green-600' : 'text-yellow-600'}>
                        {isAlternateSuccess ? '✅' : '💡'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Schema Markup</span>
                      <span className={isSchemaSuccess ? 'text-green-600' : isSchemaWarning ? 'text-yellow-600' : 'text-red-600'}>
                        {isSchemaSuccess ? '✅' : isSchemaWarning ? '⚠️' : '❌'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Recommendations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {!isCanonicalSuccess && <li>• Implement canonical tags to prevent duplicate content issues</li>}
                    {!isAlternateSuccess && <li>• Add alternate links for international SEO if applicable</li>}
                    {!isSchemaSuccess && !isSchemaWarning && <li>• Add structured data markup for rich snippets</li>}
                    {isSchemaWarning && <li>• Move schema markup from BODY to HEAD section</li>}
                    {isCanonicalSuccess && isAlternateSuccess && hasAnySchema && <li>• ✅ Excellent technical SEO implementation!</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Educational Section */}
            <div className="pt-6 border-t border-gray-300">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                <h3 className={questionClasses}>
                  <strong>Why are these Technical SEO Elements Critical?</strong>
                </h3>
                <div className="space-y-3 text-sm">
                  <p className={answerClasses}>
                    <strong>Canonical Tags:</strong> Prevent duplicate content penalties by telling search engines which version of a page is the preferred one, consolidating ranking signals and avoiding content dilution.
                  </p>
                  <p className={answerClasses}>
                    <strong>Alternate Links:</strong> Essential for international SEO, helping search engines serve the right language or regional version to users, improving global search visibility and user experience.
                  </p>
                  <p className={answerClasses}>
                    <strong>Schema Markup:</strong> Provides structured data that helps search engines understand your content better, enabling rich snippets, knowledge panels, and improved SERP features that can significantly boost click-through rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-50 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Analysis Error</h2>
          <p className="text-red-600 mb-4">{error.message || 'An unexpected error occurred during search optimization analysis.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }
};

export default SearchOptimization;