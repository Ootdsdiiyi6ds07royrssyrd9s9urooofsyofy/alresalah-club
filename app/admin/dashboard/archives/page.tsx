
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Plus, Search, Archive, Trash2, Edit, ExternalLink, Lock, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ArchivesAdminPage() {
    const supabase = createClient();
    const [archives, setArchives] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadArchives();
    }, []);

    const loadArchives = async () => {
        const { data, error } = await supabase
            .from('archives')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching archives:', error);
        } else {
            setArchives(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`هل أنت متأكد من حذف الأرشيف "${title}"؟`)) return;

        const { error } = await supabase.from('archives').delete().eq('id', id);
        if (error) {
            alert('فشل الحذف: ' + error.message);
        } else {
            loadArchives();
        }
    };

    const filteredArchives = archives.filter(a =>
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.access_code.includes(searchTerm)
    );

    if (loading) return <div className="loading" style={{ margin: '3rem auto', display: 'block' }}></div>;

    return (
        <div className="fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-navy dark:text-gold mb-2">إدارة الأرشيف المحمي</h1>
                    <p className="text-gray-500">قم بإدارة المحتوى الخاص المحمي برموز سرية</p>
                </div>
                <Link href="/admin/dashboard/archives/new" className="btn btn-primary">
                    <Plus size={20} /> إضافة أرشيف جديد
                </Link>
            </div>

            <div className="mb-8 relative">
                <Search className="absolute right-4 top-3.5 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="بحث بالعنوان أو الكود السري..."
                    className="input pr-12 h-14 text-lg bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredArchives.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArchives.map((ark) => (
                        <div key={ark.id} className="card-elevated group relative overflow-hidden">
                            {!ark.is_active && (
                                <div className="absolute top-2 right-2 z-10 bg-error/10 text-error p-1 rounded-full" title="غير نشط">
                                    <EyeOff size={16} />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-navy/5 dark:bg-gold/10 rounded-xl text-primary">
                                        <Archive size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold truncate">{ark.title}</h3>
                                </div>

                                <p className="text-sm text-gray-500 mb-6 line-clamp-2 h-10">
                                    {ark.description || 'لا يوجد وصف متاح'}
                                </p>

                                <div className="bg-surface rounded-xl p-4 mb-6 flex items-center justify-between border border-dashed border-accent/30">
                                    <div className="flex items-center gap-2 text-accent">
                                        <Lock size={16} />
                                        <span className="text-xs font-bold uppercase">كود الوصول</span>
                                    </div>
                                    <span className="text-xl font-black tracking-widest text-navy dark:text-gold">
                                        {ark.access_code}
                                    </span>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-border">
                                    <Link href={`/admin/dashboard/archives/${ark.id}/edit`} className="btn btn-secondary flex-1 py-2">
                                        <Edit size={16} /> تعديل
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(ark.id, ark.title)}
                                        className="btn bg-error/10 text-error hover:bg-error hover:text-white px-3 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card text-center py-16">
                    <Archive size={64} className="mx-auto text-gray-300 mb-4" />
                    <h2 className="text-xl font-bold text-gray-400">لا توجد أرشيفات تطابق بحثك</h2>
                    <p className="text-gray-400 mt-2">ابدأ بإضافة أرشيفك الأول الآن</p>
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
