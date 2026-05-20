import React from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { products, loading } = useProducts();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-gray-300" />
      </div>
    );
  }
  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-black overflow-hidden flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full border-l-4 border-white pl-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
              REDEFINE YOUR <br /> STANDARD.
            </h1>
            <p className="text-xl text-gray-300 max-w-xl mb-10 leading-relaxed font-light">
              Elevating the mundane into the extraordinary. Discover our curated collection of premium essentials.
            </p>
            <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all uppercase tracking-widest text-sm">
              Explore Collection
            </button>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">LATEST DROPS</h2>
            <p className="text-gray-500">Every piece in our collection is meticulously crafted with attention to detail and a commitment to quality.</p>
          </div>
          <div className="flex space-x-2 mt-6 md:mt-0">
            {['Electronics', 'Fashion', 'Home', 'Sports'].map(cat => (
              <button key={cat} className="px-6 py-2 rounded-full border border-gray-200 text-sm font-medium hover:border-black hover:bg-black hover:text-white transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
