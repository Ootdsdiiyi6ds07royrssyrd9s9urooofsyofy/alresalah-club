'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Trash2, Ban } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StudentActionButtonsProps {
    studentId: string;
    currentStatus: string;
    isApproved: boolean;
}

export default function StudentActionButtons({ studentId, currentStatus, isApproved }: StudentActionButtonsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async (status: string, approved: boolean) => {
        if (!confirm('هل أنت متأكد من تغيير حالة الطالب؟')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/students/${studentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, is_approved: approved }),
            });

            if (!response.ok) throw new Error('Failed to update');

            router.refresh();
        } catch (error) {
            alert('حدث خطأ أثناء التحديث');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('هل أنت متأكد من حذف هذا الطالب نهائياً؟ ولا يمكن التراجع عن هذا الإجراء.')) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/students/${studentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            router.refresh();
        } catch (error) {
            alert('حدث خطأ أثناء الحذف');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {!isApproved && (
                <button
                    onClick={() => handleUpdateStatus('active', true)}
                    disabled={loading}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-200"
                    title="موافقة وتفعيل"
                >
                    <CheckCircle size={18} />
                </button>
            )}

            {currentStatus === 'active' && (
                <button
                    onClick={() => handleUpdateStatus('suspended', false)}
                    disabled={loading}
                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
                    title="تجميد الحساب"
                >
                    <Ban size={18} />
                </button>
            )}

            <button
                onClick={handleDelete}
                disabled={loading}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                title="حذف نهائي"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
}
