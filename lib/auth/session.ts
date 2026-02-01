import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

export async function isAdmin() {
    const user = await getCurrentUser()
    return user !== null
}

export async function requireAdmin() {
    const admin = await isAdmin()
    if (!admin) {
        throw new Error('Unauthorized: Admin access required')
    }
    return true
}
