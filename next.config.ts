/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // For your real uploads
      },
      {
        protocol: 'https',
        hostname: 'example.com',        // 👈 Add this line to fix the error
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Optional: if you use Unsplash
      },
    ],
  },
};

export default nextConfig;