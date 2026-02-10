
'use client';

import { createClient } from '@/lib/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileText, ArrowRight, Download, Search, Layout, Database } from 'lucide-react';
import Link from 'next/link';

export default function ReportEntriesPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [template, setTemplate] = useState<any>(null);
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        // Fetch Template
        const { data: tplData } = await supabase
            .from('report_templates')
            .select('*')
            .eq('id', id)
            .single();

        // Fetch Entries
        const { data: entData } = await supabase
            .from('report_entries')
            .select('*')
            .eq('template_id', id)
            .order('created_at', { ascending: false });

        setTemplate(tplData);
        setEntries(entData || []);
        setLoading(false);
    };

    const handleExport = () => {
        if (!entries.length) return;

        // Simple CSV export
        const headers = template.fields.map((f: any) => f.label).join(',');
        const rows = entries.map(ent =>
            template.fields.map((f: any) => `"${ent.data[f.id] || ''}"`).join(',')
        ).join('\n');

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers + "\n" + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${template.name}_${new Date().toLocaleDateString()}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    if (loading) return <div className="loading" style={{ margin: '3rem auto', display: 'block' }}></div>;
    if (!template) return <div className="alert alert-error">التقرير غير موجود</div>;

    return (
        <div className="fade-in max-w-6xl mx-auto py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-navy dark:text-gold mb-2">{template.name} - البيانات المسجلة</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1"><Database size={14} /> إجمالي الإدخالات: {entries.length}</span>
                        <span className="flex items-center gap-1"><Layout size={14} /> القالب: {template.fields.length} حقول</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="btn btn-secondary">
                        <Download size={18} /> تصدير CSV
                    </button>
                    <Link href={`/admin/dashboard/reports/${id}/fill`} className="btn btn-primary">
                        إضافة إدخال يدوي
                    </Link>
                </div>
            </div>

            <div className="card-elevated overflow-hidden">
                <div className="p-4 bg-surface border-b border-border flex items-center gap-4">
                    <Search className="text-gray-400" size={20} />
                    <input
                        placeholder="بحث في البيانات..."
                        className="bg-transparent border-none focus:outline-none w-full text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                        <thead>
                            <tr className="bg-navy text-white">
                                <th className="p-4 font-bold border-b border-navy-light text-sm">تاريخ الإدخال</th>
                                {template.fields.map((field: any) => (
                                    <th key={field.id} className="p-4 font-bold border-b border-navy-light text-sm">
                                        {field.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {entries.length > 0 ? (
                                entries.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-border">
                                        <td className="p-4 text-xs text-gray-400 font-mono">
                                            {new Date(entry.created_at).toLocaleString('ar-SA')}
                                        </td>
                                        {template.fields.map((field: any) => (
                                            <td key={field.id} className="p-4 text-sm font-medium">
                                                {entry.data[field.id] || '-'}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={template.fields.length + 1} className="p-12 text-center text-gray-300 italic">
                                        لم يتم تسجيل أي بيانات لهذا التقرير بعد
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <Link href="/admin/dashboard/reports" className="text-gray-500 flex items-center gap-2 hover:text-navy transition">
                    <ArrowRight size={18} /> العودة لقائمة التقارير
                </Link>
            </div>

            <style jsx>{`
                th, td { min-width: 150px; }
            `}</style>
        </div>
    );
}
