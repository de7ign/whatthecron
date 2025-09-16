import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';

import { ThemeProvider } from '@/components/theme-provider';

import { baseUrl } from './sitemap';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WhatTheCron – Understand your CRON expressions instantly',
  description:
    'WhatTheCron is an open-source tool that helps developers understand CRON expressions with ease. Translate, validate, and visualize your CRON schedules instantly.',
  metadataBase: new URL(baseUrl),
  keywords: [
    'cron expression',
    'cron parser',
    'cron schedule',
    'cron job',
    'crontab',
    'what the cron',
    'developer tools',
    'open source cron tool',
  ],
  authors: [{ name: 'WhatTheCron', url: baseUrl }],
  creator: 'WhatTheCron',
  openGraph: {
    title: 'WhatTheCron – Understand your CRON expressions instantly',
    description:
      'Translate, validate, and visualize your CRON schedules instantly. Open-source developer tool.',
    url: baseUrl,
    siteName: 'WhatTheCron',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WhatTheCron – Understand your CRON expressions instantly',
    description:
      'An open-source tool for developers to easily understand and validate CRON expressions.',
    creator: '@dzndev',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    // apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-Y6B6YQ8MM8" />
    </html>
  );
}
