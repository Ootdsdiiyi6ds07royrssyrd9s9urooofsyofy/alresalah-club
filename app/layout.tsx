import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/Header'
import GlobalLoading from '@/components/GlobalLoading'
import SessionMonitor from '@/components/SessionMonitor'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
    themeColor: '#1a3a52',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
}

export const metadata: Metadata = {
    title: 'نادي الرسالة التعليمي | الرائد في التدريب والتعليم المهارى',
    description: 'الموقع الرسمي لنادي الرسالة التعليمي. بوابتك الأولى للتميز والإبداع من خلال دورات تدريبية احترافية وبرامج تطويرية شاملة. سجل الآن في أحدث البرامج واكتسب مهارات المستقبل.',
    keywords: [
        'نادي الرسالة التعليمي',
        'نادي الرسالة',
        'موقع نادي الرسالة',
        'التسجيل في نادي الرسالة',
        'دورات نادي الرسالة',
        'الرسالة التعليمي',
        'منصة الرسالة',
        'Al-Resalah Club',
        'Al Resalah Club',
        'Al-Resalah Education',
        'تعليم إلكتروني',
        'دورات أونلاين',
        'منصة تعليمية',
        'تطوير المهارات',
        'التعلم المستمر',
        'دورات معتمدة',
        'مهارات المستقبل',
        'تدريب',
        'طلاب',
        'تعليم',
    ],
    authors: [{ name: 'نادي الرسالة التعليمي' }],
    creator: 'نادي الرسالة التعليمي',
    publisher: 'نادي الرسالة التعليمي',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'ar_SA',
        url: 'https://alresalah.club',
        siteName: 'نادي الرسالة التعليمي',
        title: 'نادي الرسالة التعليمي | الرائد في التدريب والتعليم المهارى',
        description: 'الموقع الرسمي لنادي الرسالة التعليمي. احصل على أفضل الدورات التدريبية والبرامج التعليمية لتطوير مهاراتك.',
        images: [
            {
                url: '/logo.png',
                width: 1200,
                height: 630,
                alt: 'نادي الرسالة التعليمي',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'نادي الرسالة التعليمي',
        description: 'منصة تعليمية متميزة تقدم دورات وبرامج تدريبية متخصصة',
        images: ['/logo.png'],
    },
    verification: {
        // يمكنك إضافة رموز التحقق من Google و Bing هنا لاحقاً
        // google: 'your-google-verification-code',
        // bing: 'your-bing-verification-code',
    },
    alternates: {
        canonical: 'https://alresalah.club',
    },
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'نادي الرسالة',
    },
    formatDetection: {
        telephone: false,
    },
    icons: {
        shortcut: '/pwa-icon.png',
        apple: '/pwa-icon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" dir="rtl" style={{ height: '100dvh', overflowX: 'hidden' }}>
            <body style={{ minHeight: '100dvh', margin: 0, padding: 0 }}>
                <Suspense fallback={null}>
                    <GlobalLoading />
                </Suspense>
                <SessionMonitor />
                <Header />
                <main style={{ minHeight: 'calc(100dvh - 80px)' }}>
                    {children}
                </main>
            </body>
        </html>
    )
}
