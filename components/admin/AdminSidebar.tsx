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
                    <img src="/logo.png" alt="Al-Resalah Club Logo" style={{ height: '100px', width: 'auto', marginBottom: 'var(--spacing-xs)', objectFit: 'contain' }} />
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
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

                <div style={{
                    borderTop: '1px solid var(--color-border)',
                    paddingTop: 'var(--spacing-md)',
                    marginTop: 'auto',
                    paddingBottom: 'calc(var(--spacing-md) + env(safe-area-inset-bottom, 0px))',
                    backgroundColor: 'var(--color-surface)' // Keep background for sticky look if needed
                }}>
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>مسجل كـ:</p>
                        <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, wordBreak: 'break-all', opacity: 0.8 }}>{userEmail}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
                        <ThemeToggle />
                        <button onClick={handleSignOut} className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '6px', fontSize: 'var(--font-size-xs)', padding: '6px 10px' }}>
                            <LogOut size={14} />
                            خروج
                        </button>
                    </div>
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
