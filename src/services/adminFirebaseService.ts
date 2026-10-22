import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { uploadImageToCloudinary } from './cloudinaryService';
import { AdminOrder, OrderStatus, Product, CategoryType } from '../types';
import { MOCK_FIRESTORE_PRODUCTS } from './firebaseService';

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: 'UR-829104',
    customerName: 'Shan Cooper',
    customerEmail: 'shan.cooper@cloud.io',
    customerPhone: '+1 (212) 555-0199',
    shippingAddress: {
      street: '450 Lexington Ave, Suite 1200',
      city: 'New York',
      state: 'NY',
      zipCode: '10017',
      country: 'United States'
    },
    items: [
      {
        id: 'ur-prod-001',
        title: 'Tailored Italian Wool Blend Overcoat',
        price: 189.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop',
        selectedSize: 'L'
      }
    ],
    itemsCount: 1,
    status: 'Shipped',
    total: 189.00,
    paymentMethod: 'Stripe (Visa •••• 4242)',
    createdAt: '2026-10-22 14:30',
    trackingNumber: '1Z9999999999999999'
  },
  {
    id: 'UR-744019',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@fashion.fr',
    customerPhone: '+1 (415) 888-2911',
    shippingAddress: {
      street: '888 Brannan St, Penthouse 4',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'United States'
    },
    items: [
      {
        id: 'ur-prod-006',
        title: 'Full-Grain Artisan Leather Weekender Bag',
        price: 198.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
        selectedSize: '45L'
      },
      {
        id: 'ur-prod-007',
        title: 'Chronograph Minimalist Sapphire Watch',
        price: 165.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
        selectedSize: '40mm'
      }
    ],
    itemsCount: 2,
    status: 'Delivered',
    total: 363.00,
    paymentMethod: 'Apple Pay',
    createdAt: '2026-10-20 09:15',
    trackingNumber: '1Z8888888888888888'
  },
  {
    id: 'UR-623810',
    customerName: 'Marcus Vance',
    customerEmail: 'marcus.vance@techcorp.com',
    customerPhone: '+1 (312) 444-1029',
    shippingAddress: {
      street: '233 S Wacker Dr, Floor 44',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60606',
      country: 'United States'
    },
    items: [
      {
        id: 'ur-prod-003',
        title: 'Heavyweight Supima Cotton Luxe Hoodie',
        price: 68.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
        selectedSize: 'XL'
      },
      {
        id: 'ur-prod-009',
        title: 'Japanese Selvedge Denim Relaxed Jean',
        price: 118.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop',
        selectedSize: '34x32'
      }
    ],
    itemsCount: 3,
    status: 'Pending',
    total: 254.00,
    paymentMethod: 'Cash on Delivery (COD)',
    createdAt: '2026-10-22 17:45'
  },
  {
    id: 'UR-512093',
    customerName: 'Sophia Laurent',
    customerEmail: 'sophia.laurent@vogue.com',
    customerPhone: '+1 (305) 991-3042',
    shippingAddress: {
      street: '1100 Biscayne Blvd, Apt 32A',
      city: 'Miami',
      state: 'FL',
      zipCode: '33132',
      country: 'United States'
    },
    items: [
      {
        id: 'ur-prod-004',
        title: 'Cashmere Knit Asymmetrical Midi Dress',
        price: 132.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
        selectedSize: 'S'
      }
    ],
    itemsCount: 1,
    status: 'Pending',
    total: 132.00,
    paymentMethod: 'Stripe (Mastercard •••• 8812)',
    createdAt: '2026-10-22 18:12'
  },
  {
    id: 'UR-491028',
    customerName: 'David K. Miller',
    customerEmail: 'd.miller@austinmedia.com',
    customerPhone: '+1 (512) 773-4411',
    shippingAddress: {
      street: '500 W 2nd St, Suite 1900',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'United States'
    },
    items: [
      {
        id: 'ur-prod-005',
        title: 'Kids All-Weather Puffer Parka',
        price: 54.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop',
        selectedSize: '8-9Y'
      }
    ],
    itemsCount: 2,
    status: 'Shipped',
    total: 108.00,
    paymentMethod: 'Stripe (Amex •••• 1004)',
    createdAt: '2026-10-21 11:20',
    trackingNumber: '1Z7777777777777777'
  }
];

// In-memory cache synced with Firestore
let adminProductsCache: Product[] = [...MOCK_FIRESTORE_PRODUCTS];
let adminOrdersCache: AdminOrder[] = [...INITIAL_ADMIN_ORDERS];

/**
 * 1. Re-export Cloudinary direct upload function
 */
export { uploadImageToCloudinary } from './cloudinaryService';

/**
 * 2. Add product to live Firestore database (collection: 'products')
 * Uploads the image file directly to Cloudinary using unsigned upload preset,
 * and saves the returned secure HTTPS URL to the Firestore product document!
 */
export async function addFirestoreProduct(productData: {
  title: string;
  price: number;
  sellingPrice?: number;
  originalPrice?: number;
  discountPercent?: number;
  description: string;
  stock: number;
  category: CategoryType;
  imageUrl?: string;
  file?: File | null;
  brand?: string;
  tags?: string[];
  onProgress?: (progress: number) => void;
}): Promise<Product> {
  let finalImageUrl = productData.imageUrl || '';

  // Step 1: Upload physical image file directly to Cloudinary using unsigned upload preset
  if (productData.file) {
    try {
      finalImageUrl = await uploadImageToCloudinary(productData.file, productData.onProgress);
      console.log('Cloudinary direct upload complete. Secure URL:', finalImageUrl);
    } catch (cloudinaryErr: any) {
      console.error('Cloudinary upload failed:', cloudinaryErr);
      throw new Error(cloudinaryErr?.message || 'Failed to upload image to Cloudinary.');
    }
  }

  // Default fallback if no image provided
  if (!finalImageUrl) {
    finalImageUrl = 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop';
  }

  const sellingPrice = productData.sellingPrice !== undefined 
    ? Number(productData.sellingPrice) 
    : Number(productData.price);
  const originalPrice = productData.originalPrice !== undefined 
    ? Number(productData.originalPrice) 
    : Number((sellingPrice * 1.35).toFixed(2));
  const discountPercent = productData.discountPercent !== undefined 
    ? Number(productData.discountPercent) 
    : Math.max(0, Math.round(((originalPrice - sellingPrice) / originalPrice) * 100));

  // Step 2: Prepare Firestore document payload
  const firestoreDoc = {
    title: productData.title,
    price: sellingPrice,
    sellingPrice: sellingPrice,
    originalPrice: originalPrice,
    discountPercent: discountPercent,
    category: productData.category,
    stock: Number(productData.stock),
    imageUrl: finalImageUrl,
    description: productData.description || '',
    brand: productData.brand || 'UR Studio',
    subtitle: productData.brand || 'UR Studio Edition',
    tags: productData.tags || ['New Arrival', 'UR Prime'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Navy', hex: '#0B192C' },
      { name: 'Noir Black', hex: '#111827' }
    ],
    inStock: Number(productData.stock) > 0,
    primeEligible: true,
    rating: 5.0,
    ratingCount: 1,
    createdAt: serverTimestamp()
  };

  let assignedId = `ur-prod-${Date.now()}`;

  // Step 3: Write document to Firestore 'products' collection
  try {
    const docRef = await addDoc(collection(db, 'products'), firestoreDoc);
    assignedId = docRef.id;
    console.log('Successfully saved to live Firestore products collection with Doc ID:', assignedId);
  } catch (firestoreErr) {
    console.warn('Firestore write failed (check Firestore Security Rules). Stored in local catalog.', firestoreErr);
  }

  const newProduct: Product = {
    id: assignedId,
    title: productData.title,
    subtitle: productData.brand || 'UR Studio Edition',
    brand: productData.brand || 'UR Studio',
    price: sellingPrice,
    sellingPrice: sellingPrice,
    originalPrice: originalPrice,
    discountPercent: discountPercent,
    rating: 5.0,
    ratingCount: 1,
    category: productData.category,
    image: finalImageUrl,
    tags: productData.tags || ['New Arrival', 'UR Prime'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Navy', hex: '#0B192C' },
      { name: 'Noir Black', hex: '#111827' }
    ],
    inStock: Number(productData.stock) > 0,
    stockCount: Number(productData.stock),
    primeEligible: true,
    description: productData.description
  };

  adminProductsCache = [newProduct, ...adminProductsCache];
  return newProduct;
}

/**
 * 3. Fetch products from live Firestore 'products' collection
 */
export async function fetchAdminProducts(): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const firestoreProducts: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        const priceVal = Number(d.sellingPrice ?? d.price) || 0;
        const origVal = d.originalPrice !== undefined ? Number(d.originalPrice) : priceVal * 1.35;
        const discVal = d.discountPercent !== undefined 
          ? Number(d.discountPercent) 
          : (origVal > priceVal ? Math.round(((origVal - priceVal) / origVal) * 100) : 0);

        firestoreProducts.push({
          id: docSnap.id,
          title: d.title || 'Untitled Product',
          subtitle: d.subtitle || d.brand || 'UR Studio',
          brand: d.brand || 'UR Studio',
          price: priceVal,
          sellingPrice: priceVal,
          originalPrice: origVal,
          discountPercent: discVal,
          rating: d.rating || 5.0,
          ratingCount: d.ratingCount || 1,
          category: d.category || 'Men',
          image: d.imageUrl || d.image || 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop',
          tags: d.tags || ['New Arrival', 'UR Prime'],
          sizes: d.sizes || ['S', 'M', 'L', 'XL'],
          colors: d.colors || [{ name: 'Default', hex: '#0B192C' }],
          inStock: (d.stock !== undefined ? d.stock : d.stockCount) > 0,
          stockCount: d.stock !== undefined ? d.stock : (d.stockCount || 10),
          primeEligible: d.primeEligible ?? true,
          description: d.description || ''
        });
      });

      // Merge with default seeded items so storefront remains richly populated
      const existingIds = new Set(firestoreProducts.map((p) => p.id));
      const merged = [
        ...firestoreProducts,
        ...MOCK_FIRESTORE_PRODUCTS.filter((p) => !existingIds.has(p.id))
      ];

      adminProductsCache = merged;
      return merged;
    }
  } catch (err) {
    console.warn('Could not read from live Firestore products collection. Using local memory catalog.', err);
  }

  return [...adminProductsCache];
}

/**
 * 4. Update an existing product in Firestore
 */
export async function updateFirestoreProduct(productId: string, updates: Partial<Product>): Promise<Product> {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('Updated document in Firestore:', productId);
  } catch (e) {
    console.warn('Could not update live document in Firestore, updating locally:', e);
  }

  const idx = adminProductsCache.findIndex((p) => p.id === productId);
  if (idx !== -1) {
    const updated: Product = {
      ...adminProductsCache[idx],
      ...updates,
      inStock: (updates.stockCount !== undefined ? updates.stockCount : adminProductsCache[idx].stockCount) > 0
    };
    adminProductsCache[idx] = updated;
    return updated;
  }

  return updates as Product;
}

/**
 * 5. Delete product from Firestore
 */
export async function deleteFirestoreProduct(productId: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    console.log('Deleted document from Firestore:', productId);
  } catch (e) {
    console.warn('Could not delete from live Firestore, deleting locally:', e);
  }

  adminProductsCache = adminProductsCache.filter((p) => p.id !== productId);
  return true;
}

/**
 * 6. Fetch Admin Orders
 */
export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  try {
    const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
    if (!ordersSnapshot.empty) {
      const liveOrders: AdminOrder[] = [];
      ordersSnapshot.forEach((docSnap) => {
        const d = docSnap.data();
        liveOrders.push({
          id: docSnap.id,
          customerName: d.customerName || 'Anonymous Customer',
          customerEmail: d.customerEmail || 'customer@urcollection.com',
          customerPhone: d.customerPhone || '+1 (555) 019-2831',
          shippingAddress: d.shippingAddress || {
            street: '450 Lexington Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10017',
            country: 'United States'
          },
          items: d.items || [],
          itemsCount: d.items?.length || 1,
          status: d.status || 'Pending',
          total: Number(d.totalAmount || d.total) || 0,
          paymentMethod: d.paymentMethod || 'Stripe',
          createdAt: d.createdAt?.toDate?.()?.toLocaleString?.() || new Date().toLocaleString(),
          trackingNumber: d.trackingNumber
        });
      });
      return liveOrders;
    }
  } catch (e) {
    console.warn('Using seeded orders cache:', e);
  }
  return [...adminOrdersCache];
}

/**
 * 7. Update Order Status
 */
export async function updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<AdminOrder> {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn('Could not update live order status, updating locally:', e);
  }

  const index = adminOrdersCache.findIndex((o) => o.id === orderId);
  if (index !== -1) {
    const updated: AdminOrder = {
      ...adminOrdersCache[index],
      status: newStatus,
      trackingNumber: newStatus === 'Shipped' && !adminOrdersCache[index].trackingNumber 
        ? `1Z${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}` 
        : adminOrdersCache[index].trackingNumber
    };
    adminOrdersCache[index] = updated;
    return updated;
  }

  return { id: orderId, status: newStatus } as AdminOrder;
}
