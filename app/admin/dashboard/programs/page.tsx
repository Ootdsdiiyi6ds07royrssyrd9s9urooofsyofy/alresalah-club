import { createClient } from '@/lib/supabase/server'

export default async function AdminProgramsPage() {
    const supabase = await createClient()
    const { data: programs } = await (supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false }) as any)

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>إدارة البرامج</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        عرض وإدارة البرامج التعليمية المتاحة
                    </p>
                </div>
                <a href="/admin/dashboard/programs/new" className="btn btn-primary">+ إضافة برنامج جديد</a>
            </div>

            <div className="card">
                {programs && programs.length > 0 ? (
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>العنوان</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الفئة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>المدة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الحالة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {programs.map((program: any) => (
                                    <tr key={program.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{program.title}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{program.category}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{program.duration}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span className={`badge badge-${program.is_active ? 'success' : 'muted'}`}>
                                                {program.is_active ? 'نشط' : 'غير نشط'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <a href={`/admin/dashboard/programs/${program.id}/edit`} className="btn btn-sm btn-secondary" style={{ marginLeft: 'var(--spacing-xs)' }}>تعديل</a>
                                            <button className="btn btn-sm btn-error">حذف</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                            لا توجد برامج مضافة حالياً
                        </p>
                        <a href="/admin/dashboard/programs/new" className="btn btn-primary">+ إضافة أول برنامج</a>
                    </div>
                )}
            </div>
        </div>
    )
}
