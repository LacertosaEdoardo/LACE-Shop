import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle OPTIONS request
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle API routes
  if (path.startsWith('/api/')) {
    const route = path.replace('/api/', '');
    const headers = { ...corsHeaders, 'Content-Type': 'application/json' };

    try {
      switch (route) {
        case 'login':
          if (request.method === 'POST') {
            const { username, password } = await request.json();
            if (username === env.ADMIN_USERNAME && password === env.ADMIN_PASSWORD) {
              return new Response(JSON.stringify({ success: true }), {
                headers: {
                  ...headers,
                  'Set-Cookie': 'isAdmin=true; Path=/; HttpOnly; SameSite=Strict'
                }
              });
            }
            return new Response(JSON.stringify({ success: false }), { 
              status: 401,
              headers 
            });
          }
          break;

        case 'products':
          if (request.method === 'GET') {
            const products = await env.PRODUCTS.get('products', { type: 'json' }) || [];
            return new Response(JSON.stringify(products), { headers });
          } else if (request.method === 'POST') {
            const product = await request.json();
            const products = await env.PRODUCTS.get('products', { type: 'json' }) || [];
            products.push(product);
            await env.PRODUCTS.put('products', JSON.stringify(products));
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          break;

        case 'upload':
          if (request.method === 'POST') {
            const formData = await request.formData();
            const file = formData.get('video');
            
            if (!file) {
              return new Response(JSON.stringify({ error: 'No file provided' }), { 
                status: 400,
                headers 
              });
            }

            const filename = `video-${Date.now()}-${file.name}`;
            await env.R2.put(filename, file);

            return new Response(JSON.stringify({
              success: true,
              videoUrl: `/videos/${filename}`
            }), { headers });
          }
          break;

        case 'deleteProduct':
          if (request.method === 'DELETE') {
            const { slug } = await request.json();
            const products = await env.PRODUCTS.get('products', { type: 'json' }) || [];
            const updatedProducts = products.filter(p => p.slug !== slug);
            await env.PRODUCTS.put('products', JSON.stringify(updatedProducts));
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          break;
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers 
      });
    }
  }

  // Pass through to static assets
  return env.ASSETS.fetch(request);
}
