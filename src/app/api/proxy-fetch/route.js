// app/api/proxy-fetch/route.js
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const mainResponse = await axios.get(url);
    const parsedUrl = new URL(url);
    const domain = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

    const [robots, sitemap, page404] = await Promise.all([
      axios.get(`${domain}/robots.txt`).catch(() => ({ data: null })),
      axios.get(`${domain}/sitemap.xml`).catch(() => ({ data: null })),
      axios.get(`${domain}/non-existent-page`).catch(err =>
        err.response?.status === 404 ? { data: err.response.data } : { data: null }
      )
    ]);

    return Response.json({
      sourceCode: mainResponse.data,
      robots: robots.data || 'No /robots.txt found',
      sitemap: sitemap.data || 'No /sitemap.xml found',
      page404: page404.data || 'No 404 page found',
      url: url,
    });
  } catch (err) {
    console.error('Proxy Fetch Error:', err.message);
    return Response.json({ error: 'Failed to fetch the source code' }, { status: 500 });
  }
}
