'use client';

import Link from 'next/link';
import { ShieldCheck, GraduationCap, ArrowRight } from 'lucide-react';

export default function PortalChoicePage() {
    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-xl)'
        }}>
            <div style={{
                maxWidth: '800px',
                width: '100%',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: 'var(--font-size-3xl)',
                    fontWeight: '800',
                    marginBottom: 'var(--spacing-sm)',
                    background: 'var(--grad-navy)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    مرحباً بك في نادي الرسالة
                </h1>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-2xl)',
                    fontSize: 'var(--font-size-lg)'
                }}>
                    يرجى اختيار البوابة المناسبة للدخول
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--spacing-xl)'
                }}>
                    {/* Student Portal */}
                    <Link href="/student/login" className="card-elevated hover-scale" style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: 'var(--spacing-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--spacing-lg)',
                        border: '2px solid transparent',
                        transition: 'all var(--transition-base)'
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-accent)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'var(--grad-gold)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
                        }}>
                            <GraduationCap size={40} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-xs)' }}>بوابة الطلاب</h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                للمسجلين في الدورات والبرامج التعليمية
                            </p>
                        </div>
                        <div style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            دخول الطلاب <ArrowRight size={18} />
                        </div>
                    </Link>

                    {/* Admin Portal */}
                    <Link href="/admin/login" className="card-elevated hover-scale" style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: 'var(--spacing-2xl)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 'var(--spacing-lg)',
                        border: '2px solid transparent',
                        transition: 'all var(--transition-base)'
                    }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                    >
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'var(--grad-navy)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 10px 20px rgba(10, 25, 47, 0.2)'
                        }}>
                            <ShieldCheck size={40} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-xs)' }}>بوابة المسؤول</h2>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                لإدارة الدورات، الإعلانات، والطلاب
                            </p>
                        </div>
                        <div style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                            دخول الإدارة <ArrowRight size={18} />
                        </div>
                    </Link>
                </div>

                <div style={{ marginTop: 'var(--spacing-2xl)' }}>
                    <Link href="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 'var(--font-size-sm)' }} className="hover:underline">
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}
