import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { Mail, Lock, User, LogIn, UserPlus, Github, Chrome } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        toast.success('Welcome back!');
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(user, { displayName: formData.displayName });
        
        // Save to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: formData.displayName,
          createdAt: serverTimestamp()
        });

        toast.success('Account created successfully!');
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Sync with Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp()
      }, { merge: true });

      toast.success('Logged in with Google');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tighter mb-2">
            {isLogin ? 'WELCOME BACK' : 'JOIN LUMINA'}
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-medium">
            {isLogin ? 'Elevated Shopping Awaits' : 'Start your journey with us'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className="flex bg-gray-50 p-1 rounded-2xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${
                isLogin ? 'bg-white shadow-sm text-black' : 'text-gray-400'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>LOGIN</span>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold transition-all ${
                !isLogin ? 'bg-white shadow-sm text-black' : 'text-gray-400'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>REGISTER</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-black transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-gray-300">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-100 py-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
            <Chrome className="w-5 h-5" />
            <span>GOOGLE</span>
          </button>
        </div>
      </div>
    </div>
  );
}
