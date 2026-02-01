/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
        ],
    },
    typescript: {
        ignoreBuildErrors: true, // يتجاهل أخطاء التايب سكريبت
    },
    eslint: {
        ignoreDuringBuilds: true, // يتجاهل أخطاء التنسيق
    },
}

module.exports = nextConfig
