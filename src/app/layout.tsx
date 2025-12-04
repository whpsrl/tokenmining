import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HashBurst Token - Mining Crypto',
  description: 'Token rivoluzionario con mining AI-powered',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
