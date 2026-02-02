import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'نادي الرسالة التعليمي - دورات وبرامج تعليمية متميزة',
    description: 'نادي الرسالة - منصة تعليمية رقمية متكاملة تقدم دورات وبرامج تدريبية متخصصة لتطوير المهارات وتعزيز التعلم المستمر في بيئة تعليمية احترافية',
    keywords: [
        'نادي الرسالة',
        'نادي الرساله',
        'Al Resalah Club',
        'دورات تعليمية',
        'برامج تدريبية',
        'تعليم إلكتروني',
        'دورات أونلاين',
        'منصة تعليمية',
        'تطوير المهارات',
        'التعلم المستمر',
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
        title: 'نادي الرسالة التعليمي - منصة تعليمية رقمية متكاملة',
        description: 'منصة تعليمية متميزة تقدم دورات وبرامج تدريبية متخصصة لتطوير المهارات والتعلم المستمر',
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
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" dir="rtl">
            <body>
                <Header />
                {children}
            </body>
        </html>
    )
}
