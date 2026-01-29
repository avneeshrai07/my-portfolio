// Custom Service Worker Registration extending global type
export interface ExtendedServiceWorkerRegistration extends ServiceWorkerRegistration {
  waiting?: ServiceWorker | null;
  active?: ServiceWorker | null;
}

// Before Install Prompt Event
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// PWA Install State
export interface PWAInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  showPrompt: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
}
