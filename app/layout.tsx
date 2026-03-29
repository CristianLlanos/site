import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'
import Footer from '@/components/footer'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-body' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin', 'latin-ext'], variable: '--font-heading' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-code' })

export const metadata: Metadata = {
  metadataBase: new URL('https://cristianllanos.com'),
  title: {
    default: 'Cristian Llanos',
    template: '%s | Cristian Llanos',
  },
  description: 'Creemos software escalable, seguro y mantenible juntos. ¿Qué aprenderemos hoy?',
  openGraph: {
    siteName: 'Cristian Llanos',
  },
  twitter: {
    creator: '@cris_decode',
    site: '@cris_decode',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-body)' }}>
        <GoogleTagManager gtmId="GTM-TPCTDS7" />
        <div className="site-container">
          {children}
          <Footer />
        </div>
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
