'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SessionMonitor() {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const IDLE_TIMEOUT = 60 * 1000 // 1 minute in ms
        let timer: NodeJS.Timeout

        const handleActivity = () => {
            const now = Date.now()
            localStorage.setItem('admin_last_active', now.toString())

            clearTimeout(timer)
            timer = setTimeout(checkTimeout, IDLE_TIMEOUT)
        }

        const checkTimeout = async () => {
            const lastActive = parseInt(localStorage.getItem('admin_last_active') || '0')
            const now = Date.now()

            // If more than 1 minute passed since last activity
            if (now - lastActive >= IDLE_TIMEOUT) {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    await supabase.auth.signOut()
                    localStorage.removeItem('admin_last_active')
                    window.location.href = '/admin/login'
                }
            }
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                checkTimeout()
            }
        }

        // Listen for activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove']
        events.forEach(event => window.addEventListener(event, handleActivity))
        document.addEventListener('visibilitychange', handleVisibilityChange)

        handleActivity()

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity))
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            clearTimeout(timer)
        }
    }, [supabase, router])

    return null
}
