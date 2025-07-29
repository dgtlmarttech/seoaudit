// app/api/generate-pdf/route.js

import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request) {
  const { url, className } = await request.json();

  if (!url || !className) {
    return NextResponse.json(
      { error: 'Missing url or className in request body.' },
      { status: 400 }
    );
  }

  let browser;
  try {
    // 1. Launch a headless browser
    browser = await puppeteer.launch({
      headless: 'new', // Use the new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Recommended for production environments
    });
    const page = await browser.newPage();

    // Set a wider viewport for better rendering, if needed
    await page.setViewport({ width: 1280, height: 800 });

    // 2. Navigate to URL
    await page.goto(url, { waitUntil: 'networkidle0' }); // Wait until network is idle

    // 3. Locate the element and manipulate its visibility
    const elementExists = await page.evaluate((selector) => {
      const element = document.querySelector(selector);
      return !!element;
    }, `.${className}`);

    if (!elementExists) {
      return NextResponse.json(
        { error: `Element with class '${className}' not found on the page.` },
        { status: 404 }
      );
    }

    // Inject CSS to hide everything except the target element
    await page.evaluate((selector) => {
      const targetElement = document.querySelector(selector);

      if (targetElement) {
        // Hide all direct children of the body
        Array.from(document.body.children).forEach(child => {
          if (child !== targetElement) {
            child.style.display = 'none';
          }
        });

        // For elements outside direct body children or deeply nested,
        // a more robust approach might be needed, or consider a screenshot approach.
        // For simplicity, this hides siblings of the target element within its parent.
        if (targetElement.parentElement) {
          Array.from(targetElement.parentElement.children).forEach(child => {
            if (child !== targetElement) {
              child.style.display = 'none';
            }
          });
        }
        
        // Ensure the target element itself is visible
        targetElement.style.display = 'block'; // Or 'flex', 'grid', etc., based on its original display
        targetElement.style.position = 'static'; // Reset position if it was absolute/fixed
        targetElement.style.margin = '0'; // Remove any external margins that might push it off page
      }
    }, `.${className}`);

    // Optionally, you might want to adjust the page size to fit the element
    // This is more complex and might involve calculating the element's bounding box.
    // For now, we'll generate a standard A4 PDF.

    // 4. Capture as PDF
    const pdfBuffer = await page.pdf({
      format: 'A4', // Or 'Letter', or specify width/height for custom sizes
      printBackground: true, // Include background colors/images
      // You can add margins here if desired
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px',
      },
      // You might also want to control headers/footers
      displayHeaderFooter: false,
    });

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="section-of-${new URL(url).hostname}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF.', details: error.message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}