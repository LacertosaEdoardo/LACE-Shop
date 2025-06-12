export async function onRequest({ request, env }) {
  if (request.method !== 'DELETE') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { slug } = await request.json()
    
    // Lettura prodotti esistenti
    const existingProducts = await env.PRODUCTS.get('products')
    if (!existingProducts) {
      return new Response(JSON.stringify({ error: 'Prodotto non trovato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let products = JSON.parse(existingProducts)
    
    // Ricerca e rimozione prodotto
    const index = products.findIndex(p => p.slug === slug)
    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Prodotto non trovato' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Rimozione prodotto
    products.splice(index, 1)
    await env.PRODUCTS.put('products', JSON.stringify(products))

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
