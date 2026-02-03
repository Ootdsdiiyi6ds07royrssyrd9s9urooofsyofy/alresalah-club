import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'نادي الرسالة التعليمي',
        short_name: 'نادي الرسالة',
        description: 'الموقع الرسمي لنادي الرسالة التعليمي. بوابتك الأولى للتميز والإبداع.',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a3a52',
        theme_color: '#1a3a52',
        icons: [
            {
                src: '/pwa-icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/pwa-icon.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    }
}
