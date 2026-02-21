import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Choose Destinations",
    description: "Choose Destinations and Tours now and Book your tour today!",
};

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}