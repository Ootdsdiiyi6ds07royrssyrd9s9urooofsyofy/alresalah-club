import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { courseSchema } from '@/lib/validation/schemas'
import { logActivity } from '@/lib/logging/activity'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const isActive = searchParams.get('active')

        let query = supabase.from('courses').select('*').order('created_at', { ascending: false })

        if (isActive !== null) {
            query = query.eq('is_active', isActive === 'true')
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        await requireAdmin()
        const supabase = await createClient()
        const body = await request.json()

        // Validate input
        const validatedData = courseSchema.parse(body)

        // Set available_seats to total_seats initially
        const courseData = {
            ...validatedData,
            available_seats: validatedData.total_seats,
        }

        const { data, error } = await supabase
            .from('courses')
            .insert(courseData)
            .select()
            .single()

        if (error) throw error

        // Log activity
        await logActivity({
            action_type: 'create',
            entity_type: 'course',
            entity_id: data.id,
            details: { title: data.title },
        })

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
    }
}
