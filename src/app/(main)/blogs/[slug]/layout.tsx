import type {Metadata} from "next";
import {api} from "@/lib/axios";
import React from "react";

// 1. Define the props for Next.js 15+ (params is a Promise)
type LayoutProps = {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
};

// 2. Generate the dynamic SEO metadata
export async function generateMetadata({params}: LayoutProps): Promise<Metadata> {
    try {
        const resolvedParams = await params;
        const slug = resolvedParams.slug;

        // Fetch the specific blog post data
        const {data} = await api.get(`/blogs/${slug}`);
        const blog = data?.data;

        if (!blog) throw new Error("Blog not found");

        return {
            title: `${blog.title} | DD Tours Travel Diaries`,
            description: blog.excerpt?.substring(0, 160) || "Read firsthand experiences and destination guides from our completed tours.",
            openGraph: {
                title: blog.title,
                description: blog.excerpt || "Read our latest travel story.",
                images: [{url: blog.coverImage || "/placeholder-travel.jpg"}],
                type: "article",
            },
            twitter: {
                card: "summary_large_image",
                title: blog.title,
                description: blog.excerpt,
                images: [blog.coverImage || "/placeholder-travel.jpg"],
            },
        };
    } catch (error) {
        // Fallback if the blog isn't found
        return {
            title: "Travel Story | DD Tours & Travels",
        };
    }
}

// 3. The layout wrapper component
export default function BlogLayout({children}: LayoutProps) {
    return <>{children}</>;
}