'use client'

import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import NavLink from '@/components/admin/NavLink'
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
    LogOut
} from 'lucide-react'

interface AdminSidebarProps {
    userEmail: string | null | undefined
    handleSignOut: () => void
}

export default function AdminSidebar({ userEmail, handleSignOut }: AdminSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)

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
                    height: '100vh',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    transition: 'transform 0.3s ease-in-out',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    zIndex: 2001,
                }}
                className="admin-sidebar"
            >
                <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        نادي الرسالة
                    </h2>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        لوحة تحكم المسؤول
                    </p>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto' }}>
                    <div onClick={() => setIsOpen(false)}>
                        <NavLink href="/admin/dashboard" icon={<LayoutDashboard size={20} />}>لوحة التحكم</NavLink>
                        <NavLink href="/admin/dashboard/courses" icon={<BookOpen size={20} />}>الدورات</NavLink>
                        <NavLink href="/admin/dashboard/programs" icon={<GraduationCap size={20} />}>البرامج</NavLink>
                        <NavLink href="/admin/dashboard/applicants" icon={<Users size={20} />}>المتقدمين</NavLink>
                        <NavLink href="/admin/dashboard/surveys" icon={<ClipboardList size={20} />}>الاستبيانات</NavLink>
                        <NavLink href="/admin/dashboard/announcements" icon={<Megaphone size={20} />}>الإعلانات</NavLink>
                        <NavLink href="/admin/dashboard/gallery" icon={<ImageIcon size={20} />}>معرض الوسائط</NavLink>
                        <NavLink href="/admin/dashboard/logs" icon={<Activity size={20} />}>سجل النشاطات</NavLink>
                        <NavLink href="/admin/dashboard/settings" icon={<Settings size={20} />}>إعدادات المتعلم الذكي</NavLink>
                    </div>
                </nav>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>مسجل كـ:</p>
                        <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, wordBreak: 'break-all' }}>{userEmail}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                        <ThemeToggle />
                        <button onClick={handleSignOut} className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '8px' }}>
                            <LogOut size={16} />
                            تسجيل الخروج
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    @media (min-width: 769px) {
                        .admin-sidebar {
                            transform: none !important;
                            position: sticky !important;
                        }
                    }
                `}</style>
            </aside>
        </>
    )
}
