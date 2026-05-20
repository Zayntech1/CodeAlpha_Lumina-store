import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <footer className="bg-gray-50 border-t border-gray-100 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <span className="text-xl font-bold tracking-tighter">LUMINA</span>
                    <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-bold">Premium Essentials</p>
                  </div>
                  <div className="flex space-x-8 text-sm text-gray-400 font-medium">
                    <a href="#" className="hover:text-black transition-colors">Privacy</a>
                    <a href="#" className="hover:text-black transition-colors">Terms</a>
                    <a href="#" className="hover:text-black transition-colors">Contact</a>
                  </div>
                  <p className="mt-8 md:mt-0 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                    &copy; 2026 LUMINA STORE. ALL RIGHTS RESERVED.
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#000',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 20px',
              },
            }}
          />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
