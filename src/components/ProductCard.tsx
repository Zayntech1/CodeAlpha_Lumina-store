import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </Link>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
              {product.category}
            </p>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-black transition-colors">
              {product.name}
            </h3>
          </div>
          <p className="text-lg font-bold text-black">${product.price.toFixed(2)}</p>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-6">
          {product.description}
        </p>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-black text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className="w-12 h-12 bg-gray-50 text-gray-400 flex items-center justify-center rounded-xl hover:bg-black hover:text-white transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
