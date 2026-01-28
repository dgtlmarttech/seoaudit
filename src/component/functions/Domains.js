import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Globe, Shield, Zap, Hash } from 'lucide-react'; // Removed 'Link' as it was used for subdomains

const Domains = ({ result }) => {
  console.log('Domains Data:', result);

  try {
    if (!result) {
      throw new Error("No result data provided.");
    }

    const data = result;

    // Enhanced domain analysis
    const domainLength = data.domainLength || 0;
    const hasSpecialChars = data.specialCharacters && data.specialCharacters !== 'None' && data.specialCharacters !== 'N/A';
    const isSuccess = data.status === 'Success';

    // Domain length analysis
    const getDomainLengthStatus = () => {
      if (domainLength <= 15) return { status: 'optimal', message: 'Perfect length for memorability and SEO.', color: 'green' };
      if (domainLength <= 25) return { status: 'good', message: 'Good length, easy to remember and type.', color: 'blue' };
      if (domainLength <= 35) return { status: 'acceptable', message: 'Acceptable but could be shorter for better impact.', color: 'yellow' };
      return { status: 'long', message: 'Consider a shorter domain for better memorability and SEO.', color: 'orange' };
    };

    const lengthAnalysis = getDomainLengthStatus();

    // Special characters analysis
    const getSpecialCharsStatus = () => {
      if (!hasSpecialChars) return { status: 'good', message: 'No special characters detected – excellent for SEO and user experience.', color: 'green' };
      return { status: 'warning', message: 'Special characters may affect memorability and brandability.', color: 'orange' };
    };

    const specialCharsAnalysis = getSpecialCharsStatus();

    // Status icon component
    const StatusIcon = ({ status, size = 'w-5 h-5' }) => {
      switch (status) {
        case 'optimal':
        case 'good':
        case 'simple':
          return <CheckCircle className={`${size} text-green-600`} />;
        case 'acceptable':
        case 'warning':
        case 'complex':
          return <AlertCircle className={`${size} text-yellow-600`} />;
        case 'long':
          return <XCircle className={`${size} text-orange-600`} />; // Using orange for long to differentiate from hard failure
        default:
          return <Globe className={`${size} text-gray-600`} />;
      }
    };

    // Status badge component
    const StatusBadge = ({ success, customText }) => {
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {success ? <CheckCircle className="w-4 h-4 mr-1" /> : <XCircle className="w-4 h-4 mr-1" />}
          {customText || (success ? 'Success' : 'Failure')}
        </span>
      );
    };

    // Analysis card component
    const AnalysisCard = ({ icon: Icon, title, value, analysis, recommendations }) => {
      const colorClasses = {
        green: 'border-green-400 bg-green-50',
        blue: 'border-blue-400 bg-blue-50',
        yellow: 'border-yellow-400 bg-yellow-50',
        orange: 'border-orange-400 bg-orange-50',
        red: 'border-red-400 bg-red-50'
      };

      return (
        <div className={`p-6 rounded-lg border-l-4 ${colorClasses[analysis.color]} mb-6`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <Icon className="w-6 h-6 text-gray-700 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            </div>
            <StatusIcon status={analysis.status} size="w-6 h-6" />
          </div>

          <div className="mb-4">
            <p className="text-2xl font-bold text-gray-800 mb-2">{value}</p>
            <p className="text-gray-700">{analysis.message}</p>
          </div>

          {recommendations && recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="font-medium text-gray-800 mb-2">Recommendations:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-gray-400 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    };

    // Calculate overall domain score
    const calculateDomainScore = () => {
      let score = 0;
      let maxScore = 0;

      // Length score (50% weight now that subdomains are removed)
      maxScore += 50;
      if (lengthAnalysis.status === 'optimal') score += 50;
      else if (lengthAnalysis.status === 'good') score += 40;
      else if (lengthAnalysis.status === 'acceptable') score += 25;
      else score += 10; // Penalize 'long' more

      // Special characters score (30% weight)
      maxScore += 30;
      if (!hasSpecialChars) score += 30;
      else score += 10; // Penalize special chars more

      // Overall status score (20% weight) - This reflects parser success/failure
      maxScore += 20;
      if (isSuccess) score += 20;
      else score += 5; // Very low score if parsing failed

      return Math.round((score / maxScore) * 100);
    };

    const domainScore = calculateDomainScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6 font-sans antialiased">
        <div className="max-w-4xl mx-auto">
          {/* Header with overall score */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Domain SEO Analysis</h1>
              <div className="flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-emerald-600 mr-3" />
                <span className="text-xl text-gray-600">{data.domain || 'Domain Analysis'}</span>
              </div>
            </div>

            {/* Overall Score */}
            <div className="text-center mb-6">
              <div className="inline-block">
                <div className={`w-24 h-24 rounded-full border-8 flex items-center justify-center ${
                  domainScore >= 80 ? 'border-green-500 bg-green-50' :
                  domainScore >= 60 ? 'border-yellow-500 bg-yellow-50' :
                  'border-red-500 bg-red-50'
                }`}>
                  <span className={`text-2xl font-bold ${
                    domainScore >= 80 ? 'text-green-700' :
                    domainScore >= 60 ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>
                    {domainScore}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">SEO Score</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-4"> {/* Changed to 3 columns */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Hash className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Length</p>
                <p className="text-xl font-bold text-gray-800">{domainLength} chars</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Shield className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Special Chars</p>
                <p className="text-xl font-bold text-gray-800">{hasSpecialChars ? 'Yes' : 'None'}</p>
              </div>
              {/* Removed Subdomains Quick Stat */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Zap className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Status</p>
                <StatusBadge success={isSuccess} />
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detailed Domain Analysis</h2>

            <AnalysisCard
              icon={Hash}
              title="Domain Length"
              value={`${domainLength} characters`}
              analysis={lengthAnalysis}
              recommendations={
                lengthAnalysis.status === 'long' ? [
                  'Consider using a shorter, more memorable domain.',
                  'Remove unnecessary words or use abbreviations.',
                  'Shorter domains are easier to type and remember, which benefits user experience and SEO.'
                ] : lengthAnalysis.status === 'acceptable' ? [
                  'Domain length is acceptable but could be optimized.',
                  'Explore shorter alternatives for improved memorability and branding.'
                ] : []
              }
            />

            <AnalysisCard
              icon={Shield}
              title="Special Characters"
              value={data.specialCharacters || 'None'}
              analysis={specialCharsAnalysis}
              recommendations={
                hasSpecialChars ? [
                  'While hyphens are technically allowed, they can make domains less memorable and harder to communicate verbally.',
                  'Avoid underscores as they are often confused with spaces by users and search engines.',
                  'Aim for a simple, clean domain name without any special characters for best results.'
                ] : []
              }
            />
          </div>

          {/* Domain Information Table */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Domain Information</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700 w-1/3">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-2" />
                        Domain
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-800 font-mono">
                      {data.domain || 'N/A'}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700">
                      <div className="flex items-center">
                        <Hash className="w-5 h-5 mr-2" />
                        Domain Length
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-800">
                      <div className="flex items-center">
                        <span className="mr-3">{domainLength} characters</span>
                        <StatusIcon status={lengthAnalysis.status} />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        Special Characters
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-800">
                      <div className="flex items-center">
                        <span className="mr-3">{data.specialCharacters || 'None'}</span>
                        <StatusIcon status={specialCharsAnalysis.status} />
                      </div>
                    </td>
                  </tr>
                  {/* Removed Subdomains row */}
                  <tr className="border-b border-gray-200">
                    <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700">
                      <div className="flex items-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Overall Status
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge success={isSuccess} />
                    </td>
                  </tr>
                  {data.message && data.message !== 'N/A' && (
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 mr-2" />
                          Message
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-800">
                        {data.message}
                      </td>
                    </tr>
                  )}
                  {data.report && data.report !== 'N/A' && (
                    <tr>
                      <td className="py-4 px-6 bg-gray-50 font-semibold text-gray-700">
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          SEO Report
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-800">
                        {data.report}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Domain SEO Best Practices */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Domain SEO Best Practices</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Domain Selection Tips
                </h3>
                <ul className="text-blue-700 text-sm space-y-2">
                  <li>• Keep it short and memorable (ideally under 15 characters for top impact).</li>
                  <li>• Prioritize a .com extension if your audience is global or US-based.</li>
                  <li>• Avoid hyphens and numbers unless absolutely necessary for branding or clarity.</li>
                  <li>• Ensure it's easy to spell, pronounce, and communicate verbally.</li>
                </ul>
              </div>

              <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  SEO Considerations
                </h3>
                <ul className="text-green-700 text-sm space-y-2">
                  <li>• Choose a domain name that reflects your brand or niche (e.g., brandable or descriptive).</li>
                  <li>• Avoid "exact match domains" (EMDs) that solely rely on keywords; focus on natural branding.</li>
                  <li>• Incorporate relevant keywords naturally if it makes sense for your brand, but don't force them.</li>
                  <li>• Check the domain's history for any past penalties or spam activity before acquisition.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Overall Recommendations */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Recommendations</h2>

            {domainScore >= 80 ? (
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-green-800 mb-2">Excellent domain structure! 🎉</h3>
                <p className="text-green-700 mb-3">
                  Your domain follows SEO best practices and is well-optimized for search engines. Great job!
                </p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Continue monitoring domain performance and traffic.</li>
                  <li>• Maintain consistent branding across all online and offline platforms.</li>
                  <li>• Consider securing relevant trademark protection for your brand if not already done.</li>
                </ul>
              </div>
            ) : domainScore >= 60 ? (
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-semibold text-yellow-800 mb-2">Good domain with areas for enhancement.</h3>
                <p className="text-yellow-700 mb-3">
                  Your domain is functional, but there are opportunities to optimize it further for better SEO performance and user experience.
                </p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Review the "Detailed Domain Analysis" section for specific areas of improvement.</li>
                  <li>• Evaluate how easily users can recall and type your domain.</li>
                  <li>• Consider future branding strategies that might involve a more SEO-friendly domain if needed.</li>
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h3 className="font-semibold text-red-800 mb-2">Domain needs significant attention for SEO.</h3>
                <p className="text-red-700 mb-3">
                  Your domain structure has several characteristics that could negatively impact your SEO and brandability. Addressing these is crucial.
                </p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Thoroughly review all recommendations in the "Detailed Domain Analysis" section.</li>
                  <li>• Seriously consider acquiring or migrating to a more SEO-friendly domain.</li>
                  <li>• Consult with SEO professionals to develop a comprehensive domain strategy.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-red-800">Domain Analysis Error</h2> {/* More specific error title */}
          <p className="text-lg text-red-700">{error.message || 'An unexpected error occurred during domain analysis.'}</p>
          {/* Added more informative error report if available in result.report */}
          {result && result.report && result.report !== 'N/A' && (
              <p className="text-md text-red-600 mt-2">{result.report}</p>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default Domains;
