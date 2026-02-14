import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { email, code } = await request.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'البريد الإلكتروني ورمز التحقق مطلوبان' }, { status: 400 });
        }

        // Fetch student
        const { data: student, error } = await supabase
            .from('students')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !student) {
            return NextResponse.json({ error: 'لم يتم العثور على الحساب' }, { status: 404 });
        }

        // Validate OTP
        if (student.verification_code !== code) {
            return NextResponse.json({ error: 'رمز التحقق غير صحيح' }, { status: 400 });
        }

        // Check expiry
        if (new Date(student.code_expiry) < new Date()) {
            return NextResponse.json({ error: 'انتهت صلاحية رمز التحقق' }, { status: 400 });
        }

        // Update status to pending (waiting for admin approval)
        // Clear verification code to prevent reuse
        const { error: updateError } = await supabase
            .from('students')
            .update({
                status: 'pending',
                verification_code: null,
                code_expiry: null
            })
            .eq('id', student.id);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({
            message: 'تم التحقق بنجاح. حسابك الآن قيد المراجعة من قبل الإدارة.',
            verified: true
        });

    } catch (error: any) {
        console.error('Verification error:', error);
        return NextResponse.json({ error: 'فشل التحقق' }, { status: 500 });
    }
}
