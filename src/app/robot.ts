import {MetadataRoute} from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*', // '*' means ALL search engines are allowed
            allow: '/',     // Allow them to scan the entire public site
            disallow: [
                '/api/',      // Keep bots out of your backend routes
                '/profile/',  // Keep bots out of private user dashboards
            ],
        },
        // This is the most important part: Pointing bots directly to your blueprint!
        sitemap: 'https://ddtours.in/sitemap.xml',
    };
}