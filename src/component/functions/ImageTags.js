import React from 'react';
import Image from 'next/image';

const DEFAULT_IMAGE = 'https://placehold.co/100x100/CCCCCC/000000?text=No+Image';

const ImageTags = ({ result }) => { // Destructure result directly from props
  try {
    // Extract favicon and images from results
    const favicon = result.result.faviconResults && result.result.faviconResults.length > 0
      ? result.result.faviconResults[0]
      : null;
    const images = result.result.imageResults || [];

    const faviconStatus = favicon
      ? { status: 'Success', report: 'Your website is optimized with a favicon.' }
      : { status: 'Failure', report: 'Your website is missing a favicon.' };

    // Common Tailwind classes for table and its elements
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const subHeadingClasses = "text-xl font-semibold text-gray-700 mb-3 mt-6"; // For Favicon & Images sub-headings

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Favicon & Images Report</h2>

          {/* Favicon Section */}
          <div className="mb-10">
            <h3 className={sectionHeadingClasses}>Favicon</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}><strong>Favicon Icon</strong></th>
                  <th className={thClasses}><strong>Link</strong></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdClasses}>
                    {favicon ? (
                      <Image
                        src={favicon.href}
                        alt="Favicon Preview"
                        width={50}
                        height={50}
                        className="rounded-md object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                      />
                    ) : (
                      <span className="text-gray-500">Not Found</span>
                    )}
                  </td>
                  <td className={tdClasses}>
                    {favicon ? (
                      <a
                        href={favicon.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {favicon.href}
                      </a>
                    ) : (
                      <span className="text-gray-500">Not Found</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 className={`${subHeadingClasses} mt-6`}>Output</h3>
            <table className={tableClasses}>
              <tbody>
                <tr>
                  <td className={thClasses}><strong>Status</strong></td>
                  <td className={tdClasses}>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        favicon ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {faviconStatus.status}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}><strong>Report</strong></td>
                  <td className={tdClasses}>{faviconStatus.report}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                <strong>Why Favicon?</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">
                A favicon is crucial for webpage SEO as it enhances brand recognition and user experience, fostering trust and credibility, ultimately improving site engagement and search engine visibility.
              </p>
            </div>
          </div>

          {/* Images Section */}
          <div className="mb-10">
            <h3 className={sectionHeadingClasses}>Images</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>S.No</th>
                  <th className={thClasses}>Link</th>
                  <th className={thClasses}>Alt Attribute Present</th>
                  <th className={thClasses}>Preview</th>
                  <th className={thClasses}>Status</th>
                  {/* <th>Element</th> */}
                </tr>
              </thead>
              <tbody>
                {images.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`${tdClasses} text-center text-gray-500`}>No images found.</td>
                  </tr>
                ) : (
                  images.map((img, index) => {
                    const missingAttributes = [];
                    if (!img.alt) missingAttributes.push('alt');
                    if (!img.src) missingAttributes.push('src');

                    // Validate if src is a valid URL
                    const isValidSrc =
                      img.src && (img.src.startsWith('http') || img.src.startsWith('//'));
                    const validSrc = isValidSrc
                      ? img.src.startsWith('//')
                        ? `https:${img.src}`
                        : img.src
                      : DEFAULT_IMAGE;

                    return (
                      <tr key={index}>
                        <td className={tdClasses}>{index + 1}</td>
                        <td className={tdClasses}>
                          {img.src ? (
                            <a
                              href={
                                img.src.startsWith('//')
                                  ? `https:${img.src}`
                                  : img.src
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {img.src.startsWith('//') ? `https:${img.src}` : img.src}
                            </a>
                          ) : (
                            <span className="text-gray-500">Not Found</span>
                          )}
                        </td>
                        <td className={tdClasses}>
                          {missingAttributes.length > 0 ? (
                            <span className="text-red-600 font-medium">No</span>
                          ) : (
                            <span className="text-green-600 font-medium">Yes</span>
                          )}
                        </td>
                        <td className={tdClasses}>
                          <Image
                            src={validSrc}
                            alt={img.alt || `Image ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                          />
                        </td>
                        <td className={tdClasses}>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              missingAttributes.length > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {missingAttributes.length > 0 ? 'Failure' : 'Success'}
                          </span>
                        </td>
                        {/* <td>
                          <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-2 rounded">{img.imgElement}</pre>
                        </td> */}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                <strong>Alt Attributes & Why?</strong>
              </p>
              <p className="text-gray-700 leading-relaxed">
                The alt attribute in the image tag is essential for SEO as it provides
                textual context for the images, aiding search engine understanding and accessibility,
                thereby enhancing image search rankings.
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

export default ImageTags;
