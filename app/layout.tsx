import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SummarizeLectures - Master Your Lectures in Seconds with AI",
  description: "Turn any YouTube lecture or video into structured study notes, cheat sheets, and summaries instantly. Powered by Advanced AI. Perfect for students.",
  generator: "Next.js",
  applicationName: "SummarizeLectures",
  keywords: [
    "AI study notes",
    "summarize lecture",
    "video to notes",
    "study cheat sheet",
    "YouTube summarizer",
    "lecture notes",
    "exam preparation",
    "student tools",
    "AI education",
    "AI summarizer",
    "youtube lecture summarizer",
    "AI lecture notes generator",
    "convert youtube to notes",
    "lecture summary AI",
    "online lecture summarizer",
    "AI note taker",
    "youtube video summary",
    "study helper AI",
    "free lecture notes",
    "video transcript to notes"
  ],
  authors: [{ name: "SummarizeLectures Team" }],
  creator: "SummarizeLectures Team",
  metadataBase: new URL("https://summarizelectures.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://summarizelectures.com",
    siteName: "SummarizeLectures",
    title: "SummarizeLectures - Master Your Lectures in Seconds",
    description: "Turn any lecture video into structured study notes and cheat sheets instantly with AI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SummarizeLectures - AI-Powered Lecture Summarization",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SummarizeLectures - Master Your Lectures with AI",
    description: "Turn any lecture video into structured study notes and cheat sheets instantly.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for SEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SummarizeLectures",
            "description": "AI-powered lecture summarization tool for students - Turn YouTube videos into study notes instantly",
            "url": "https://summarizelectures.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            }
          })
        }} />
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9333ea" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SummarizeLectures" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={outfit.className} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        {/* Service Worker Cleanup (Dev Mode) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
