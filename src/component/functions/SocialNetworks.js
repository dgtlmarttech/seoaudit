import React from 'react';

const SocialNetworks = ({ result }) => {
  try {
    const linkdata = result;

    if (!linkdata || !Array.isArray(linkdata)) {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-blue-500 text-6xl mb-4">🔗</div>
            <p className="text-lg text-gray-700">No social media link data available to display.</p>
          </div>
        </div>
      );
    }

    // Platform icon mapping
    const getPlatformIcon = (platform) => {
      const platformLower = platform?.toLowerCase() || '';
      const iconMap = {
        facebook: '📘',
        twitter: '🐦',
        instagram: '📷',
        linkedin: '💼',
        youtube: '📺',
        tiktok: '🎵',
        pinterest: '📌',
        snapchat: '👻',
        whatsapp: '💬',
        telegram: '✈️',
        discord: '🎮',
        reddit: '🔴',
        github: '🐱',
        medium: '📝',
        tumblr: '🌀',
        vimeo: '🎬',
        twitch: '🎮'
      };
      
      for (const [key, icon] of Object.entries(iconMap)) {
        if (platformLower.includes(key)) return icon;
      }
      return '🌐'; // Default icon
    };

    // Get platform color
    const getPlatformColor = (platform) => {
      const platformLower = platform?.toLowerCase() || '';
      const colorMap = {
        facebook: 'bg-blue-100 text-blue-800 border-blue-200',
        twitter: 'bg-sky-100 text-sky-800 border-sky-200',
        instagram: 'bg-pink-100 text-pink-800 border-pink-200',
        linkedin: 'bg-blue-100 text-blue-800 border-blue-200',
        youtube: 'bg-red-100 text-red-800 border-red-200',
        tiktok: 'bg-gray-100 text-gray-800 border-gray-200',
        pinterest: 'bg-red-100 text-red-800 border-red-200',
        snapchat: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        whatsapp: 'bg-green-100 text-green-800 border-green-200',
        telegram: 'bg-blue-100 text-blue-800 border-blue-200',
        discord: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        reddit: 'bg-orange-100 text-orange-800 border-orange-200',
        github: 'bg-gray-100 text-gray-800 border-gray-200',
        medium: 'bg-gray-100 text-gray-800 border-gray-200'
      };
      
      for (const [key, color] of Object.entries(colorMap)) {
        if (platformLower.includes(key)) return color;
      }
      return 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Analyze platform distribution
    const platformCounts = linkdata.reduce((acc, item) => {
      const platform = item.platform || 'Unknown';
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    }, {});

    const uniquePlatforms = Object.keys(platformCounts).length;
    const totalLinks = linkdata.length;

    // Common Tailwind classes
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r break-words";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";
    
    const outputStatusClasses = (isSuccess) =>
      `inline-block px-3 py-1 rounded-full text-sm font-medium ${
        isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`;

    const getAnalysisLevel = (count) => {
      if (count === 0) return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
      if (count <= 2) return { level: 'Basic', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      if (count <= 4) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
      return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
    };

    const analysis = getAnalysisLevel(totalLinks);

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔗</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Social Media Links Analysis</h2>
              <p className="text-gray-600">Analyze your social media presence and connectivity</p>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalLinks}</div>
                <div className="text-sm text-blue-700">Total Links</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{uniquePlatforms}</div>
                <div className="text-sm text-purple-700">Platforms</div>
              </div>
              <div className={`${analysis.bg} border border-opacity-30 rounded-lg p-4 text-center`}>
                <div className={`text-2xl font-bold ${analysis.color}`}>{analysis.level}</div>
                <div className={`text-sm ${analysis.color}`}>Coverage</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{totalLinks > 0 ? '100%' : '0%'}</div>
                <div className="text-sm text-gray-700">Accessibility</div>
              </div>
            </div>

            {/* Platform Distribution */}
            {totalLinks > 0 && (
              <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Platform Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(platformCounts).map(([platform, count]) => (
                    <div key={platform} className={`p-3 rounded-lg border ${getPlatformColor(platform)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getPlatformIcon(platform)}</span>
                          <span className="font-medium text-sm">{platform}</span>
                        </div>
                        <span className="font-bold">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className={sectionHeadingClasses}>Social Media Links Details</h3>
              
              <div className="overflow-x-auto">
                <table className={tableClasses}>
                  <thead>
                    <tr>
                      <th className={thClasses}>S.No</th>
                      <th className={thClasses}>Platform</th>
                      <th className={thClasses}>Link</th>
                      <th className={thClasses}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {linkdata.length > 0 ? linkdata.map((linkItem, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className={tdClasses}>{linkItem.sNo || index + 1}</td>
                        <td className={tdClasses}>
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{getPlatformIcon(linkItem.platform)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPlatformColor(linkItem.platform)}`}>
                              {linkItem.platform || 'Unknown'}
                            </span>
                          </div>
                        </td>
                        <td className={`${tdClasses} max-w-xs`}>
                          <a 
                            href={linkItem.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline break-all"
                          >
                            {linkItem.link.length > 50 ? `${linkItem.link.substring(0, 50)}...` : linkItem.link}
                          </a>
                        </td>
                        <td className={tdClasses}>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            Active
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className={`${tdClasses} text-center text-gray-500 py-8`}>
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">📭</div>
                            <div>No social media links found</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Analysis Summary</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Overall Status</h4>
                      <div className="flex items-center">
                        <span className={outputStatusClasses(linkdata.length > 0)}>
                          {linkdata.length > 0 ? 'Success' : 'Needs Improvement'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Social Reach Level</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${analysis.color} ${analysis.bg}`}>
                        {analysis.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Detailed Report</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {linkdata.length > 0
                        ? `Your website has ${totalLinks} social media link${totalLinks > 1 ? 's' : ''} across ${uniquePlatforms} platform${uniquePlatforms > 1 ? 's' : ''}. This ${analysis.level.toLowerCase()} social media presence helps enhance online visibility, foster user engagement, and provides additional channels for audience interaction, contributing positively to your SEO strategy.`
                        : 'No social media links were detected on your webpage. Adding social media links can significantly improve online visibility, user engagement, and provide valuable social signals to search engines, which can positively impact your SEO performance.'}
                    </p>
                  </div>

                  {linkdata.length === 0 && (
                    <div className="p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg">
                      <h5 className="font-semibold text-orange-800 mb-2">Recommendations:</h5>
                      <ul className="text-orange-700 text-sm space-y-1">
                        <li>• Add links to your primary social media profiles</li>
                        <li>• Include popular platforms like Facebook, Twitter, Instagram, LinkedIn</li>
                        <li>• Place social links in footer or header for easy access</li>
                        <li>• Ensure links open in new tabs to retain visitors</li>
                        <li>• Use recognizable social media icons for better UX</li>
                      </ul>
                    </div>
                  )}

                  {linkdata.length > 0 && linkdata.length <= 2 && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Enhancement Opportunities:</h5>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Consider adding more social platforms to expand reach</li>
                        <li>• Include video platforms like YouTube or TikTok if relevant</li>
                        <li>• Add professional networks like LinkedIn for B2B engagement</li>
                        <li>• Ensure all social profiles are active and regularly updated</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Section */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <p className={questionClasses}>
                  <strong>Why are Social Media Links Important for SEO?</strong>
                </p>
                <p className={answerClasses}>
                  Social media links serve as powerful connectors between your website and social platforms, creating additional pathways for user engagement and content discovery. They contribute to your overall digital presence by providing social signals to search engines, increasing brand awareness, driving referral traffic, and encouraging social sharing of your content. A well-connected social media strategy can significantly enhance your website's authority and search engine rankings.
                </p>
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
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Report</h2>
          <p className="text-red-600 mb-4">{error.message || 'An unexpected error occurred while analyzing social media links.'}</p>
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

export default SocialNetworks;