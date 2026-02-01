'use server'

import { createClient } from '@/lib/supabase/server'

export interface ActivityLogData {
    action_type: string
    entity_type?: string
    entity_id?: string
    details?: Record<string, any>
}

export async function logActivity(data: ActivityLogData) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        // We still log even if no user (e.g. system actions or public registration)
        // but it's better to have a user ID if possible.

        const { error } = await supabase
            .from('activity_logs')
            .insert({
                user_id: user?.id || null,
                action_type: data.action_type,
                entity_type: data.entity_type || null,
                entity_id: data.entity_id || null,
                details: data.details || null,
            })

        if (error) {
            console.error('Error logging activity:', error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error: any) {
        console.error('Exception in logActivity:', error)
        return { success: false, error: error.message }
    }
}
