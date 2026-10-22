import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { StoreSettingsProvider } from './context/StoreSettingsContext';
import { AuthProvider } from './context/AuthContext';

// Layouts & Route Components
import { PublicStorefrontLayout } from './layouts/PublicStorefrontLayout';
import { ProtectedAdminLayout } from './layouts/ProtectedAdminLayout';
import { ProtectedRoute } from './components/Admin/ProtectedRoute';
import { AdminLogin } from './components/Admin/AdminLogin';

/**
 * HashRedirectHandler
 * Handles variations such as #admin -> #/admin for seamless navigation on GitHub Pages
 */
const HashRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#admin') {
        navigate('/admin', { replace: true });
      } else if (window.location.hash === '#admin/login') {
        navigate('/admin/login', { replace: true });
      }
    }
  }, [navigate]);

  return null;
};

export default function App() {
  return (
    <ThemeProvider>
      <StoreSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <HashRouter>
                <HashRedirectHandler />
                <Routes>
                  {/* 1. PUBLIC STOREFRONT ROUTES (100% Public - No Login Required) */}
                  <Route path="/" element={<PublicStorefrontLayout />} />
                  <Route path="/category/:categoryName" element={<PublicStorefrontLayout />} />
                  <Route path="/product/:productId" element={<PublicStorefrontLayout />} />
                  <Route path="/cart" element={<PublicStorefrontLayout />} />
                  <Route path="/checkout" element={<PublicStorefrontLayout />} />

                  {/* 2. ADMIN AUTHENTICATION ROUTE */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* 3. PROTECTED ADMIN ROUTES (Firebase Authentication Required) */}
                  <Route
                    path="/admin/*"
                    element={
                      <ProtectedRoute>
                        <ProtectedAdminLayout />
                      </ProtectedRoute>
                    }
                  />

                  {/* 4. CATCH-ALL ROUTE (Redirect to Home) */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </HashRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </StoreSettingsProvider>
    </ThemeProvider>
  );
}
