import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Secure Booking | DD Tours & Travels",
    description: "Book your tour with DD Tours & Travels. Secure your adventure today! | DD Tours & Travels | Secure Booking",
};

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}