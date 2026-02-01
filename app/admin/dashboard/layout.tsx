import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import NavLink from '@/components/admin/NavLink'

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const handleSignOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/admin/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside
                style={{
                    width: '260px',
                    backgroundColor: 'var(--color-surface)',
                    borderLeft: '1px solid var(--color-border)',
                    padding: 'var(--spacing-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        نادي الرسالة
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        لوحة تحكم المسؤول
                    </p>
                </div>

                <nav style={{ flex: 1 }}>
                    <NavLink href="/admin/dashboard" icon="📊">
                        لوحة التحكم
                    </NavLink>
                    <NavLink href="/admin/dashboard/courses" icon="📚">
                        الدورات
                    </NavLink>
                    <NavLink href="/admin/dashboard/programs" icon="🎓">
                        البرامج
                    </NavLink>
                    <NavLink href="/admin/dashboard/forms" icon="📝">
                        نماذج التسجيل
                    </NavLink>
                    <NavLink href="/admin/dashboard/applicants" icon="👥">
                        المتقدمين
                    </NavLink>
                    <NavLink href="/admin/dashboard/surveys" icon="📋">
                        الاستبيانات
                    </NavLink>
                    <NavLink href="/admin/dashboard/announcements" icon="📢">
                        الإعلانات
                    </NavLink>
                    <NavLink href="/admin/dashboard/gallery" icon="🖼️">
                        معرض الوسائط
                    </NavLink>
                    <NavLink href="/admin/dashboard/logs" icon="📜">
                        سجل النشاطات
                    </NavLink>
                    <NavLink href="/admin/dashboard/settings" icon="⚙️">
                        إعدادات المتعلم الذكي
                    </NavLink>
                </nav>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)' }}>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                            مسجل كـ:
                        </p>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{user.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <ThemeToggle />
                        <form action={handleSignOut}>
                            <button type="submit" className="btn btn-secondary btn-sm">
                                تسجيل الخروج
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--spacing-xl)', overflow: 'auto' }}>
                {children}
            </main>
        </div>
    )
}
