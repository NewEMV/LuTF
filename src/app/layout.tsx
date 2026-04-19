import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CookieConsent } from '@/components/cookie-consent';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

// ID do Google Analytics 4 — configure em .env.local: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const metadata: Metadata = {
  title: "Luciana Telles Ferri | Psicologia",
  description: "Psicóloga dedicada a transformar momentos de transição em processos de suporte e cuidado humanizado.",
  verification: {
    google: "463thUJEFIyYdS8yeWmLbuVPc63EkKh0XarHP8AJ39I",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Allison&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased flex flex-col min-h-screen" suppressHydrationWarning>
        {/* Google Analytics 4 — só carrega se GA_ID estiver configurado */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow flex flex-col">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
