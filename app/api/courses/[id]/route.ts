import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { courseSchema } from '@/lib/validation/schemas'
import { logActivity } from '@/lib/logging/activity'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 404 })
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin()
        const supabase = await createClient()
        const body = await request.json()

        // Validate input (partial update)
        const validatedData = courseSchema.partial().parse(body)

        const { data, error } = await supabase
            .from('courses')
            .update(validatedData)
            .eq('id', params.id)
            .select()
            .single()

        if (error) throw error

        // Log activity
        await logActivity({
            action_type: 'update',
            entity_type: 'course',
            entity_id: data.id,
            details: { title: data.title, changes: Object.keys(validatedData) },
        })

        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode || 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await requireAdmin()
        const supabase = await createClient()

        // Get course details before deletion
        const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', params.id)
            .single()

        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', params.id)

        if (error) throw error

        // Log activity
        await logActivity({
            action_type: 'delete',
            entity_type: 'course',
            entity_id: params.id,
            details: { title: course?.title },
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
