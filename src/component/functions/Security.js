import React from 'react';

const Security = ({ result: data }) => { // Destructure result and rename to data
  try {
    if (!data || !Array.isArray(data)) {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <p className="text-lg text-gray-700">No data available to display for security report.</p>
          </div>
        </div>
      );
    }

    // Function to check if "rel" attribute contains "noopener" or "noreferrer"
    const checkRelAttributes = (linkElement) => {
      const rel = linkElement.rel ? linkElement.rel.toLowerCase() : '';
      return rel.includes('noopener') || rel.includes('noreferrer') ? '✔️' : '❌';
    };

    // List of social media domains to ignore
    const socialMediaDomains = ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'youtube.com'];

    // Function to check if the link is from a social media domain
    const isSocialMediaLink = (href) => {
      try {
        const url = new URL(href);
        return socialMediaDomains.some((domain) => url.hostname.includes(domain));
      } catch (e) {
        return false; // Invalid URL
      }
    };

    // Function to check if the link is from the same root domain (ignoring subdomains)
    const isSameRootDomain = (href) => {
      try {
        const getRootDomain = (hostname) => {
          // Remove 'www' or any common subdomains if present
          const parts = hostname.split('.');
          if (parts[0] === 'www') {
            parts.shift(); // Remove 'www' if it exists
          }
          // Handle cases like 'co.uk' or 'com.au'
          if (parts.length > 2 && (parts[parts.length - 2] === 'co' || parts[parts.length - 2] === 'com')) {
            return parts.slice(-3).join('.');
          }
          return parts.slice(-2).join('.'); // Get root domain (e.g., example.com)
        };

        // Check if window is defined (for browser environment)
        if (typeof window === 'undefined' || !window.location || !window.location.hostname) {
          // In a non-browser environment (like SSR), we cannot determine the current domain.
          // For the purpose of this component, we'll treat it as not the same root domain.
          return false;
        }

        const currentDomain = getRootDomain(window.location.hostname); // Current root domain
        const linkDomain = getRootDomain(new URL(href).hostname); // Link's root domain

        return currentDomain === linkDomain; // Compare root domains
      } catch (e) {
        return false; // Invalid URL
      }
    };

    let status = 'Success'; // Initial status

    // Filter out links that should be ignored and check rel attributes
    const filteredLinks = data.filter((row) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = row;
      const linkElement = tempDiv.querySelector('a');

      if (!linkElement || !linkElement.href) {
        return false; // Skip if no valid link element or href
      }

      // If it's a social media link or same root domain, filter it out
      if (isSocialMediaLink(linkElement.href) || isSameRootDomain(linkElement.href)) {
        return false;
      }
      return true; // Keep the link if it's not ignored
    });

    // Check filtered links for '❌' status to determine overall status
    if (filteredLinks.some(row => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = row;
      const linkElement = tempDiv.querySelector('a');
      return linkElement && checkRelAttributes(linkElement) === '❌';
    })) {
      status = 'Failure';
    }


    // Common Tailwind classes for table and its elements
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r break-words"; // Added break-words for link column
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";
    const outputStatusClasses = (isSuccess) =>
      `inline-block px-3 py-1 rounded-full text-sm font-medium ${
        isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`;

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Security Report</h2>
          <table className={`${tableClasses} table-fixed`}> {/* Added table-fixed for layout control */}
            <thead>
              <tr>
                <th className={`${thClasses} w-1/12`}>S.No</th>
                <th className={`${thClasses} w-5/12`}>Link</th>
                <th className={`${thClasses} w-3/12`}>REL="NOOPENER" OR "NOREFERRER"</th>
                <th className={`${thClasses} w-3/12`}>Element</th>
              </tr>
            </thead>
            <tbody>
              {filteredLinks.length > 0 ? (
                filteredLinks.map((row, index) => {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = row;
                  const linkElement = tempDiv.querySelector('a');

                  return (
                    <tr key={index}>
                      <td className={tdClasses}>{index + 1}</td>
                      <td className={tdClasses}>
                        {linkElement && linkElement.href ? (
                          <a href={linkElement.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                            {linkElement.href}
                          </a>
                        ) : 'No Link'}
                      </td>
                      <td className={`${tdClasses} text-center`}>
                        {linkElement ? checkRelAttributes(linkElement) : 'No Data'}
                      </td>
                      <td className={`${tdClasses} font-mono text-xs whitespace-pre-wrap`}>
                        {linkElement ? row.replace(/<i.*?>.*?<\/i>/g, '') : 'Invalid Element'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className={`${tdClasses} text-center text-gray-500`}>No relevant external links found requiring 'noopener' or 'noreferrer'.</td>
                </tr>
              )}
            </tbody>
          </table>
          <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">Output</h3>
          <table className={tableClasses}>
            <tbody>
              <tr>
                <td className={thClasses}><strong>Status</strong></td>
                <td className={tdClasses}>
                  <p className={outputStatusClasses(status === 'Success')}>
                    {status === 'Success' ? 'Success' : 'Failure'}
                  </p>
                </td>
              </tr>
              <tr>
                <td className={thClasses}><strong>Report</strong></td>
                <td className={tdClasses}>
                  {status === 'Success'
                    ? `Excellent! You have successfully added (rel='noopener' or rel='noreferrer') to anchor tags with 'target='_blank'', ensuring optimal user security and preventing potential vulnerabilities, while fortifying against unsafe cross-origin navigation for enhanced SEO performance.`
                    : `Warning! Ensure optimal user security and prevent potential vulnerabilities by adding (rel='noopener' or rel='noreferrer') to anchor tags with 'target='_blank'', fortifying against unsafe cross-origin navigation for enhanced SEO performance.`}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 pt-4 border-t border-gray-300">
            <p className={questionClasses}>
              <strong>Why is 'rel="noopener" or "noreferrer"' required?</strong>
            </p>
            <p className={answerClasses}>
              Adding `rel="noopener"` or `rel="noreferrer"` to anchor tags with `target="_blank"` is crucial for security and SEO. It prevents the opened page from gaining control over the originating page (a phishing vulnerability) and stops the transfer of referrer information, enhancing user privacy and preventing potential SEO issues related to link juice leakage.
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-50 text-red-800 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="text-lg">{error.message || 'An unexpected error occurred.'}</p>
        </div>
      </div>
    );
  }
};

export default Security;
