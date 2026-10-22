import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import { triggerHaptic } from '../utils/haptics';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  shopName: 'UR Collection',
  tagline: 'HAUTE & STREET',
  physicalAddress: {
    street: '450 Lexington Ave, Suite 1200',
    city: 'New York',
    state: 'NY',
    zipCode: '10017',
    country: 'United States'
  },
  defaultCurrency: {
    code: 'USD',
    symbol: '$'
  },
  payments: {
    enableCod: true,
    enableStripe: true,
    enableApplePay: true
  },
  supportEmail: 'concierge@urcollection.com',
  updatedAt: Date.now()
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<{ success: boolean; message: string }>;
  isSaving: boolean;
  currencySymbol: string;
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined);

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ur-store-settings');
        if (stored) {
          return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(stored) };
        }
      } catch (e) {
        console.warn('Failed to parse stored store settings', e);
      }
    }
    return DEFAULT_STORE_SETTINGS;
  });

  const [isSaving, setIsSaving] = useState(false);

  // Sync to document title and meta
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = `${settings.shopName} | Multi-Category Amazon-Style Store`;
    }
    localStorage.setItem('ur-store-settings', JSON.stringify(settings));
  }, [settings]);

  /**
   * Firestore update logic placeholder:
   * 
   * import { doc, setDoc } from 'firebase/firestore';
   * import { db } from '../services/firebaseService';
   * 
   * await setDoc(doc(db, 'settings', 'storeSettings'), updated, { merge: true });
   */
  const updateSettings = async (newSettings: Partial<StoreSettings>): Promise<{ success: boolean; message: string }> => {
    setIsSaving(true);
    triggerHaptic('medium');

    try {
      // Simulate realistic Firestore network latency (250ms)
      await new Promise((resolve) => setTimeout(resolve, 250));

      const updated: StoreSettings = {
        ...settings,
        ...newSettings,
        updatedAt: Date.now()
      };

      setSettings(updated);
      localStorage.setItem('ur-store-settings', JSON.stringify(updated));

      triggerHaptic('success');
      setIsSaving(false);
      return { 
        success: true, 
        message: `Store settings saved! "${updated.shopName}" updated globally.` 
      };
    } catch (err: any) {
      setIsSaving(false);
      triggerHaptic('error');
      return { 
        success: false, 
        message: err?.message || 'Failed to update store settings in Firestore.' 
      };
    }
  };

  return (
    <StoreSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isSaving,
        currencySymbol: settings.defaultCurrency.symbol
      }}
    >
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};
