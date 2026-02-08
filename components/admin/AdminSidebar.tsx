'use client'

import { useState, useEffect } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import NavLink from '@/components/admin/NavLink'
import { createClient } from '@/lib/supabase/client'
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    Users,
    ClipboardList,
    Megaphone,
    Image as ImageIcon,
    Activity,
    Settings,
    Menu,
    X,
    LogOut,
    Home,
    Globe,
    Clock,
    UserCheck
} from 'lucide-react'

interface AdminSidebarProps {
    userEmail: string | null | undefined
    handleSignOut: () => void
}

export default function AdminSidebar({ userEmail, handleSignOut }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [happeningNowCourses, setHappeningNowCourses] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchHappeningNow = async () => {
            const { data } = await supabase
                .from('courses')
                .select('id, title')
                .eq('is_happening_now', true)
            if (data) setHappeningNowCourses(data)
        }
        fetchHappeningNow()

        // Realtime subscription? Maybe overkill for now.
        // But let's verify if user wants instant updates. "If a course starts... a new slot opens".
        // Polling or subscription would be better but manual refresh/page load is fine for MVP.
    }, [])

    const toggleSidebar = () => setIsOpen(!isOpen)

    return (
        <>
            {/* Mobile Toggle Button */}
            <div
                className="mobile-only"
                style={{
                    position: 'fixed',
                    top: 'var(--spacing-md)',
                    right: 'var(--spacing-md)',
                    zIndex: 2002,
                }}
            >
                <button
                    onClick={toggleSidebar}
                    className="btn btn-primary btn-sm"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Backdrop */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="mobile-only"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 2000,
                    }}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: '260px',
                    backgroundColor: 'var(--color-surface)',
                    borderLeft: '1px solid var(--color-border)',
                    padding: 'var(--spacing-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minHeight: '100dvh',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    transition: 'transform 0.3s ease-in-out',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    zIndex: 2001,
                    boxShadow: isOpen ? 'var(--shadow-2xl)' : 'none'
                }}
                className="admin-sidebar"
            >
                <div style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <img src="/logo.png" alt="Al-Resalah Club Logo" style={{ height: '140px', width: 'auto', marginBottom: 'var(--spacing-xs)', objectFit: 'contain' }} />
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        لوحة تحكم المسؤول
                    </p>
                </div>

                <nav style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingLeft: 'var(--spacing-xs)',
                    marginRight: 'calc(var(--spacing-xs) * -1)',
                    paddingBottom: 'var(--spacing-xl)' // Added padding at bottom for scroll space
                }}>
                    <div onClick={() => setIsOpen(false)}>
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0 var(--spacing-md)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>الإدارة</p>
                            <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />}>الرئيسية</NavLink>
                            <NavLink href="/admin/dashboard/students" icon={<Users size={20} />}>كشفيات الطلاب</NavLink>
                            <NavLink href="/admin/dashboard/attendance" icon={<UserCheck size={20} />}>التحضير والكشوفات</NavLink>
                            <NavLink href="/admin/dashboard/applicants" icon={<Users size={20} />}>المتقدمين للمسارات</NavLink>
                            <NavLink href="/admin/dashboard/surveys" icon={<ClipboardList size={20} />}>نتائج الاستبيانات</NavLink>
                        </div>

                        {/* Happening Now Section */}
                        {happeningNowCourses.length > 0 && (
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', padding: '0 var(--spacing-md)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
                                    تقام الآن
                                </p>
                                {happeningNowCourses.map(course => (
                                    <NavLink key={course.id} href={`/admin/dashboard/attendance/${course.id}`} icon={<Clock size={20} />}>
                                        {course.title}
                                    </NavLink>
                                ))}
                            </div>
                        )}

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0 var(--spacing-md)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>المحتوى التعليمي</p>
                            <NavLink href="/admin/dashboard/courses" icon={<BookOpen size={20} />}>إدارة الدورات</NavLink>
                            <NavLink href="/admin/dashboard/programs" icon={<GraduationCap size={20} />}>إدارة البرامج</NavLink>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0 var(--spacing-md)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>التواصل والميديا</p>
                            <NavLink href="/admin/dashboard/announcements" icon={<Megaphone size={20} />}>الإعلانات</NavLink>
                            <NavLink href="/admin/dashboard/gallery" icon={<ImageIcon size={20} />}>المعرض</NavLink>
                            <NavLink href="/admin/dashboard/kits" icon={<BookOpen size={20} />}>الحقائب التعليمية</NavLink>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0 var(--spacing-md)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>الإعدادات</p>
                            <NavLink href="/admin/dashboard/settings" icon={<Settings size={20} />}>إعدادات الموقع</NavLink>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', padding: '0 var(--spacing-md)', marginBottom: 'var(--spacing-xs)', textTransform: 'uppercase', letterSpacing: '1px' }}>روابط الموقع العام</p>
                            <NavLink href="/" icon={<Home size={20} />}>الموقع الرئيسي</NavLink>
                            <NavLink href="/courses" icon={<BookOpen size={20} />}>كل الدورات</NavLink>
                            <NavLink href="/programs" icon={<GraduationCap size={20} />}>كل البرامج</NavLink>
                            <NavLink href="/surveys" icon={<ClipboardList size={20} />}>الاستبيانات العامة</NavLink>
                        </div>

                        <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border)' }}>
                            <button
                                onClick={handleSignOut}
                                className="nav-link"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md)',
                                    width: '100%',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: 'var(--color-error)',
                                    fontWeight: 500
                                }}
                            >
                                <LogOut size={20} />
                                <span>تسجيل الخروج</span>
                            </button>
                        </div>
                    </div>
                </nav>

                <div style={{
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: 'var(--spacing-md)',
                    marginTop: 'auto',
                    paddingBottom: 'calc(var(--spacing-md) + env(safe-area-inset-bottom, 0px))',
                    backgroundColor: 'var(--color-surface)',
                    textAlign: 'center'
                }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', margin: 0 }}>نادي الرسالة التعليمي © 2026</p>
                </div>

                <style jsx>{`
                    .admin-sidebar {
                        scrollbar-width: thin;
                        scrollbar-color: var(--color-border) transparent;
                        overflow-y: auto; /* Ensure the whole sidebar can scroll if nav doesn't */
                    }
                    .admin-sidebar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .admin-sidebar::-webkit-scrollbar-thumb {
                        background-color: var(--color-border);
                        border-radius: 10px;
                    }
                    @media (min-width: 769px) {
                        .admin-sidebar {
                            transform: none !important;
                            position: sticky !important;
                            height: 100vh !important;
                        }
                    }
                    @media (max-width: 768px) {
                        .admin-sidebar {
                            width: 280px !important;
                            height: 100dvh !important; /* Use dynamic viewport height */
                        }
                    }
                `}</style>
            </aside>
        </>
    )
}
