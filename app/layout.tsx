import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AudioSeparator Pro - AI-Powered Voice & Music Separation",
  description: "Advanced audio and video processing application that separates voice and music tracks using AI technology. Upload any audio or video file and get high-quality separated tracks for download.",
  keywords: "audio separation, voice isolation, music extraction, AI audio processing, stem separation",
  authors: [{ name: "AudioSeparator Pro Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "AudioSeparator Pro - AI-Powered Voice & Music Separation",
    description: "Separate voice and music from any audio or video file using advanced AI technology",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}