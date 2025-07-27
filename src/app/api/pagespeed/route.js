// app/api/pagespeed/route.js
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const apiKey = process.env.PAGE_SPEED_API_KEY;

  if (!url) {
    return Response.json({ error: 'URL is required' }, { status: 400 });
  }

  const apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

  try {
    const encodedUrl = encodeURIComponent(url);

    const [mobileRes, desktopRes] = await Promise.all([
      axios.get(`${apiUrl}?url=${encodedUrl}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=mobile`),
      axios.get(`${apiUrl}?url=${encodedUrl}&key=${apiKey}&category=performance&category=accessibility&category=best-practices&category=seo&strategy=desktop`)
    ]);

    return Response.json({
      mobile: mobileRes.data,
      desktop: desktopRes.data
    });
  } catch (err) {
    console.error('PageSpeed API error:', err.message);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
