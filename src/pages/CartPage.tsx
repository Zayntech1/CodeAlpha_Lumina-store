import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, CreditCard, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Explore our products to get started.</p>
        <Link
          to="/"
          className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center space-x-2 hover:bg-gray-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>START SHOPPING</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">SHOPPING BAG</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="flex items-center space-x-6 py-6 border-b border-gray-100 group"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{item.category}</p>
                  </div>
                  <p className="text-lg font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-gray-50 rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-400 hover:text-black transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-400 hover:text-black transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center space-x-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-3xl p-8 sticky top-28">
            <h2 className="text-xl font-bold mb-8">ORDER SUMMARY</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">$0.00</span>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 mb-10">
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
            >
              <span>CHECKOUT</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-8 space-y-3">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest justify-center">
                <CreditCard className="w-3 h-3" />
                <span>Encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
