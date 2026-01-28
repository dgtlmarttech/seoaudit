import React from 'react';

const Security = ({ result: data }) => {
  try {
    if (!data || !Array.isArray(data)) {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-blue-500 text-6xl mb-4">🔒</div>
            <p className="text-lg text-gray-700">No security data available to display.</p>
          </div>
        </div>
      );
    }

    // Function to check if "rel" attribute contains "noopener" or "noreferrer"
    const checkRelAttributes = (linkElement) => {
      const rel = linkElement.rel ? linkElement.rel.toLowerCase() : '';
      const hasNoopener = rel.includes('noopener');
      const hasNoreferrer = rel.includes('noreferrer');

      return {
        status: (hasNoopener || hasNoreferrer) ? 'secure' : 'vulnerable',
        attributes: {
          noopener: hasNoopener,
          noreferrer: hasNoreferrer
        },
        icon: (hasNoopener || hasNoreferrer) ? '🔒' : '⚠️'
      };
    };

    // List of social media domains to ignore
    const socialMediaDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com', 'tiktok.com', 'pinterest.com'];

    // Function to check if the link is from a social media domain
    const isSocialMediaLink = (href) => {
      try {
        const url = new URL(href);
        return socialMediaDomains.some((domain) => url.hostname.includes(domain));
      } catch (e) {
        return false;
      }
    };

    // Function to check if the link is from the same root domain
    const isSameRootDomain = (href) => {
      try {
        const getRootDomain = (hostname) => {
          const parts = hostname.split('.');
          if (parts[0] === 'www') {
            parts.shift();
          }
          if (parts.length > 2 && (parts[parts.length - 2] === 'co' || parts[parts.length - 2] === 'com')) {
            return parts.slice(-3).join('.');
          }
          return parts.slice(-2).join('.');
        };

        if (typeof window === 'undefined' || !window.location || !window.location.hostname) {
          return false;
        }

        const currentDomain = getRootDomain(window.location.hostname);
        const linkDomain = getRootDomain(new URL(href).hostname);

        return currentDomain === linkDomain;
      } catch (e) {
        return false;
      }
    };

    // Function to get domain from URL
    const getDomain = (href) => {
      try {
        return new URL(href).hostname;
      } catch (e) {
        return 'Invalid URL';
      }
    };

    // Function to determine risk level
    const getRiskLevel = (href) => {
      try {
        const url = new URL(href);
        const domain = url.hostname.toLowerCase();

        // High trust domains
        const trustedDomains = ['google.com', 'microsoft.com', 'apple.com', 'github.com', 'stackoverflow.com'];
        if (trustedDomains.some(trusted => domain.includes(trusted))) {
          return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
        }

        // Medium risk indicators
        if (domain.includes('bit.ly') || domain.includes('tinyurl') || url.pathname.includes('redirect')) {
          return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
        }

        return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      } catch (e) {
        return { level: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50' };
      }
    };

    // Process and filter links
    const processedLinks = data.map((row, index) => {
      // Use regex to extract href and text from the HTML string 'row'
      const hrefMatch = /href=["']([^"']*)["']/i.exec(row);
      const relMatch = /rel=["']([^"']*)["']/i.exec(row);

      if (!hrefMatch) {
        return null;
      }

      const href = hrefMatch[1];
      const rel = relMatch ? relMatch[1] : '';
      const isSocial = isSocialMediaLink(href);
      const isSameDomain = isSameRootDomain(href);

      // Inline check for rel attributes
      const hasNoopener = rel.toLowerCase().includes('noopener');
      const hasNoreferrer = rel.toLowerCase().includes('noreferrer');
      const security = {
        status: (hasNoopener || hasNoreferrer) ? 'secure' : 'vulnerable',
        attributes: {
          noopener: hasNoopener,
          noreferrer: hasNoreferrer
        },
        icon: (hasNoopener || hasNoreferrer) ? '🔒' : '⚠️'
      };
      const risk = getRiskLevel(href);
      const domain = getDomain(href);

      return {
        index: index + 1,
        href,
        domain,
        element: row,
        security,
        risk,
        isSocial,
        isSameDomain,
        linkElement
      };
    }).filter(link => link && !link.isSocial && !link.isSameDomain);

    // Calculate security metrics
    const totalLinks = processedLinks.length;
    const secureLinks = processedLinks.filter(link => link.security.status === 'secure').length;
    const vulnerableLinks = processedLinks.filter(link => link.security.status === 'vulnerable').length;
    const securityScore = totalLinks > 0 ? Math.round((secureLinks / totalLinks) * 100) : 100;

    const overallStatus = vulnerableLinks === 0 ? 'Success' : 'Failure';

    const getSecurityLevel = (score) => {
      if (score === 100) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-50' };
      if (score >= 80) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-50' };
      if (score >= 60) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50' };
      return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-50' };
    };

    const securityLevel = getSecurityLevel(securityScore);

    // Common Tailwind classes
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r break-words";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";

    const outputStatusClasses = (isSuccess) =>
      `inline-block px-3 py-1 rounded-full text-sm font-medium ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`;

    const SecurityBadge = ({ security }) => {
      const isSecure = security.status === 'secure';
      return (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{security.icon}</span>
          <div className="flex flex-col">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isSecure ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {isSecure ? 'Secure' : 'Vulnerable'}
            </span>
            {isSecure && (
              <div className="text-xs text-gray-500 mt-1">
                {security.attributes.noopener && 'noopener '}
                {security.attributes.noreferrer && 'noreferrer'}
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔒</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Security Analysis Report</h2>
              <p className="text-gray-600">External link security and vulnerability assessment</p>
            </div>

            {/* Security Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className={`${securityLevel.bg} border border-opacity-30 rounded-lg p-4 text-center`}>
                <div className={`text-2xl font-bold ${securityLevel.color}`}>{securityScore}%</div>
                <div className={`text-sm ${securityLevel.color}`}>Security Score</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{secureLinks}</div>
                <div className="text-sm text-green-700">Secure Links</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{vulnerableLinks}</div>
                <div className="text-sm text-red-700">Vulnerable Links</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{totalLinks}</div>
                <div className="text-sm text-blue-700">Total External</div>
              </div>
            </div>

            {/* Security Level Indicator */}
            <div className="mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Security Level</h3>
                  <p className="text-gray-600">Based on external link security practices</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold ${securityLevel.color} ${securityLevel.bg}`}>
                  {securityLevel.level}
                </div>
              </div>
            </div>

            <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className={sectionHeadingClasses}>External Links Security Analysis</h3>

              <div className="overflow-x-auto">
                <table className={`${tableClasses} table-fixed`}>
                  <thead>
                    <tr>
                      <th className={`${thClasses} w-16`}>S.No</th>
                      <th className={`${thClasses} w-80`}>Link & Domain</th>
                      <th className={`${thClasses} w-32`}>Security Status</th>
                      <th className={`${thClasses} w-24`}>Risk Level</th>
                      <th className={`${thClasses} flex-1`}>HTML Element</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedLinks.length > 0 ? (
                      processedLinks.map((link, index) => (
                        <tr key={index} className={link.security.status === 'secure' ? 'bg-green-50' : 'bg-red-50'}>
                          <td className={tdClasses}>{index + 1}</td>
                          <td className={tdClasses}>
                            <div className="space-y-1">
                              <a
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all text-sm"
                              >
                                {link.href.length > 60 ? `${link.href.substring(0, 60)}...` : link.href}
                              </a>
                              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {link.domain}
                              </div>
                            </div>
                          </td>
                          <td className={tdClasses}>
                            <SecurityBadge security={link.security} />
                          </td>
                          <td className={tdClasses}>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${link.risk.color} ${link.risk.bg}`}>
                              {link.risk.level}
                            </span>
                          </td>
                          <td className={`${tdClasses} font-mono text-xs`}>
                            <div className="max-w-xs overflow-hidden">
                              <pre className="whitespace-pre-wrap break-all text-xs">
                                {link.element.replace(/<i.*?>.*?<\/i>/g, '').substring(0, 100)}
                                {link.element.length > 100 ? '...' : ''}
                              </pre>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className={`${tdClasses} text-center text-gray-500 py-8`}>
                          <div className="flex flex-col items-center">
                            <div className="text-4xl mb-2">🔐</div>
                            <div>No external links found requiring security attributes</div>
                            <div className="text-sm mt-1">All links are either internal or from trusted social media platforms</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Security Summary</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Overall Status</h4>
                      <div className="flex items-center space-x-2">
                        <span className={outputStatusClasses(overallStatus === 'Success')}>
                          {overallStatus}
                        </span>
                        <span className="text-lg">
                          {overallStatus === 'Success' ? '🛡️' : '⚠️'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Security Score</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${securityScore >= 80 ? 'bg-green-500' :
                                securityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${securityScore}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold">{securityScore}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Analysis Results</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {overallStatus === 'Success'
                        ? `Excellent security implementation! All ${totalLinks} external link${totalLinks !== 1 ? 's' : ''} include proper security attributes (rel="noopener" or rel="noreferrer"). This prevents potential security vulnerabilities including window object manipulation and referrer information leakage, ensuring optimal user protection and SEO performance.`
                        : `Security vulnerabilities detected! ${vulnerableLinks} out of ${totalLinks} external link${totalLinks !== 1 ? 's' : ''} lack proper security attributes. Adding rel="noopener" or rel="noreferrer" to these links is crucial for preventing security vulnerabilities and maintaining SEO integrity.`
                      }
                    </p>
                  </div>

                  {vulnerableLinks > 0 && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                      <h5 className="font-semibold text-red-800 mb-2">Security Recommendations:</h5>
                      <ul className="text-red-700 text-sm space-y-1">
                        <li>• Add rel="noopener noreferrer" to all external links with target="_blank"</li>
                        <li>• Prevents window.opener access from external sites</li>
                        <li>• Stops referrer information leakage to external domains</li>
                        <li>• Protects against potential phishing and reverse tabnabbing attacks</li>
                        <li>• Improves overall website security posture</li>
                      </ul>
                    </div>
                  )}

                  {overallStatus === 'Success' && totalLinks > 0 && (
                    <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                      <h5 className="font-semibold text-green-800 mb-2">Security Best Practices Followed:</h5>
                      <ul className="text-green-700 text-sm space-y-1">
                        <li>• ✅ All external links properly secured</li>
                        <li>• ✅ Window object access prevention implemented</li>
                        <li>• ✅ Referrer information protection in place</li>
                        <li>• ✅ Protection against reverse tabnabbing</li>
                        <li>• ✅ Optimal security for user experience</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Section */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6">
                <p className={questionClasses}>
                  <strong>Why are rel="noopener" and rel="noreferrer" Critical for Security?</strong>
                </p>
                <p className={answerClasses}>
                  These security attributes are essential for protecting your website and users from several vulnerabilities. Without them, external links with target="_blank" can access your page through the window.opener object, potentially redirecting users to malicious sites (reverse tabnabbing). The noreferrer attribute prevents sensitive referrer information from being leaked to external sites, protecting user privacy and preventing potential SEO manipulation. Implementing these attributes is a fundamental security practice that also positively impacts your site's trustworthiness and search engine rankings.
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
          <div className="text-red-500 text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Security Analysis Error</h2>
          <p className="text-red-600 mb-4">{error.message || 'An unexpected error occurred during security analysis.'}</p>
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

export default Security;