'use client';
import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const handleSignOut = async () => {
        'use server'
        const supabase = await createClient()
        await supabase.auth.signOut()
        redirect('/admin/login')
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <AdminSidebar userEmail={user.email} handleSignOut={handleSignOut} />

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--spacing-xl)', overflow: 'auto', width: '100%' }}>
                {children}
            </main>

            <style jsx global>{`
                @media (max-width: 768px) {
                    main {
                        padding: var(--spacing-md) !important;
                        margin-top: 60px; /* Space for mobile menu button */
                    }
                    .table-container {
                        overflow-x: auto;
                    }
                    table {
                        min-width: 600px;
                    }
                }
            `}</style>
        </div>
    )
}
