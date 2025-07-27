// Import html2canvas and jsPDF from CDNs
// In a real project, you would install these via npm/yarn:
// npm install html2canvas jspdf
// import html2canvas from 'html2canvas';
// import { jsPDF } from 'jspdf';

/**
 * Generates a PDF from the provided HTML element class name with a header and footer.
 * Handles long content gracefully using html2canvas and jsPDF directly.
 * @param {string} className - The class name of the element to include in the PDF.
 * @param {string} url - The URL being analyzed for the report.
 */
export const generatePDF = async (className, url) => {
  // Load html2canvas and jsPDF dynamically to ensure they are available
  // In a production React/Next.js app, you'd import them at the top
  const html2canvas = await import('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js').then(m => m.default);
  const { jsPDF } = await import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');

  const contentElement = document.querySelector(`.${className}`);
  if (!contentElement) {
    alert('No content available to download!'); // Using alert as per original code, but recommend custom modal
    return;
  }

  // Format the URL
  const formattedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Create a temporary wrapper div to contain the header, content, and footer
  const wrapper = document.createElement('div');
  wrapper.style.width = '210mm'; // A4 width for consistent rendering
  wrapper.style.padding = '10mm'; // Add some padding
  wrapper.style.boxSizing = 'border-box';
  wrapper.style.backgroundColor = '#ffffff'; // Ensure background is white for PDF

  // Header HTML
  const headerHtml = `
    <div style="text-align: center; margin-bottom: 20px; font-family: 'Inter', sans-serif;">
      <div style="display: flex; justify-content: center; align-items: center; border-bottom: 2px solid #34495E; padding-bottom: 10px;">
        <img
          src="https://placehold.co/100x100/E0E7FF/4F46E5?text=LOGO"
          alt="Logo"
          style="width: 100px; height: 100px; margin-right: 20px; border-radius: 8px;"
        />
        <h1 style="font-size: 26px; color: #2C3E50; margin: 0;">SEO Analysis Report</h1>
      </div>
      <p style="font-size: 14px; color: #34495E; margin-top: 10px;">Generated on: ${new Date().toLocaleString()}</p>
    </div>
  `;

  // Main Content HTML
  const mainContentHtml = `
    <div style="width: 100%; font-family: 'Inter', sans-serif; text-align: center; padding-top: 20px;">
      <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">Report on ${formattedUrl}</h1>
      ${contentElement.outerHTML}
    </div>
  `;

  // Footer HTML
  const footerHtml = `
    <div style="text-align: center; font-size: 12px; font-family: 'Inter', sans-serif; color: #7F8C8D; border-top: 1px solid #BDC3C7; padding-top: 10px; margin-top: 30px;">
      <p>Contact us: <a href="mailto:contact@dgtlmart.com" style="color: #2980B9; text-decoration: none;">contact@dgtlmart.com</a> | Phone: 9810559439</p>
      <p>Generated using SEO Analysis Tool</p>
    </div>
  `;

  wrapper.innerHTML = headerHtml + mainContentHtml + footerHtml;

  // Append wrapper to body temporarily to render it for html2canvas
  document.body.appendChild(wrapper);

  try {
    const canvas = await html2canvas(wrapper, {
      scale: 2, // Higher scale for better resolution
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollX: 0,
      scrollY: -window.scrollY, // Correct scroll position
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('SEO_Report.pdf');

  } catch (err) {
    console.error('PDF Generation Failed:', err);
    alert('Failed to generate PDF. Please try again.'); // Using alert as per original code, but recommend custom modal
  } finally {
    // Clean up the temporary wrapper
    document.body.removeChild(wrapper);
  }
};
