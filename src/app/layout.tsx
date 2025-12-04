import { LanguageProvider } from '@/contexts/LanguageContext';
import './globals.css';

export const metadata = {
  title: 'HashBurst - Bitcoin Mining Token',
  description: 'Own real Bitcoin mining hardware through tokens',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-black text-white">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
