import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentSession } from '@/lib/auth/student-session';

export async function GET() {
    try {
        const session = await getStudentSession();
        if (!session) {
            return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
        }

        const supabase = await createClient();
        const { data: student, error } = await supabase
            .from('students')
            .select('*')
            .eq('id', (session as any).id)
            .single();

        if (error || !student) {
            return NextResponse.json({ error: 'الطالب غير موجود' }, { status: 404 });
        }

        return NextResponse.json({ student });
    } catch (error) {
        return NextResponse.json({ error: 'فشل تحميل البيانات' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getStudentSession();
        if (!session) {
            return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 });
        }

        const body = await request.json();
        const supabase = await createClient();

        const { data: student, error } = await supabase
            .from('students')
            .update({
                name: body.name,
                bio: body.bio,
                specialization: body.specialization,
                interests: body.interests,
                birth_date: body.birth_date,
                phone: body.phone,
            })
            .eq('id', (session as any).id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({
            message: 'تم التحديث بنجاح',
            student
        });
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'فشل تحديث البيانات' }, { status: 500 });
    }
}
