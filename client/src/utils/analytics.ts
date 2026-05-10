/**
 * Google Analytics 4 integration
 * 
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs
 */

const GA_MEASUREMENT_ID = import.meta.env.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';
let isInitialized = false;

/**
 * Initialize Google Analytics
 * Must be called once on app startup
 */
export function initGA(): void {
  // Prevent double initialization
  if (isInitialized) {
    return;
  }
  isInitialized = true;
  
  // Check if script already exists
  const existingScript = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
  );
  if (existingScript) {
    return;
  }

  // Validate measurement ID
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    console.warn('Google Analytics not configured. Set VITE_GA_MEASUREMENT_ID in .env');
    return;
  }

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  
  // Initialize gtag function - CRITICAL: use arguments, not spread operator
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  
  // Configure Google Analytics
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    'send_page_view': false,        // Manual page view tracking
    'debug_mode': import.meta.env.DEV,  // Debug only in development
    'transport_type': 'beacon',     // Use sendBeacon API
  });
}

/**
 * Track page view
 * Call on route changes in SPA
 */
export function trackPageView(path: string, title: string): void {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
    });
  }
}

/**
 * Track custom event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>): void {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
}

// TypeScript declarations
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag: (...args: any[]) => void;
  }
}