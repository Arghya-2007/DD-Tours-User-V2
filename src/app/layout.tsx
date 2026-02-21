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
    metadataBase: new URL("https://ddtours.in"), // Replace with your actual domain
    title: {
        default: "DD Tours & Travels | Immersive Off-Beat Journeys",
        template: "%s | DD Tours & Travels",
    },
    description: "Experience the world's most breathtaking, safe, and unforgettable travel experiences. From the Spiti Valley to the Kashmir Great Lakes, we handle the logistics so you can live the adventure.",
    keywords: [
        "Travel Agency in West Bengal",
        "DD Tours Ranaghat",
        "Off-beat India Tours",
        "Spiti Valley Expedition",
        "Kashmir Tour Packages",
        "Varanasi Travel Guide",
        "Secure Trip Booking"
    ],
    authors: [{ name: "DD Tours Team" }],
    creator: "DD Tours & Travels",
    openGraph: {
        type: "website",
        locale: "en_IN",
        url: "https://ddtours.in",
        siteName: "DD Tours & Travels",
        title: "DD Tours & Travels | Immersive Off-Beat Journeys",
        description: "Experience the world's most breathtaking, safe, and unforgettable travel experiences. Pack your bags, we have the rest covered.",
        images: [
            {
                url: "/images/hero-1.webp", // Replace with your best cinematic hero image
                width: 1200,
                height: 630,
                alt: "DD Tours Cinematic Travel",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "DD Tours & Travels",
        description: "Immersive, off-beat, and unforgettable journeys across India.",
        images: ["/images/hero-1.webp"],
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