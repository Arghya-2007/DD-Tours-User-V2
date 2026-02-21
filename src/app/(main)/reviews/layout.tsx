import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Wall of Love",
    description: "Read our latest travel story by our customers.",
};

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}