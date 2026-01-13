/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',    
    turbopack: {},

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
