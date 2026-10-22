import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from '../firebase';

// Fallback in-memory defaults if Firestore is not yet seeded
const DEFAULT_STORE_CONFIG = {
  shopName: 'UR Collection',
  address: '450 Lexington Ave, Suite 1200, New York, NY 10017',
  currency: 'USD',
  codEnabled: true,
  stripeEnabled: true
};

/**
 * 1. Upload an image file to Firebase Storage and return the download URL
 * 
 * @param {File} file - The raw File object from an HTML <input type="file"> or dropzone
 * @param {string} [pathPrefix='products'] - Destination folder in Firebase Storage bucket
 * @param {function} [onProgress] - Optional progress callback receiving percentage (0 - 100)
 * @returns {Promise<string>} Download URL string of uploaded image
 */
export async function uploadProductImage(file, pathPrefix = 'products', onProgress = null) {
  if (!file) {
    throw new Error('uploadProductImage: No file provided.');
  }

  // Sanitize filename and create unique timestamped storage reference
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${pathPrefix}/${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  // Metadata for caching and content-type detection
  const metadata = {
    contentType: file.type || 'image/jpeg',
    customMetadata: {
      uploadedAt: new Date().toISOString(),
      app: 'UR Collection Storefront'
    }
  };

  // Resumable upload task
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (typeof onProgress === 'function') {
          onProgress(Math.round(progress));
        }
      },
      (error) => {
        console.error('Firebase Storage upload failed:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (urlError) {
          console.error('Failed to retrieve download URL:', urlError);
          reject(urlError);
        }
      }
    );
  });
}

/**
 * 2. Fetch all products (with an optional category filter)
 * 
 * @param {string|null} [categoryFilter=null] - Category to filter by ('Men', 'Women', 'Kids', or null/'All')
 * @returns {Promise<Array<Object>>} Array of product documents including document ID
 */
export async function fetchProducts(categoryFilter = null) {
  try {
    const productsRef = collection(db, 'products');
    let q;

    // Apply category filter if provided and not 'All'
    if (categoryFilter && categoryFilter !== 'All') {
      q = query(
        productsRef,
        where('category', '==', categoryFilter),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(
        productsRef,
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const products = [];

    querySnapshot.forEach((docSnapshot) => {
      products.push({
        id: docSnapshot.id,
        ...docSnapshot.data(),
        // Convert Firestore Timestamp to JS Date / ISO string if present
        createdAt: docSnapshot.data().createdAt?.toDate?.() || docSnapshot.data().createdAt
      });
    });

    return products;
  } catch (error) {
    console.warn('fetchProducts: Firestore query failed or offline. Falling back to local catalog.', error);
    
    // In development/offline mode, return local seed if firestore is not reached
    const { MOCK_FIRESTORE_PRODUCTS } = await import('./firebaseService');
    if (categoryFilter && categoryFilter !== 'All') {
      return MOCK_FIRESTORE_PRODUCTS.filter((p) => p.category === categoryFilter);
    }
    return MOCK_FIRESTORE_PRODUCTS;
  }
}

/**
 * 3. Fetch the settings/store_config document
 * 
 * Enables the frontend to dynamically display the current Shop Name, Address,
 * Currency, and payment toggles.
 * 
 * @returns {Promise<Object>} Store configuration document data
 */
export async function fetchStoreConfig() {
  try {
    const configDocRef = doc(db, 'settings', 'store_config');
    const docSnapshot = await getDoc(configDocRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data()
      };
    } else {
      console.warn('settings/store_config does not exist in Firestore. Initializing default document...');
      // Initialize the default document in Firestore
      await setDoc(configDocRef, {
        ...DEFAULT_STORE_CONFIG,
        updatedAt: serverTimestamp()
      }, { merge: true });

      return DEFAULT_STORE_CONFIG;
    }
  } catch (error) {
    console.warn('fetchStoreConfig: Unable to reach Firestore, using default store configuration.', error);
    
    // Check localStorage cache or return default config
    try {
      const cached = localStorage.getItem('ur-store-settings');
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          shopName: parsed.shopName || DEFAULT_STORE_CONFIG.shopName,
          address: typeof parsed.physicalAddress === 'object' 
            ? `${parsed.physicalAddress.street}, ${parsed.physicalAddress.city}, ${parsed.physicalAddress.state} ${parsed.physicalAddress.zipCode}` 
            : parsed.address || DEFAULT_STORE_CONFIG.address,
          currency: parsed.defaultCurrency?.code || DEFAULT_STORE_CONFIG.currency,
          codEnabled: parsed.payments?.enableCod ?? DEFAULT_STORE_CONFIG.codEnabled,
          stripeEnabled: parsed.payments?.enableStripe ?? DEFAULT_STORE_CONFIG.stripeEnabled
        };
      }
    } catch (e) {
      // Fall through to default
    }

    return DEFAULT_STORE_CONFIG;
  }
}

/**
 * 4. Update the settings/store_config document
 * 
 * @param {Object} newConfig - New store settings to merge into Firestore
 * @returns {Promise<{ success: boolean }>}
 */
export async function updateStoreConfig(newConfig) {
  try {
    const configDocRef = doc(db, 'settings', 'store_config');
    await setDoc(configDocRef, {
      ...newConfig,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('updateStoreConfig failed:', error);
    throw error;
  }
}

/**
 * 5. Create a new Order document in Firestore
 * 
 * @param {Object} orderData - Order payload matching the schema
 * @returns {Promise<{ id: string }>}
 */
export async function createOrder(orderData) {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: orderData.status || 'Pending',
      createdAt: serverTimestamp()
    });

    return { id: docRef.id };
  } catch (error) {
    console.error('createOrder failed:', error);
    throw error;
  }
}
