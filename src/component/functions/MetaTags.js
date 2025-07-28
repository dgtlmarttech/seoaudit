import React, { useMemo } from 'react';

const MetaTags = ({ result }) => {
  // Memoize the meta tags analysis
  const metaTagsAnalysis = useMemo(() => {
    if (!result || typeof result !== 'object') {
      return null;
    }

    const tagConfigurations = [
      {
        name: 'Meta Title',
        key: 'title',
        content: result?.title?.content || null,
        length: result?.title?.length || 0,
        element: `<title>${result?.title?.content || 'Not Available'}</title>`,
        minLength: 30,
        maxLength: 70,
        priority: 'critical',
        description: 'The title that appears in search engine results and browser tabs',
        whyRequired: 'Meta title tags are critical for SEO as they provide a concise, relevant summary of a web page\'s content, influencing search engine rankings and click-through rates in search results, thereby enhancing website visibility and organic traffic.'
      },
      {
        name: 'Meta Description',
        key: 'description',
        content: result?.description?.content || null,
        length: result?.description?.length || 0,
        element: `<meta name="description" content="${result?.description?.content || 'Not Available'}">`,
        minLength: 150,
        maxLength: 200,
        priority: 'critical',
        description: 'The description snippet that appears in search engine results',
        whyRequired: 'Meta description tags are vital for SEO as they provide a brief, compelling summary of a web page\'s content, influencing search engine users\' decision to click on the link, thereby improving click-through rates and overall website visibility in search results.'
      },
      {
        name: 'Meta Charset',
        key: 'charset',
        content: result?.charset?.content || null,
        length: result?.charset?.content?.length || 0,
        element: `<meta charset="${result?.charset?.content || 'Not Available'}">`,
        minLength: 1,
        maxLength: 10,
        priority: 'important',
        description: 'Specifies the character encoding for the HTML document',
        whyRequired: 'The meta charset tag is essential for SEO as it specifies the character encoding, ensuring accurate text and special character display, critical for optimal user experience and search engine indexing.'
      },
      {
        name: 'Meta Robots',
        key: 'robots',
        content: result?.robots?.content || null,
        length: result?.robots?.content?.length || 0,
        element: `<meta name="robots" content="${result?.robots?.content || 'Not Available'}">`,
        minLength: 1,
        maxLength: 100,
        priority: 'important',
        description: 'Controls how search engines crawl and index the page',
        whyRequired: 'The meta robots tag plays a crucial role in SEO by dictating how search engines crawl and index a web page, directly influencing its visibility and rankings in search results. It\'s imperative to set the directives to "all" or "index, follow" to ensure optimal indexing and crawling for maximum visibility.'
      },
      {
        name: 'Meta Viewport',
        key: 'viewport',
        content: result?.viewport?.content || null,
        length: result?.viewport?.content?.length || 0,
        element: `<meta name="viewport" content="${result?.viewport?.content || 'Not Available'}">`,
        minLength: 1,
        maxLength: 100,
        priority: 'important',
        description: 'Controls the page\'s dimensions and scaling on mobile devices',
        whyRequired: 'The meta viewport tag is crucial for SEO as it ensures proper rendering and usability of web pages across various devices, enhancing user experience and potentially improving search engine rankings.'
      }
    ];

    // Analyze each tag
    const analyzedTags = tagConfigurations.map(tag => {
      const isPresent = tag.content && tag.content !== 'Not Available';
      const isLengthValid = isPresent && tag.length >= tag.minLength && tag.length <= tag.maxLength;
      
      let status, statusMessage;
      
      if (!isPresent) {
        status = 'Failed';
        statusMessage = `The '${tag.name}' tag is missing. This tag is required for optimal SEO and visibility.`;
      } else if (!isLengthValid && (tag.name === 'Meta Title' || tag.name === 'Meta Description')) {
        status = 'Warning';
        statusMessage = `The '${tag.name}' tag is present, but its length is not within the recommended range. Please adjust it to improve SEO.`;
      } else {
        status = 'Success';
        statusMessage = `The '${tag.name}' tag is present and properly configured. This is optimal for SEO.`;
      }

      return {
        ...tag,
        isPresent,
        isLengthValid,
        status,
        statusMessage
      };
    });

    // Calculate overall statistics
    const totalTags = analyzedTags.length;
    const presentTags = analyzedTags.filter(tag => tag.isPresent).length;
    const successTags = analyzedTags.filter(tag => tag.status === 'Success').length;
    const warningTags = analyzedTags.filter(tag => tag.status === 'Warning').length;
    const failedTags = analyzedTags.filter(tag => tag.status === 'Failed').length;
    const criticalIssues = analyzedTags.filter(tag => tag.priority === 'critical' && tag.status === 'Failed').length;

    let overallStatus;
    if (criticalIssues > 0) {
      overallStatus = 'Critical Issues';
    } else if (failedTags > 0) {
      overallStatus = 'Needs Attention';
    } else if (warningTags > 0) {
      overallStatus = 'Good with Warnings';
    } else {
      overallStatus = 'Excellent';
    }

    return {
      analyzedTags,
      stats: {
        totalTags,
        presentTags,
        successTags,
        warningTags,
        failedTags,
        criticalIssues
      },
      overallStatus
    };
  }, [result]);

  if (!metaTagsAnalysis) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg text-gray-700">No meta tag data available to analyze.</p>
          <p className="text-sm text-gray-500 mt-2">Please provide valid meta tag data to generate a report.</p>
        </div>
      </div>
    );
  }

  const { analyzedTags, stats, overallStatus } = metaTagsAnalysis;

  // Status badge component
  const StatusBadge = ({ status, size = "normal" }) => {
    const sizeClasses = size === "large" ? "px-4 py-2 text-base" : "px-3 py-1 text-sm";
    const baseClasses = `inline-flex items-center rounded-full font-medium ${sizeClasses}`;
    
    const statusConfig = {
      'Success': { classes: 'bg-green-100 text-green-800', icon: '✓' },
      'Warning': { classes: 'bg-yellow-100 text-yellow-800', icon: '⚠' },
      'Failed': { classes: 'bg-red-100 text-red-800', icon: '✕' },
      'Excellent': { classes: 'bg-green-100 text-green-800', icon: '🎉' },
      'Good with Warnings': { classes: 'bg-yellow-100 text-yellow-800', icon: '⚠' },
      'Needs Attention': { classes: 'bg-orange-100 text-orange-800', icon: '⚡' },
      'Critical Issues': { classes: 'bg-red-100 text-red-800', icon: '🚨' }
    };

    const config = statusConfig[status] || statusConfig['Failed'];
    
    return (
      <span className={`${baseClasses} ${config.classes}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  // Priority badge component
  const PriorityBadge = ({ priority }) => {
    const config = {
      'critical': { classes: 'bg-red-100 text-red-800', text: 'Critical' },
      'important': { classes: 'bg-blue-100 text-blue-800', text: 'Important' },
      'optional': { classes: 'bg-gray-100 text-gray-800', text: 'Optional' }
    };

    const { classes, text } = config[priority] || config['optional'];
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${classes}`}>
        {text}
      </span>
    );
  };

  // Summary dashboard component
  const SummaryDashboard = () => (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Meta Tags Analysis Summary</h3>
        <StatusBadge status={overallStatus} size="large" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{stats.presentTags}/{stats.totalTags}</div>
          <div className="text-sm text-gray-500">Tags Present</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">{stats.successTags}</div>
          <div className="text-sm text-gray-500">Optimized</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{stats.warningTags}</div>
          <div className="text-sm text-gray-500">Warnings</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-red-600">{stats.failedTags}</div>
          <div className="text-sm text-gray-500">Missing</div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 text-center">
        {overallStatus === 'Excellent' && "All meta tags are properly configured for optimal SEO performance."}
        {overallStatus === 'Good with Warnings' && "Most tags are configured well, with some minor optimization opportunities."}
        {overallStatus === 'Needs Attention' && "Several important meta tags need attention for better SEO performance."}
        {overallStatus === 'Critical Issues' && "Critical meta tags are missing. Immediate action required for SEO."}
      </div>
    </div>
  );

  // Individual tag report component
  const TagReport = ({ tag }) => (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">{tag.name}</h3>
        <div className="flex items-center space-x-2">
          <PriorityBadge priority={tag.priority} />
          <StatusBadge status={tag.status} />
        </div>
      </div>

      <div className="mb-4 p-3 bg-white rounded border">
        <p className="text-sm text-gray-600 mb-2">{tag.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tag Details */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Tag Details</h4>
          <div className="bg-white rounded border overflow-hidden">
            <table className="min-w-full">
              <tbody>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">Content</td>
                  <td className="py-3 px-4 text-gray-800 border-b break-words">
                    {tag.content || <span className="text-gray-400 italic">Not Available</span>}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">Length</td>
                  <td className="py-3 px-4 text-gray-800 border-b">
                    <span className={
                      tag.isLengthValid || !tag.isPresent 
                        ? "text-green-600 font-medium" 
                        : "text-yellow-600 font-medium"
                    }>
                      {tag.length} characters
                    </span>
                    {(tag.name === 'Meta Title' || tag.name === 'Meta Description') && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Recommended: {tag.minLength}-{tag.maxLength})
                      </span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Element</td>
                  <td className="py-3 px-4">
                    <code className="bg-gray-100 text-purple-700 text-sm p-2 rounded block font-mono break-all">
                      {tag.element}
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Analysis Results */}
        <div>
          <h4 className="font-semibold text-gray-700 mb-3">Analysis Results</h4>
          <div className="bg-white rounded border overflow-hidden">
            <table className="min-w-full">
              <tbody>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">Status</td>
                  <td className="py-3 px-4 border-b">
                    <StatusBadge status={tag.status} />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">Length Range</td>
                  <td className="py-3 px-4 text-gray-800 border-b">
                    {tag.minLength} - {tag.maxLength} characters
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 bg-gray-50 font-medium text-gray-700">Report</td>
                  <td className="py-3 px-4 text-gray-800">
                    {tag.statusMessage}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Why it matters section */}
      <div className="mt-6 pt-4 border-t border-gray-300">
        <h4 className="font-semibold text-gray-800 mb-2">Why is '{tag.name}' important?</h4>
        <p className="text-gray-700 leading-relaxed text-sm">{tag.whyRequired}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Meta Tags Analysis Report</h1>
            <p className="text-gray-600">Comprehensive analysis of your page's meta tags for SEO optimization</p>
          </div>

          {/* Summary Dashboard */}
          <SummaryDashboard />

          {/* Critical Issues Alert */}
          {stats.criticalIssues > 0 && (
            <div className="mb-8 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center mb-2">
                <span className="text-red-600 mr-2">🚨</span>
                <h3 className="font-semibold text-red-800">Critical Issues Detected</h3>
              </div>
              <p className="text-red-700 text-sm">
                {stats.criticalIssues} critical meta tag{stats.criticalIssues > 1 ? 's are' : ' is'} missing. 
                These are essential for SEO and should be added immediately.
              </p>
            </div>
          )}

          {/* Individual Tag Reports */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Detailed Tag Analysis</h2>
            {analyzedTags.map((tag, index) => (
              <TagReport key={index} tag={tag} />
            ))}
          </div>

          {/* Best Practices */}
          <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-blue-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Meta Tags Best Practices</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Title Tag Tips:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Keep between 30-70 characters</li>
                  <li>• Include primary keyword near the beginning</li>
                  <li>• Make it compelling and unique</li>
                  <li>• Avoid keyword stuffing</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Description Tag Tips:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Keep between 150-200 characters</li>
                  <li>• Write compelling, actionable copy</li>
                  <li>• Include target keywords naturally</li>
                  <li>• Make each page's description unique</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaTags;