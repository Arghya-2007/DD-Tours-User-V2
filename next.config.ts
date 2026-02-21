/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Image settings
  images: {
  qualities: [50, 60, 70, 75, 80, 85, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        // When your Vercel frontend calls /api/...
        source: '/api/:path*',
        // ...Next.js secretly forwards it to Render, making Chrome think it's a 1st-party request!
        destination: 'https://dd-tours-backend-v2.onrender.com/api/v1/:path*',
      },
    ]
  },
};

export default nextConfig;