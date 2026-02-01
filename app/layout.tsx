import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'

export const metadata: Metadata = {
    title: 'Al-Resalah Club | نادي الرسالة',
    description: 'Educational programs and courses for Al-Resalah Club',
    keywords: ['education', 'courses', 'programs', 'Al-Resalah', 'نادي الرسالة'],
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
