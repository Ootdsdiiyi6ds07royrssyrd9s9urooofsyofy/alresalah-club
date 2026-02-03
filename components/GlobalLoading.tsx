'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function GlobalLoading() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const handleStart = () => setIsLoading(true)
        const handleComplete = () => {
            // Short delay for optimal feel
            setTimeout(() => setIsLoading(false), 300)
        }

        // We can't easily hook into Next.js 13+ app router transitions directly 
        // without a custom router wrapper or progress bar lib,
        // but we can trigger it on pathname/searchParams changes.
        handleStart()
        handleComplete()
    }, [pathname, searchParams])

    if (!isLoading) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(var(--color-surface), 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'all',
            transition: 'opacity 0.2s ease-in-out'
        }}>
            <div className="pulse-logo">
                <img src="/logo.png" alt="Loading..." style={{ height: '180px', width: 'auto' }} />
            </div>

            <style jsx>{`
                .pulse-logo {
                    animation: pulse 1.2s infinite ease-in-out;
                }
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.8; }
                }
            `}</style>
        </div>
    )
}
