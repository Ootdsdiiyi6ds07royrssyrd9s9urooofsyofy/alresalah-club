
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Save, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function FillReportPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [template, setTemplate] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadTemplate();
    }, [id]);

    const loadTemplate = async () => {
        const { data, error } = await supabase
            .from('report_templates')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching template:', error);
            setError('فشل تحميل قالب التقرير');
        } else {
            setTemplate(data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const entryData: any = {};

        template.fields.forEach((field: any) => {
            entryData[field.id] = formData.get(field.id);
        });

        try {
            const { error: insertError } = await supabase
                .from('report_entries')
                .insert({
                    template_id: id,
                    data: entryData
                });

            if (insertError) throw insertError;

            setSuccess('تم حفظ إدخال التقرير بنجاح');
            setTimeout(() => {
                router.push(`/admin/dashboard/reports/${id}/entries`);
            }, 1500);

        } catch (err: any) {
            console.error('Error saving entry:', err);
            setError(err.message || 'حدث خطأ أثناء حفظ البيانات');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="loading" style={{ margin: '3rem auto', display: 'block' }}></div>;
    if (!template) return <div className="alert alert-error">التقرير غير موجود</div>;

    return (
        <div className="fade-in max-w-3xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-navy dark:text-gold mb-2">{template.name}</h1>
                    <p className="text-gray-500">{template.description || 'تعبئة بيانات التقرير المخصص'}</p>
                </div>
                <Link href="/admin/dashboard/reports" className="flex items-center gap-2 text-primary font-bold">
                    <ArrowRight size={20} /> العودة
                </Link>
            </div>

            {error && (
                <div className="alert alert-error mb-6 flex items-center gap-2">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-6 flex items-center gap-2">
                    <CheckCircle size={20} /> {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-6">
                {template.fields.map((field: any) => (
                    <div key={field.id} className="form-group">
                        <label className="label font-bold flex items-center gap-1">
                            {field.label}
                            {field.required && <span className="text-error">*</span>}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                name={field.id}
                                required={field.required}
                                className="input"
                                rows={4}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                name={field.id}
                                required={field.required}
                                className="input"
                            >
                                <option value="">اختر من القائمة...</option>
                                {field.options?.split(',').map((opt: string) => (
                                    <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.id}
                                required={field.required}
                                className="input"
                            />
                        )}
                    </div>
                ))}

                <div className="pt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary min-w-[200px] h-14 text-lg"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : (
                            <span className="flex items-center gap-2">
                                <Save size={20} /> حفظ البيانات الآن
                            </span>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
