import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, Shield, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/')} className="text-black font-medium underline">
          Back to browsing
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-2 text-gray-400 hover:text-black transition-colors mb-12 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium uppercase tracking-widest">Back to products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100"
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">
              {product.category}
            </span>
            <h1 className="text-5xl font-bold tracking-tighter text-gray-900 mb-4">{product.name}</h1>
            <p className="text-3xl font-light text-black border-l-4 border-black pl-4">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            {product.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 py-8 border-y border-gray-100">
            <div className="flex flex-col items-center text-center space-y-2">
              <Truck className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <RotateCcw className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">30 Day Returns</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <Shield className="w-5 h-5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Secure Payments</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>ADD TO CART</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
