'use client';

import Link from 'next/link';
import { ShieldCheck, GraduationCap, ArrowRight, Home } from 'lucide-react';

export default function PortalChoicePage() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 200px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-2xl) var(--spacing-md)',
            background: 'var(--color-background)'
        }}>
            <div className="container" style={{ maxWidth: '900px' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                    <h1 className="gradient-text" style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: 'var(--spacing-md)',
                    }}>
                        مرحباً بك في نادي الرسالة
                    </h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        يرجى اختيار البوابة المناسبة للمتابعة إلى حسابك
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: 'var(--spacing-xl)',
                    marginTop: 'var(--spacing-2xl)'
                }}>
                    {/* Student Portal */}
                    <Link href="/student/login" className="card-elevated hover-scale fade-in" style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: 'var(--spacing-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--spacing-lg)',
                        border: '2px solid transparent',
                        transition: 'all var(--transition-base)',
                        backgroundColor: 'var(--color-surface-elevated)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                    >
                        <div style={{
                            width: '90px',
                            height: '90px',
                            background: 'var(--grad-gold)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)',
                            transform: 'rotate(-5deg)'
                        }}>
                            <GraduationCap size={44} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text)' }}>بوابة الطلاب</h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: '1.5' }}>
                                للمسجلين في الدورات والبرامج التعليمية والأنشطة التدريبية
                            </p>
                        </div>
                        <div style={{
                            color: 'var(--color-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '700',
                            marginTop: 'var(--spacing-md)',
                            fontSize: 'var(--font-size-lg)'
                        }}>
                            دخول الطلاب <ArrowRight size={20} />
                        </div>
                    </Link>

                    {/* Admin Portal */}
                    <Link href="/admin/login" className="card-elevated hover-scale fade-in" style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: 'var(--spacing-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--spacing-lg)',
                        border: '2px solid transparent',
                        transition: 'all var(--transition-base)',
                        backgroundColor: 'var(--color-surface-elevated)',
                        position: 'relative',
                        overflow: 'hidden',
                        animationDelay: '0.1s'
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                    >
                        <div style={{
                            width: '90px',
                            height: '90px',
                            background: 'var(--grad-navy)',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 10px 20px rgba(10, 25, 47, 0.2)',
                            transform: 'rotate(5deg)'
                        }}>
                            <ShieldCheck size={44} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: '700', marginBottom: 'var(--spacing-xs)', color: 'var(--color-text)' }}>بوابة المسؤول</h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: '1.5' }}>
                                لوحة التحكم الخاصة بالمديرين والمشرفين لإدارة محتوى النادي
                            </p>
                        </div>
                        <div style={{
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: '700',
                            marginTop: 'var(--spacing-md)',
                            fontSize: 'var(--font-size-lg)'
                        }}>
                            دخول الإدارة <ArrowRight size={20} />
                        </div>
                    </Link>
                </div>

                <div style={{ marginTop: 'var(--spacing-2xl)', textAlign: 'center' }}>
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors font-medium">
                        <Home size={18} /> العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}

