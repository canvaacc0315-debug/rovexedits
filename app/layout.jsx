import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';

export const metadata = {
  title: "RovexEdits — Premium Valorant Edits",
  description: "The most trusted marketplace for high-quality Valorant inventory designs.",
  manifest: "/manifest.json",
  themeColor: "#06060a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "RovexEdits" },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-scroll-behavior="smooth">
        <head>
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <link rel="apple-touch-icon" href="/logo.png" />
        </head>
        <body>
          <ScrollProgress />
          <Navbar />
          <main style={{ minHeight: '100vh' }}>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
