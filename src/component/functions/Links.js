import React, { useMemo } from 'react';

const Links = ({ result }) => {
  // Memoize the links analysis
  const linksAnalysis = useMemo(() => {
    if (!result || !Array.isArray(result)) {
      return null;
    }

    const linkData = result;
    
    // Categorize links
    const internalLinks = linkData.filter(link => link.linkType === 'Internal');
    const externalLinks = linkData.filter(link => link.linkType === 'External');
    const hiddenLinks = linkData.filter(link => link.isHidden);

    // Enhanced analysis for each category
    const analyzeLinks = (links, type) => {
      const count = links.length;
      let status, message, recommendation, severity;

      switch (type) {
        case 'internal':
          if (count === 0) {
            status = 'Critical';
            message = 'No internal links found';
            recommendation = 'Add internal links to improve site navigation and distribute link equity';
            severity = 'high';
          } else if (count > 15) {
            status = 'Warning';
            message = `High number of internal links (${count})`;
            recommendation = 'Consider reducing to focus on most important pages';
            severity = 'medium';
          } else if (count < 3) {
            status = 'Warning';
            message = `Low number of internal links (${count})`;
            recommendation = 'Add more internal links to improve site structure';
            severity = 'medium';
          } else {
            status = 'Success';
            message = `Optimal internal linking structure (${count} links)`;
            recommendation = 'Continue maintaining good internal linking practices';
            severity = 'low';
          }
          break;

        case 'external':
          if (count === 0) {
            status = 'Warning';
            message = 'No external links found';
            recommendation = 'Consider adding relevant external links to authoritative sources';
            severity = 'medium';
          } else if (count > 10) {
            status = 'Warning';
            message = `High number of external links (${count})`;
            recommendation = 'Review if all external links are necessary and relevant';
            severity = 'medium';
          } else {
            status = 'Success';
            message = `Good balance of external links (${count} links)`;
            recommendation = 'Maintain quality external linking to authoritative sources';
            severity = 'low';
          }
          break;

        case 'hidden':
          if (count > 0) {
            status = 'Critical';
            message = `${count} hidden link${count > 1 ? 's' : ''} detected`;
            recommendation = 'Remove hidden links immediately - they violate search engine guidelines';
            severity = 'high';
          } else {
            status = 'Success';
            message = 'No hidden links found';
            recommendation = 'Continue avoiding hidden links for transparent SEO';
            severity = 'low';
          }
          break;

        default:
          status = 'Unknown';
          message = 'Unable to analyze';
          recommendation = 'Please check the data';
          severity = 'medium';
      }

      return {
        count,
        status,
        message,
        recommendation,
        severity,
        links
      };
    };

    const internalAnalysis = analyzeLinks(internalLinks, 'internal');
    const externalAnalysis = analyzeLinks(externalLinks, 'external');
    const hiddenAnalysis = analyzeLinks(hiddenLinks, 'hidden');

    // Calculate overall status
    const totalLinks = linkData.length;
    const criticalIssues = [internalAnalysis, externalAnalysis, hiddenAnalysis]
      .filter(analysis => analysis.status === 'Critical').length;
    const warnings = [internalAnalysis, externalAnalysis, hiddenAnalysis]
      .filter(analysis => analysis.status === 'Warning').length;

    let overallStatus;
    if (criticalIssues > 0) {
      overallStatus = 'Critical Issues';
    } else if (warnings > 1) {
      overallStatus = 'Needs Attention';
    } else if (warnings === 1) {
      overallStatus = 'Good with Warnings';
    } else {
      overallStatus = 'Excellent';
    }

    // Additional insights
    const linkDensity = totalLinks > 0 ? ((internalLinks.length / totalLinks) * 100).toFixed(1) : 0;
    const externalRatio = totalLinks > 0 ? ((externalLinks.length / totalLinks) * 100).toFixed(1) : 0;

    return {
      totalLinks,
      internalAnalysis,
      externalAnalysis,
      hiddenAnalysis,
      overallStatus,
      criticalIssues,
      warnings,
      insights: {
        linkDensity,
        externalRatio
      }
    };
  }, [result]);

  if (!linksAnalysis) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-lg text-gray-700">No link data available to analyze.</p>
          <p className="text-sm text-gray-500 mt-2">Please provide valid link data to generate a report.</p>
        </div>
      </div>
    );
  }

  const {
    totalLinks,
    internalAnalysis,
    externalAnalysis,
    hiddenAnalysis,
    overallStatus,
    criticalIssues,
    warnings,
    insights
  } = linksAnalysis;

  // Status badge component
  const StatusBadge = ({ status, size = "normal" }) => {
    const sizeClasses = size === "large" ? "px-4 py-2 text-base" : "px-3 py-1 text-sm";
    const baseClasses = `inline-flex items-center rounded-full font-medium ${sizeClasses}`;
    
    const statusConfig = {
      'Success': { classes: 'bg-green-100 text-green-800', icon: '✓' },
      'Warning': { classes: 'bg-yellow-100 text-yellow-800', icon: '⚠' },
      'Critical': { classes: 'bg-red-100 text-red-800', icon: '🚨' },
      'Excellent': { classes: 'bg-green-100 text-green-800', icon: '🎉' },
      'Good with Warnings': { classes: 'bg-yellow-100 text-yellow-800', icon: '⚠' },
      'Needs Attention': { classes: 'bg-orange-100 text-orange-800', icon: '⚡' },
      'Critical Issues': { classes: 'bg-red-100 text-red-800', icon: '🚨' }
    };

    const config = statusConfig[status] || statusConfig['Warning'];
    
    return (
      <span className={`${baseClasses} ${config.classes}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  // Summary dashboard component
  const SummaryDashboard = () => (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Links Analysis Summary</h3>
        <StatusBadge status={overallStatus} size="large" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{totalLinks}</div>
          <div className="text-sm text-gray-500">Total Links</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">{internalAnalysis.count}</div>
          <div className="text-sm text-gray-500">Internal</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{externalAnalysis.count}</div>
          <div className="text-sm text-gray-500">External</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-red-600">{hiddenAnalysis.count}</div>
          <div className="text-sm text-gray-500">Hidden</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600">Internal Link Ratio</div>
          <div className="text-lg font-semibold text-blue-600">{insights.linkDensity}%</div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600">External Link Ratio</div>
          <div className="text-lg font-semibold text-purple-600">{insights.externalRatio}%</div>
        </div>
      </div>
    </div>
  );

  // Link category component
  const LinkCategory = ({ 
    title, 
    analysis, 
    description, 
    whyImportant,
    showElement = false,
    icon 
  }) => (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        <StatusBadge status={analysis.status} />
      </div>

      <div className="mb-4 p-3 bg-white rounded border">
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Found: {analysis.count} links</span>
          <span className="text-gray-500">{analysis.message}</span>
        </div>
      </div>

      {/* Links Table */}
      <div className="mb-6 bg-white rounded border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 font-semibold text-gray-700 border-b text-left w-16">No.</th>
                <th className="py-3 px-4 font-semibold text-gray-700 border-b text-left">Link</th>
                {showElement && (
                  <th className="py-3 px-4 font-semibold text-gray-700 border-b text-left">Element</th>
                )}
              </tr>
            </thead>
            <tbody>
              {analysis.links.length === 0 ? (
                <tr>
                  <td colSpan={showElement ? 3 : 2} className="py-4 px-4 text-center text-gray-500">
                    No {title.toLowerCase()} found
                  </td>
                </tr>
              ) : (
                analysis.links.map((link, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600 border-b">{index + 1}</td>
                    <td className="py-3 px-4 border-b">
                      <a 
                        href={link.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all"
                        title={link.link}
                      >
                        {link.link.length > 80 ? `${link.link.substring(0, 80)}...` : link.link}
                      </a>
                    </td>
                    {showElement && (
                      <td className="py-3 px-4 border-b text-sm font-mono bg-gray-50 text-purple-700 max-w-xs">
                        <div className="truncate" title={link.element}>
                          {link.element}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded border overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-700">Analysis Results</h4>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Status:</span>
              <StatusBadge status={analysis.status} />
            </div>
            <div className="text-sm text-gray-700">
              <strong>Report:</strong> {analysis.message}
            </div>
          </div>
        </div>

        <div className="bg-white rounded border overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h4 className="font-semibold text-gray-700">Recommendation</h4>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-700">{analysis.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Why it matters */}
      <div className="pt-4 border-t border-gray-300">
        <h4 className="font-semibold text-gray-800 mb-2">Why {title} Matter</h4>
        <p className="text-gray-700 leading-relaxed text-sm">{whyImportant}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Links Analysis Report</h1>
            <p className="text-gray-600">Comprehensive analysis of your page's linking structure for SEO optimization</p>
          </div>

          {/* Summary Dashboard */}
          <SummaryDashboard />

          {/* Critical Issues Alert */}
          {criticalIssues > 0 && (
            <div className="mb-8 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center mb-2">
                <span className="text-red-600 mr-2">🚨</span>
                <h3 className="font-semibold text-red-800">Critical Issues Detected</h3>
              </div>
              <p className="text-red-700 text-sm">
                {criticalIssues} critical link-related issue{criticalIssues > 1 ? 's' : ''} detected. 
                These need immediate attention for optimal SEO performance.
              </p>
            </div>
          )}

          {/* Link Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Detailed Link Analysis</h2>
            
            <LinkCategory
              title="Internal Links"
              analysis={internalAnalysis}
              description="Links that point to other pages within your website"
              whyImportant="Internal links are vital for SEO as they establish a logical hierarchy within a website, distributing link equity and guiding search engine crawlers to discover and index pages effectively, ultimately enhancing overall website visibility and authority in search engine results."
              icon="🔗"
            />

            <LinkCategory
              title="External Links"
              analysis={externalAnalysis}
              description="Links that point to pages on other websites"
              whyImportant="External links are essential for SEO as they validate a website's credibility and authority by associating it with reputable sources, improving search engine rankings and trustworthiness while enhancing the site's overall visibility and domain authority in search engine results."
              icon="🌐"
            />

            <LinkCategory
              title="Hidden Links"
              analysis={hiddenAnalysis}
              description="Links that are not visible to users but may be present in the code"
              whyImportant="Avoid using hidden links in webpage SEO as they violate search engine guidelines, leading to penalties or de-indexing. Transparency and relevance are key; visible, contextually relevant links contribute positively to user experience and search engine rankings."
              showElement={true}
              icon="👁️"
            />
          </div>

          {/* Best Practices & Recommendations */}
          <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-blue-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Link Building Best Practices</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Internal Linking:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Use descriptive anchor text</li>
                  <li>• Link to relevant, high-quality pages</li>
                  <li>• Maintain a reasonable link density</li>
                  <li>• Create a logical site hierarchy</li>
                  <li>• Use breadcrumb navigation</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-800 mb-2">External Linking:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Link to authoritative, trustworthy sources</li>
                  <li>• Use rel="nofollow" when appropriate</li>
                  <li>• Ensure external links open in new tabs</li>
                  <li>• Regularly check for broken external links</li>
                  <li>• Balance quantity with quality</li>
                </ul>
              </div>
            </div>

            <div className="mt-4 p-4 bg-white rounded border">
              <h4 className="font-medium text-gray-800 mb-2">Optimal Link Distribution:</h4>
              <div className="text-sm text-gray-700">
                <p><strong>Internal Links:</strong> 3-8 per page for most content pages</p>
                <p><strong>External Links:</strong> 1-3 per page to high-authority sources</p>
                <p><strong>Hidden Links:</strong> 0 (always avoid)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Links;