import React from 'react';

const Links = ({ result }) => { // Destructure result directly from props
  try {
    const linkData = result; // result is already the array we need

    const internalLinks = linkData.filter(link => link.linkType === 'Internal');
    const externalLinks = linkData.filter(link => link.linkType === 'External');
    const hiddenLinks = linkData.filter(link => link.isHidden);

    // Common Tailwind classes for table and its elements
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";
    const outputStatusClasses = (isSuccess) =>
      `inline-block px-3 py-1 rounded-full text-sm font-medium ${
        isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`;

    const generateReportForExternalLinks = () => {
      if (externalLinks.length === 0) {
        return "No external links found. External links are important for SEO as they enhance the authority of your website by linking to trusted sources.";
      } else {
        return externalLinks.length > 5
          ? "Too many external links detected. You may want to review if they are all relevant to your content."
          : "External links are balanced and contribute positively to your SEO strategy.";
      }
    };

    const generateReportForInternalLinks = () => {
      if (internalLinks.length === 0) {
        return "No internal links found. Internal links are critical for SEO to improve navigation and spread link equity across your site.";
      } else {
        return internalLinks.length > 10
          ? "Too many internal links could clutter the user experience. Consider prioritizing the most important pages."
          : "Internal links are properly used to improve user experience and site structure.";
      }
    };

    const generateReportForHiddenLinks = () => {
      if (hiddenLinks.length > 0) {
        return "Hidden links detected. These could harm your SEO performance and are generally against search engine guidelines.";
      } else {
        return "No hidden links found, which is great for transparency and SEO.";
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Links Report</h2>

          {/* External Links Section */}
          <div className="mb-10">
            <h3 className={sectionHeadingClasses}>External Links</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Link</th>
                </tr>
              </thead>
              <tbody>
                {externalLinks.length === 0 ? (
                  <tr>
                    <td colSpan="2" className={`${tdClasses} text-center text-gray-500`}>No external links found.</td>
                  </tr>
                ) : (
                  externalLinks.map((link, index) => (
                    <tr key={index}>
                      <td className={tdClasses}>{index + 1}</td>
                      <td className={tdClasses}>
                        <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {link.link}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">Output</h3>
            <table className={tableClasses}>
              <tbody>
                <tr>
                  <td className={thClasses}>Status</td>
                  <td className={tdClasses}>
                    <p className={outputStatusClasses(externalLinks.length > 0)}>
                      {externalLinks.length > 0 ? 'Success' : 'Failure'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>
                    {generateReportForExternalLinks()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why External Links?</strong>
              </p>
              <p className={answerClasses}>
                External links are essential for SEO as they validate a website's credibility and authority by associating it with reputable sources, improving search engine rankings and trustworthiness while enhancing the site's overall visibility and domain authority in search engine results.
              </p>
            </div>
          </div>

          {/* Hidden Links Section */}
          <div className="mb-10">
            <h3 className={sectionHeadingClasses}>Hidden Links</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Link</th>
                  <th className={thClasses}>Element</th>
                </tr>
              </thead>
              <tbody>
                {hiddenLinks.length > 0 ?
                  hiddenLinks.map((link, index) => (
                    <tr key={index}>
                      <td className={tdClasses}>{index + 1}</td>
                      <td className={tdClasses}>
                        <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {link.link}
                        </a>
                      </td>
                      <td className={`${tdClasses} whitespace-pre-wrap break-words text-sm`}>{link.element}</td>
                    </tr>
                  )) :
                  <tr>
                    <td className={tdClasses}>1</td>
                    <td className={`${tdClasses} text-gray-500`}>No Links Available</td>
                    <td className={`${tdClasses} text-gray-500`}>Not Present</td>
                  </tr>
                }
              </tbody>
            </table>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">Output</h3>
            <table className={tableClasses}>
              <tbody>
                <tr>
                  <td className={thClasses}>Status</td>
                  <td className={tdClasses}>
                    <p className={outputStatusClasses(hiddenLinks.length <= 0)}>
                      {hiddenLinks.length <= 0 ? 'Success' : 'Failure'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>
                    {generateReportForHiddenLinks()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why no Hidden Links?</strong>
              </p>
              <p className={answerClasses}>
                Avoid using the hidden links in webpage SEO as they violate search engine guidelines, leading to penalties or de-indexing. Transparency and relevance are key; visible, contextually relevant links contribute positively to user experience and search engine rankings.
              </p>
            </div>
          </div>

          {/* Internal Links Section */}
          <div className="mb-10">
            <h3 className={sectionHeadingClasses}>Internal Links</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Link</th>
                </tr>
              </thead>
              <tbody>
                {internalLinks.length === 0 ? (
                  <tr>
                    <td colSpan="2" className={`${tdClasses} text-center text-gray-500`}>No internal links found.</td>
                  </tr>
                ) : (
                  internalLinks.map((link, index) => (
                    <tr key={index}>
                      <td className={tdClasses}>{index + 1}</td>
                      <td className={tdClasses}>
                        <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {link.link}
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-6">Output</h3>
            <table className={tableClasses}>
              <tbody>
                <tr>
                  <td className={thClasses}>Status</td>
                  <td className={tdClasses}>
                    <p className={outputStatusClasses(internalLinks.length > 0)}>
                      {internalLinks.length > 0 ? 'Success' : 'Failure'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>
                    {generateReportForInternalLinks()}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why Internal Links?</strong>
              </p>
              <p className={answerClasses}>
                Internal links are vital for SEO as they establish a logical hierarchy within a website, distributing link equity and guiding search engine crawlers to discover and index pages effectively, ultimately enhancing overall website visibility and authority in search engine results.
              </p>
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

export default Links;
