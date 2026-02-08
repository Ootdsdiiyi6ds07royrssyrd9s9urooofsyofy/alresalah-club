
import Link from 'next/link';

export default function StudentLoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                        تسجيل دخول الطلاب
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        قم بتسجيل الدخول باستخدام حساب بوابة الخاص بك
                    </p>
                </div>
                <div className="mt-8 space-y-6">
                    <Link
                        href="/api/auth/bawaba/login"
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {/* Icon placeholder */}
                            <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </span>
                        تسجيل الدخول عبر بوابة
                    </Link>
                </div>
            </div>
        </div>
    );
}
