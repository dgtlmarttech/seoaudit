import React from 'react';

const HeadingTags = ({ result }) => { // Destructure result directly from props
  try {
    const { h1, h2, h3, h4, h5, h6 } = result.result;

    const renderTable = (heading, headingData) => {
      // Common Tailwind classes for table and its elements
      const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
      const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
      const tdClasses = "py-2 px-4 text-gray-800 border-b border-r";
      const headingClasses = "text-xl font-semibold text-gray-700 mb-3 mt-6 border-b pb-2";

      if (headingData === 'Not Found' || headingData.length === 0) {
        return (
          <div className="mb-8">
            <h3 className={headingClasses}>{heading} Tags</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Content</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdClasses}>1.</td>
                  <td className={tdClasses}>Not Found</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

      return (
        <div className="mb-8">
          <h3 className={headingClasses}>{heading} Tags</h3>
          <table className={tableClasses}>
            <thead>
              <tr>
                <th className={thClasses}>S.No</th>
                <th className={thClasses}>Content</th>
              </tr>
            </thead>
            <tbody>
              {headingData.map((row, index) => (
                <tr key={index}>
                  <td className={tdClasses}>{index + 1}</td>
                  <td className={tdClasses}>{row}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-3xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Heading Tags Report</h2>

          {/* Render each heading table */}
          {renderTable('H1', h1)}
          {renderTable('H2', h2)}
          {renderTable('H3', h3)}
          {renderTable('H4', h4)}
          {renderTable('H5', h5)}
          {renderTable('H6', h6)}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-50 text-red-800 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="text-lg">{error.message}</p>
        </div>
      </div>
    );
  }
};

export default HeadingTags;
