import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ArrowRight, Package, CreditCard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to complete your order');
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    setIsProcessing(true);
    
    try {
      // 1. Persistence to Firestore
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items,
        totalAmount: totalPrice,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // 2. Simulate API call to backend for processing
      const response = await fetch('/api/orders/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total: totalPrice, userId: user.uid }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          clearCart();
        }, 1500);
      }
    } catch (error) {
      setIsProcessing(false);
      console.error(error);
      toast.error('Failed to process order');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tighter">ORDER CONFIRMED</h1>
          <p className="text-gray-500 mb-10 leading-relaxed">
            Thank you for your purchase! We've sent a confirmation email with your order details and tracking information.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            CONTINUE SHOPPING
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-12">SECURE CHECKOUT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <form onSubmit={handleCheckout} className="space-y-10">
            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Shipping Information</span>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                    defaultValue={user?.displayName || ''}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                    defaultValue={user?.email || ''}
                  />
                </div>
                <div className="col-span-2">
                  <input
                    required
                    type="text"
                    placeholder="Shipping Address"
                    className="w-full px-5 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
                <input
                  required
                  type="text"
                  placeholder="City"
                  className="px-5 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                />
                <input
                  required
                  type="text"
                  placeholder="Postal Code"
                  className="px-5 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Payment Details</span>
              </h2>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-400 text-sm text-center">
                Payment processing is handled securely in our sandbox environment.
              </div>
            </section>

            <button
              disabled={isProcessing}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <span>PAY ${totalPrice.toFixed(2)}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="hidden lg:block">
          <div className="bg-gray-50 rounded-3xl p-10">
            <h2 className="text-xl font-bold mb-8">IN YOUR BAG</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Subtotal</span>
                <span className="font-bold text-sm">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-gray-200">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
