# UR Collection — Multi-Category Amazon-Style Store & Admin Dashboard

A high-performance, mobile-first e-commerce storefront and enterprise-grade Admin Dashboard for **UR Collection**, engineered to deliver Amazon-grade scalability, inventory controls, and native mobile fidelity via **CapacitorJS**.

Built with **React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Live Preview
- **Customer Storefront**: `http://localhost:5173/`
- **Admin Dashboard**: `http://localhost:5173/#admin` (or click *"Admin Dashboard"* in the header / mobile menu)

---

## 🛠️ Admin Dashboard Architecture

The Admin Dashboard provides full operational control over the multi-category store with 4 core tabs:

### 1. Overview Tab (`src/components/Admin/OverviewTab.tsx`)
- **Executive KPI Cards**:
  - Total Gross Revenue ($148k+ with +24.8% growth velocity)
  - Total Active Orders (Pending + Shipped fulfillments)
  - Stock Units & Inventory SKU Count
  - Repeat Customer Rate boosted by UR Prime
- **Mock Revenue & Growth Charts**:
  - Responsive visual monthly revenue bar chart with interactive hover statistics.
  - Category sales volume distribution (Men's Sartorial, Women's Haute, Leather & Accessories, Kids & Juniors).
- **Recent Fulfillment Stream**:
  - Live activity table with quick order inspection.

### 2. Products Manager Tab (`src/components/Admin/ProductsManagerTab.tsx`)
- **Inventory Data Table**:
  - Multi-category filtering (**All**, **Men**, **Women**, **Kids**, **Accessories**).
  - Search by title, brand, or SKU ID.
  - Stock status filters (In Stock, Low Stock, Out of Stock).
  - Inline stock steppers (`+` / `-`) for instant inventory adjustments.
  - Delete product with instant feedback.
- **"Add Product" Modal** (`src/components/Admin/AddProductModal.tsx`):
  - **Title** (required)
  - **Price** (formatted with dynamic currency)
  - **Description** (textarea with character counter)
  - **Stock** (number input)
  - **Category Dropdown** (`Men`, `Women`, `Kids`, `Accessories`)
  - **Image Upload Zone** (drag-and-drop or file selector, ready for Firebase Storage upload streaming, with preview and editorial fashion presets).

### 3. Orders Tab (`src/components/Admin/OrdersTab.tsx`)
- **Orders Table**:
  - **Order ID** (e.g. `#UR-829104`)
  - **Customer Details**: Name, email, shipping address, contact.
  - **Status**: Interactive dropdown selector (`Pending`, `Shipped`, `Delivered`, `Cancelled`) with color-coded badges.
  - **Total**: Calculated order value formatted in store currency.
  - **Order Details Drawer**: Inspect line items, thumbnails, size/color selections, payment gateway, and delivery tracking numbers.

### 4. Store Settings Tab (Critical) (`src/components/Admin/StoreSettingsTab.tsx`)
- Updates the `StoreSettings` document in Firestore (`doc(db, 'settings', 'storeSettings')`):
  - **Dynamic Shop Name**: Updates the logo, header branding, and transactional invoices globally across both storefront and admin in real-time.
  - **Physical Address**: Headquarters street, city, state, postal code, and country.
  - **Default Currency**: USD ($), EUR (€), GBP (£), CAD ($), INR (₹), JPY (¥), AUD ($).
  - **Payment Toggles**:
    - Enable/Disable Cash on Delivery (COD)
    - Enable/Disable Stripe Payments (Credit & Debit Cards)
    - Enable/Disable 1-Touch Apple Pay / Google Pay
  - **Live Brand Header Preview**: Instant visual confirmation of how the updated logo and shop name render on the storefront.

---

## ⚡ Firebase Firestore & Storage Architecture

```typescript
// 1. Store Settings Document
import { doc, setDoc } from 'firebase/firestore';
import { db } from './services/firebaseService';

await setDoc(doc(db, 'settings', 'storeSettings'), {
  shopName: 'UR Collection',
  physicalAddress: { ... },
  defaultCurrency: { code: 'USD', symbol: '$' },
  payments: { enableCod: true, enableStripe: true, enableApplePay: true }
}, { merge: true });

// 2. Product Media Upload
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './services/firebaseService';

const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
const uploadTask = uploadBytesResumable(storageRef, file);
const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
```

---

## 📱 Mobile-First Native Conversion via CapacitorJS
- Capacitor Config: [`capacitor.config.ts`](file:///c:/Users/shanj/Downloads/UR/capacitor.config.ts) (`com.urcollection.storefront`)
- Native Haptics: [`src/utils/haptics.ts`](file:///c:/Users/shanj/Downloads/UR/src/utils/haptics.ts)
- Safe Area Padding: `pb-safe`, `pt-safe`
