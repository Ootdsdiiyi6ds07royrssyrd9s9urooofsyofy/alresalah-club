'use client';

import CourseForm from '@/components/admin/CourseForm';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewCoursePage() {
    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-navy dark:text-gold mb-2">إضافة دورة جديدة</h1>
                    <p className="text-gray-500 dark:text-gray-400">قم بتعبئة بيانات الدورة التدريبية لنشرها في الموقع</p>
                </div>
                <Link
                    href="/admin/dashboard/courses"
                    className="flex items-center gap-2 text-navy hover:text-accent transition font-semibold"
                >
                    <ArrowRight size={20} />
                    <span>العودة للقائمة</span>
                </Link>
            </div>

            <CourseForm />

            <style jsx>{`
                .text-navy { color: var(--color-navy); }
                @media (prefers-color-scheme: dark) {
                    .dark\:text-gold { color: var(--color-gold); }
                }
            `}</style>
        </div>
    );
}
