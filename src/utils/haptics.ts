/**
 * Native Haptics abstraction for CapacitorJS & Web
 * Enhances conversion rate on mobile by giving tactile feedback
 * during "Add to Cart", Tab switching, and Checkout actions.
 */

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
  try {
    // Check if running inside Capacitor native container
    if (typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.()) {
      // If Capacitor Haptics plugin is available at runtime
      const Haptics = (window as any).Capacitor?.Plugins?.Haptics;
      if (Haptics) {
        if (type === 'success' || type === 'error') {
          Haptics.notification({ type: type.toUpperCase() });
        } else {
          Haptics.impact({ style: type.toUpperCase() });
        }
        return;
      }
    }

    // Fallback to HTML5 Vibration API on mobile browsers
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'heavy':
          navigator.vibrate(45);
          break;
        case 'success':
          navigator.vibrate([20, 40, 20]);
          break;
        case 'error':
          navigator.vibrate([50, 50, 50]);
          break;
      }
    }
  } catch (e) {
    // Graceful fallback for non-supporting browsers
  }
};
