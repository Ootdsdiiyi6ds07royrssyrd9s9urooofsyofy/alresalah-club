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
    const worksheet = workbook.addWorksheet(options.courseName, {
        views: [{ rightToLeft: true }] // Set RTL for Arabic users
    })

    // Define columns in Arabic
    const columns: Partial<ExcelJS.Column>[] = [
        { header: 'الاسم الكامل', key: 'full_name', width: 30 },
        { header: 'البريد الإلكتروني', key: 'email', width: 35 },
        { header: 'رقم الجوال', key: 'phone', width: 20 },
        { header: 'تاريخ التسجيل', key: 'registration_date', width: 22 },
    ]

    // Style configuration
    const headerStyle: Partial<ExcelJS.Style> = {
        font: { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF1E3A8A' } // Dark Blue
        },
        alignment: { horizontal: 'center', vertical: 'middle' },
        border: {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        }
    }

    worksheet.columns = columns
    worksheet.getRow(1).style = headerStyle

    // Add data rows
    applicants.forEach(applicant => {
        worksheet.addRow({
            full_name: applicant.full_name,
            email: applicant.email,
            phone: applicant.phone,
            registration_date: format(new Date(applicant.registration_date), 'yyyy-MM-dd HH:mm'),
        })
    })

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.alignment = { horizontal: 'right', vertical: 'middle' }
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                }
            })
        }
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
