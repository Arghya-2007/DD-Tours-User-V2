import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Profile",
    description: "Profile | DD Tours & Travels | Update your profile and get the best experience.",
};

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}