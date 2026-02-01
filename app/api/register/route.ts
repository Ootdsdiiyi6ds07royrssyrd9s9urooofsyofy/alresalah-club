import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { registrationSchema } from '@/lib/validation/schemas'
import { sanitizeObject } from '@/lib/security/sanitize'
import { ConflictError, NotFoundError } from '@/lib/errors/handler'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Validate input
        const validatedData = registrationSchema.parse(body)

        // Sanitize form responses
        const sanitizedResponses = sanitizeObject(validatedData.form_responses)

        // Check if course exists and has available seats
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('id, available_seats, title')
            .eq('id', body.course_id)
            .single()

        if (courseError || !course) {
            throw new NotFoundError('Course not found')
        }

        if (course.available_seats <= 0) {
            throw new ConflictError('No available seats for this course')
        }

        // Check for duplicate registration (email or phone)
        const { data: existingApplicant } = await supabase
            .from('applicants')
            .select('id')
            .eq('course_id', body.course_id)
            .or(`email.eq.${validatedData.email},phone.eq.${validatedData.phone}`)
            .single()

        if (existingApplicant) {
            throw new ConflictError('You have already registered for this course')
        }

        // Insert applicant
        const { data: applicant, error: insertError } = await supabase
            .from('applicants')
            .insert({
                form_id: body.form_id,
                course_id: body.course_id,
                full_name: validatedData.full_name,
                email: validatedData.email,
                phone: validatedData.phone,
                form_responses: sanitizedResponses,
                status: 'pending',
            })
            .select()
            .single()

        if (insertError) {
            console.error('Insert error:', insertError)
            throw new Error('Failed to submit registration: ' + insertError.message)
        }

        // Seats are automatically updated by database trigger

        return NextResponse.json({
            data: applicant,
            message: 'Registration successful!',
        }, { status: 201 })
    } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: error.message || 'Registration failed' },
            { status: error.statusCode || 500 }
        )
    }
}
