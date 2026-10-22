import { Product, CategoryType } from '../types';

/**
 * UR COLLECTION - FIRESTORE DATA SERVICE
 * 
 * Ready for direct plug-in with Firebase Web SDK:
 * 
 * import { initializeApp } from 'firebase/app';
 * import { getFirestore, collection, getDocs, query, where, orderBy } from 'firebase/firestore';
 * 
 * const firebaseConfig = {
 *   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 *   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
 *   ...
 * };
 * const app = initializeApp(firebaseConfig);
 * export const db = getFirestore(app);
 */

// Production Curated Catalog for UR Collection
export const MOCK_FIRESTORE_PRODUCTS: Product[] = [
  {
    id: 'ur-prod-001',
    title: 'Tailored Italian Wool Blend Overcoat',
    subtitle: 'UR Sartorial Winter Edition',
    brand: 'UR Atelier',
    price: 189.00,
    originalPrice: 269.00,
    discountPercent: 30,
    rating: 4.9,
    ratingCount: 1420,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=800&auto=format&fit=crop',
    tags: ['Best Seller', 'UR Prime', 'Winter Core'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Midnight Navy', hex: '#0B192C' },
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Charcoal Grey', hex: '#333333' }
    ],
    inStock: true,
    stockCount: 18,
    primeEligible: true,
    description: 'Masterfully crafted in soft Italian wool-blend fleece. Designed with sharp notch lapels, interior silk lining, and reinforced horn buttons for timeless executive presence.',
    features: ['75% Virgin Wool, 25% Cashmere-feel Polyamide', 'Thermal heat retention weave', 'Dual inner security pockets', 'Water-resistant finish']
  },
  {
    id: 'ur-prod-002',
    title: 'Silk Touch Structured Belted Trench',
    subtitle: 'UR Paris Haute Edition',
    brand: 'UR Studio',
    price: 145.00,
    originalPrice: 210.00,
    discountPercent: 31,
    rating: 4.8,
    ratingCount: 890,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    tags: ['Amazon Choice', 'Limited Edition'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Sand Dune', hex: '#E2D4C0' },
      { name: 'Onyx Black', hex: '#111827' },
      { name: 'Olive Green', hex: '#556B2F' }
    ],
    inStock: true,
    stockCount: 12,
    primeEligible: true,
    description: 'An iconic silhouette modernized with fluid silk-drape twill. Features storm flaps, a tortoiseshell waist buckle, and deep utilitarian welt pockets.',
    features: ['Water-repellent gabardine finish', 'Custom engraved horn buckle', 'Removable belted sash', 'Relaxed tailored silhouette']
  },
  {
    id: 'ur-prod-003',
    title: 'Heavyweight Supima Cotton Luxe Hoodie',
    subtitle: 'UR Essentials Minimalist Drop',
    brand: 'UR Basics',
    price: 68.00,
    originalPrice: 95.00,
    discountPercent: 28,
    rating: 4.9,
    ratingCount: 3120,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    tags: ['Best Seller', 'UR Prime'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: [
      { name: 'Heather Slate', hex: '#64748B' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Pitch Black', hex: '#0F172A' }
    ],
    inStock: true,
    stockCount: 45,
    primeEligible: true,
    description: '450 GSM French Terry woven from long-staple California Supima cotton. Features double-lined hood structure and pre-shrunk anti-pilling yarn.',
    features: ['100% Organic Supima Cotton', '450 GSM ultra-dense knit', 'Zero chemical softener wash', 'Ribbed side gussets']
  },
  {
    id: 'ur-prod-004',
    title: 'Cashmere Knit Asymmetrical Midi Dress',
    subtitle: 'UR Runway Evening Wear',
    brand: 'UR Studio',
    price: 132.00,
    originalPrice: 175.00,
    discountPercent: 25,
    rating: 4.7,
    ratingCount: 654,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop',
    tags: ['Trending', 'UR Prime'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Burgundy Crimson', hex: '#6B1D2F' },
      { name: 'Ivory Cream', hex: '#FDFBF7' },
      { name: 'Forest Noir', hex: '#1C3128' }
    ],
    inStock: true,
    stockCount: 9,
    primeEligible: true,
    description: 'Spun from Mongolian grade-A cashmere threads. Ultra-soft against skin with an elegant mock-neck collar and subtle side slit for effortless movement.',
    features: ['100% Sustainable Grade-A Mongolian Cashmere', 'Seamless 3D knit technology', 'Hypoallergenic natural fibers']
  },
  {
    id: 'ur-prod-005',
    title: 'Kids All-Weather Puffer Parka',
    subtitle: 'UR Junior Adventure Gear',
    brand: 'UR Kids',
    price: 54.00,
    originalPrice: 79.00,
    discountPercent: 32,
    rating: 4.9,
    ratingCount: 520,
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=800&auto=format&fit=crop',
    tags: ['Best Seller', 'Kid Safe'],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-12Y'],
    colors: [
      { name: 'Safety Orange', hex: '#FF7A00' },
      { name: 'Deep Royal', hex: '#1E3E62' },
      { name: 'Arctic Teal', hex: '#0D9488' }
    ],
    inStock: true,
    stockCount: 24,
    primeEligible: true,
    description: 'Engineered for playground warmth down to -10°C. Features eco-down thermal insulation, reflective safety trims, and snag-free zipper guards.',
    features: ['100% Recycled Thermolite Down', 'Windproof & 10k Hydrostatic water barrier', 'Fleece-lined handwarmer pockets']
  },
  {
    id: 'ur-prod-006',
    title: 'Full-Grain Artisan Leather Weekender Bag',
    subtitle: 'UR Heritage Travel Capsule',
    brand: 'UR Leatherworks',
    price: 198.00,
    originalPrice: 280.00,
    discountPercent: 29,
    rating: 4.9,
    ratingCount: 1140,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
    tags: ['Amazon Choice', 'UR Prime', 'Handcrafted'],
    sizes: ['45L Carry-On'],
    colors: [
      { name: 'Cognac Amber', hex: '#8B4513' },
      { name: 'Espresso Brown', hex: '#3E2723' },
      { name: 'Obsidian Black', hex: '#18181B' }
    ],
    inStock: true,
    stockCount: 14,
    primeEligible: true,
    description: 'Vegetable-tanned full-grain cowhide leather that builds a rich vintage patina over years of use. Includes dedicated TSA padded laptop compartment and shoe garage.',
    features: ['Solid brass hardware & YKK Excella zippers', 'Separate ventilated footwear compartment', 'Airline carry-on approved dimensions']
  },
  {
    id: 'ur-prod-007',
    title: 'Chronograph Minimalist Sapphire Watch',
    subtitle: 'UR Horology 40mm Precision',
    brand: 'UR Horology',
    price: 165.00,
    originalPrice: 240.00,
    discountPercent: 31,
    rating: 4.8,
    ratingCount: 780,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
    tags: ['UR Prime', 'Luxury'],
    sizes: ['40mm Case'],
    colors: [
      { name: 'Silver & Navy Dial', hex: '#1E3E62' },
      { name: 'All Matte Black', hex: '#18181B' },
      { name: 'Rose Gold', hex: '#B76E79' }
    ],
    inStock: true,
    stockCount: 20,
    primeEligible: true,
    description: 'Japanese Miyota quartz movement housed in 316L medical grade stainless steel. Scratch-resistant sapphire crystal glass face with 50m water resistance.',
    features: ['Anti-reflective sapphire crystal glass', 'Quick-release Italian calfskin strap', 'Sub-dial 24-hr stopwatch timing']
  },
  {
    id: 'ur-prod-008',
    title: 'Kids Organic Cotton Everyday Play Set',
    subtitle: 'UR Junior Softwear',
    brand: 'UR Kids',
    price: 36.00,
    originalPrice: 48.00,
    discountPercent: 25,
    rating: 4.9,
    ratingCount: 380,
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=800&auto=format&fit=crop',
    tags: ['GOTS Certified', 'UR Prime'],
    sizes: ['2T', '3T', '4T', '5Y'],
    colors: [
      { name: 'Mustard Sun', hex: '#EAB308' },
      { name: 'Sage Green', hex: '#84CC16' },
      { name: 'Cloud Grey', hex: '#E2E8F0' }
    ],
    inStock: true,
    stockCount: 30,
    primeEligible: true,
    description: 'Ultra-gentle 100% GOTS certified organic combed cotton. Elasticized waistband with reinforced knee patches built for maximum active durability.',
    features: ['100% Certified Organic Cotton', 'Tag-free itchless collar', 'Pre-washed for cloud softness']
  },
  {
    id: 'ur-prod-009',
    title: 'Japanese Selvedge Denim Relaxed Jean',
    subtitle: 'UR Kuroki Mill Capsule',
    brand: 'UR Denim',
    price: 118.00,
    originalPrice: 160.00,
    discountPercent: 26,
    rating: 4.8,
    ratingCount: 1670,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=800&auto=format&fit=crop',
    tags: ['UR Prime', 'Authentic'],
    sizes: ['30x32', '32x32', '34x32', '36x32'],
    colors: [
      { name: 'Indigo Raw Wash', hex: '#1C2833' },
      { name: 'Stonewashed Blue', hex: '#4A6984' },
      { name: 'Washed Grey', hex: '#4B5563' }
    ],
    inStock: true,
    stockCount: 22,
    primeEligible: true,
    description: '14oz red-line selvedge denim woven on vintage shuttle looms in Okayama, Japan. Features chain-stitched hems and solid copper rivets.',
    features: ['14oz 100% Selvedge Indigo Denim', 'Natural indigo rope dye process', 'Reinforced donut buttons & bar tacks']
  },
  {
    id: 'ur-prod-010',
    title: 'Pleated Chiffon Midi Floral Skirt',
    subtitle: 'UR Spring Reverie',
    brand: 'UR Studio',
    price: 79.00,
    originalPrice: 110.00,
    discountPercent: 28,
    rating: 4.7,
    ratingCount: 420,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    tags: ['UR Prime', 'Trending'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Blush Floral', hex: '#F472B6' },
      { name: 'Botanical Olive', hex: '#65A30D' },
      { name: 'Midnight Garden', hex: '#1E1B4B' }
    ],
    inStock: true,
    stockCount: 16,
    primeEligible: true,
    description: 'Accordion pleats engineered with high-precision heat setting for permanent crisp folds. Lined with anti-static lightweight satin.',
    features: ['Comfort stretch inner waistband', 'Non-wrinkle travel friendly fabric', 'Featherweight flowing movement']
  },
  {
    id: 'ur-prod-011',
    title: 'Polarized Aviator Sunglasses Titanium Frame',
    subtitle: 'UR Optics Precision Series',
    brand: 'UR Optics',
    price: 88.00,
    originalPrice: 125.00,
    discountPercent: 30,
    rating: 4.9,
    ratingCount: 930,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
    tags: ['UR Prime', 'Best Seller'],
    sizes: ['Standard 55mm'],
    colors: [
      { name: 'Gold & Green Lens', hex: '#CA8A04' },
      { name: 'Gunmetal Mirror', hex: '#4B5563' },
      { name: 'Matte Black', hex: '#000000' }
    ],
    inStock: true,
    stockCount: 28,
    primeEligible: true,
    description: 'Ultralight Japanese beta-titanium frames weighing only 18 grams. Equipped with 7-layer polarization eliminating 99.9% of reflective road glare.',
    features: ['UV400 Category 3 Sun Protection', 'Ultra-durable spring hinges', 'Hypoallergenic silicone nose pads']
  },
  {
    id: 'ur-prod-012',
    title: 'Merino Wool Ribbed Beanie & Scarf Set',
    subtitle: 'UR Alpine Winter Essentials',
    brand: 'UR Knitwear',
    price: 49.00,
    originalPrice: 70.00,
    discountPercent: 30,
    rating: 4.8,
    ratingCount: 610,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop',
    secondaryImage: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=800&auto=format&fit=crop',
    tags: ['UR Prime', 'Gift Ready'],
    sizes: ['One Size Fits All'],
    colors: [
      { name: 'Caramel Oat', hex: '#D97706' },
      { name: 'Navy Blue', hex: '#0B192C' },
      { name: 'Heather Charcoal', hex: '#374151' }
    ],
    inStock: true,
    stockCount: 40,
    primeEligible: true,
    description: '100% extra-fine Australian Merino wool (19.5 micron). Natural temperature regulation that retains heat even when wet without any scratchiness.',
    features: ['100% Pure Extra-fine Merino Wool', 'Naturally odor-resistant', 'Presented in luxury UR gift box']
  }
];

/**
 * Fetch products from Firestore or fallback local store
 */
export async function getFirestoreProducts(): Promise<Product[]> {
  // Simulating realistic Firestore network latency (150ms)
  await new Promise((resolve) => setTimeout(resolve, 150));
  
  // Return the production-ready catalog
  return MOCK_FIRESTORE_PRODUCTS;
}

/**
 * Filter products by category
 */
export async function getFirestoreProductsByCategory(category: CategoryType): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (category === 'All') return MOCK_FIRESTORE_PRODUCTS;
  return MOCK_FIRESTORE_PRODUCTS.filter((item) => item.category === category);
}

/**
 * Search products by query & category
 */
export async function searchFirestoreProducts(query: string, category: CategoryType = 'All'): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const normalized = query.toLowerCase().trim();
  
  return MOCK_FIRESTORE_PRODUCTS.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;
    
    return (
      item.title.toLowerCase().includes(normalized) ||
      item.subtitle.toLowerCase().includes(normalized) ||
      item.brand.toLowerCase().includes(normalized) ||
      item.category.toLowerCase().includes(normalized) ||
      item.tags?.some((t) => t.toLowerCase().includes(normalized))
    );
  });
}
