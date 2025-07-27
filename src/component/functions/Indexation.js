import React, { useState, useEffect } from 'react';

const Indexation = ({ result }) => {
  const [data, setData] = useState(null); // To store resolved data
  const [error, setError] = useState(null); // To store any errors during data resolution

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ensure result is not null or undefined before attempting to resolve
        if (result) {
          const resolvedData = await result; // Resolve the promise
          setData(resolvedData);
        } else {
          // Handle case where result prop itself is not provided
          setError(new Error("No result prop provided to Indexation component."));
        }
      } catch (err) {
        console.error('Error resolving data:', err);
        setError(err); // Store the error
      }
    };

    fetchData(); // Call fetchData when the component mounts or result prop changes
  }, [result]); // Depend on result to re-fetch if it changes

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 text-red-800 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="text-lg">{error.message || 'An unexpected error occurred.'}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <p className="text-lg text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Determine success status based on robotsContent
  const isRobotsSuccess = data.robotsContent !== 'No /robots.txt found';
  // Determine success status based on sitemapConfirmation
  const isSitemapSuccess = data.sitemapConfirmation !== 'No /sitemap.xml found';


  // Common Tailwind classes for table and its elements
  const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
  const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
  const tdClasses = "py-2 px-4 text-gray-800 border-b border-r";
  const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
  const subHeadingClasses = "text-xl font-semibold text-gray-700 mb-3 mt-6"; // For Robots.txt & Sitemap sub-headings
  const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
  const answerClasses = "text-gray-700 leading-relaxed";

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Indexation Report</h2>

        {/* Robots Section */}
        <div className="mb-10">
          <h3 className={sectionHeadingClasses}>Robots.txt</h3>
          <table className={tableClasses}>
            <tbody>
              <tr>
                <td className={thClasses}><strong>Present</strong></td>
                <td className={tdClasses}>
                  {data.robotsContent === 'No /robots.txt found' ? (
                    <span className="text-red-600 font-medium">NO</span>
                  ) : (
                    <span className="text-green-600 font-medium">YES</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className={thClasses}><strong>Content</strong></td>
                <td className={`${tdClasses} whitespace-pre-wrap break-words text-sm`}>
                  {data.robotsContent}
                </td>
              </tr>
              <tr>
                <td className={thClasses}>
                  <strong>Status</strong>
                </td>
                <td className={tdClasses}>
                  <p
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isRobotsSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isRobotsSuccess ? 'Success' : 'Failure'}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 pt-4 border-t border-gray-300">
            <p className={questionClasses}>
              <strong>Why is &#39;Robots.txt&#39; required?</strong>
            </p>
            <p className={answerClasses}>
              Robots.txt file guides search engine crawlers, directing them to prioritize indexing important pages and avoiding indexing irrelevant or sensitive content, thus enhancing website SEO performance and visibility.
            </p>
          </div>
        </div>

        {/* Sitemap Section */}
        <div className="mb-10">
          <h3 className={sectionHeadingClasses}>Sitemap_index.xml</h3>
          <table className={tableClasses}>
            <tbody>
              <tr>
                <td className={thClasses}><strong>Present</strong></td>
                <td className={tdClasses}>
                  {data.sitemapConfirmation === 'No /sitemap.xml found' ? (
                    <span className="text-red-600 font-medium">NO</span>
                  ) : (
                    <span className="text-green-600 font-medium">YES</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className={thClasses}>
                  <strong>Status</strong>
                </td>
                <td className={tdClasses}>
                  <p
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      isSitemapSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isSitemapSuccess ? 'Success' : 'Failure'}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="mt-8 pt-4 border-t border-gray-300">
            <p className={questionClasses}>
              <strong>Why is &#39;sitemap.xml&#39; required?</strong>
            </p>
            <p className={answerClasses}>
              A sitemap.xml file is crucial for website SEO as it provides search engines with a comprehensive roadmap of the site&apos;s structure and content, facilitating efficient crawling and indexing, and ultimately improving search engine visibility and rankings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indexation;
