'use client'

import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import SideMenu from './SideMenu'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const isAdmin = pathname?.startsWith('/admin')

    if (isAdmin) return null

    return (
        <>
            <header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    backgroundColor: 'rgba(var(--color-surface), 0.8)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid var(--color-border)',
                    padding: 'var(--spacing-md) 0',
                    transition: 'all var(--transition-base)',
                }}
            >
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                padding: 'var(--spacing-xs)',
                                borderRadius: 'var(--radius-md)',
                                transition: 'background-color var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-border)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                            </svg>
                        </button>
                        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <img src="/logo.png" alt="Al-Resalah Club Logo" className="header-logo" />
                        </Link>
                    </div>

                    <nav style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center' }} className="no-mobile">
                        <Link href="/courses" className="nav-link">الدورات</Link>
                        <Link href="/programs" className="nav-link">البرامج</Link>
                        <Link href="/announcements" className="nav-link">الإعلانات</Link>
                        <Link href="/surveys" className="nav-link">الاستبيانات</Link>
                        <Link href="/gallery" className="nav-link">المعرض</Link>
                    </nav>

                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                        <ThemeToggle />
                        <Link href="/admin/login" className="btn btn-primary btn-sm">دخول</Link>
                    </div>
                </div>
            </header>

            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <style jsx>{`
                .nav-link {
                    color: var(--color-text-secondary);
                    font-weight: 500;
                    font-size: var(--font-size-sm);
                    transition: color var(--transition-fast);
                }
                .header-logo {
                    height: 140px;
                    width: auto;
                    transition: height var(--transition-base);
                }
                .nav-link:hover {
                    color: var(--color-primary);
                }
                @media (max-width: 768px) {
                    .header-logo {
                        height: 90px;
                    }
                    .no-mobile {
                        display: none;
                    }
                }
            `}</style>
        </>
    )
}
