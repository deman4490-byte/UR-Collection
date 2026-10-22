import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/Admin/AdminLayout';
import { OverviewTab } from '../components/Admin/OverviewTab';
import { ProductsManagerTab } from '../components/Admin/ProductsManagerTab';
import { OrdersTab } from '../components/Admin/OrdersTab';
import { StoreSettingsTab } from '../components/Admin/StoreSettingsTab';
import { AdminOrder, Product, OrderStatus, AdminTab } from '../types';
import { 
  fetchAdminOrders, 
  fetchAdminProducts, 
  addFirestoreProduct, 
  updateFirestoreProduct, 
  deleteFirestoreProduct, 
  updateOrderStatus 
} from '../services/adminFirebaseService';

interface ProtectedAdminLayoutProps {
  onCatalogChanged?: () => void;
}

export const ProtectedAdminLayout: React.FC<ProtectedAdminLayoutProps> = ({ onCatalogChanged }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Derive currentTab from path: /admin/products -> 'products', /admin -> 'overview'
  const pathSegment = location.pathname.split('/')[2] as AdminTab || 'overview';
  const currentTab: AdminTab = ['overview', 'products', 'orders', 'settings'].includes(pathSegment) 
    ? pathSegment 
    : 'overview';

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          fetchAdminOrders(),
          fetchAdminProducts()
        ]);
        if (isMounted) {
          setAdminOrders(ordersData);
          setAdminProducts(productsData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load admin data:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleTabChange = (tab: AdminTab) => {
    navigate(`/admin/${tab}`);
  };

  const handleAddProduct = async (productData: any) => {
    if (productData?.id) {
      setAdminProducts((prev) => [productData, ...prev]);
      if (onCatalogChanged) onCatalogChanged();
      return;
    }
    try {
      const created = await addFirestoreProduct(productData);
      setAdminProducts((prev) => [created, ...prev]);
      if (onCatalogChanged) onCatalogChanged();
    } catch (err) {
      console.error('Failed to add product:', err);
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const updated = await updateFirestoreProduct(productId, { stockCount: newStock });
      setAdminProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
      if (onCatalogChanged) onCatalogChanged();
    } catch (err) {
      console.error('Failed to update stock:', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteFirestoreProduct(productId);
      setAdminProducts((prev) => prev.filter((p) => p.id !== productId));
      if (onCatalogChanged) onCatalogChanged();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setAdminOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  const activeOrdersCount = adminOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'Shipped'
  ).length;

  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={handleTabChange}
      onExitToStorefront={() => navigate('/')}
      activeOrdersCount={activeOrdersCount}
    >
      <Routes>
        <Route
          index
          element={
            <OverviewTab
              orders={adminOrders}
              products={adminProducts}
              onNavigateTab={(tab) => navigate(`/admin/${tab}`)}
            />
          }
        />
        <Route
          path="overview"
          element={
            <OverviewTab
              orders={adminOrders}
              products={adminProducts}
              onNavigateTab={(tab) => navigate(`/admin/${tab}`)}
            />
          }
        />
        <Route
          path="products"
          element={
            <ProductsManagerTab
              products={adminProducts}
              onAddProduct={handleAddProduct}
              onUpdateStock={handleUpdateStock}
              onDeleteProduct={handleDeleteProduct}
            />
          }
        />
        <Route
          path="orders"
          element={
            <OrdersTab
              orders={adminOrders}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          }
        />
        <Route path="settings" element={<StoreSettingsTab />} />
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </AdminLayout>
  );
};
