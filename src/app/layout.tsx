import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'HashBurst Token - Revolutionary Mining-Backed Cryptocurrency',
  description: 'Join the future of cloud mining with HashBurst Token. AI-powered, geo-distributed mining network with guaranteed returns and affiliate rewards.',
  keywords: 'HashBurst, mining, cryptocurrency, token, blockchain, Polygon, affiliate, cloud mining',
  openGraph: {
    title: 'HashBurst Token - Revolutionary Mining-Backed Cryptocurrency',
    description: 'AI-powered cloud mining network with guaranteed returns',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: '1px solid rgba(14, 165, 233, 0.3)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#0ea5e9',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
