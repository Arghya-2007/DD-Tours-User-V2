import type {Metadata} from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Make Payment",
    description: "Payment | Make your payment now for confirm your seat and get the best experience.",
};

export default function AboutLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}