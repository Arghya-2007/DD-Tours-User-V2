import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DD Tours & Travels",
  description: "Experience the world with DD Tours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-white overflow-x-hidden`}>
        {/* We keep AuthProvider here so it works EVERYWHERE (even on Login) */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}