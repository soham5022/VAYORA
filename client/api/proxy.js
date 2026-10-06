/**
 * Vercel Serverless BFF Proxy Handler
 * 
 * Routes incoming public /api/* requests to the internal 'server' service
 * using Vercel Service Binding: process.env.SERVER_URL
 */
export default async function handler(req, res) {
  const internalServerBase = process.env.SERVER_URL || 'http://localhost:5000';

  // Construct internal destination URL
  const incomingUrl = req.url || '';
  const cleanPath = incomingUrl.startsWith('/api') ? incomingUrl : `/api${incomingUrl}`;
  const targetUrl = new URL(cleanPath, internalServerBase);

  try {
    const headers = { ...req.headers };
    // Remove host and content-length to let fetch manage connection
    delete headers.host;
    delete headers['content-length'];

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.body) {
      fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
      if (!headers['content-type']) {
        headers['content-type'] = 'application/json';
      }
    }

    const backendRes = await fetch(targetUrl.toString(), fetchOptions);

    res.status(backendRes.status);

    const contentType = backendRes.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const data = await backendRes.text();
    return res.send(data);
  } catch (err) {
    console.error('[VAYORA BFF Proxy Error]:', err.message);
    return res.status(502).json({
      success: false,
      message: 'Failed to communicate with internal backend service: ' + err.message,
    });
  }
}
