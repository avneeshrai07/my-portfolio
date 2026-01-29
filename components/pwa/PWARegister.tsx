'use client';

import { useEffect, useRef } from 'react';

export default function PWARegister() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async (): Promise<void> => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // Always check for updates
      });

      registrationRef.current = registration;

      console.log('âœ… Service Worker registered:', registration.scope);

      // Check for updates every hour
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Handle waiting service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New version available
              showUpdateNotification();
            }
          });
        }
      });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!registrationRef.current?.waiting) {
          window.location.reload();
        }
      });

    } catch (error) {
      console.error('âŒ Service Worker registration failed:', error);
    }
  };

  const showUpdateNotification = (): void => {
    if (confirm('New version available! Reload to update?')) {
      registrationRef.current?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return null;
}

