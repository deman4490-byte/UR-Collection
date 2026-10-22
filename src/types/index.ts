export type CategoryType = 'All' | 'Men' | 'Women' | 'Kids' | 'Accessories';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  brand: string;
  price: number;
  sellingPrice?: number;
  originalPrice: number;
  discountPercent?: number;
  rating: number;
  ratingCount: number;
  category: CategoryType;
  image: string;
  secondaryImage?: string;
  tags?: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  inStock: boolean;
  stockCount: number;
  primeEligible: boolean;
  description: string;
  features?: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: { name: string; hex: string };
  addedAt: number;
}

export interface FilterState {
  category: CategoryType;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
  minRating: number;
  priceRange: [number, number];
  inStockOnly: boolean;
  primeOnly: boolean;
  tagFilter: string | null;
}

export interface UserProfile {
  name: string;
  email: string;
  isPrime: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  ordersCount: number;
}

// ==========================================
// STORE SETTINGS & ADMIN DASHBOARD CONTRACTS
// ==========================================

export interface StoreSettings {
  shopName: string;
  tagline: string;
  physicalAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  defaultCurrency: {
    code: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'INR' | 'AUD' | 'JPY';
    symbol: string;
  };
  payments: {
    enableCod: boolean;
    enableStripe: boolean;
    enableApplePay: boolean;
  };
  supportEmail: string;
  updatedAt?: number;
}

export type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItemSummary {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: OrderItemSummary[];
  itemsCount: number;
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
}

export type AdminTab = 'overview' | 'products' | 'orders' | 'settings';
