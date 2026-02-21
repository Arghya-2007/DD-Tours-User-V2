import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Our Travel Diaries",
    description: "Read our latest travel story by our customers. Get the best experience.",
};

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}