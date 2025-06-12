export async function onRequest({ request, env }) {
  try {
    if (request.method === 'GET') {
      // Lettura prodotti da KV
      const products = await env.PRODUCTS.get('products')
      return new Response(products || '[]', {
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (request.method === 'POST') {
      const newProduct = await request.json()
      
      // Validazione prodotto
      if (!newProduct || !newProduct.slug) {
        return new Response(JSON.stringify({ error: 'Dati prodotto non validi' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Lettura prodotti esistenti
      let products = []
      const existingProducts = await env.PRODUCTS.get('products')
      if (existingProducts) {
        products = JSON.parse(existingProducts)
      }

      // Controllo slug duplicato
      if (products.some(p => p.slug === newProduct.slug)) {
        return new Response(JSON.stringify({ error: 'Prodotto con questo slug già esistente' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Aggiunta nuovo prodotto
      products.push(newProduct)
      await env.PRODUCTS.put('products', JSON.stringify(products))

      return new Response(JSON.stringify(newProduct), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
