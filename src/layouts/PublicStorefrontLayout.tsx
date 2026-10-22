import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { CategoryType, Product } from '../types';
import { 
  getFirestoreProducts, 
  getFirestoreProductsByCategory, 
  searchFirestoreProducts 
} from '../services/firebaseService';
import { fetchAdminProducts } from '../services/adminFirebaseService';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { useCart } from '../context/CartContext';

// Storefront Components
import { GlobalHeader } from '../components/Header/GlobalHeader';
import { CategoryPills } from '../components/Navigation/CategoryPills';
import { BottomTabBar, TabType } from '../components/Navigation/BottomTabBar';
import { HeroBanner } from '../components/Banners/HeroBanner';
import { ProductGrid } from '../components/Products/ProductGrid';
import { SlideOverCart } from '../components/Cart/SlideOverCart';
import { CheckoutModal } from '../components/Checkout/CheckoutModal';
import { ProfileModal } from '../components/Profile/ProfileModal';
import { ProductQuickViewModal } from '../components/Products/ProductQuickViewModal';

export const PublicStorefrontLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ categoryName?: string; productId?: string }>();
  const { settings, currencySymbol } = useStoreSettings();
  const { openCart } = useCart();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Modals & Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sync category from URL if present (e.g., /category/men)
  useEffect(() => {
    if (params.categoryName) {
      const formatted = (params.categoryName.charAt(0).toUpperCase() + 
        params.categoryName.slice(1).toLowerCase()) as CategoryType;
      const validCategories: CategoryType[] = ['All', 'Men', 'Women', 'Kids', 'Accessories'];
      if (validCategories.includes(formatted)) {
        setSelectedCategory(formatted);
      }
    } else if (location.pathname === '/') {
      // Root is All departments unless user explicitly changed it
    }
  }, [params.categoryName, location.pathname]);

  // Sync direct modal routes (/cart, /checkout, /product/:productId)
  useEffect(() => {
    if (location.pathname === '/cart') {
      openCart();
    } else if (location.pathname === '/checkout') {
      setIsCheckoutOpen(true);
    }
  }, [location.pathname, openCart]);

  // Open product modal if directly navigating to /product/:productId
  useEffect(() => {
    if (params.productId && products.length > 0) {
      const match = products.find((p) => p.id === params.productId);
      if (match) {
        setQuickViewProduct(match);
      }
    }
  }, [params.productId, products]);

  // Fetch live products
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const loadData = async () => {
      try {
        let data: Product[];
        if (searchQuery.trim()) {
          data = await searchFirestoreProducts(searchQuery, selectedCategory);
        } else if (selectedCategory !== 'All') {
          data = await getFirestoreProductsByCategory(selectedCategory);
        } else {
          // Prefer catalog synced with admin/Firestore
          const adminItems = await fetchAdminProducts();
          data = adminItems.length > 0 ? adminItems : await getFirestoreProducts();
        }

        if (activeTag === 'Prime') {
          data = data.filter((p) => p.primeEligible);
        } else if (activeTag === 'Best Seller') {
          data = data.filter((p) => p.tags?.some((t) => t.includes('Best')));
        }

        if (isMounted) {
          setProducts(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching Firestore products:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadData, 100);
    return () => {
      isMounted = false;
      clearTimeout(debounceTimer);
    };
  }, [selectedCategory, searchQuery, activeTag]);

  const handleSelectCategory = (category: CategoryType) => {
    setSelectedCategory(category);
    setActiveTag(null);
    if (category === 'All') {
      navigate('/');
    } else {
      navigate(`/category/${category.toLowerCase()}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setActiveTag(null);
    navigate('/');
  };

  const handleOpenCategories = () => {
    setSelectedCategory('All');
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-brand-orange selection:text-white pb-20 md:pb-8">
      
      {/* 1. Global Header: Prominent Search Bar, hamburger menu, live Cart icon, Navy Blue Header */}
      <GlobalHeader
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 2. Category Navigation: Horizontal scrollable sticky pill-menu below header */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        activeTag={activeTag}
        onToggleTag={setActiveTag}
        productsCount={products.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Promotional Hero Banner shown on All or Top Page */}
        {!searchQuery && selectedCategory === 'All' && activeTag === null && (
          <HeroBanner
            onExploreCategory={handleSelectCategory}
            onExploreDeals={() => setActiveTag('Best Seller')}
          />
        )}

        {/* 3. Product Grid: 2-column mobile, 4-column desktop with quick Add button & Amazon-style pricing */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          activeTag={activeTag}
          onClearFilters={handleClearFilters}
          onInstantCheckout={() => setIsCheckoutOpen(true)}
        />
      </main>

      {/* 4. Slide-over Cart: Right-side panel with items, total price, proceed to checkout (100% Public) */}
      <SlideOverCart
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreProducts={() => handleSelectCategory('All')}
      />

      {/* 5. Checkout Modal with 1-Click Fast Guest Checkout (No Account or Login Required) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          if (location.pathname === '/checkout') navigate('/');
        }}
      />

      {/* 6. Profile & Account Perks Modal (Guest-friendly) */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* 7. Product Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => {
            setQuickViewProduct(null);
            if (params.productId) navigate('/');
          }}
          onInstantCheckout={() => {
            setQuickViewProduct(null);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {/* 8. Bottom Tab Navigation: Sticky mobile footer with Home, Categories, Cart, Profile */}
      <BottomTabBar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenCategories={handleOpenCategories}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Desktop Footer (Amazon-style clean corporate footer displaying dynamic shop settings) */}
      <footer className="hidden md:block mt-12 bg-brand-navy border-t border-brand-navy-surface text-white/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-brand-orange text-brand-navy font-black text-sm flex items-center justify-center">
                {settings.shopName.slice(0, 2).toUpperCase() || 'UR'}
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                {settings.shopName.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-white/60">
              The premier destination for sartorial tailoring, grade-A knitwear, and handcrafted leather accessories. 100% public browsing with instant guest checkout.
            </p>
            <p className="text-[10px] text-white/40">
              HQ: {settings.physicalAddress.street}, {settings.physicalAddress.city}, {settings.physicalAddress.state} {settings.physicalAddress.zipCode}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">Brand & Atelier</h4>
            <ul className="space-y-1.5 text-white/60">
              <li><a href="#" className="hover:text-brand-orange transition-colors">Our Sartorial Heritage</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Artisan Tailoring & Leather</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Sustainable Mongolian Cashmere</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Global Flagship Boutiques</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-1.5 text-white/60">
              <li><button onClick={() => setIsProfileOpen(true)} className="hover:text-brand-orange transition-colors">Guest Orders & Tracking</button></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">Shipping Rates ({currencySymbol})</a></li>
              <li><a href="#" className="hover:text-brand-orange transition-colors">30-Day Hassle-Free Returns</a></li>
              <li><button onClick={() => setIsCheckoutOpen(true)} className="hover:text-brand-orange transition-colors">Guest Express Checkout</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 text-xs uppercase tracking-wider">Payments & Gateways</h4>
            <div className="space-y-2 text-white/60 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${settings.payments.enableStripe ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>Stripe Card Processing: {settings.payments.enableStripe ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${settings.payments.enableCod ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>Cash on Delivery: {settings.payments.enableCod ? 'Active' : 'Disabled'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${settings.payments.enableApplePay ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                <span>Apple Pay / Mobile: {settings.payments.enableApplePay ? 'Active' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-4 text-center text-[11px] text-white/40">
          © {new Date().getFullYear()} {settings.shopName}. All rights reserved. Amazon-style premium luxury storefront.
        </div>
      </footer>

    </div>
  );
};
