import { createClient } from '@/lib/supabase/server'

export default async function ApplicantsPage() {
    const supabase = await createClient()

    // Fetch all applicants with course information
    const { data: applicants } = await supabase
        .from('applicants')
        .select('*, courses(title)')
        .order('created_at', { ascending: false })

    // Fetch all courses for filtering
    const { data: courses } = await supabase
        .from('courses')
        .select('id, title')
        .order('title', { ascending: true })

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <div>
                    <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>إدارة المتقدمين</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        عرض وإدارة جميع تسجيلات الدورات
                    </p>
                </div>
            </div>

            {/* Export Buttons */}
            {courses && courses.length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>تصدير إلى Excel</h3>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                        {courses.map((course) => (
                            <a
                                key={course.id}
                                href={`/api/export/applicants?courseId=${course.id}`}
                                className="btn btn-secondary btn-sm"
                                download
                            >
                                📥 {course.title}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Applicants Table */}
            {applicants && applicants.length > 0 ? (
                <div className="card">
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الاسم</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>البريد الإلكتروني</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>رقم الجوال</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الدورة</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>الحالة</th>
                                    <th style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicants.map((applicant) => (
                                    <tr key={applicant.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: 'var(--spacing-md)', fontWeight: 500 }}>
                                            {applicant.full_name}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                                            {applicant.email}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                                            {applicant.phone}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>
                                            {(applicant.courses as any)?.title || 'غير متوفر'}
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)' }}>
                                            <span className={`badge badge-${applicant.status === 'approved' ? 'success' : applicant.status === 'rejected' ? 'error' : 'warning'}`}>
                                                {applicant.status === 'approved' ? 'مقبول' : applicant.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                                            </span>
                                        </td>
                                        <td style={{ padding: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            {new Date(applicant.created_at).toLocaleDateString('ar-SA')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                        لم يتم العثور على متقدمين
                    </p>
                </div>
            )}
        </div>
    )
}
