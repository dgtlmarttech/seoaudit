// app/api/pagespeed/route.js
import axios from 'axios';
import { NextResponse } from 'next/server'; // Use NextResponse for robust API responses

// --- Caching Setup ---
// In-memory cache for demonstration. For production, consider persistent caching (Redis, database, Vercel Blob, etc.)
// A Map outside the handler can persist across 'warm' serverless function invocations.
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // Cache results for 1 hour (60 minutes * 60 seconds * 1000 milliseconds)

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const urlParam = searchParams.get('url');
  const apiKey = process.env.PAGE_SPEED_API_KEY;

  // 1. API Key Check
  if (!apiKey) {
    console.error('Server Configuration Error: PAGE_SPEED_API_KEY is not set.');
    return NextResponse.json(
      { success: false, error: 'Server configuration error: PageSpeed API Key is missing.' },
      { status: 500 }
    );
  }

  // 2. Input Validation
  if (!urlParam) {
    return NextResponse.json(
      { success: false, error: 'URL is required.' },
      { status: 400 }
    );
  }

  let url;
  try {
    // Validate URL format
    url = new URL(urlParam).toString(); // Ensures it's a valid, absolute URL
  } catch (e) {
    return NextResponse.json(
      { success: false, error: 'Invalid URL format provided.' },
      { status: 400 }
    );
  }

  // 3. Caching Logic - Check Cache
  const cachedData = cache.get(url);
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
    console.log(`Cache hit for URL: ${url}`);
    return NextResponse.json({ success: true, data: cachedData.data, source: 'cache' });
  }
  console.log(`Cache miss (or expired) for URL: ${url}. Fetching from PageSpeed API.`);


  const apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  try {
    const encodedUrl = encodeURIComponent(url);

    // Make two parallel requests to PageSpeed Insights API (mobile and desktop)
    const [mobileRes, desktopRes] = await Promise.all([
      axios.get(`${apiUrl}?url=${encodedUrl}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`),
      axios.get(`${apiUrl}?url=${encodedUrl}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=desktop`)
    ]);

    const resultData = {
      mobile: mobileRes.data,
      desktop: desktopRes.data
    };

    // 4. Caching Logic - Store in Cache
    cache.set(url, { data: resultData, timestamp: Date.now() });

    return NextResponse.json({ success: true, data: resultData, source: 'api' });

  } catch (err) {
    console.error('PageSpeed API request failed.');
    if (axios.isAxiosError(err)) {
      console.error('Axios Error Details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data, // This will contain Google's specific error message
        configUrl: err.config?.url, // The URL that caused the error
      });

      let errorMessage = 'Failed to fetch PageSpeed data from Google API.';
      let statusCode = err.response?.status || 500;
      let errorDetails = err.response?.data || {};

      if (statusCode === 400 && errorDetails.error?.message?.includes('API key not valid')) {
        errorMessage = 'Google API Key is invalid or not authorized for PageSpeed Insights API.';
      } else if (statusCode === 429) {
        errorMessage = 'Google API Quota exceeded. Please try again later.';
      } else if (errorDetails.error?.message) {
          errorMessage = errorDetails.error.message; // Use Google's specific message if available
      }
      
      return NextResponse.json(
        { success: false, error: errorMessage, details: errorDetails, statusCode: statusCode },
        { status: statusCode }
      );
    } else {
      console.error('An unexpected non-Axios error occurred:', err);
      return NextResponse.json(
        { success: false, error: 'An unexpected server error occurred.' },
        { status: 500 }
      );
    }
  }
}