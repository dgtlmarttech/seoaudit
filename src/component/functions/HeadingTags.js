import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Hash, Eye, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';

const HeadingTags = ({ result }) => {
  const [expandedSections, setExpandedSections] = useState({
    h1: true,
    h2: true,
    h3: false,
    h4: false,
    h5: false,
    h6: false
  });

  try {
    const { h1, h2, h3, h4, h5, h6 } = result;
    
    // Process heading data
    const headingData = [
      { level: 'H1', data: h1, importance: 'critical', color: 'red' },
      { level: 'H2', data: h2, importance: 'high', color: 'orange' },
      { level: 'H3', data: h3, importance: 'medium', color: 'yellow' },
      { level: 'H4', data: h4, importance: 'medium', color: 'blue' },
      { level: 'H5', data: h5, importance: 'low', color: 'indigo' },
      { level: 'H6', data: h6, importance: 'low', color: 'purple' }
    ];

    // Calculate statistics
    const getHeadingCount = (data) => {
      if (data === 'Not Found' || !data || data.length === 0) return 0;
      return Array.isArray(data) ? data.length : 0;
    };

    const headingStats = headingData.map(heading => ({
      ...heading,
      count: getHeadingCount(heading.data),
      hasContent: heading.data !== 'Not Found' && heading.data && heading.data.length > 0
    }));

    const totalHeadings = headingStats.reduce((sum, heading) => sum + heading.count, 0);
    const h1Count = headingStats[0].count;
    const h1Status = h1Count === 1 ? 'optimal' : h1Count === 0 ? 'missing' : 'multiple';
    
    // Check heading hierarchy
    const checkHierarchy = () => {
      const issues = [];
      let hasH1 = headingStats[0].count > 0;
      
      if (!hasH1) {
        issues.push('Missing H1 tag - critical for SEO');
      }
      
      if (headingStats[0].count > 1) {
        issues.push('Multiple H1 tags found - should be unique');
      }
      
      // Check for skipped levels
      for (let i = 1; i < headingStats.length; i++) {
        if (headingStats[i].count > 0 && headingStats[i-1].count === 0) {
          issues.push(`${headingStats[i].level} found without ${headingStats[i-1].level} - breaks hierarchy`);
        }
      }
      
      return issues;
    };

    const hierarchyIssues = checkHierarchy();
    const isHierarchyHealthy = hierarchyIssues.length === 0 && h1Status === 'optimal';

    const toggleSection = (section) => {
      setExpandedSections(prev => ({
        ...prev,
        [section.toLowerCase()]: !prev[section.toLowerCase()]
      }));
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'optimal': return 'text-green-600';
        case 'missing': return 'text-red-600';
        case 'multiple': return 'text-orange-600';
        default: return 'text-gray-600';
      }
    };

    const getImportanceColor = (importance) => {
      switch (importance) {
        case 'critical': return 'border-red-400 bg-red-50';
        case 'high': return 'border-orange-400 bg-orange-50';
        case 'medium': return 'border-yellow-400 bg-yellow-50';
        case 'low': return 'border-blue-400 bg-blue-50';
        default: return 'border-gray-400 bg-gray-50';
      }
    };

    const StatusIcon = ({ status }) => {
      switch (status) {
        case 'optimal':
          return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'missing':
          return <XCircle className="w-5 h-5 text-red-600" />;
        case 'multiple':
          return <AlertCircle className="w-5 h-5 text-orange-600" />;
        default:
          return <Hash className="w-5 h-5 text-gray-600" />;
      }
    };

    const renderHeadingSection = (heading) => {
      const isExpanded = expandedSections[heading.level.toLowerCase()];
      const hasData = heading.hasContent;
      
      return (
        <div key={heading.level} className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
          <div 
            className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 ${getImportanceColor(heading.importance)}`}
            onClick={() => toggleSection(heading.level)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex items-center mr-4">
                  {isExpanded ? 
                    <ChevronDown className="w-5 h-5 text-gray-500" /> : 
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  }
                </div>
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold text-gray-800 mr-4">{heading.level}</h3>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    heading.importance === 'critical' ? 'bg-red-100 text-red-800' :
                    heading.importance === 'high' ? 'bg-orange-100 text-orange-800' :
                    heading.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {heading.importance}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-700 mr-4">{heading.count}</span>
                {heading.level === 'H1' && <StatusIcon status={h1Status} />}
                {heading.level !== 'H1' && (hasData ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> : 
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
          
          {isExpanded && (
            <div className="px-6 pb-6">
              {hasData ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700 w-16">#</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700">Content</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-700 w-24">Length</th>
                      </tr>
                    </thead>
                    <tbody>
                      {heading.data.map((content, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-700">{index + 1}</td>
                          <td className="py-3 px-4 text-gray-800">
                            <span className="break-words">{content}</span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{content.length} chars</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <EyeOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No {heading.level} tags found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {heading.importance === 'critical' || heading.importance === 'high' 
                      ? 'Consider adding for better SEO structure' 
                      : 'Not critical for basic SEO'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 font-sans antialiased">
        <div className="max-w-5xl mx-auto">
          {/* Header with overall statistics */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Heading Structure SEO Report</h1>
              <div className="flex items-center justify-center mb-4">
                <Hash className="w-8 h-8 text-indigo-600 mr-3" />
                <span className="text-xl text-gray-600">{totalHeadings} total headings analyzed</span>
              </div>
            </div>
            
            {/* Overall Status */}
            <div className="flex items-center justify-center mb-6">
              <StatusIcon status={isHierarchyHealthy ? 'optimal' : 'multiple'} />
              <span className={`ml-3 text-xl font-semibold ${
                isHierarchyHealthy ? 'text-green-700' : 'text-red-700'
              }`}>
                Heading Structure: {isHierarchyHealthy ? 'Healthy' : 'Needs Improvement'}
              </span>
            </div>

            {/* Statistics Grid */}
            <div className="grid md:grid-cols-6 gap-4 mb-6">
              {headingStats.map((heading, index) => (
                <div 
                  key={heading.level}
                  className={`p-4 rounded-lg text-center border-2 ${getImportanceColor(heading.importance)}`}
                >
                  <h3 className="font-bold text-gray-800 text-lg">{heading.level}</h3>
                  <p className="text-2xl font-bold text-gray-700">{heading.count}</p>
                  <p className="text-xs text-gray-600 capitalize">{heading.importance}</p>
                </div>
              ))}
            </div>

            {/* H1 Status Alert */}
            <div className={`p-4 rounded-lg border-l-4 ${
              h1Status === 'optimal' ? 'border-green-400 bg-green-50' :
              h1Status === 'missing' ? 'border-red-400 bg-red-50' :
              'border-orange-400 bg-orange-50'
            }`}>
              <div className="flex items-center">
                <StatusIcon status={h1Status} />
                <div className="ml-3">
                  <p className={`font-semibold ${getStatusColor(h1Status)}`}>
                    H1 Status: {
                      h1Status === 'optimal' ? 'Perfect! One H1 tag found' :
                      h1Status === 'missing' ? 'Missing H1 tag' :
                      `${h1Count} H1 tags found (should be 1)`
                    }
                  </p>
                  <p className="text-sm text-gray-600">
                    {h1Status === 'optimal' ? 'Your page has proper H1 structure' :
                     h1Status === 'missing' ? 'Every page should have exactly one H1 tag' :
                     'Multiple H1 tags can confuse search engines'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hierarchy Issues */}
          {hierarchyIssues.length > 0 && (
            <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 mr-3" />
                Hierarchy Issues Found
              </h2>
              <div className="space-y-3">
                {hierarchyIssues.map((issue, index) => (
                  <div key={index} className="flex items-start p-3 bg-red-50 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-red-700">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Heading Analysis */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Heading Analysis</h2>
            <div className="space-y-4">
              {headingStats.map(renderHeadingSection)}
            </div>
          </div>

          {/* SEO Guidelines */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">SEO Best Practices</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Heading Hierarchy Rules
                </h3>
                <ul className="text-blue-700 text-sm space-y-2 list-disc list-inside">
                  <li>Use exactly one H1 tag per page</li>
                  <li>Follow logical order (H1 → H2 → H3 → etc.)</li>
                  <li>Don't skip heading levels</li>
                  <li>Use headings to structure content, not for styling</li>
                </ul>
              </div>

              <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Content Guidelines
                </h3>
                <ul className="text-green-700 text-sm space-y-2 list-disc list-inside">
                  <li>Include target keywords naturally</li>
                  <li>Keep headings descriptive and concise</li>
                  <li>Make them scannable for users</li>
                  <li>Reflect the content structure accurately</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommendations</h2>
            
            {h1Status === 'missing' && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h3 className="font-semibold text-red-800 mb-2">Critical: Add an H1 tag</h3>
                <p className="text-red-700 mb-3">
                  Your page is missing an H1 tag, which is crucial for SEO and accessibility.
                </p>
                <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                  <li>Add one H1 tag that describes the main topic of the page</li>
                  <li>Include your primary keyword naturally</li>
                  <li>Keep it under 60 characters for best results</li>
                </ul>
              </div>
            )}

            {h1Status === 'multiple' && (
              <div className="mb-6 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <h3 className="font-semibold text-orange-800 mb-2">Fix: Multiple H1 tags detected</h3>
                <p className="text-orange-700 mb-3">
                  You have {h1Count} H1 tags. Use only one H1 per page for optimal SEO.
                </p>
                <ul className="text-orange-700 text-sm space-y-1 list-disc list-inside">
                  <li>Choose the most important heading to remain as H1</li>
                  <li>Convert other H1s to H2 or appropriate level</li>
                  <li>Ensure the H1 represents the main page topic</li>
                </ul>
              </div>
            )}

            {hierarchyIssues.length === 0 && h1Status === 'optimal' && (
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-green-800 mb-2">Excellent heading structure! 🎉</h3>
                <p className="text-green-700 mb-3">
                  Your heading hierarchy follows SEO best practices.
                </p>
                <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
                  <li>Continue using descriptive, keyword-rich headings</li>
                  <li>Maintain logical content structure</li>
                  <li>Consider adding more H2-H3 subheadings for longer content</li>
                </ul>
              </div>
            )}

            {/* Show "No recommendations" when there are no issues */}
            {h1Status === 'optimal' && hierarchyIssues.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-800 mb-2">No recommendations needed</p>
                <p className="text-gray-600">Your heading structure is already optimized for SEO!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
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
};

export default HeadingTags;
