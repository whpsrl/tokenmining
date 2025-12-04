import './globals.css';

export const metadata = {
  title: 'HashBurst Token',
  description: 'Bitcoin Mining Token',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
