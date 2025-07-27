import React from 'react';

const Custom404 = ({ result }) => { // Destructure result directly from props
  const data = result; // result is already the object we need

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Custom 404 Page Report</h2>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Is Custom 404 page used</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden mb-8">
          <tbody>
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                <strong>Is Custom</strong>
              </td>
              <td className="py-3 px-4 text-gray-800 border-b">
                {data.custom404}
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Output</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden mb-8">
          <tbody>
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                <strong>Status</strong>
              </td>
              <td className="py-3 px-4 text-gray-800 border-b">
                <p
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    data.custom404 === 'YES'
                      ? 'bg-green-100 text-green-800' // Tailwind for success
                      : 'bg-red-100 text-red-800' // Tailwind for failure
                  }`}
                >
                  {data.custom404 === 'YES' ? 'Success' : 'Failure'}
                </p>
              </td>
            </tr>
            {/* Displaying additional conditions */}
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                <strong>404 in Source Code</strong>
              </td>
              <td className="py-3 px-4 text-gray-800 border-b">
                {data.additionalConditions.is404InSourceCode ? 'Yes' : 'No'}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                <strong>Is Page Blocked by Robots</strong>
              </td>
              <td className="py-3 px-4 text-gray-800 border-b">
                {data.additionalConditions.isRobotsBlocked ? 'Yes' : 'No'}
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                <strong>Is Page Listed in Sitemap</strong>
              </td>
              <td className="py-3 px-4 text-gray-800 border-b">
                {data.additionalConditions.isInSitemap ? 'Yes' : 'No'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 pt-4 border-t border-gray-300">
          <p className='text-lg font-semibold text-gray-800 mb-2'>
            <strong>Why is &#39;Custom 404 Page&#39; required?</strong>
          </p>
          <p className='text-gray-700 leading-relaxed'>
            A custom 404 page is essential for SEO as it enhances user experience by guiding visitors to relevant content
            when they encounter broken links or unavailable pages, minimizing bounce rates and preserving search engine
            crawlability and indexing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
