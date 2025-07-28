import React, { useMemo } from "react";

const OpenGraphs = ({ result }) => {
  // Memoize validation logic to prevent unnecessary recalculations
  const analysisData = useMemo(() => {
    if (!result || typeof result !== "object") {
      return null;
    }

    const recommendedLengths = {
      Title: { min: 30, max: 70 },
      Description: { min: 150, max: 200 },
    };

    // Enhanced validation function with more detailed feedback
    const validateTag = (tag, content) => {
      const { min, max } = recommendedLengths[tag] || {};
      const length = content?.length || 0;

      if (!content) {
        return { 
          status: "Failure", 
          message: `${tag} tag is missing.`,
          severity: "high"
        };
      }

      if (length < min) {
        return {
          status: "Warning",
          message: `${tag} is too short (${length} chars). Recommended: ${min}-${max} characters.`,
          severity: "medium"
        };
      }

      if (length > max) {
        return {
          status: "Warning",
          message: `${tag} is too long (${length} chars). Recommended: ${min}-${max} characters.`,
          severity: "medium"
        };
      }

      return {
        status: "Success",
        message: `${tag} length is optimal (${length} chars).`,
        severity: "low"
      };
    };

    // Validate critical tags
    const titleValidation = validateTag("Title", result.title);
    const descriptionValidation = validateTag("Description", result.description);

    // Define tag configuration with metadata
    const tagConfigs = [
      { 
        tag: "Title", 
        content: result.title, 
        validation: titleValidation,
        required: true,
        description: "The title that appears when shared on social media"
      },
      { 
        tag: "Description", 
        content: result.description, 
        validation: descriptionValidation,
        required: true,
        description: "The description that appears when shared on social media"
      },
      { 
        tag: "Image", 
        content: result.image,
        required: true,
        description: "The image that appears when shared on social media"
      },
      { 
        tag: "URL", 
        content: result.url,
        required: true,
        description: "The canonical URL of the page"
      },
      { 
        tag: "Type", 
        content: result.type,
        required: false,
        description: "The type of content (e.g., website, article)"
      },
      { 
        tag: "Site Name", 
        content: result.sitename,
        required: false,
        description: "The name of the website"
      },
      { 
        tag: "Locale", 
        content: result.locale,
        required: false,
        description: "The locale/language of the content"
      },
    ];

    // Calculate overall status with more nuanced logic
    const criticalIssues = tagConfigs.filter(({ required, content, validation }) => 
      required && (!content || validation?.status === "Failure")
    ).length;

    const warnings = tagConfigs.filter(({ validation }) => 
      validation?.status === "Warning"
    ).length;

    let overallStatus;
    if (criticalIssues > 0) {
      overallStatus = "Failure";
    } else if (warnings > 0) {
      overallStatus = "Warning";
    } else {
      overallStatus = "Success";
    }

    return {
      tagConfigs,
      overallStatus,
      criticalIssues,
      warnings,
      recommendedLengths
    };
  }, [result]);

  // Loading/Error states
  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg text-gray-700">No data available to display.</p>
          <p className="text-sm text-gray-500 mt-2">Please provide valid OpenGraph data to analyze.</p>
        </div>
      </div>
    );
  }

  const { tagConfigs, overallStatus, criticalIssues, warnings, recommendedLengths } = analysisData;

  // Status badge component
  const StatusBadge = ({ status, size = "normal" }) => {
    const sizeClasses = size === "large" ? "px-4 py-2 text-base" : "px-3 py-1 text-sm";
    const baseClasses = `inline-flex items-center rounded-full font-medium ${sizeClasses}`;
    
    const statusConfig = {
      Success: { 
        classes: "bg-green-100 text-green-800",
        icon: "✓"
      },
      Warning: { 
        classes: "bg-yellow-100 text-yellow-800",
        icon: "⚠"
      },
      Failure: { 
        classes: "bg-red-100 text-red-800",
        icon: "✕"
      }
    };

    const config = statusConfig[status] || statusConfig.Failure;
    
    return (
      <span className={`${baseClasses} ${config.classes}`}>
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  // Summary card component
  const SummaryCard = () => (
    <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Analysis Summary</h3>
        <StatusBadge status={overallStatus} size="large" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-green-600">
            {tagConfigs.filter(({ content, validation }) => 
              content && validation?.status !== "Failure"
            ).length}
          </div>
          <div className="text-sm text-gray-500">Tags Present</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{warnings}</div>
          <div className="text-sm text-gray-500">Warnings</div>
        </div>
        
        <div className="text-center p-3 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-red-600">{criticalIssues}</div>
          <div className="text-sm text-gray-500">Critical Issues</div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        {overallStatus === "Success" && "All essential OpenGraph tags are properly configured."}
        {overallStatus === "Warning" && "Some tags need attention but essential ones are present."}
        {overallStatus === "Failure" && "Critical OpenGraph tags are missing or invalid."}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">OpenGraph Analysis Report</h1>
            <p className="text-gray-600">Comprehensive analysis of your page's social media optimization</p>
          </div>

          <SummaryCard />

          {/* Detailed Tag Analysis */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Tag Details</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b border-r text-left">Tag</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b border-r text-left">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b border-r text-left">Content</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b border-r text-left">Length</th>
                    <th className="py-3 px-4 font-semibold text-gray-700 border-b text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {tagConfigs.map(({ tag, content, validation, required, description }, index) => {
                    const length = (tag === "Title" || tag === "Description") ? 
                      (content?.length || 0) : "N/A";
                    
                    let status = "Success";
                    let message = description;
                    
                    if (validation) {
                      status = validation.status;
                      message = validation.message;
                    } else if (!content && required) {
                      status = "Failure";
                      message = `Required ${tag} tag is missing`;
                    } else if (!content) {
                      status = "Warning";
                      message = `Optional ${tag} tag is missing`;
                    }

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 border-b border-r">
                          <div className="flex items-center">
                            <span className="font-medium">{tag}</span>
                            {required && (
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Required
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 border-b border-r">
                          <StatusBadge status={status} />
                        </td>
                        <td className="py-3 px-4 text-gray-800 border-b border-r max-w-xs">
                          <div className="truncate" title={content || "Not Found"}>
                            {content || <span className="text-gray-400 italic">Not Found</span>}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-800 border-b border-r">
                          {length !== "N/A" ? (
                            <span className={
                              length < (recommendedLengths[tag]?.min || 0) || 
                              length > (recommendedLengths[tag]?.max || Infinity) 
                                ? "text-yellow-600 font-medium" 
                                : "text-green-600 font-medium"
                            }>
                              {length}
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600 border-b text-sm">
                          {message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-blue-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recommendations</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Length Guidelines:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-3 rounded border">
                    <strong>Title:</strong> {recommendedLengths.Title.min}-{recommendedLengths.Title.max} characters
                    <div className="text-gray-600 text-xs mt-1">
                      Optimal for display across all social platforms
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <strong>Description:</strong> {recommendedLengths.Description.min}-{recommendedLengths.Description.max} characters
                    <div className="text-gray-600 text-xs mt-1">
                      Provides adequate context without truncation
                    </div>
                  </div>
                </div>
              </div>

              {criticalIssues > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-4">
                  <h4 className="font-medium text-red-800 mb-2">Critical Issues to Fix:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {tagConfigs
                      .filter(({ required, content, validation }) => 
                        required && (!content || validation?.status === "Failure"))
                      .map(({ tag }) => (
                        <li key={tag}>• Add missing {tag} tag</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Why OpenGraph Matters */}
          <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Why OpenGraph Tags Matter</h3>
            <p className="text-gray-700 leading-relaxed">
              OpenGraph tags are essential for SEO and social media optimization. They control how your 
              content appears when shared on platforms like Facebook, Twitter, LinkedIn, and others. 
              Properly configured tags can significantly increase click-through rates and engagement 
              by providing compelling previews of your content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenGraphs;