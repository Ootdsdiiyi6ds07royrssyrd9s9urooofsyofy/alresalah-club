'use client';

import ReportBuilder from '@/components/admin/ReportBuilder';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewReportTemplatePage() {
    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-navy dark:text-gold mb-2">تصميم قالب تقرير جديد</h1>
                    <p className="text-gray-500">قم بتعريف الحقول والبيانات التي تريد جمعها في هذا التقرير</p>
                </div>
                <Link
                    href="/admin/dashboard/reports"
                    className="flex items-center gap-2 text-navy hover:text-accent transition font-semibold"
                >
                    <ArrowRight size={20} />
                    <span>العودة للقائمة</span>
                </Link>
            </div>

            <ReportBuilder />

            <style jsx>{`
                .text-navy { color: var(--color-navy); }
                @media (prefers-color-scheme: dark) {
                    .dark\:text-gold { color: var(--color-gold); }
                }
            `}</style>
        </div>
    );
}
