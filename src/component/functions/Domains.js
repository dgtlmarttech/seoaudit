import React from 'react';

const Domains = ({ result }) => { // Destructure result directly from props
  try {
    if (!result || !result.result) {
      throw new Error("No result data provided.");
    }

    const data = result.result;

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Domain Report</h2>
          <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden mb-8">
            <tbody>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                  <strong>Domain</strong>
                </td>
                <td className="py-3 px-4 text-gray-800 border-b">
                  {data.domain || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                  <strong>Domain Length</strong>
                </td>
                <td className="py-3 px-4 text-gray-800 border-b">
                  {data.domainLength || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                  <strong>Special Characters</strong>
                </td>
                <td className="py-3 px-4 text-gray-800 border-b">
                  {data.specialCharacters || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                  <strong>Subdomains</strong>
                </td>
                <td className="py-3 px-4 text-gray-800 border-b">
                  {data.subdomains || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                  <strong>Status</strong>
                </td>
                <td className="py-3 px-4 text-gray-800 border-b">
                  <p
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      data.status === 'Success'
                        ? 'bg-green-100 text-green-800' // Tailwind for success
                        : 'bg-red-100 text-red-800' // Tailwind for failure
                    }`}
                  >
                    {data.status === 'Success' ? 'Success' : 'Failure'}
                  </p>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                  <strong>Message</strong>
                </td>
                <td className="py-3 px-4 text-gray-800 border-b">
                  {data.message || 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 bg-gray-50 font-semibold text-gray-700 border-b border-r">
                  <strong>SEO Report</strong>
                </td>
                <td className="py-3 px-4 text-gray-800 border-b">
                  {data.report || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-50 text-red-800 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Error in the Code</h2>
          <p className="text-lg">{error.message}</p>
        </div>
      </div>
    );
  }
};

export default Domains;
