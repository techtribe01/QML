import React from "react"
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ScrollToTop } from '@/components/layout/scroll-to-top'
import './globals.css'

const _inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

const _jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-jetbrains'
});

export const metadata: Metadata = {
  title: 'QADS | Quantum Anomaly Detection System',
  description: 'Enterprise-grade fraud detection platform leveraging Quantum Machine Learning across Finance, Healthcare, and Cybersecurity domains.',
  generator: 'v0.app',
  keywords: ['quantum computing', 'fraud detection', 'machine learning', 'cybersecurity', 'healthcare', 'finance'],
  openGraph: {
    title: 'QADS | Quantum Anomaly Detection System',
    description: 'Enterprise-grade fraud detection powered by Quantum Machine Learning',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QADS | Quantum Anomaly Detection System',
    description: 'Enterprise-grade fraud detection powered by Quantum Machine Learning',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1640FF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ScrollToTop />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
