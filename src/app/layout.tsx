import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {Syne, Plus_Jakarta_Sans} from "next/font/google";
import "./globals.css";
import {AuthProvider} from "@/components/providers/AuthProvider";

const inter = Inter({subsets: ["latin"]});

// 1. Configure the Heading Font (Syne)
const syne = Syne({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});

// 2. Configure the Body Font (Plus Jakarta Sans)
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});

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
        <body
            className={`${syne.variable} ${jakarta.variable} font-body antialiased bg-background text-white overflow-x-hidden`}
        >
        <AuthProvider>
            {children}
        </AuthProvider>
        </body>
        </html>
    );
}