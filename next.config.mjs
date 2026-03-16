/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    turbopack: {},

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                ],
            },
        ];
    },

    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.optimization.splitChunks = {
                ...config.optimization.splitChunks,
                cacheGroups: {
                    ...config.optimization.splitChunks.cacheGroups,
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        priority: 10,
                        chunks: 'all',
                    },
                    react: {
                        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
                        name: 'react',
                        priority: 20,
                        chunks: 'all',
                    },
                    ui: {
                        test: /[\\/]node_modules[\\/](@headlessui|react-icons)[\\/]/,
                        name: 'ui',
                        priority: 15,
                        chunks: 'all',
                    },
                    data: {
                        test: /[\\/]node_modules[\\/](@tanstack|axios|zustand)[\\/]/,
                        name: 'data',
                        priority: 15,
                        chunks: 'all',
                    },
                },
            };
        }
        return config;
    },
    images: {
        formats: ['image/webp', 'image/avif'],
        unoptimized: false,
    },
    trailingSlash: false,
    compress: true,
};

export default nextConfig;
