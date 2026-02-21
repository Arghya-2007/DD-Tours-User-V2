import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Our Mission & Team",
    description: "Meet the passionate explorers and logistical experts behind DD Tours & Travels. Discover our mission to make travel seamless and secure.",
};

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}