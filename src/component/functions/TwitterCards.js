import React from "react";

const TwitterCards = ({ result }) => {
  try {
    if (!result || typeof result !== "object") {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <div className="text-blue-500 text-6xl mb-4">🐦</div>
            <p className="text-lg text-gray-700">No Twitter Cards data available to display.</p>
          </div>
        </div>
      );
    }

    const recommendedLengths = {
      Title: { min: 30, max: 70 },
      Description: { min: 150, max: 200 },
    };

    // Validate the Title and Description tags
    const validateTag = (tag, content) => {
      const { min, max } = recommendedLengths[tag] || {};
      const length = content?.length || 0;

      if (!content) {
        return { status: "Failure", message: `${tag} tag is missing.` };
      }

      if (length < min || length > max) {
        return {
          status: "Warning",
          message: `${tag} length is out of the recommended range. Please ensure it's between ${min} and ${max} characters.`,
        };
      }

      return {
        status: "Success",
        message: `${tag} is valid with an appropriate length.`,
      };
    };

    // Validate Title and Description
    const titleValidation = validateTag("Title", result.title);
    const descriptionValidation = validateTag("Description", result.description);

    // Common Tailwind classes for table and its elements
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r break-words";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const subHeadingClasses = "text-xl font-semibold text-gray-700 mb-3 mt-6";
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";
    
    const outputStatusClasses = (status) => {
      let baseClasses = "inline-block px-3 py-1 rounded-full text-sm font-medium";
      if (status === "Success") return `${baseClasses} bg-green-100 text-green-800`;
      if (status === "Warning") return `${baseClasses} bg-yellow-100 text-yellow-800`;
      if (status === "Failure") return `${baseClasses} bg-red-100 text-red-800`;
      return `${baseClasses} bg-gray-100 text-gray-800`; // For "N/A" or other cases
    };

    // Get tag configuration with validation
    const getTagConfig = (tag) => {
      let content, length = "N/A", validation = { status: "N/A", message: "" };

      switch (tag) {
        case "Title":
          content = result.title;
          validation = titleValidation;
          length = content?.length || 0;
          break;
        case "Description":
          content = result.description;
          validation = descriptionValidation;
          length = content?.length || 0;
          break;
        case "Image":
          content = result.image;
          validation.status = content ? "Success" : "Failure";
          validation.message = content ? "Image URL provided" : "Image URL missing";
          break;
        case "Card Type":
          content = result.cardType;
          validation.status = content ? "Success" : "Failure";
          validation.message = content ? "Card type specified" : "Card type missing";
          break;
        case "Creator":
          content = result.creator;
          validation.status = content ? "Success" : "Failure";
          validation.message = content ? "Creator handle provided" : "Creator handle missing";
          break;
        case "Site":
          content = result.site;
          validation.status = content ? "Success" : "Failure";
          validation.message = content ? "Site handle provided" : "Site handle missing";
          break;
        default:
          break;
      }

      return { content, length, validation };
    };

    // Calculate overall status
    const tagResults = ["Title", "Description", "Image", "Card Type", "Creator", "Site"].map(tag => {
      return getTagConfig(tag);
    });

    const successCount = tagResults.filter(tag => tag.validation.status === "Success").length;
    const warningCount = tagResults.filter(tag => tag.validation.status === "Warning").length;
    const failureCount = tagResults.filter(tag => tag.validation.status === "Failure").length;

    const overallStatus = 
      failureCount === 0 && warningCount === 0 ? "Success" :
      failureCount > 0 ? "Failure" : "Warning";

    const StatusIcon = ({ status }) => {
      switch (status) {
        case "Success": return <span className="text-green-500">✓</span>;
        case "Warning": return <span className="text-yellow-500">⚠</span>;
        case "Failure": return <span className="text-red-500">✗</span>;
        default: return <span className="text-gray-500">—</span>;
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🐦</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Twitter Cards Analysis Report</h2>
              <p className="text-gray-600">Optimize your content for better Twitter engagement</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-green-700">Optimized</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{failureCount}</div>
                <div className="text-sm text-red-700">Issues</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">6</div>
                <div className="text-sm text-blue-700">Total Tags</div>
              </div>
            </div>
            
            <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className={sectionHeadingClasses}>Twitter Cards Analysis</h3>
              
              <div className="overflow-x-auto">
                <table className={tableClasses}>
                  <thead>
                    <tr>
                      <th className={thClasses}>Tag</th>
                      <th className={thClasses}>Present</th>
                      <th className={thClasses}>Content</th>
                      <th className={thClasses}>Length</th>
                      <th className={thClasses}>Status</th>
                      <th className={thClasses}>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Title", "Description", "Image", "Card Type", "Creator", "Site"].map((tag, index) => {
                      const { content, length, validation } = getTagConfig(tag);
                      
                      return (
                        <tr key={index} className={validation.status === "Success" ? "bg-green-50" : validation.status === "Failure" ? "bg-red-50" : "bg-yellow-50"}>
                          <td className={`${tdClasses} font-medium`}>{tag}</td>
                          <td className={tdClasses}>
                            <div className="flex items-center">
                              {content ? (
                                <>
                                  <span className="text-green-600 font-medium">Yes</span>
                                  <span className="ml-2 text-green-500">✓</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-red-600 font-medium">No</span>
                                  <span className="ml-2 text-red-500">✗</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className={`${tdClasses} whitespace-pre-wrap max-w-xs`}>
                            {content ? (
                              <div className="truncate" title={content}>
                                {content.length > 50 ? `${content.substring(0, 50)}...` : content}
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">Not Found</span>
                            )}
                          </td>
                          <td className={tdClasses}>
                            {length !== "N/A" && (
                              <div className="flex items-center">
                                <span>{length}</span>
                                {tag === "Title" || tag === "Description" ? (
                                  <div className="ml-2 text-sm text-gray-500">
                                    /{recommendedLengths[tag]?.max}
                                  </div>
                                ) : null}
                              </div>
                            )}
                            {length === "N/A" && <span className="text-gray-500">—</span>}
                          </td>
                          <td className={tdClasses}>
                            <div className="flex items-center">
                              <StatusIcon status={validation.status} />
                              <span className={`ml-2 ${outputStatusClasses(validation.status)}`}>
                                {validation.status}
                              </span>
                            </div>
                          </td>
                          <td className={`${tdClasses} text-sm text-gray-600`}>
                            {validation.message}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className={subHeadingClasses}>Summary Report</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Overall Status</h4>
                      <div className="flex items-center">
                        <StatusIcon status={overallStatus} />
                        <span className={`ml-2 ${outputStatusClasses(overallStatus)}`}>
                          {overallStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Recommended Lengths</h4>
                      <div className="text-sm text-gray-600">
                        <div>Title: {recommendedLengths.Title.min}-{recommendedLengths.Title.max} chars</div>
                        <div>Description: {recommendedLengths.Description.min}-{recommendedLengths.Description.max} chars</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Analysis Results</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {overallStatus === "Success" ? (
                        "Excellent! Your webpage includes all required Twitter Cards with proper formats and recommended lengths. This optimizes visibility and engagement when your content is shared on Twitter."
                      ) : overallStatus === "Warning" ? (
                        "Good progress! Most Twitter Cards are configured correctly, but some may need length adjustments to meet optimal recommendations for better engagement."
                      ) : (
                        "Your Twitter Cards implementation needs attention. Missing or improperly configured tags can significantly reduce engagement when your content is shared on Twitter."
                      )}
                    </p>
                  </div>

                  {(overallStatus === "Warning" || overallStatus === "Failure") && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                      <h5 className="font-semibold text-blue-800 mb-2">Optimization Tips:</h5>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Ensure title is between 30-70 characters for optimal display</li>
                        <li>• Keep description between 150-200 characters for better engagement</li>
                        <li>• Include a high-quality image (minimum 300x157px, ratio 1.91:1)</li>
                        <li>• Specify card type (summary, summary_large_image, etc.)</li>
                        <li>• Add creator and site handles for proper attribution</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Section */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <p className={questionClasses}>
                  <strong>Why are Twitter Cards Important?</strong>
                </p>
                <p className={answerClasses}>
                  Twitter Cards enhance how your content appears when shared on Twitter, providing rich previews with images, titles, and descriptions. This leads to higher engagement rates, increased click-throughs, and better brand visibility. Properly implemented Twitter Cards can significantly boost your social media presence and drive more traffic to your website.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-red-50 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Report</h2>
          <p className="text-red-600 mb-4">{error.message || 'An unexpected error occurred while analyzing Twitter Cards data.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }
};

export default TwitterCards;