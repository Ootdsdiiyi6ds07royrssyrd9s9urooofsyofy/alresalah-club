'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { logActivityAction } from '@/lib/logging/actions'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const supabase = createClient()
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) {
                throw authError
            }

            if (data.user) {
                // Log successful login using server action (non-blocking for redirect)
                logActivityAction({
                    action_type: 'login',
                    details: { email },
                }).catch(err => console.error('Failed to log login activity:', err))

                // Use window.location.href for a full page reload to ensure 
                // all cookies and session state are correctly recognized by the server
                window.location.href = '/admin/dashboard'
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setError(err.message || 'Invalid credentials. Please check your email and password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)',
                padding: 'var(--spacing-md)',
            }}
        >
            <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                        نادي الرسالة
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>بوابة المسؤول</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && (
                        <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email" className="label">
                            البريد الإلكتروني
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="admin@alresalah.club"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="label">
                            كلمة المرور
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? (
                            <>
                                <span className="loading"></span>
                                جاري الدخول...
                            </>
                        ) : (
                            'تسجيل الدخول'
                        )}
                    </button>
                </form>

                <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <a href="/" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                        ← العودة للرئيسية
                    </a>
                </div>
            </div>
        </div>
    )
}
