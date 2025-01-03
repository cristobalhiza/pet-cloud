import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.ibb.co',
      'images.unsplash.com',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'cdn.example.com',
      'firebasestorage.googleapis.com',
      'drive.google.com',
      'png.pngtree.com',
    ],
  },
};

export default nextConfig;
