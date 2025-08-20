const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
});

const nextConfig = withPWA({
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/**',
            },
        ],
    },
});

module.exports = nextConfig;