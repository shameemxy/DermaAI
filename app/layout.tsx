import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Primary sans-serif font for body UI elements
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Custom "Silver Editorial" font configuration
const silverEditorial = localFont({
  src: [
    {
      path: "../public/fonts/TheSilverEditorial-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/TheSilverEditorial-Italic.woff",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-silver-editorial",
  fallback: ["Playfair Display", "Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "DermaAI | Personalized Skincare Ingredient Scanner",
  description:
    "Advanced AI-powered dermatological analysis for safe and compatible skincare products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${silverEditorial.variable}`}
    >
      <body className="min-h-screen bg-primaryBG text-primaryText antialiased selection:bg-accent selection:text-primaryText">
        {children}
      </body>
    </html>
  );
}