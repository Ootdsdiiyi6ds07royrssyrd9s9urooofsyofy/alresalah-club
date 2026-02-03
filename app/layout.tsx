import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import GlobalLoading from '@/components/GlobalLoading'
import { Suspense } from 'react'

export const dynamic = 'force-dynamic'

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
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ar" dir="rtl">
            <body>
                <Suspense fallback={null}>
                    <GlobalLoading />
                </Suspense>
                <Header />
                {children}
            </body>
        </html>
    )
}
