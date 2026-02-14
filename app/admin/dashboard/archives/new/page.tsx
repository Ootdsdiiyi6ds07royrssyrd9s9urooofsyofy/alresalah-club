'use client';

import ArchiveForm from '@/components/admin/ArchiveForm';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewArchivePage() {
    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-navy dark:text-gold mb-2">إنشاء أرشيف محمي</h1>
                    <p className="text-gray-500">قم بإضافة محتوى جديد وتعيين كود الوصول الخاص به</p>
                </div>
                <Link
                    href="/admin/dashboard/archives"
                    className="flex items-center gap-2 text-navy hover:text-accent transition font-semibold"
                >
                    <ArrowRight size={20} />
                    <span>العودة للقائمة</span>
                </Link>
            </div>

            <ArchiveForm />

            <style jsx>{`
                .text-navy { color: var(--color-navy); }
                @media (prefers-color-scheme: dark) {
                    .dark\:text-gold { color: var(--color-gold); }
                }
            `}</style>
        </div>
    );
}
