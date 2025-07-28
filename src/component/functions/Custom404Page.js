import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Search, Shield, MapPin } from 'lucide-react';

const Custom404 = ({ result }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for demonstration - replace with actual result prop
  const data = result || {
    custom404: 'YES',
    additionalConditions: {
      is404InSourceCode: true,
      isRobotsBlocked: false,
      isInSitemap: false
    }
  };

  const overallStatus = data.custom404 === 'YES' ? 'success' : 'warning';
  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800'
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800'
    }
  };

  const currentStatus = statusConfig[overallStatus];
  const StatusIcon = currentStatus.icon;

  const checkItems = [
    {
      label: '404 Status Code',
      value: data.additionalConditions.is404InSourceCode,
      description: 'Returns proper 404 HTTP status code',
      icon: Search,
      importance: 'critical'
    },
    {
      label: 'Not Blocked by Robots',
      value: !data.additionalConditions.isRobotsBlocked,
      description: 'Page is not blocked by robots.txt',
      icon: Shield,
      importance: 'important'
    },
    {
      label: 'Not in Sitemap',
      value: !data.additionalConditions.isInSitemap,
      description: '404 page should not be listed in sitemap',
      icon: MapPin,
      importance: 'important'
    }
  ];

  const getCheckStatus = (value, importance) => {
    if (value) return 'success';
    return importance === 'critical' ? 'error' : 'warning';
  };

  const scoreCalculation = () => {
    const totalChecks = checkItems.length + 1; // +1 for custom 404
    let passedChecks = data.custom404 === 'YES' ? 1 : 0;
    passedChecks += checkItems.filter(item => item.value).length;
    return Math.round((passedChecks / totalChecks) * 100);
  };

  const score = scoreCalculation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 font-sans antialiased">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Custom 404 Page Analysis</h1>
                <p className="text-blue-100 text-lg">SEO compliance and user experience audit</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-1">{score}%</div>
                <div className="text-blue-100">Overall Score</div>
              </div>
            </div>
          </div>
          
          {/* Status Overview */}
          <div className={`px-6 py-6 ${currentStatus.bg} ${currentStatus.border} border-t`}>
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full bg-white ${currentStatus.color}`}>
                <StatusIcon size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {data.custom404 === 'YES' ? 'Custom 404 Page Detected' : 'No Custom 404 Page Found'}
                </h2>
                <p className={`text-lg ${currentStatus.color} font-medium`}>
                  {data.custom404 === 'YES' 
                    ? 'Your website has a custom 404 page implementation' 
                    : 'Consider implementing a custom 404 page for better UX'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'technical', label: 'Technical Details', icon: Search }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 flex items-center justify-center space-x-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <TabIcon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Quick Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {checkItems.map((item, index) => {
                    const checkStatus = getCheckStatus(item.value, item.importance);
                    const config = statusConfig[checkStatus];
                    const ItemIcon = item.icon;
                    
                    return (
                      <div key={index} className={`p-4 rounded-xl border-2 ${config.border} ${config.bg}`}>
                        <div className="flex items-center space-x-3 mb-2">
                          <ItemIcon className={`${config.color}`} size={24} />
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${config.badge}`}>
                            {item.value ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.label}</h3>
                        <p className="text-gray-600 text-xs leading-relaxed">{item.description}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Recommendations */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Info className="text-blue-600 mr-2" size={24} />
                    Why Custom 404 Pages Matter
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">SEO Benefits</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Reduces bounce rate from broken links</li>
                        <li>• Maintains crawlability for search engines</li>
                        <li>• Preserves link equity distribution</li>
                        <li>• Prevents negative ranking signals</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">User Experience</h4>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Guides users to relevant content</li>
                        <li>• Maintains brand consistency</li>
                        <li>• Provides helpful navigation options</li>
                        <li>• Reduces user frustration</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="space-y-6">
                {/* Technical Details Table */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Implementation Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-300">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Check</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Expected Behavior</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="py-4 px-4 font-medium text-gray-900">Custom 404 Page</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              data.custom404 === 'YES' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {data.custom404 === 'YES' ? 'Implemented' : 'Not Found'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600 text-sm">Should display branded 404 page with navigation</td>
                        </tr>
                        {checkItems.map((item, index) => {
                          const status = getCheckStatus(item.value, item.importance);
                          const config = statusConfig[status];
                          return (
                            <tr key={index}>
                              <td className="py-4 px-4 font-medium text-gray-900">{item.label}</td>
                              <td className="py-4 px-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badge}`}>
                                  {item.value ? 'Pass' : 'Fail'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-600 text-sm">{item.description}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Action Items */}
                {score < 100 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-amber-800 mb-4 flex items-center">
                      <AlertTriangle className="mr-2" size={24} />
                      Recommended Actions
                    </h3>
                    <div className="space-y-3">
                      {data.custom404 !== 'YES' && (
                        <div className="flex items-start space-x-3">
                          <div className="bg-amber-200 rounded-full p-1 mt-0.5">
                            <span className="text-amber-800 text-xs font-bold px-1">1</span>
                          </div>
                          <div>
                            <p className="font-semibold text-amber-800">Implement Custom 404 Page</p>
                            <p className="text-amber-700 text-sm">Create a branded 404 page with helpful navigation and search functionality</p>
                          </div>
                        </div>
                      )}
                      {checkItems.map((item, index) => {
                        if (!item.value) {
                          return (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="bg-amber-200 rounded-full p-1 mt-0.5">
                                <span className="text-amber-800 text-xs font-bold px-1">{index + 2}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-amber-800">Fix {item.label}</p>
                                <p className="text-amber-700 text-sm">{item.description}</p>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Best Practices Expandable Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-xl font-semibold text-gray-900">404 Page Best Practices</h3>
            {showDetails ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
          
          {showDetails && (
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg">Essential Elements</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Clear, friendly error message explaining the situation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Search functionality to help users find content</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Links to popular pages or main navigation</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Consistent branding and design with your site</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 text-lg">Technical Requirements</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Returns proper 404 HTTP status code</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Not indexed by search engines</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Mobile-responsive design</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                      <span className="text-sm">Fast loading time</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Custom404;