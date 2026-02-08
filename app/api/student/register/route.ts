import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { hashPassword } from '@/lib/auth/password';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { name, email, phone, password, national_id } = await request.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' }, { status: 400 });
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('students')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'البريد الإلكتروني مسجل مسبقاً' }, { status: 400 });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Insert into students table
        const { data: student, error: studentError } = await supabase
            .from('students')
            .insert({
                name,
                email,
                phone,
                national_id,
                password_hash: passwordHash,
            })
            .select()
            .single();

        if (studentError) throw studentError;

        // Optionally create entry in student_auth if you want to separate auth from profile
        const { error: authError } = await supabase
            .from('student_auth')
            .insert({
                student_id: student.id,
                username: email,
                password_hash: passwordHash,
            });

        if (authError) {
            console.error('Error creating student_auth:', authError);
            // Non-critical if we already have it in students table for now
        }

        return NextResponse.json({
            message: 'تم التسجيل بنجاح',
            student: { id: student.id, name: student.name, email: student.email }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'فشل التسجيل: ' + error.message }, { status: 500 });
    }
}
