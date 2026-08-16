import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from '@/components/site/Navbar';
import Footer from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "آرمان انرژی",
  description: "فروش انواع موتور کولر",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-ink-100">{children}</main>
          <Footer />
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
