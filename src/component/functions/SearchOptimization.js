import React from "react";

const SearchOptimization = ({ result }) => { // Destructure result directly from props
  try {
    // Ensure result and its properties are available
    if (!result || typeof result !== "object") {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <p className="text-lg text-gray-700">No data available to display.</p>
          </div>
        </div>
      );
    }

    const { canonicalLinks, alternateLinks, headSchema, bodySchema } = result;

    // Common Tailwind classes for table and its elements
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";
    const outputStatusClasses = (isSuccess, isWarning = false) => {
      let baseClasses = "inline-block px-3 py-1 rounded-full text-sm font-medium";
      if (isWarning) return `${baseClasses} bg-yellow-100 text-yellow-800`;
      if (isSuccess) return `${baseClasses} bg-green-100 text-green-800`;
      return `${baseClasses} bg-red-100 text-red-800`; // Failure
    };

    // Helper to extract href from link string
    const extractHref = (linkString) => {
      const match = linkString.match(/href="([^"]+)"/);
      return match ? match[1] : 'N/A';
    };

    const isCanonicalSuccess = canonicalLinks && canonicalLinks.length > 0;
    const isAlternateSuccess = alternateLinks && alternateLinks.length > 0;
    const isSchemaSuccess = headSchema && headSchema.length > 0;
    const isSchemaWarning = !isSchemaSuccess && bodySchema && bodySchema.length > 0;


    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Search Optimization Report</h2>

          {/* Canonical Link Tag Section */}
          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className={sectionHeadingClasses}>Canonical Link Tag</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Link</th>
                </tr>
              </thead>
              <tbody>
                {isCanonicalSuccess ? (
                  <tr>
                    <td className={tdClasses}>1</td>
                    <td className={tdClasses}>
                      <a href={extractHref(canonicalLinks[0])} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {extractHref(canonicalLinks[0])}
                      </a>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan="2" className={`${tdClasses} text-center text-gray-500`}>No canonical link found.</td>
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
                    <p className={outputStatusClasses(isCanonicalSuccess)}>
                      {isCanonicalSuccess ? 'Success' : 'Failure'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>
                    {isCanonicalSuccess
                      ? "The canonical link tag is present, which is crucial for SEO to prevent duplicate content issues."
                      : "No canonical link tag found. This is important for SEO to avoid duplicate content issues and consolidate ranking signals."
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why is &#39;Canonical Tag&#39; required?</strong>
              </p>
              <p className={answerClasses}>Utilizing a canonical tag is critical for SEO as it ensures that search engines properly identify the preferred version of a webpage, avoiding duplicate content issues and maintaining the page&#39;s ranking authority.</p>
            </div>
          </div>

          {/* Alternate Links Section */}
          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className={sectionHeadingClasses}>Alternate_Links</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Link</th>
                </tr>
              </thead>
              <tbody>
                {isAlternateSuccess ? (
                  alternateLinks.map((link, index) => (
                    <tr key={index}>
                      <td className={tdClasses}>{index + 1}</td>
                      <td className={tdClasses}>
                        <a href={extractHref(link)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {extractHref(link)}
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className={`${tdClasses} text-center text-gray-500`}>No alternate links found.</td>
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
                    <p className={outputStatusClasses(isAlternateSuccess)}>
                      {isAlternateSuccess ? 'Success' : 'Failure'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>
                    {isAlternateSuccess
                      ? "The inclusion of alternate links strengthens website structure and enhances user experience, optimizing SEO performance and accessibility across various platforms."
                      : "No alternate links found. These are important for international SEO to indicate different language or regional versions of a page."
                    }
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why is &#39;Alternate Links&#39; required?</strong>
              </p>
              <p className={answerClasses}>Implementing alternate link tags is crucial for SEO as they help search engines understand the relationship between different languages or regional versions of a webpage, improving international targeting and organic search visibility.</p>
            </div>
          </div>

          {/* Schema Markups-Structured Data Section */}
          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className={sectionHeadingClasses}>Schema Markups-Structured Data</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Part</th>
                  <th className={thClasses}>Present</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdClasses}>1</td>
                  <td className={tdClasses}>HEAD</td>
                  <td className={tdClasses}>
                    {headSchema && headSchema.length > 0 ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No schema found</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td className={tdClasses}>2</td>
                  <td className={tdClasses}>BODY</td>
                  <td className={tdClasses}>
                    {bodySchema && bodySchema.length > 0 ? (
                      <span className="text-green-600 font-medium">Yes</span>
                    ) : (
                      <span className="text-red-600 font-medium">No schema found</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">Output</h3>
            <table className={tableClasses}>
              <tbody>
                <tr>
                  <td className={thClasses}><strong>Status</strong></td>
                  <td className={tdClasses}>
                    <p
                      className={outputStatusClasses(isSchemaSuccess, isSchemaWarning)}
                    >
                      {isSchemaSuccess
                        ? "Success"
                        : isSchemaWarning
                          ? "Warning"
                          : "Failure"
                      }
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>
                    {isSchemaSuccess
                      ? "Schema markup is correctly placed in the head section, which is ideal for SEO."
                      : isSchemaWarning
                        ? "Schema markup is found in the body section. While this is recognized by search engines, placing schema in the head section is recommended for better SEO practices."
                        : "No schema markup found. Adding structured data to the head section can improve your webpage's SEO and visibility in search results."}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why is &#39;Schema Markups&#39; required?</strong>
              </p>
              <p className={answerClasses}>Using schema markup is essential for SEO as it provides search engines with structured data, enhancing the understanding of web page content and increasing the likelihood of appearing in rich snippets and other SERP features, ultimately improving visibility and click-through rates.</p>
            </div>
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

export default SearchOptimization;
