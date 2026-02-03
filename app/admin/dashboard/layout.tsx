'use client';

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/admin/login')
                } else {
                    setUser(user)
                    setLoading(false)
                }
            } catch (error) {
                router.push('/admin/login')
            }
        }
        checkUser()
    }, [router, supabase])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = '/admin/login'
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading" style={{ width: '40px', height: '40px' }}></div>
            </div>
        )
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar userEmail={user?.email} handleSignOut={handleSignOut} />

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--spacing-xl)', overflowY: 'auto', width: '100%' }}>
                {children}
            </main>

            <style jsx global>{`
                @media (max-width: 768px) {
                    main {
                        padding: var(--spacing-md) !important;
                        margin-top: 50px; /* Space for mobile menu button */
                        width: 100% !important;
                        overflow-x: hidden;
                    }
                    .table-container {
                        margin: 0 -1rem;
                        padding: 0 1rem;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                    }
                    table {
                        min-width: 600px;
                    }
                    .card {
                        padding: var(--spacing-md) !important;
                    }
                }
            `}</style>
        </div>
    )
}
