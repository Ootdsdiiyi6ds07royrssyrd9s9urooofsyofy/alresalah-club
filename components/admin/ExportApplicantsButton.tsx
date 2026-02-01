'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'
import { FileSpreadsheet, Loader2 } from 'lucide-react'

export default function ExportApplicantsButton({ courseId, courseTitle }: { courseId: string, courseTitle: string }) {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleExport = async () => {
        setLoading(true)
        try {
            // 1. Fetch Applicants with Form Responses
            const { data: applicants, error } = await supabase
                .from('applicants')
                .select('full_name, email, phone, registration_date, form_responses, status')
                .eq('course_id', courseId)

            if (error) throw error

            if (!applicants || applicants.length === 0) {
                alert('لا يوجد مسجلين في هذه الدورة حتى الآن.')
                setLoading(false)
                return
            }

            // 2. Process Data for Excel
            // Flatten the JSONB form_responses
            const exportData = applicants.map(app => {
                const responses = app.form_responses as Record<string, any> || {}

                // Base data
                const row: any = {
                    'الاسم الكامل': app.full_name,
                    'البريد الإلكتروني': app.email,
                    'رقم الجوال': app.phone,
                    'تاريخ التسجيل': new Date(app.registration_date).toLocaleDateString('ar-SA'),
                    'وقت التسجيل': new Date(app.registration_date).toLocaleTimeString('ar-SA'),
                    'الحالة': app.status === 'pending' ? 'بانتظار الموافقة' : app.status === 'approved' ? 'مقبول' : 'مرفوض'
                }

                // Add dynamic fields
                // Note: Keys in form_responses come from field_name (e.g., field_0, field_1)
                // Ideally, we'd map these to labels if we fetched form_fields, but
                // since field_name might be generic, we rely on what's stored.
                // If form_responses keys are meaningful (which they might NOT be if we use field_0),
                // it might be hard to read.
                // However, in the RegistrationForm component we stored keys as `field.field_name`.
                // In NewCoursePage, we used `field_${index}`.
                // So the keys are likely `field_0`, `field_1`.
                // This is bad for Excel export readability.
                // OPTIMIZATION: We should fetch `form_fields` to map keys to labels.

                // Let's just dump updates for now. To do it properly, we need form fields.
                Object.keys(responses).forEach(key => {
                    // Exclude standard fields if duplicated
                    if (['full_name', 'email', 'phone'].includes(key)) return
                    row[key] = responses[key]
                })

                return row
            })

            // 3. Generate Sheet
            // To make headers nice, we need to fetch the labels.
            // Let's do a quick fetch of form fields for this course's form.

            // Get form id first
            const { data: form } = await supabase
                .from('registration_forms')
                .select('id')
                .eq('course_id', courseId)
                .single()

            if (form) {
                const { data: fields } = await supabase
                    .from('form_fields')
                    .select('field_name, field_label')
                    .eq('form_id', form.id)

                if (fields) {
                    // Create a mapping
                    const labelMap: Record<string, string> = {}
                    fields.forEach(f => labelMap[f.field_name] = f.field_label)

                    // Update exportData keys
                    exportData.forEach((row: any) => {
                        Object.keys(row).forEach(key => {
                            if (labelMap[key]) {
                                row[labelMap[key]] = row[key] // Add new key with label
                                delete row[key] // Remove old key
                            }
                        })
                    })
                }
            }

            const worksheet = XLSX.utils.json_to_sheet(exportData)
            const workbook = XLSX.utils.book_new()

            // RTL option for sheet (optional, SheetJS doesn't fully support RTL layout flag easily in CE but content is fine)
            XLSX.utils.book_append_sheet(workbook, worksheet, "المسجلين")

            // 4. Download
            XLSX.writeFile(workbook, `Applicants_${courseTitle}_${new Date().toISOString().split('T')[0]}.xlsx`)

        } catch (err: any) {
            console.error(err)
            alert('حدث خطأ أثناء التصدير: ' + err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleExport}
            className="btn btn-ghost btn-sm"
            title="تصدير المسجلين إلى Excel"
            disabled={loading}
            style={{ color: 'var(--color-success)', borderColor: 'var(--color-success)' }}
        >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />}
        </button>
    )
}
