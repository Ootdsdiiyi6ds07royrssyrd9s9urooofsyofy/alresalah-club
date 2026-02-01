'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface SideMenuProps {
    isOpen: boolean
    onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 2000,
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease-in-out',
                }}
            />

            {/* Menu Side Panel */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    right: isOpen ? 0 : '-320px',
                    width: '320px',
                    height: '100vh',
                    backgroundColor: 'var(--color-surface)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 2001,
                    transition: 'right 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--spacing-xl)',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>نادي الرسالة</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            padding: 'var(--spacing-sm)',
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <MenuLink href="/" onClick={onClose} icon="🏠">الرئيسية</MenuLink>
                    <MenuLink href="/courses" onClick={onClose} icon="📚">الدورات المتاحة</MenuLink>
                    <MenuLink href="/programs" onClick={onClose} icon="🎓">البرامج التعليمية</MenuLink>
                    <MenuLink href="/announcements" onClick={onClose} icon="📢">آخر الإعلانات</MenuLink>
                    <MenuLink href="/surveys" onClick={onClose} icon="📊">الاستبيانات</MenuLink>
                    <MenuLink href="/gallery" onClick={onClose} icon="🖼️">معرض الصور</MenuLink>
                    <div style={{ margin: 'var(--spacing-md) 0', borderTop: '1px solid var(--color-border)' }} />
                    <MenuLink href="/admin/login" onClick={onClose} icon="🔐">لوحة التحكم</MenuLink>
                </nav>

                <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                        © 2026 نادي الرسالة التعليمي
                    </p>
                </div>
            </aside>
        </>
    )
}

function MenuLink({ href, children, onClick, icon }: { href: string; children: React.ReactNode; onClick: () => void; icon: string }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'all var(--transition-fast)',
            }}
            className="menu-link-hover"
        >
            <span style={{ fontSize: '1.25rem' }}>{icon}</span>
            {children}
            <style jsx>{`
                .menu-link-hover:hover {
                    background-color: var(--color-beige-dark);
                    color: var(--color-primary);
                    transform: translateX(-5px);
                }
                [data-theme="dark"] .menu-link-hover:hover {
                    background-color: var(--color-surface-elevated);
                }
            `}</style>
        </Link>
    )
}
