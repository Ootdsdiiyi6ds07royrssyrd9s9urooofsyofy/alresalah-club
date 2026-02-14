
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Plus, FileBarChart, ClipboardList, Trash2, Edit, ChevronLeft, Layout, Table } from 'lucide-react';
import Link from 'next/link';

export default function ReportsAdminPage() {
    const supabase = createClient();
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        const { data, error } = await supabase
            .from('report_templates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching report templates:', error);
        } else {
            setTemplates(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`هل أنت متأكد من حذف قالب التقرير "${name}"؟ سيؤدي ذلك لحذف جميع البيانات المدخلة فيه أيضاً!`)) return;

        const { error } = await supabase.from('report_templates').delete().eq('id', id);
        if (error) {
            alert('فشل الحذف: ' + error.message);
        } else {
            loadTemplates();
        }
    };

    if (loading) return <div className="loading" style={{ margin: '3rem auto', display: 'block' }}></div>;

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-navy dark:text-gold mb-2">نظام التقارير المخصصة</h1>
                    <p className="text-gray-500">قم ببناء القوالب وجمع البيانات وتحليلها بسهولة</p>
                </div>
                <Link href="/admin/dashboard/reports/new" className="btn btn-primary">
                    <Plus size={20} /> إنشاء قالب تقرير جديد
                </Link>
            </div>

            {templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="card-elevated border-t-4 border-primary">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-navy/5 rounded-2xl text-primary">
                                            <FileBarChart size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-navy dark:text-white">{tpl.name}</h3>
                                            <span className="text-xs text-gray-400">عدد الحقول: {tpl.fields?.length || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/dashboard/reports/${tpl.id}/edit`} className="p-2 hover:bg-surface rounded-lg transition" title="تعديل الهيكل">
                                            <Layout size={18} />
                                        </Link>
                                        <button onClick={() => handleDelete(tpl.id, tpl.name)} className="p-2 hover:bg-error/10 text-error rounded-lg transition" title="حذف">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mb-8 h-10 line-clamp-2">
                                    {tpl.description || 'لا يوجد وصف متاح لهذا التقرير.'}
                                </p>

                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                                    <Link href={`/admin/dashboard/reports/${tpl.id}/fill`} className="btn btn-accent flex items-center justify-center gap-2 py-3 rounded-xl font-bold">
                                        <Plus size={18} /> إضافة إدخال
                                    </Link>
                                    <Link href={`/admin/dashboard/reports/${tpl.id}/entries`} className="btn btn-secondary flex items-center justify-center gap-2 py-3 rounded-xl font-bold">
                                        <Table size={18} /> عرض البيانات
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-20 border-2 border-dashed border-gray-200">
                    <ClipboardList size={64} className="mx-auto text-gray-200 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-400">لا توجد قوالب تقارير حالياً</h2>
                    <p className="text-gray-400 mt-2 mb-8">ابدأ بتصميم أول تقرير مخصص لناديك الآن</p>
                    <Link href="/admin/dashboard/reports/new" className="btn btn-primary px-10">
                        إنشاء أول قالب
                    </Link>
                </div>
            )}

            <style jsx>{`
                .text-navy { color: var(--color-navy); }
                @media (prefers-color-scheme: dark) {
                    .dark\:text-gold { color: var(--color-gold); }
                }
            `}</style>
        </div>
    );
}
