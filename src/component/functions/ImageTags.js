import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ImageIcon, Globe, Eye, EyeOff } from 'lucide-react';

const DEFAULT_IMAGE = 'https://placehold.co/100x100/CCCCCC/000000?text=No+Image';

const ImageTags = ({ result }) => {
  const [expandedImage, setExpandedImage] = useState(null);

  console.log('Image Tags Data:', result);
  
  try {
    // Extract favicon and images from results
    const favicon = result.faviconResults && result.faviconResults.length > 0
      ? result.faviconResults[0]
      : null;
    const images = result.imageResults || [];

    const faviconStatus = favicon
      ? { status: 'Success', report: 'Your website is optimized with a favicon.' }
      : { status: 'Failure', report: 'Your website is missing a favicon.' };

    // Calculate image statistics
    const totalImages = images.length;
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim() !== '').length;
    const imagesWithoutAlt = totalImages - imagesWithAlt;
    const altOptimizationRate = totalImages > 0 ? Math.round((imagesWithAlt / totalImages) * 100) : 0;

    // Status icon component
    const StatusIcon = ({ success, size = 'w-5 h-5' }) => {
      return success ? (
        <CheckCircle className={`${size} text-green-600 inline`} />
      ) : (
        <XCircle className={`${size} text-red-600 inline`} />
      );
    };

    // Status badge component
    const StatusBadge = ({ success, customText }) => {
      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <StatusIcon success={success} size="w-4 h-4" />
          <span className="ml-1">{customText || (success ? 'Success' : 'Failure')}</span>
        </span>
      );
    };

    // Image modal component
    const ImageModal = ({ img, index, onClose }) => {
      if (!img) return null;
      
      const validSrc = img.src && (img.src.startsWith('http') || img.src.startsWith('//'))
        ? img.src.startsWith('//') ? `https:${img.src}` : img.src
        : DEFAULT_IMAGE;

      return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">Image Details</h3>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="text-center mb-4">
                <img
                  src={validSrc}
                  alt={img.alt || `Image ${index + 1}`}
                  className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                  style={{ maxHeight: '300px' }}
                  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-gray-700">URL:</strong>
                  <p className="text-sm text-blue-600 break-all mt-1">{validSrc}</p>
                </div>
                <div>
                  <strong className="text-gray-700">Alt Text:</strong>
                  <p className="text-sm text-gray-600 mt-1">
                    {img.alt ? `"${img.alt}"` : 'No alt text provided'}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-700">SEO Status:</strong>
                  <div className="mt-1">
                    <StatusBadge success={!!img.alt} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6 font-sans antialiased">
        <div className="max-w-6xl mx-auto">
          {/* Header with overall statistics */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Image & Favicon SEO Report</h1>
              <div className="flex items-center justify-center mb-4">
                <ImageIcon className="w-8 h-8 text-purple-600 mr-3" />
                <span className="text-xl text-gray-600">{totalImages} images analyzed</span>
              </div>
            </div>
            
            {/* Statistics Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-800">Favicon</h3>
                <StatusBadge success={!!favicon} />
              </div>
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 text-center">
                <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-800">Images with Alt</h3>
                <p className="text-2xl font-bold text-green-700">{imagesWithAlt}</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 text-center">
                <EyeOff className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-red-800">Missing Alt Text</h3>
                <p className="text-2xl font-bold text-red-700">{imagesWithoutAlt}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 text-center">
                <AlertCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-800">Optimization Rate</h3>
                <p className="text-2xl font-bold text-purple-700">{altOptimizationRate}%</p>
              </div>
            </div>
          </div>

          {/* Favicon Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="flex items-center mb-6">
              <StatusIcon success={!!favicon} size="w-8 h-8" />
              <h2 className="text-3xl font-bold text-gray-800 ml-3">Favicon Analysis</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {favicon ? (
                    <>
                      <img
                        src={favicon.href}
                        alt="Favicon Preview"
                        width="64"
                        height="64"
                        className="rounded-lg shadow-md mr-4"
                        onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">Favicon Found</p>
                        <p className="text-sm text-gray-600 break-all">{favicon.href}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mr-4">
                        <Globe className="w-8 h-8 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">No Favicon Found</p>
                        <p className="text-sm text-gray-600">Consider adding a favicon to improve brand recognition</p>
                      </div>
                    </>
                  )}
                </div>
                <StatusBadge success={!!favicon} />
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Why is a favicon important?
              </h3>
              <p className="text-blue-700 leading-relaxed">
                A favicon enhances brand recognition and user experience by providing a visual identifier in browser tabs, bookmarks, and search results. It builds trust and credibility, improving site engagement and indirectly supporting SEO efforts through better user metrics.
              </p>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Image SEO Analysis</h2>
              <div className="text-right">
                <p className="text-sm text-gray-600">Optimization Score</p>
                <p className={`text-2xl font-bold ${altOptimizationRate >= 80 ? 'text-green-600' : altOptimizationRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {altOptimizationRate}%
                </p>
              </div>
            </div>

            {images.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-600">No images found on this page</p>
                <p className="text-sm text-gray-500 mt-2">This might indicate a text-heavy page or images loaded via JavaScript</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-4 text-left font-semibold text-gray-700">#</th>
                      <th className="py-4 px-4 text-left font-semibold text-gray-700">Preview</th>
                      <th className="py-4 px-4 text-left font-semibold text-gray-700">URL</th>
                      <th className="py-4 px-4 text-left font-semibold text-gray-700">Alt Text</th>
                      <th className="py-4 px-4 text-left font-semibold text-gray-700">SEO Status</th>
                      <th className="py-4 px-4 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {images.map((img, index) => {
                      const hasAlt = img.alt && img.alt.trim() !== '';
                      const isValidSrc = img.src && (img.src.startsWith('http') || img.src.startsWith('//'));
                      const validSrc = isValidSrc
                        ? img.src.startsWith('//')
                          ? `https:${img.src}`
                          : img.src
                        : DEFAULT_IMAGE;

                      return (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-700">{index + 1}</td>
                          <td className="py-4 px-4">
                            <img
                              src={validSrc}
                              alt={img.alt || `Image ${index + 1}`}
                              width="60"
                              height="60"
                              className="rounded-lg shadow-sm object-cover cursor-pointer hover:shadow-md transition-shadow"
                              onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMAGE; }}
                              onClick={() => setExpandedImage({ img, index })}
                            />
                          </td>
                          <td className="py-4 px-4 max-w-xs">
                            {img.src ? (
                              <a
                                href={validSrc}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm break-all"
                              >
                                {img.src.length > 50 ? `${img.src.substring(0, 50)}...` : img.src}
                              </a>
                            ) : (
                              <span className="text-gray-500 text-sm">No URL</span>
                            )}
                          </td>
                          <td className="py-4 px-4 max-w-xs">
                            {hasAlt ? (
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                <span className="text-sm text-gray-700 truncate" title={img.alt}>
                                  {img.alt.length > 30 ? `${img.alt.substring(0, 30)}...` : img.alt}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <XCircle className="w-4 h-4 text-red-600 mr-2" />
                                <span className="text-sm text-red-600">Missing alt text</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <StatusBadge success={hasAlt} />
                          </td>
                          <td className="py-4 px-4">
                            <button
                              onClick={() => setExpandedImage({ img, index })}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
              <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Why are alt attributes crucial for SEO?
              </h3>
              <p className="text-green-700 leading-relaxed mb-3">
                Alt attributes provide textual descriptions of images, serving multiple critical functions:
              </p>
              <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
                <li>Enable screen readers to describe images for visually impaired users</li>
                <li>Help search engines understand image content for better indexing</li>
                <li>Improve image search rankings and drive additional traffic</li>
                <li>Display fallback text when images fail to load</li>
                <li>Contribute to overall page accessibility and user experience</li>
              </ul>
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">SEO Recommendations</h2>
            
            {!favicon && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <h3 className="font-semibold text-red-800 mb-2">Add a Favicon</h3>
                <p className="text-red-700 mb-3">
                  Your website is missing a favicon, which affects brand recognition and user experience.
                </p>
                <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                  <li>Create a 32x32 pixel favicon.ico file</li>
                  <li>Add it to your website's root directory</li>
                  <li>Include favicon link tags in your HTML head section</li>
                  <li>Consider multiple sizes for different devices (16x16, 32x32, 64x64)</li>
                </ul>
              </div>
            )}

            {imagesWithoutAlt > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Optimize Alt Text ({imagesWithoutAlt} images need attention)
                </h3>
                <p className="text-yellow-700 mb-3">
                  {imagesWithoutAlt} of your images are missing alt text, which hurts both SEO and accessibility.
                </p>
                <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                  <li>Add descriptive alt text to all images</li>
                  <li>Keep alt text concise but descriptive (under 125 characters)</li>
                  <li>Include relevant keywords naturally</li>
                  <li>For decorative images, use empty alt="" attributes</li>
                </ul>
              </div>
            )}

            {altOptimizationRate >= 80 && favicon && (
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h3 className="font-semibold text-green-800 mb-2">Excellent Image SEO! 🎉</h3>
                <p className="text-green-700 mb-3">
                  Your images are well-optimized with proper alt attributes and favicon implementation.
                </p>
                <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
                  <li>Continue maintaining descriptive alt text for new images</li>
                  <li>Consider adding structured data markup for images</li>
                  <li>Optimize image file sizes for better page speed</li>
                  <li>Use modern image formats (WebP, AVIF) when possible</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {expandedImage && (
          <ImageModal 
            img={expandedImage.img} 
            index={expandedImage.index} 
            onClose={() => setExpandedImage(null)} 
          />
        )}
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6 font-sans antialiased flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-red-800">Error</h2>
          <p className="text-lg text-red-700">{error.message || 'An unexpected error occurred.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
};

export default ImageTags;