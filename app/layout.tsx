import { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import PWARegister from '@/components/pwa/PWARegister';
import InstallPrompt from '@/components/pwa/InstallPrompt';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Your Name - Full-Stack Developer',
    template: '%s | Your Name',
  },
  description: 'Python & TypeScript developer specializing in APIs, PWAs, and scalable web applications',
  applicationName: 'Portfolio PWA',
  authors: [{ name: 'Your Name', url: 'https://yourportfolio.com' }],
  keywords: ['Python', 'TypeScript', 'Next.js', 'FastAPI', 'Full-Stack Developer'],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon512.png',
    apple: '/icon512.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Portfolio',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon512.png" />
      </head>
      <body className={inter.className}>
        {children}
        <PWARegister />
        <InstallPrompt />
      </body>
    </html>
  );
}

