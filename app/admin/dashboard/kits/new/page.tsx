
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Package, FileText, Image as ImageIcon, Plus, Save, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NewKitPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [cover, setCover] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;

        try {
            let fileUrl = '';
            let coverUrl = '';

            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { data, error } = await supabase.storage.from('media').upload(`kits/${fileName}`, file);
                if (error) throw error;
                const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(`kits/${fileName}`);
                fileUrl = publicUrlData.publicUrl;
            }

            if (cover) {
                const fileExt = cover.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { data, error } = await supabase.storage.from('media').upload(`covers/${fileName}`, cover);
                if (error) throw error;
                const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(`covers/${fileName}`);
                coverUrl = publicUrlData.publicUrl;
            }

            const { error: insertError } = await supabase.from('educational_kits' as any).insert({
                title,
                description,
                file_url: fileUrl,
                cover_url: coverUrl,
            });


            if (insertError) throw insertError;

            router.push('/admin/dashboard/kits');
            router.refresh();

        } catch (error) {
            console.error('Error creating kit:', error);
            alert('حدث خطأ أثناء إنشاء الحقيبة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-xl)' }}>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-text)' }}>إضافة حقيبة تعليمية جديدة</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>أنشئ حقيبة تعليمية جديدة وشارك الملفات مع الطلاب</p>
                </div>
                <Link href="/admin/dashboard/kits" className="btn btn-secondary">
                    <ArrowRight size={18} /> العودة
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-8">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--spacing-lg)' }}>
                    {/* Title */}
                    <div className="form-group">
                        <label className="label">
                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <Package size={16} /> عنوان الحقيبة
                            </span>
                        </label>
                        <input
                            name="title"
                            required
                            className="input"
                            placeholder="مثال: أساسيات علوم الحاسب"
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="label">الوصف</label>

                        <textarea
                            name="description"
                            rows={4}
                            className="input"
                            placeholder="اكتب وصفاً مختصراً لمحتويات الحقيبة..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                        {/* Cover Image */}
                        <div className="form-group">
                            <label className="label">
                                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    <ImageIcon size={16} /> صورة الغلاف
                                </span>
                            </label>
                            <div style={{
                                border: '2px dashed var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-md)',
                                textAlign: 'center',
                                background: 'var(--color-background)'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCover(e.target.files?.[0] || null)}
                                    style={{ width: '100%' }}
                                />
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                                    JPG, PNG أو WebP (بحد أقصى 2MB)
                                </p>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="form-group">
                            <label className="label">
                                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                    <FileText size={16} /> ملف الحقيبة (PDF)
                                </span>
                            </label>
                            <div style={{
                                border: '2px dashed var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--spacing-md)',
                                textAlign: 'center',
                                background: 'var(--color-background)'
                            }}>
                                <input
                                    type="file"
                                    required
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    style={{ width: '100%' }}
                                />
                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                                    PDF, DOCX أو ZIP
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-lg)' }}>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '150px' }}>
                        {loading ? <span className="loading"></span> : (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                                <Save size={18} /> حفظ الحقيبة
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

