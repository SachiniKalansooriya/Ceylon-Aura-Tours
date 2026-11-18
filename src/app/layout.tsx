import type { Metadata } from "next";
import type { Viewport } from "next";
import "./globals.css";
import { siteName, siteUrl, defaultShareImage } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#0a1628",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Private Tours & Travel in Sri Lanka`,
    template: `%s | ${siteName}`,
  },
  description:
    "Discover Sri Lanka with private, customizable tour packages. Visit Sigiriya, Kandy, Ella, Galle and more. Plan your dream trip on WhatsApp.",
  keywords: [
    "Sri Lanka tours",
    "Sri Lanka travel",
    "private tours Sri Lanka",
    "Sri Lanka holiday packages",
    "Sigiriya tours",
    "Kandy tours",
    "Ella tours",
    "Sri Lanka tour packages",
  ],
  applicationName: siteName,
  category: "travel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | Private Tours & Travel in Sri Lanka`,
    description:
      "Discover Sri Lanka with private, customizable tour packages. Plan your dream trip today.",
    images: [{ url: defaultShareImage, alt: `${siteName} — Sri Lanka tours` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Private Tours in Sri Lanka`,
    description:
      "Private, customizable Sri Lanka tours. Sigiriya, Kandy, Ella, Galle and more.",
    images: [defaultShareImage],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
