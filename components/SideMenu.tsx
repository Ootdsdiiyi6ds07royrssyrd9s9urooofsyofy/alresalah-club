'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Home, BookOpen, GraduationCap, Megaphone, CheckSquare, Image as ImageIcon, LayoutDashboard, X, Download, Share, PlusSquare } from 'lucide-react'
import { usePWA } from '@/hooks/usePWA'

import Image from 'next/image'

interface SideMenuProps {
    isOpen: boolean
    onClose: () => void
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            document.body.style.touchAction = 'none'
        } else {
            document.body.style.overflow = 'auto'
            document.body.style.touchAction = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
            document.body.style.touchAction = 'auto'
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
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    zIndex: 2000,
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />

            {/* Menu Side Panel */}
            <aside
                style={{
                    position: 'fixed',
                    top: 0,
                    right: isOpen ? 0 : '-320px',
                    width: 'min(320px, 85vw)',
                    height: '100dvh',
                    backgroundColor: 'var(--color-surface)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 2001,
                    transition: 'right 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 'var(--spacing-xl) var(--spacing-lg)',
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <Link href="/" onClick={onClose} style={{ textDecoration: 'none' }}>
                        <div style={{ position: 'relative', height: '100px', width: '100px' }}>
                            <Image
                                src="/logo.png"
                                alt="Al-Resalah Club Logo"
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            padding: 'var(--spacing-sm)',
                        }}
                        aria-label="Close Menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    <MenuLink href="/" onClick={onClose} icon={<Home size={20} />}>الرئيسية</MenuLink>
                    <MenuLink href="/courses" onClick={onClose} icon={<BookOpen size={20} />}>الدورات المتاحة</MenuLink>
                    <MenuLink href="/programs" onClick={onClose} icon={<GraduationCap size={20} />}>البرامج التعليمية</MenuLink>
                    <MenuLink href="/announcements" onClick={onClose} icon={<Megaphone size={20} />}>آخر الإعلانات</MenuLink>
                    <MenuLink href="/surveys" onClick={onClose} icon={<CheckSquare size={20} />}>الاستبيانات</MenuLink>
                    <MenuLink href="/gallery" onClick={onClose} icon={<ImageIcon size={20} />}>معرض الصور</MenuLink>
                    <div style={{ margin: 'var(--spacing-md) 0', borderTop: '1px solid var(--color-border)' }} />
                    <MenuLink href="/admin/login" onClick={onClose} icon={<LayoutDashboard size={20} />}>لوحة التحكم</MenuLink>
                </nav>

                <PWAInstallContainer />

                <div style={{ marginTop: 'auto', textAlign: 'center' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                        © 2026 نادي الرسالة التعليمي
                    </p>
                </div>
            </aside>
        </>
    )
}

function MenuLink({ href, children, onClick, icon }: { href: string; children: React.ReactNode; onClick: () => void; icon: React.ReactNode }) {
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
            <span style={{ color: 'var(--color-primary)' }}>{icon}</span>
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

function PWAInstallContainer() {
    const { isInstallable, isStandalone, isIOS, installPWA } = usePWA()
    const [showIOSInstructions, setShowIOSInstructions] = useState(false)

    if (isStandalone) return null

    if (isIOS) {
        return (
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                {!showIOSInstructions ? (
                    <button
                        onClick={() => setShowIOSInstructions(true)}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--spacing-md)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-lg)',
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, #2c5e84 100%)',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: 'var(--font-size-sm)',
                            boxShadow: '0 4px 15px rgba(26, 58, 82, 0.3)',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <Download size={20} />
                        تثبيت التطبيق على الآيفون
                    </button>
                ) : (
                    <div style={{
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-primary)',
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--color-text)',
                        lineHeight: '1.6',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)', color: 'var(--color-primary)' }}>لتثبيت التطبيق على آيفون:</p>
                        <ol style={{ paddingRight: '20px', margin: 0 }}>
                            <li>اضغط على زر المشاركة <Share size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> في الأسفل</li>
                            <li>اختر "إضافة إلى الشاشة الرئيسية" <PlusSquare size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /></li>
                            <li>اضغط "إضافة" في الزاوية العلوية</li>
                        </ol>
                        <button
                            onClick={() => setShowIOSInstructions(false)}
                            style={{
                                marginTop: 'var(--spacing-sm)',
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-primary)',
                                cursor: 'pointer',
                                fontSize: 'var(--font-size-xs)',
                                fontWeight: 500,
                                padding: 0
                            }}
                        >
                            إغلاق التعليمات
                        </button>
                    </div>
                )}
                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
            </div>
        )
    }

    if (!isInstallable) return null

    return (
        <button
            onClick={installPWA}
            style={{
                marginTop: 'var(--spacing-xl)',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #2c5e84 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 'var(--font-size-sm)',
                boxShadow: '0 4px 15px rgba(26, 58, 82, 0.3)',
                transition: 'all 0.3s ease',
            }}
            className="pwa-install-btn"
        >
            <Download size={20} />
            تثبيت التطبيق على الجوال
            <style jsx>{`
                .pwa-install-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(26, 58, 82, 0.4);
                    filter: brightness(1.1);
                }
                .pwa-install-btn:active {
                    transform: translateY(0);
                }
            `}</style>
        </button>
    )
}
