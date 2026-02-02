import { createClient } from '@/lib/supabase/server'

export default async function AdminFormsPage() {
    const supabase = await createClient()
    const { data: forms } = await supabase
        .from('registration_forms')
        .select('*, courses(title)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>نماذج التسجيل</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        إنشاء وإدارة نماذج التسجيل للدورات
                    </p>
                </div>
                <a href="/admin/dashboard/forms/new" className="btn btn-primary">+ إنشاء نموذج جديد</a>
            </div>

            <div className="card">
                {forms && forms.length > 0 ? (
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>عنوان النموذج</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الدورة المرتبطة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الحالة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>تاريخ الإنشاء</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forms.map((form: any) => (
                                    <tr key={form.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{form.title}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{form.courses?.title || 'عام'}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span className={`badge badge-${form.is_active ? 'success' : 'muted'}`}>
                                                {form.is_active ? 'نشط' : 'غير نشط'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            {new Date(form.created_at).toLocaleDateString('ar-SA')}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                                                <a href={`/admin/dashboard/forms/${form.id}/edit`} className="btn btn-sm btn-secondary">تعديل</a>
                                                <button className="btn btn-sm btn-info">معاينة</button>
                                                <DeleteFormButton id={form.id} title={form.title} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                            لا توجد نماذج تسجيل مضافة حالياً
                        </p>
                        <a href="/admin/dashboard/forms/new" className="btn btn-primary">+ إنشاء أول نموذج</a>
                    </div>
                )}
            </div>
        </div>
    )
}

function DeleteFormButton({ id, title }: { id: string; title: string }) {
    'use client'
    const { createClient } = require('@/lib/supabase/client')
    const { useRouter } = require('next/navigation')
    const supabase = createClient()
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`هل أنت متأكد من حذف نموذج "${title}"؟`)) return

        const { error } = await supabase
            .from('registration_forms')
            .delete()
            .eq('id', id)

        if (error) {
            alert('فشل الحذف: ' + error.message)
        } else {
            router.refresh()
        }
    }

    return (
        <button onClick={handleDelete} className="btn btn-sm btn-error">
            حذف
        </button>
    )
}
