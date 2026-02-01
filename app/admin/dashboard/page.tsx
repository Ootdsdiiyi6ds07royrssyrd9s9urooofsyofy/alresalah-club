import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboardPage() {
    const supabase = await createClient()

    // Fetch statistics
    const [coursesResult, applicantsResult, surveysResult, announcementsResult] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('applicants').select('*', { count: 'exact', head: true }),
        supabase.from('surveys').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
    ])

    const stats = {
        courses: coursesResult.count || 0,
        applicants: applicantsResult.count || 0,
        surveys: surveysResult.count || 0,
        announcements: announcementsResult.count || 0,
    }

    // Fetch recent activity
    const { data: recentLogs } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>نظرة عامة على لوحة التحكم</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    مرحباً بك في لوحة تحكم نادي الرسالة
                </p>
            </div>

            {/* Statistics Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-2xl)',
                }}
            >
                <StatCard title="إجمالي الدورات" value={stats.courses} icon="📚" color="var(--color-primary)" />
                <StatCard title="إجمالي المتقدمين" value={stats.applicants} icon="👥" color="var(--color-accent)" />
                <StatCard title="الاستبيانات النشطة" value={stats.surveys} icon="📋" color="var(--color-info)" />
                <StatCard title="الإعلانات" value={stats.announcements} icon="📢" color="var(--color-success)" />
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>النشاطات الأخيرة</h2>
                {recentLogs && recentLogs.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        {recentLogs.map((log) => (
                            <div
                                key={log.id}
                                style={{
                                    padding: 'var(--spacing-md)',
                                    backgroundColor: 'var(--color-background)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <p style={{ fontWeight: 500 }}>{log.action_type}</p>
                                    {log.entity_type && (
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                            {log.entity_type}
                                        </p>
                                    )}
                                </div>
                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                    {new Date(log.created_at).toLocaleString('ar-SA')}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-secondary)' }}>لا توجد نشاطات مؤخراً</p>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>إجراءات سريعة</h2>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
                    <a href="/admin/dashboard/courses/new" className="btn btn-primary">
                        + إضافة دورة
                    </a>
                    <a href="/admin/dashboard/forms/new" className="btn btn-primary">
                        + إنشاء نموذج
                    </a>
                    <a href="/admin/dashboard/surveys/new" className="btn btn-primary">
                        + استبيان جديد
                    </a>
                    <a href="/admin/dashboard/announcements/new" className="btn btn-primary">
                        + نشر إعلان
                    </a>
                </div>
            </div>
        </div>
    )
}

function StatCard({
    title,
    value,
    icon,
    color,
}: {
    title: string
    value: number
    icon: string
    color: string
}) {
    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>{icon}</div>
            <h3 style={{ fontSize: 'var(--font-size-3xl)', color, marginBottom: 'var(--spacing-xs)' }}>
                {value}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>{title}</p>
        </div>
    )
}
