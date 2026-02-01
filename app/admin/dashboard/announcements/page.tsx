import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Database } from '@/lib/types/database'

type Announcement = Database['public']['Tables']['announcements']['Row']

export default async function AdminAnnouncementsPage() {
    const supabase = await createClient()
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .order('publish_date', { ascending: false })

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>إدارة الإعلانات</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        نشر وتعديل الإعلانات التي تظهر للمستخدمين
                    </p>
                </div>
                <Link href="/admin/dashboard/announcements/new" className="btn btn-primary">+ إضافة إعلان جديد</Link>
            </div>

            <div className="card">
                {announcements && announcements.length > 0 ? (
                    <div className="table-container">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>العنوان</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الأولوية</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الحالة</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>تاريخ النشر</th>
                                    <th style={{ textAlign: 'right', padding: 'var(--spacing-md)' }}>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.map((announcement: Announcement) => (
                                    <tr key={announcement.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-md)' }}>{announcement.title}</td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span className={`badge badge-${announcement.priority === 'urgent' ? 'error' : announcement.priority === 'high' ? 'warning' : 'info'}`}>
                                                {announcement.priority}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span className={`badge badge-${announcement.is_active ? 'success' : 'muted'}`}>
                                                {announcement.is_active ? 'نشط' : 'غير نشط'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            {announcement.publish_date ? new Date(announcement.publish_date).toLocaleDateString('ar-SA') : '-'}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <Link href={`/admin/dashboard/announcements/${announcement.id}/edit`} className="btn btn-sm btn-secondary" style={{ marginLeft: 'var(--spacing-xs)' }}>تعديل</Link>
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
                            لا توجد إعلانات منشورة حالياً
                        </p>
                        <Link href="/admin/dashboard/announcements/new" className="btn btn-primary">+ نشر أول إعلان</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
