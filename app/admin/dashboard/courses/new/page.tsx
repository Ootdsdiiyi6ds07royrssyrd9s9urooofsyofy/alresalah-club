
import CourseForm from '@/components/admin/CourseForm';

export default function NewCoursePage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">إضافة دورة جديدة</h1>
            <CourseForm />
        </div>
    );
}
