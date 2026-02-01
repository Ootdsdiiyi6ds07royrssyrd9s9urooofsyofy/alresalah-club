'use server'

import { createClient } from '@/lib/supabase/server'
import { ActivityLogData } from './activity'

export async function logActivityAction(data: ActivityLogData) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            console.error('Cannot log activity: No authenticated user')
            return { success: false, error: 'No authenticated user' }
        }

        const { data: log, error } = await supabase
            .from('activity_logs')
            .insert({
                user_id: user.id,
                action_type: data.action_type,
                entity_type: data.entity_type || null,
                entity_id: data.entity_id || null,
                details: data.details || null,
            })
            .select()
            .single()

        if (error) {
            console.error('Error logging activity:', error)
            return { success: false, error: error.message }
        }

        return { success: true, log }
    } catch (error: any) {
        console.error('Exception in logActivityAction:', error)
        return { success: false, error: error.message }
    }
}
