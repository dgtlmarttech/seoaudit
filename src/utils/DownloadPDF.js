// utils/DownloadPDF.js
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Define standard A4 dimensions and margins in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const MARGIN_X_MM = 10;
const MARGIN_Y_MM = 10;
const CONTENT_WIDTH_MM = A4_WIDTH_MM - (2 * MARGIN_X_MM);
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - (2 * MARGIN_Y_MM);

/**
 * Generates a PDF report from an HTML element, with a dynamically drawn header and footer.
 *
 * @param {string} className - The class name of the main content element to include in the PDF.
 * @param {string} url - The URL being analyzed for the report.
 * @param {Object} [html2canvasOptions={}] - Optional configuration for html2canvas.
 * @returns {Promise<void>} A promise that resolves when the PDF is generated and saved.
 */
export const generatePDF = async (className, url, html2canvasOptions = {}) => {
  return new Promise(async (resolve, reject) => {
    const contentElement = document.querySelector(`.${className}`);
    if (!contentElement) {
      const errorMsg = `PDF Generation Error: No content available for class "${className}".`;
      console.error(errorMsg);
      // alert(errorMsg); // Consider a toast/modal instead of alert
      return reject(new Error(errorMsg));
    }

    const formattedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // --- Helper function to add Header to a page ---
    const addHeader = (doc, currentPage, totalPages) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80); // #2C3E50
      doc.setFontSize(22);
      doc.text('SEO Analysis Report', A4_WIDTH_MM / 2, MARGIN_Y_MM + 10, { align: 'center' });

      // Add a placeholder for your logo. For a real logo:
      // 1. Convert your image to a Base64 string OR ensure it's publicly accessible.
      // 2. Use pdf.addImage(base64Image, 'PNG', x, y, width, height);
      // For now, let's just use text or a simple shape.
      // Example for logo placeholder:
      doc.setFillColor(52, 73, 94); // #34495E
      doc.rect(MARGIN_X_MM, MARGIN_Y_MM + 2, 8, 8, 'F'); // Small colored square as logo placeholder
      // For an actual image, use:
      // try {
      //   const logoBase64 = await fetch('/path/to/your/logo.png').then(res => res.blob()).then(blob => {
      //     return new Promise(resolve => {
      //       const reader = new FileReader();
      //       reader.onloadend = () => resolve(reader.result);
      //       reader.readAsDataURL(blob);
      //     });
      //   });
      //   doc.addImage(logoBase64, 'PNG', MARGIN_X_MM, MARGIN_Y_MM + 2, 8, 8);
      // } catch (e) {
      //   console.warn('Could not load logo for PDF:', e);
      // }


      doc.setFont('helvetica', 'normal');
      doc.setTextColor(52, 73, 94); // #34495E
      doc.setFontSize(10);
      doc.text(`Report for: ${formattedUrl}`, A4_WIDTH_MM / 2, MARGIN_Y_MM + 20, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, A4_WIDTH_MM / 2, MARGIN_Y_MM + 25, { align: 'center' });

      doc.setDrawColor(52, 73, 94); // #34495E
      doc.line(MARGIN_X_MM, MARGIN_Y_MM + 30, A4_WIDTH_MM - MARGIN_X_MM, MARGIN_Y_MM + 30); // Header line
    };

    // --- Helper function to add Footer to a page ---
    const addFooter = (doc, currentPage, totalPages) => {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(127, 140, 141); // #7F8C8D
      doc.setFontSize(9);

      const footerText1 = 'Contact us: contact@dgtlmart.com | Phone: 9810559439';
      const footerText2 = 'Generated using SEO Analysis Tool';
      const pageNumberText = `Page ${currentPage} of ${totalPages}`;

      doc.setDrawColor(189, 195, 199); // #BDC3C7
      doc.line(MARGIN_X_MM, A4_HEIGHT_MM - MARGIN_Y_MM - 15, A4_WIDTH_MM - MARGIN_X_MM, A4_HEIGHT_MM - MARGIN_Y_MM - 15); // Footer line

      doc.text(footerText1, A4_WIDTH_MM / 2, A4_HEIGHT_MM - MARGIN_Y_MM - 10, { align: 'center' });
      doc.text(footerText2, A4_WIDTH_MM / 2, A4_HEIGHT_MM - MARGIN_Y_MM - 5, { align: 'center' });
      doc.text(pageNumberText, A4_WIDTH_MM - MARGIN_X_MM, A4_HEIGHT_MM - MARGIN_Y_MM - 5, { align: 'right' });
    };

    // Create a temporary wrapper for html2canvas content
    const tempWrapper = document.createElement('div');
    tempWrapper.style.width = `${CONTENT_WIDTH_MM}mm`;
    tempWrapper.style.padding = '0'; // html2canvas captures padding, so external padding is better
    tempWrapper.style.boxSizing = 'border-box';
    tempWrapper.style.backgroundColor = '#ffffff'; // Ensure white background
    tempWrapper.style.fontFamily = "'Inter', sans-serif"; // Ensure consistent font
    tempWrapper.style.position = 'absolute'; // Position off-screen
    tempWrapper.style.left = '-9999px';
    tempWrapper.style.top = '-9999px';

    // Clone the content to avoid modifying the live DOM
    const clonedContent = contentElement.cloneNode(true);
    tempWrapper.appendChild(clonedContent);
    document.body.appendChild(tempWrapper);

    try {
      const canvas = await html2canvas(tempWrapper, {
        scale: 2, // Higher scale for better resolution
        useCORS: true, // Important for images from other domains
        logging: true, // Enable logging to see more html2canvas internal messages
        letterRendering: true,
        allowTaint: true, // Allows loading images from other origins without security error, but taints the canvas
        // Pass any custom options provided by the user
        ...html2canvasOptions,
      });

      const imgData = canvas.toDataURL('image/png');
      const imgHeight = (canvas.height * CONTENT_WIDTH_MM) / canvas.width; // Height of the image if scaled to content width

      let heightLeft = imgHeight;
      let position = 0; // Current vertical position on the image
      let pageNum = 1;

      // Calculate the effective content area for html2canvas content on a PDF page
      // Subtract header and footer height
      const headerHeight = 35; // Estimated header height based on content in mm
      const footerHeight = 25; // Estimated footer height based on content in mm
      const availableContentHeight = A4_HEIGHT_MM - (2 * MARGIN_Y_MM) - headerHeight - footerHeight;

      // Initial page
      addHeader(pdf, pageNum, 'X'); // 'X' for total pages placeholder
      pdf.addImage(imgData, 'PNG', MARGIN_X_MM, MARGIN_Y_MM + headerHeight, CONTENT_WIDTH_MM, imgHeight, undefined, 'FAST'); // Use 'FAST' for compression
      // Footer will be added at the end once total pages are known

      heightLeft -= availableContentHeight;
      position += availableContentHeight; // Move to the next section of the image

      while (heightLeft > -10) { // Keep adding pages as long as there's content left (with a small buffer)
        pdf.addPage();
        pageNum++;

        addHeader(pdf, pageNum, 'X'); // Add header to new page

        // Calculate the position on the new page, accounting for the header
        let currentImgY = (MARGIN_Y_MM + headerHeight) - position;
        
        pdf.addImage(imgData, 'PNG', MARGIN_X_MM, currentImgY, CONTENT_WIDTH_MM, imgHeight, undefined, 'FAST');
        
        heightLeft -= availableContentHeight;
        position += availableContentHeight;
      }

      // --- Finalizing pages with correct total page count ---
      const totalPages = pdf.internal.pages.length -1; // jsPDF counts an initial empty page
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        addFooter(pdf, i, totalPages);
      }
      
      pdf.save(`SEO_Report_${formattedUrl.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`);
      resolve();

    } catch (err) {
      console.error('PDF Generation Failed:', err);
      let clientError = 'Failed to generate PDF. Please try again.';
      if (err.message && err.message.includes('unsupported color function "lab"')) {
        clientError =
          'PDF generation failed due to unsupported CSS color functions (e.g., "lab()"). ' +
          'Please check your website\'s CSS or TailwindCSS configuration for custom colors ' +
          'and ensure they use standard formats like hex, rgb(), or hsl().';
      } else if (err.message) {
        clientError = `PDF generation failed: ${err.message}.`;
      }
      // alert(clientError); // Consider a toast/modal instead of alert
      reject(new Error(clientError));
    } finally {
      // Clean up the temporary wrapper from the DOM
      if (document.body.contains(tempWrapper)) {
        document.body.removeChild(tempWrapper);
      }
    }
  });
};