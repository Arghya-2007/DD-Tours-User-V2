import type {Metadata} from "next";
import {api} from "@/lib/axios";
import React from "react";

// 1. Define the props. Notice how params is a Promise!
type LayoutProps = {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
};

// 2. The metadata generator MUST be written exactly like this:
export async function generateMetadata({params}: LayoutProps): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams.slug;

        const {data} = await api.get(`/tours/${slug}`);
        const tour = data?.data;

        if (!tour) throw new Error("Tour not found");

        return {
            title: `${tour.tourTitle} Expedition | DD Tours`,
            description: tour.description?.substring(0, 160) + "...",
            openGraph: {
                title: `${tour.tourTitle} | DD Tours`,
                images: [{url: tour.images?.[0] || "/placeholder-travel.jpg"}],
            },
        };
    } catch (error) {
        return {
            title: "Tour Details | DD Tours",
        };
    }
}

// 3. The actual layout wrapper component
export default function TourLayout({children}: LayoutProps) {
    return <>{children}</>;
}