import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    /* config options here */
    images: {
        remotePatterns: [
        {
            protocol: 'https',
            hostname: 'firebasestorage.googleapis.com',
            pathname: '/**',
        },
        ],
    },
};

export default nextConfig;
