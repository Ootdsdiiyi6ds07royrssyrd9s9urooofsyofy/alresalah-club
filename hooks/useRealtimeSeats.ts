'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Course {
    id: string
    available_seats: number
    total_seats: number
}

export function useRealtimeSeats(courseId: string) {
    const [seats, setSeats] = useState<{ available: number; total: number } | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // Fetch initial data
        const fetchSeats = async () => {
            const { data, error } = await supabase
                .from('courses')
                .select('available_seats, total_seats')
                .eq('id', courseId)
                .single()

            if (!error && data) {
                setSeats({
                    available: data.available_seats,
                    total: data.total_seats,
                })
            }
            setLoading(false)
        }

        fetchSeats()

        // Subscribe to real-time updates
        const channel = supabase
            .channel(`course-${courseId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'courses',
                    filter: `id=eq.${courseId}`,
                },
                (payload) => {
                    const newData = payload.new as Course
                    setSeats({
                        available: newData.available_seats,
                        total: newData.total_seats,
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [courseId])

    return { seats, loading }
}
