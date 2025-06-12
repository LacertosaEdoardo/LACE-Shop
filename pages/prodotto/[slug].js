import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (slug) {
      fetch(`/api/products?slug=${slug}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(error => console.error('Error fetching product:', error));
    }
  }, [slug]);

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          {product.video && (
            <video 
              className="w-full max-w-2xl mx-auto mb-4" 
              controls
              src={`/videos/${product.video}`}
            />
          )}
          <p className="text-gray-700 mb-4">{product.description}</p>
          <p className="text-xl font-semibold">€{product.price}</p>
        </div>
      </div>
    </Layout>
  );
}