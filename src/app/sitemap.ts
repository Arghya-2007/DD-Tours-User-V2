import { MetadataRoute } from 'next';
import { api } from "@/lib/axios";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://ddtours.in";

    // 1. Base Static Routes
    const staticRoutes = [
        "",
        "/about",
        "/tours",
        "/blogs",
        "/reviews",
        "/profile",
        "/terms",
        "/privacy",
        "/cookies",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === "" ? 1 : 0.8,
    }));

    try {
        // 2. Dynamic Tour Routes
        // (Assuming you have an endpoint that returns all tours)
        const { data: tourData } = await api.get("/tours");
        const tours = tourData.data || [];

        const dynamicTours = tours.map((tour: any) => ({
            url: `${baseUrl}/tours/${tour.slug}`,
            lastModified: new Date(tour.updatedAt || new Date()),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        }));

        return [...staticRoutes, ...dynamicTours];
    } catch (error) {
        console.error("Sitemap generation failed to fetch tours:", error);
        return staticRoutes;
    }
}