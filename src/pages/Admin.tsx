import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { Product } from '../types';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Package, 
  DollarSign, 
  AlertCircle,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    imageUrl: '',
    stock: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const fetchedProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        imageUrl: product.imageUrl,
        stock: product.stock
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: '',
        imageUrl: '',
        stock: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        toast.success('Product updated successfully');
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: serverTimestamp()
        });
        toast.success('Product added successfully');
      }
      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'products', id));
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Inventory Management</h1>
          <p className="text-gray-500 font-medium">Manage your product catalog and stock levels.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Items</p>
              <h3 className="text-2xl font-black">{products.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Value</p>
              <h3 className="text-2xl font-black">
                ${products.reduce((acc, curr) => acc + (curr.price * curr.stock), 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Low Stock</p>
              <h3 className="text-2xl font-black">{products.filter(p => p.stock < 10).length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex items-center space-x-4">
        <Search className="text-gray-400 ml-2" size={20} />
        <input
          type="text"
          placeholder="Search products by name or category..."
          className="flex-grow bg-transparent border-none focus:ring-0 font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Stock</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 font-black">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black tracking-tight">
                    {editingProduct ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button 
                    onClick={handleCloseModal}
                    className="p-2 hover:bg-gray-100 rounded-2xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        Product Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-black transition-all"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        Category
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-black transition-all"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-black transition-all min-h-[100px]"
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        Price ($)
                      </label>
                      <input
                        required
                        type="number"
                        step="0.01"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-black transition-all"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                        Initial Stock
                      </label>
                      <input
                        required
                        type="number"
                        className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-black transition-all"
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                      Image URL
                    </label>
                    <input
                      required
                      type="url"
                      className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-black transition-all"
                      value={formData.imageUrl}
                      onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                    />
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-black text-white py-5 rounded-2xl font-black flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} />
                        <span>{editingProduct ? 'Update Product' : 'Create Product'}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
