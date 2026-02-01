import ExcelJS from 'exceljs'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'

export interface ExportOptions {
    courseId: string
    courseName: string
}

export async function exportApplicantsToExcel(options: ExportOptions): Promise<Buffer> {
    const supabase = await createClient()

    // Fetch applicants for the course
    const { data: applicants, error } = await supabase
        .from('applicants')
        .select('*')
        .eq('course_id', options.courseId)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(`Failed to fetch applicants: ${error.message}`)
    }

    if (!applicants || applicants.length === 0) {
        throw new Error('No applicants found for this course')
    }

    // Create workbook and worksheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(options.courseName)

    // Get all unique form field keys from responses
    const allFieldKeys = new Set<string>()
    applicants.forEach(applicant => {
        if (applicant.form_responses && typeof applicant.form_responses === 'object') {
            Object.keys(applicant.form_responses).forEach(key => allFieldKeys.add(key))
        }
    })

    // Define columns
    const columns: Partial<ExcelJS.Column>[] = [
        { header: 'Registration ID', key: 'id', width: 38 },
        { header: 'Full Name', key: 'full_name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Phone', key: 'phone', width: 18 },
        { header: 'Status', key: 'status', width: 12 },
        { header: 'Registration Date', key: 'registration_date', width: 20 },
    ]

    // Add dynamic form field columns
    Array.from(allFieldKeys).forEach(key => {
        columns.push({
            header: key,
            key: `field_${key}`,
            width: 20,
        })
    })

    worksheet.columns = columns

    // Style header row
    worksheet.getRow(1).font = { bold: true, size: 12 }
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1a3a52' }, // Navy Blue
    }
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFf5f1e8' } } // Beige text
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.getRow(1).height = 25

    // Add data rows
    applicants.forEach(applicant => {
        const rowData: any = {
            id: applicant.id,
            full_name: applicant.full_name,
            email: applicant.email,
            phone: applicant.phone,
            status: applicant.status,
            registration_date: format(new Date(applicant.registration_date), 'yyyy-MM-dd HH:mm:ss'),
        }

        // Add form field responses
        if (applicant.form_responses && typeof applicant.form_responses === 'object') {
            Object.entries(applicant.form_responses).forEach(([key, value]) => {
                rowData[`field_${key}`] = typeof value === 'object' ? JSON.stringify(value) : value
            })
        }

        worksheet.addRow(rowData)
    })

    // Add borders to all cells
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            }
        })
    })

    // Auto-filter
    worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: 1, column: columns.length },
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()
    return Buffer.from(buffer)
}

export function getExcelFileName(courseName: string): string {
    const sanitizedName = courseName.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '')
    const timestamp = format(new Date(), 'yyyy-MM-dd')
    return `${sanitizedName}_Applicants_${timestamp}.xlsx`
}
