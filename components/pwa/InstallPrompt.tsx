'use client';

import { usePWA } from '@/hooks/usePWA';
import { X } from 'lucide-react'; // Icon library

export default function InstallPrompt() {
  const { isInstalled, isIOS, showPrompt, handleInstall, dismissPrompt } = usePWA();

  if (isInstalled) return null;

  // iOS-specific UI
  if (isIOS) {
    return (
      <IOSInstallBanner onDismiss={dismissPrompt} />
    );
  }

  // Android/Desktop UI
  if (showPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-2xl p-6 relative">
          <button
            onClick={dismissPrompt}
            className="absolute top-2 right-2 hover:bg-white/20 rounded-full p-1 transition"
            aria-label="Dismiss"
          >
            <X size={20} />
          </button>
          
          <h3 className="font-bold text-lg mb-2">Install Portfolio App</h3>
          <p className="text-sm text-white/90 mb-4">
            Access my portfolio offline and get app-like experience
          </p>
          
          <button
            onClick={handleInstall}
            className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            ðŸ“± Install Now
          </button>
        </div>
      </div>
    );
  }

  return null;
}

// Separate component for iOS instructions
function IOSInstallBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 text-white p-4 border-t border-white/10">
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 text-white/60 hover:text-white"
        aria-label="Dismiss"
      >
        <X size={20} />
      </button>
      
      <div className="max-w-md mx-auto">
        <h3 className="font-bold mb-2">Install App</h3>
        <ol className="text-sm space-y-1 text-white/80">
          <li>1. Tap the <strong>Share</strong> button in Safari</li>
          <li>2. Scroll and tap <strong>"Add to Home Screen"</strong></li>
          <li>3. Tap <strong>"Add"</strong> to confirm</li>
        </ol>
      </div>
    </div>
  );
}

