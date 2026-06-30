import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { CookieBanner } from '@/components/cookie-banner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Vendora - Marketplace Modern',
    template: '%s | Vendora',
  },
  description:
    'Vendora - platformă modernă de anunțuri de vânzare-cumpărare. Găsește cele mai bune oferte sau publică propriile tale anunțuri gratuit.',
  keywords: [
    'vendora',
    'anunturi',
    'vanzari',
    'cumparari',
    'marketplace',
    'romania',
    'gratuit',
  ],
  authors: [{ name: 'Daria' }],
  creator: 'Vendora',
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: 'https://vendora.ro',
    siteName: 'Vendora',
    title: 'Vendora - Marketplace Modern',
    description:
      'Vendora - platformă modernă de anunțuri de vânzare-cumpărare. Găsește cele mai bune oferte sau publică propriile tale anunțuri gratuit.',
  },
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro">
      <body className={`${inter.className} antialiased`}>
        {children}
        <CookieBanner />
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
