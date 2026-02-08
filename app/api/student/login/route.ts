import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { comparePassword } from '@/lib/auth/password';
import { createStudentSession } from '@/lib/auth/student-session';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبة' }, { status: 400 });
        }

        // Fetch student with password_hash
        const { data: student, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .single();

        if (studentError || !student || !student.password_hash) {
            return NextResponse.json({ error: 'بيانات الاعتماد غير صالحة' }, { status: 401 });
        }

        // Verify password
        const isValid = await comparePassword(password, student.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: 'بيانات الاعتماد غير صالحة' }, { status: 401 });
        }

        // Update last login
        await supabase
            .from('students')
            .update({ last_login: new Date().toISOString() })
            .eq('id', student.id);

        // Create session
        await createStudentSession({
            id: student.id,
            name: student.name,
            email: student.email,
            role: 'student'
        });

        return NextResponse.json({
            message: 'تم تسجيل الدخول بنجاح',
            student: { id: student.id, name: student.name, email: student.email }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'فشل تسجيل الدخول' }, { status: 500 });
    }
}
