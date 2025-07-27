import React from 'react';

const SocialNetworks = ({ result }) => { // Destructure result directly from props
  try {
    const linkdata = result.result; // Access the result object

    // Add a check to ensure linkdata is an array before proceeding
    if (!linkdata || !Array.isArray(linkdata)) {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <p className="text-lg text-gray-700">No social media link data available to display.</p>
          </div>
        </div>
      );
    }

    // Common Tailwind classes for table and its elements
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

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Social Media Links Report</h2>

          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className={sectionHeadingClasses}>Social Media Links</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Link</th>
                  <th className={thClasses}>Platform</th>
                </tr>
              </thead>
              <tbody>
                {linkdata.length > 0 ? linkdata.map((linkItem, index) => (
                  <tr key={index}>
                    <td className={tdClasses}>{linkItem.sNo}</td>
                    <td className={tdClasses}>
                      <a href={linkItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {linkItem.link}
                      </a>
                    </td>
                    <td className={tdClasses}>{linkItem.platform}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className={`${tdClasses} text-center text-gray-500`}>No Data Found</td>
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
                    <p className={outputStatusClasses(linkdata.length > 0)}>
                      {linkdata.length > 0 ? 'Success' : 'Failure'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>
                    {linkdata.length > 0
                      ? 'Social media links present on this webpage, optimizing online visibility and fostering user engagement for enhanced SEO benefits.'
                      : 'Social media links absent from this webpage, limiting online visibility and reducing user engagement, which may negatively impact SEO benefits.'}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why are 'Social Media Links' required?</strong>
              </p>
              <p className={answerClasses}>
                Including social media links in a webpage is crucial for SEO as it fosters social engagement and shares, expanding the website's reach and potentially increasing traffic and visibility.
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

export default SocialNetworks;
