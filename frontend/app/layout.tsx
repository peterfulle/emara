'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart/CartContext";
import { UserProvider } from "@/lib/auth/UserContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {isAdminRoute ? (
          // Admin routes: sin Header ni Footer
          children
        ) : (
          // Public routes: con Header y Footer
          <UserProvider>
            <CartProvider>
              <Header />
              {children}
              <Footer />
            </CartProvider>
          </UserProvider>
        )}
      </body>
    </html>
  );
}
