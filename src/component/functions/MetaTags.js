import React from 'react';

const MetaTags = ({ result }) => {
  try {
    const renderMetaTagReport = (tagName, content, length, element, min, max, description, whyRequired) => {
      const isTagMissing = content === 'Not Available';
      const isLengthValid = length >= min && length <= max;
      const isWarning = !isTagMissing && !isLengthValid;
      const isSuccess = !isTagMissing && isLengthValid;

      let status;
      let statusClass;
      let statusMessage;

      // Determine status and create appropriate message and class
      if (isTagMissing) {
        status = 'Failed';
        statusClass = 'bg-red-100 text-red-800'; // Tailwind for failure
        statusMessage = `The '${tagName}' tag is missing. This tag is required for optimal SEO and visibility.`;
      } else if (isWarning) {
        status = 'Warning';
        statusClass = 'bg-yellow-100 text-yellow-800'; // Tailwind for warning
        statusMessage = `The '${tagName}' tag is present, but its length is not within the recommended range. Please adjust it to improve SEO.`;
      } else if (isSuccess) {
        status = 'Success';
        statusClass = 'bg-green-100 text-green-800'; // Tailwind for success
        statusMessage = `The '${tagName}' tag is present and meets the recommended length. This is optimal for SEO.`;
      }

      // Common Tailwind classes for table and its elements
      const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
      const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
      const tdClasses = "py-2 px-4 text-gray-800 border-b border-r";
      const subHeadingClasses = "text-xl font-semibold text-gray-700 mb-3 mt-6"; // For individual tag headings
      const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
      const answerClasses = "text-gray-700 leading-relaxed";

      return (
        <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">{tagName}</h3>
          <table className={tableClasses}>
            <tbody>
              <tr>
                <td className={thClasses}><strong>Content</strong></td>
                <td className={`${tdClasses} whitespace-pre-wrap break-words`}>{content}</td>
              </tr>
              <tr>
                <td className={thClasses}><strong>Length</strong></td>
                <td className={tdClasses}>{length}</td>
              </tr>
              <tr>
                <td className={thClasses}><strong>Element</strong></td>
                <td className={`${tdClasses} font-mono bg-gray-100 text-purple-700 text-sm`}>
                  <code>{element}</code>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Output Section */}
          <h3 className={`${subHeadingClasses} mt-6`}>Output</h3>
          <table className={tableClasses}>
            <tbody>
              <tr>
                <td className={thClasses}><strong>Status</strong></td>
                <td className={tdClasses}>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                    {status}
                  </p>
                </td>
              </tr>
              <tr>
                <td className={thClasses}><strong>Recommended Length:</strong></td>
                <td className={tdClasses}>Min: {min} Characters & Max: {max} Characters</td>
              </tr>
              <tr>
                <td className={thClasses}><strong>Report</strong></td>
                <td className={tdClasses}>{statusMessage}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8 pt-4 border-t border-gray-300">
            <p className={questionClasses}>
              <strong>Why is &#39;{tagName}&#39; required?</strong>
            </p>
            <p className={answerClasses}>{whyRequired}</p>
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meta Tags Report</h2>

          {renderMetaTagReport(
            'Meta Title Tags',
            result?.title?.content || 'Not Available',
            result?.title?.length || 0,
            `<title>${result?.title?.content || 'Not Available'}</title>`,
            30,
            70,
            'The meta title on this webpage meets the recommended 30-70 character length range, ensuring optimal search engine optimization efforts, increased visibility, and higher click-through rates.',
            'Meta title tags are critical for SEO as they provide a concise, relevant summary of a web page\'s content, influencing search engine rankings and click-through rates in search results, thereby enhancing website visibility and organic traffic.'
          )}

          {renderMetaTagReport(
            'Meta Description Tags',
            result?.description?.content || 'Not Available',
            result?.description?.length || 0,
            `<meta name="description" content="${result?.description?.content || 'Not Available'}">`,
            150,
            200,
            'The meta description tag on this webpage meets the recommended length of 150-200 characters, optimizing the snippet displayed in search results for improved click-through rates and user engagement, thus positively impacting search engine optimization efforts.',
            'Meta description tags are vital for SEO as they provide a brief, compelling summary of a web page\'s content, influencing search engine users\' decision to click on the link, thereby improving click-through rates and overall website visibility in search results.'
          )}

          {renderMetaTagReport(
            'Meta Charset Tag',
            result?.charset?.content || 'Not Available',
            result?.charset?.content?.length || 0,
            `<meta charset="${result?.charset?.content || 'Not Available'}">`,
            1,
            10,
            'The meta charset tag on this webpage is crucial for SEO, ensuring accurate encoding and character set declaration, thereby enhancing website rendering, compatibility, and user experience for improved search engine performance.',
            'The meta charset tag is essential for SEO as it specifies the character encoding, ensuring accurate text and special character display, critical for optimal user experience and search engine indexing.'
          )}

          {renderMetaTagReport(
            'Meta Robots Tag',
            result?.robots?.content || 'Not Available',
            result?.robots?.content?.length || 0,
            `<meta name="robots" content="${result?.robots?.content || 'Not Available'}">`,
            1,
            100,
            'The meta robots tag on this webpage dictates search engine behavior, guiding indexing and crawling directives, influencing content visibility and indexing, which are crucial for SEO strategy and website performance.',
            'The meta robots tag plays a crucial role in SEO by dictating how search engines crawl and index a web page, directly influencing its visibility and rankings in search results. It\'s imperative to set the directives to “all“ or “index, follow“ to ensure optimal indexing and crawling for maximum visibility.'
          )}

          {renderMetaTagReport(
            'Meta Viewport Tag',
            result?.viewport?.content || 'Not Available',
            result?.viewport?.content?.length || 0,
            `<meta name="viewport" content="${result?.viewport?.content || 'Not Available'}">`,
            1,
            100,
            'The meta viewport tag on this webpage ensures proper display and responsiveness across devices. Its inclusion optimizes user experience and enhances mobile-friendliness, crucial for SEO and website performance.',
            'The meta viewport tag is crucial for SEO as it ensures proper rendering and usability of web pages across various devices, enhancing user experience and potentially improving search engine rankings.'
          )}
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

export default MetaTags;
