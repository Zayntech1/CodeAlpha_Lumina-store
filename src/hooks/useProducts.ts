import { useState, useEffect } from 'react';
import { collection, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { products as staticProducts } from '../data/products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      
      if (fetchedProducts.length === 0 && loading) {
        // Only seed if actually empty and initial load
        handleSeeding();
      } else {
        setProducts(fetchedProducts);
        setLoading(false);
      }
    }, (error) => {
      console.warn("Firestore listener error, using static fallback:", error);
      setProducts(staticProducts);
      setLoading(false);
    });

    async function handleSeeding() {
      try {
        console.log("Seeding products to Firestore...");
        const batch = writeBatch(db);
        staticProducts.forEach((p) => {
          const productRef = doc(db, "products", p.id);
          const { id: _, ...data } = p;
          batch.set(productRef, data);
        });
        await batch.commit();
        console.log("Database seeded successfully.");
      } catch (e) {
        console.info("Automatic seeding skipped or failed:", e);
        // If seeding fails, we still need to set static products to show something
        setProducts(staticProducts);
        setLoading(false);
      }
    }

    return () => unsubscribe();
  }, [loading]);

  return { products, loading };
}
