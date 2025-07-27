import React from "react";

const OpenGraphs = ({ result }) => { // Destructure result directly from props
  try {
    if (!result || typeof result !== "object") {
      return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
            <p className="text-lg text-gray-700">No data available to display.</p>
          </div>
        </div>
      );
    }

    const recommendedLengths = {
      Title: { min: 30, max: 70 },
      Description: { min: 150, max: 200 },
    };

    // Validate Title and Description with length checking
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

    const openGraphs = [
      { tag: "Title", content: result.title, validation: titleValidation },
      { tag: "Description", content: result.description, validation: descriptionValidation },
      { tag: "Image", content: result.image },
      { tag: "Url", content: result.url },
      { tag: "Type", content: result.type },
      { tag: "Site_name", content: result.sitename },
      { tag: "Locale", content: result.locale },
    ];

    // Determine overall success based on Title and Description validation and presence of other tags
    const allSuccess =
      titleValidation.status === "Success" &&
      descriptionValidation.status === "Success" &&
      openGraphs.every(({ tag, content }) => {
        // For Title and Description, rely on their specific validation
        if (tag === "Title" || tag === "Description") {
          return true; // Already handled by titleValidation and descriptionValidation
        }
        // For other tags, just check if content exists
        return !!content;
      });


    // Common Tailwind classes for table and its elements
    const tableClasses = "min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm";
    const thClasses = "py-3 px-4 bg-gray-200 font-semibold text-gray-700 border-b border-r text-left";
    const tdClasses = "py-2 px-4 text-gray-800 border-b border-r";
    const sectionHeadingClasses = "text-2xl font-semibold text-gray-700 mb-4 border-b pb-2";
    const subHeadingClasses = "text-xl font-semibold text-gray-700 mb-3 mt-6"; // For individual tag headings
    const questionClasses = "text-lg font-semibold text-gray-800 mb-2";
    const answerClasses = "text-gray-700 leading-relaxed";
    const outputStatusClasses = (status) => {
      let baseClasses = "inline-block px-3 py-1 rounded-full text-sm font-medium";
      if (status === "Success") return `${baseClasses} bg-green-100 text-green-800`;
      if (status === "Warning") return `${baseClasses} bg-yellow-100 text-yellow-800`;
      if (status === "Failure") return `${baseClasses} bg-red-100 text-red-800`;
      return baseClasses; // For "N/A" or other cases
    };

    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Meta OpenGraphs Report</h2>

          <div className="mb-10 p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className={sectionHeadingClasses}>OpenGraphs Card</h3>
            <table className={tableClasses}>
              <thead>
                <tr>
                  <th className={thClasses}>Tags</th>
                  <th className={thClasses}>Present</th>
                  <th className={thClasses}>Content</th>
                  <th className={thClasses}>Length</th>
                  <th className={thClasses}>Status</th>
                </tr>
              </thead>
              <tbody>
                {openGraphs.map(({ tag, content, validation }, index) => {
                  const length = tag === "Title" || tag === "Description" ? content?.length || 0 : "N/A";
                  let status = "N/A";

                  if (tag === "Title" || tag === "Description") {
                    status = validation.status;
                  } else {
                    status = content ? "Success" : "Failure";
                  }

                  return (
                    <tr key={index}>
                      <td className={tdClasses}>{tag}</td>
                      <td className={tdClasses}>
                        {content ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-red-600 font-medium">No</span>
                        )}
                      </td>
                      <td className={`${tdClasses} whitespace-pre-wrap break-words`}>{content || "Not Found"}</td>
                      <td className={tdClasses}>{length}</td>
                      <td className={tdClasses}>
                        <p className={outputStatusClasses(status)}>
                          {status}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h3 className={`${subHeadingClasses} mt-6`}>Output</h3>
            <table className={tableClasses}>
              <tbody>
                <tr>
                  <td className={thClasses}>
                    <strong>Status</strong>
                  </td>
                  <td className={tdClasses}>
                    <p className={outputStatusClasses(allSuccess ? "Success" : "Failure")}>
                      {allSuccess ? "Success" : "Failure"}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}>
                    <strong>Recommended Length</strong>
                  </td>
                  <td className={tdClasses}>
                    <p>
                      Title - ({recommendedLengths.Title.min} to {recommendedLengths.Title.max} Characters)
                      <br />
                      Description - ({recommendedLengths.Description.min} to {recommendedLengths.Description.max} Characters)
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className={thClasses}>
                    <strong>Report</strong>
                  </td>
                  <td className={tdClasses}>
                    {allSuccess ? (
                      <p>
                        This webpage excels with all required meta Open Graph tags
                        meeting recommended standards, optimizing its visibility and
                        engagement on social media platforms.
                      </p>
                    ) : (
                      <p>
                        This site has not properly created the Open Graphs, which
                        may negatively impact visibility and engagement on social
                        media platforms.
                      </p>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-8 pt-4 border-t border-gray-300">
              <p className={questionClasses}>
                <strong>Why is 'Open Graphs' required?</strong>
              </p>
              <p className={answerClasses}>
                Open Graphs are crucial for SEO as they optimize how web pages appear
                when shared on social media platforms like Facebook, increasing
                visibility and engagement potential.
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

export default OpenGraphs;
