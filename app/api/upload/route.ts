
import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'al-resalah';

        if (!file) {
            return NextResponse.json({ error: 'لم يتم توفير ملف' }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const result = await uploadToCloudinary(fileBase64, folder);

        return NextResponse.json({
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error: any) {
        console.error('Cloudinary API error:', error);
        return NextResponse.json(
            { error: 'فشل رفع الصورة سحابياً' },
            { status: 500 }
        );
    }
}
