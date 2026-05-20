import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Quantum Pro Laptop',
    description: 'Experience unmatched performance with the new Quantum Pro. Featuring a stunning 16-inch Retina display and the latest M3 Max chip.',
    price: 1999.99,
    category: 'Electronics',
    imageUrl: '/src/assets/images/product_laptop_1779257522943.png',
    stock: 15
  },
  {
    id: '2',
    name: 'Heritage Leather Watch',
    description: 'A timeless piece for the modern individual. Hand-stitched Italian leather meets precision Swiss movement.',
    price: 349.00,
    category: 'Fashion',
    imageUrl: '/src/assets/images/product_watch_minimalist_1779257543684.png',
    stock: 42
  },
  {
    id: '3',
    name: 'SonicWave Wireless',
    description: 'Immerse yourself in pure sound with industry-leading noise cancellation and 40-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    imageUrl: '/src/assets/images/product_headphones_wireless_1779257567772.png',
    stock: 28
  },
  {
    id: '4',
    name: 'Velocity Sport Sneakers',
    description: 'Designed for speed and engineered for comfort. The Velocity Sport features our proprietary nitrogen-infused foam.',
    price: 159.00,
    category: 'Sports',
    imageUrl: '/src/assets/images/product_sneakers_modern_sport_1779257593864.png',
    stock: 65
  }
];
