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
            localStorage.setItem('last_active', now.toString())

            clearTimeout(timer)
            timer = setTimeout(checkTimeout, IDLE_TIMEOUT)
        }

        const checkTimeout = async () => {
            const lastActive = parseInt(localStorage.getItem('last_active') || '0')
            const now = Date.now()

            // If more than 1 minute passed since last activity
            if (now - lastActive > IDLE_TIMEOUT) {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    await supabase.auth.signOut()
                    router.push('/admin/login')
                }
            }
        }

        // Initial check on mount (for when tab is closed and reopened)
        checkTimeout()

        // Listen for activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
        events.forEach(event => window.addEventListener(event, handleActivity))

        // Initial activity marker
        handleActivity()

        return () => {
            events.forEach(event => window.removeEventListener(event, handleActivity))
            clearTimeout(timer)
        }
    }, [supabase, router])

    return null
}
