'use client';

import { useState, useEffect, useCallback } from 'react';
import { BeforeInstallPromptEvent, PWAInstallState } from '@/types/pwa.types';

export const usePWA = (): PWAInstallState & {
  handleInstall: () => Promise<void>;
  dismissPrompt: () => void;
} => {
  const [state, setState] = useState<PWAInstallState>({
    isInstallable: false,
    isInstalled: false,
    isIOS: false,
    showPrompt: false,
    deferredPrompt: null,
  });

  useEffect(() => {
    // Detect iOS devices (no install API support)
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                        !(window as any).MSStream;
    
    // Check if app is already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (navigator as any).standalone === true;

    setState(prev => ({
      ...prev,
      isIOS: isIOSDevice,
      isInstalled: isStandalone,
    }));

    // Listen for install prompt (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      
      setState(prev => ({
        ...prev,
        isInstallable: true,
        showPrompt: !prev.isInstalled,
        deferredPrompt: promptEvent,
      }));
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        showPrompt: false,
        deferredPrompt: null,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation dialog
  const handleInstall = useCallback(async (): Promise<void> => {
    if (!state.deferredPrompt) return;

    try {
      await state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      
      console.log(`User ${outcome} the installation`);
      
      if (outcome === 'accepted') {
        setState(prev => ({ ...prev, showPrompt: false }));
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  }, [state.deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    setState(prev => ({ ...prev, showPrompt: false }));
  }, []);

  return { ...state, handleInstall, dismissPrompt };
};

