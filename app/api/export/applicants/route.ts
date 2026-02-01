import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/session'
import { exportApplicantsToExcel, getExcelFileName } from '@/lib/export/excel'

export async function GET(request: NextRequest) {
    try {
        await requireAdmin()
        const { searchParams } = new URL(request.url)
        const courseId = searchParams.get('courseId')

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 })
        }

        const supabase = await createClient()

        // Get course name
        const { data: course } = await supabase
            .from('courses')
            .select('title')
            .eq('id', courseId)
            .single()

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        // Generate Excel file
        const buffer = await exportApplicantsToExcel({
            courseId,
            courseName: course.title,
        })

        const fileName = getExcelFileName(course.title)

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        })
    } catch (error: any) {
        console.error('Export error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
