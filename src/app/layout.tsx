import type { Metadata } from "next";
import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Ceylon Paradise Tours";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} | Private Tours & Travel in Sri Lanka`,
    description:
      "Discover Sri Lanka with private, customizable tour packages. Plan your dream trip today.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Private Tours in Sri Lanka`,
    description:
      "Private, customizable Sri Lanka tours. Sigiriya, Kandy, Ella, Galle and more.",
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
      <body>{children}</body>
    </html>
  );
}
