import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
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
    images: [{ url: '/img/og/site-default.png', width: 1200, height: 630 }],
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
    <html lang="es-PE" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem('theme');var t=s==='dark'||s==='light'?s:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',t)})()`,
          }}
        />
      </head>
      <body style={{ fontFamily: 'var(--font-body)' }}>
        <GoogleTagManager gtmId="GTM-TPCTDS7" />
        <div className="site-container">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
