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
        {/* Canonical URL */}
        <link rel="canonical" href="https://summarizelectures.com" />

        {/* Additional SEO Meta Tags */}
        <meta name="google-site-verification" content="" />
        <meta name="msvalidate.01" content="" />
        <meta name="yandex-verification" content="" />
        <meta name="format-detection" content="telephone=no" />

        {/* JSON-LD: WebApplication Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "SummarizeLectures",
            "description": "AI-powered lecture summarization tool for students - Turn YouTube videos into study notes instantly",
            "url": "https://summarizelectures.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "browserRequirements": "Requires JavaScript. Requires HTML5.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            },
            "creator": {
              "@type": "Organization",
              "name": "SummarizeLectures",
              "url": "https://summarizelectures.com"
            }
          })
        }} />

        {/* JSON-LD: Organization Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SummarizeLectures",
            "url": "https://summarizelectures.com",
            "logo": "https://summarizelectures.com/icon-512.png",
            "sameAs": [],
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "support@summarizelectures.com",
              "contactType": "customer service"
            }
          })
        }} />

        {/* JSON-LD: FAQ Schema for Rich Snippets */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How does SummarizeLectures work?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply paste a YouTube video URL or upload a lecture file, and our AI will generate comprehensive study notes, summaries, flashcards, or quizzes in seconds."
                }
              },
              {
                "@type": "Question",
                "name": "Is SummarizeLectures free to use?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We offer a free tier with limited usage. Pro and Premium plans provide additional credits and features for power users."
                }
              },
              {
                "@type": "Question",
                "name": "What types of videos can I summarize?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can summarize any YouTube video including lectures, tutorials, podcasts, and educational content. We also support direct file uploads for audio and video files."
                }
              },
              {
                "@type": "Question",
                "name": "How accurate are the AI-generated summaries?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our AI uses Google's Gemini technology to provide highly accurate summaries. The AI understands context, identifies key points, and structures information for easy studying."
                }
              }
            ]
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
