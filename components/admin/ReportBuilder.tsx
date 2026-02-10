
'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, Trash2, Save, Settings, Type, List, Calendar, Hash, AlertCircle, CheckCircle, Loader2, GripVertical } from 'lucide-react';
import Link from 'next/link';

interface Field {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'date' | 'select';
    required: boolean;
    options?: string; // For select type
}

interface ReportBuilderProps {
    initialData?: any;
    isEdit?: boolean;
}

export default function ReportBuilder({ initialData, isEdit = false }: ReportBuilderProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [fields, setFields] = useState<Field[]>(initialData?.fields || [
        { id: 'f1', label: 'الاسم', type: 'text', required: true }
    ]);

    const addField = () => {
        const newField: Field = {
            id: 'f' + Date.now(),
            label: '',
            type: 'text',
            required: false
        };
        setFields([...fields, newField]);
    };

    const removeField = (id: string) => {
        if (fields.length > 1) {
            setFields(fields.filter(f => f.id !== id));
        }
    };

    const updateField = (id: string, updates: Partial<Field>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            setError('يرجى إدخال اسم التقرير');
            return;
        }

        const invalidField = fields.find(f => !f.label.trim());
        if (invalidField) {
            setError('يرجى تعبئة جميع عناوين الحقول');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const data = {
            name,
            description,
            fields,
            is_active: true
        };

        try {
            let resultError;
            if (isEdit) {
                const { error } = await supabase.from('report_templates').update(data).eq('id', initialData.id);
                resultError = error;
            } else {
                const { error } = await supabase.from('report_templates').insert(data);
                resultError = error;
            }

            if (resultError) throw resultError;

            setSuccess('تم حفظ هيكل التقرير بنجاح');
            setTimeout(() => {
                router.push('/admin/dashboard/reports');
                router.refresh();
            }, 1500);

        } catch (err: any) {
            console.error('Error saving report template:', err);
            setError(err.message || 'حدث خطأ أثناء الحفظ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in max-w-5xl mx-auto">
            {error && (
                <div className="alert alert-error mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success mb-6 flex items-center gap-2">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Metadata */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card-elevated p-6">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Settings size={18} /> هوية التقرير
                        </h3>
                        <div className="form-group">
                            <label className="label">اسم التقرير</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input"
                                placeholder="مثال: تقرير المتطوعين اليومي"
                                required
                            />
                        </div>
                        <div className="form-group mb-0">
                            <label className="label">وصف التقرير</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="input"
                                rows={3}
                                placeholder="ما هو الهدف من هذا التقرير؟"
                            />
                        </div>
                    </div>

                    <div className="card-elevated p-6 bg-surface">
                        <h4 className="font-bold text-navy mb-4">معلومات الحقول</h4>
                        <ul className="text-xs text-gray-500 space-y-3">
                            <li className="flex gap-2">
                                <Type size={14} className="shrink-0" />
                                <span>نصوص قصيرة للأسماء والبيانات البسيطة.</span>
                            </li>
                            <li className="flex gap-2">
                                <Hash size={14} className="shrink-0" />
                                <span>للأرقام والإحصائيات فقط.</span>
                            </li>
                            <li className="flex gap-2">
                                <List size={14} className="shrink-0" />
                                <span>قائمة خيارات (افصل بين الخيارات بفاصلة).</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right: Field Builder */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-black text-navy dark:text-gold">بناء الحقول المخصصة</h3>
                        <button
                            type="button"
                            onClick={addField}
                            className="btn btn-secondary btn-sm"
                        >
                            <Plus size={16} /> إضافة حقل
                        </button>
                    </div>

                    <div className="space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="card bg-white dark:bg-gray-800 border-r-4 border-accent p-4 shadow-sm hover:shadow-md transition">
                                <div className="flex items-start gap-4">
                                    <div className="pt-3 text-gray-300">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-12 flex justify-between">
                                            <span className="text-[10px] font-bold text-accent">الحقل {index + 1}</span>
                                            <button
                                                onClick={() => removeField(field.id)}
                                                className="text-gray-400 hover:text-error transition"
                                                title="حذف الحقل"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="md:col-span-6">
                                            <label className="text-[10px] font-bold text-gray-400 mb-1 block">اسم الحقل (Label)</label>
                                            <input
                                                value={field.label}
                                                onChange={(e) => updateField(field.id, { label: e.target.value })}
                                                className="input h-10 py-1"
                                                placeholder="مثال: عدد الحضور"
                                            />
                                        </div>

                                        <div className="md:col-span-4">
                                            <label className="text-[10px] font-bold text-gray-400 mb-1 block">نوع البيانات</label>
                                            <select
                                                value={field.type}
                                                onChange={(e) => updateField(field.id, { type: e.target.value as any })}
                                                className="input h-10 py-1"
                                            >
                                                <option value="text">نص قصير</option>
                                                <option value="textarea">نص طويل</option>
                                                <option value="number">رقم</option>
                                                <option value="date">تاريخ</option>
                                                <option value="select">قائمة خيارات</option>
                                            </select>
                                        </div>

                                        <div className="md:col-span-2 flex items-end pb-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={field.required}
                                                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                                    className="w-4 h-4 accent-accent"
                                                />
                                                <span className="text-xs">إلزامي</span>
                                            </label>
                                        </div>

                                        {field.type === 'select' && (
                                            <div className="md:col-span-12">
                                                <label className="text-[10px] font-bold text-gray-400 mb-1 block">الخيارات (افصل بينها بفاصلة)</label>
                                                <input
                                                    value={field.options || ''}
                                                    onChange={(e) => updateField(field.id, { options: e.target.value })}
                                                    className="input h-10 py-1"
                                                    placeholder="خيار 1, خيار 2, خيار 3"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 flex justify-end gap-3">
                        <Link href="/admin/dashboard/reports" className="btn btn-secondary">
                            إلغاء التغييرات
                        </Link>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn btn-primary min-w-[180px]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <span className="flex items-center gap-2">
                                    <Save size={18} /> {isEdit ? 'تحديث الهيكل' : 'اعتماد وحفظ هيكل التقرير'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
