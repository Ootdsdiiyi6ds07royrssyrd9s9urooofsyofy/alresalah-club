
'use client';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import { Search, Lock, Archive, ArrowLeft, FileText, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PublicArchivePage() {
    const supabase = createClient();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [archive, setArchive] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code) return;

        setLoading(true);
        setError('');
        setArchive(null);

        try {
            const { data, error: fetchError } = await supabase
                .from('archives')
                .select('*')
                .eq('access_code', code)
                .eq('is_active', true)
                .single();

            if (fetchError || !data) {
                setError('عذراً، كود الأرشيف غير صحيح أو منتهي الصلاحية');
            } else {
                setArchive(data);
            }
        } catch (err) {
            setError('حدث خطأ أثناء البحث. يرجى المحاولة لاحقاً');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4 rtl" dir="rtl">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-flex p-4 bg-navy/5 dark:bg-gold/10 rounded-3xl text-primary mb-6">
                        <Archive size={48} />
                    </div>
                    <h1 className="text-4xl font-black text-navy dark:text-gold mb-4">أرشيف نادي الرسالة</h1>
                    <p className="text-gray-500 text-lg">أدخل كود الأرشيف المكون من 6 أرقام للوصول إلى المحتوى الخاص</p>
                </div>

                {!archive ? (
                    <div className="card-elevated p-8 md:p-12 text-center">
                        <form onSubmit={handleSearch} className="max-w-md mx-auto">
                            <div className="relative mb-6">
                                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-accent" size={24} />
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="أدخل كود الأرشيف هنا..."
                                    className="input pr-14 h-16 text-2xl tracking-[0.5em] text-center font-black bg-surface border-2 border-border focus:border-accent"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="alert alert-error mb-6 py-3 text-sm flex items-center justify-center gap-2">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || code.length < 1}
                                className="btn btn-primary w-full h-16 text-xl font-bold rounded-2xl"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'استخراج الأرشيف'}
                            </button>
                        </form>

                        <div className="mt-12 pt-8 border-t border-border">
                            <Link href="/" className="text-navy hover:text-accent font-semibold transition flex items-center justify-center gap-2">
                                <ArrowLeft size={18} /> العودة للرئيسية
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="fade-in space-y-6">
                        <div className="card-elevated p-8 border-r-8 border-accent">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <span className="badge badge-accent mb-3">نم العثور على الأرشيف</span>
                                    <h2 className="text-3xl font-black text-navy dark:text-gold">{archive.title}</h2>
                                </div>
                                <button
                                    onClick={() => setArchive(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                            </div>

                            {archive.description && (
                                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                    {archive.description}
                                </p>
                            )}

                            <div className="bg-surface p-6 rounded-2xl border border-border">
                                <h4 className="font-bold text-navy dark:text-gold mb-4 flex items-center gap-2">
                                    <FileText size={18} /> المحتوى:
                                </h4>
                                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-relaxed font-mono text-sm sm:text-base">
                                    {archive.content || 'لا يوجد نص متاح'}
                                </div>

                                {archive.file_url && (
                                    <div className="mt-8 pt-6 border-t border-border">
                                        <a
                                            href={archive.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-accent w-full py-4 text-lg font-bold"
                                        >
                                            <ExternalLink size={20} /> فتح الرابط / الملف الملحق
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => {
                                    setArchive(null);
                                    setCode('');
                                }}
                                className="text-gray-500 hover:text-navy transition underline"
                            >
                                البحث عن أرشيف آخر
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .text-navy { color: var(--color-navy); }
                @media (prefers-color-scheme: dark) {
                    .dark\:text-gold { color: var(--color-gold); }
                }
            `}</style>
        </div>
    );
}
