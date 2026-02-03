'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function GlobalLoading() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        let showTimer: NodeJS.Timeout
        let minTimer: NodeJS.Timeout

        const handleStart = () => {
            // Only show if it takes more than 50ms (prevents flash on fast loads)
            showTimer = setTimeout(() => {
                setIsLoading(true)
                // Once shown, keep for at least 500ms for visual stability
                minTimer = setTimeout(() => { }, 500)
            }, 50)
        }

        const handleComplete = () => {
            clearTimeout(showTimer)
            // Ensure a smooth exit
            setTimeout(() => setIsLoading(false), 400)
        }

        handleStart()
        handleComplete()

        return () => {
            clearTimeout(showTimer)
            clearTimeout(minTimer)
        }
    }, [pathname, searchParams])

    if (!isLoading) return null

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(var(--color-surface), 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'none', // Don't block interaction if it's just finishing
            opacity: isLoading ? 1 : 0,
            visibility: isLoading ? 'visible' : 'hidden',
            transition: 'opacity 0.6s ease-in-out, visibility 0.6s'
        }}>
            <div className="loading-container">
                <img src="/logo.png" alt="Loading..." style={{ height: '140px', width: 'auto', opacity: 0.8 }} />
                <div className="progress-bar-container">
                    <div className="progress-bar-fill"></div>
                </div>
            </div>

            <style jsx>{`
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-lg);
                    animation: subtle-float 4s infinite ease-in-out;
                }
                .progress-bar-container {
                    width: 160px;
                    height: 2px;
                    background: var(--color-border);
                    border-radius: 1px;
                    overflow: hidden;
                    position: relative;
                }
                .progress-bar-fill {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: var(--color-primary);
                    animation: slow-progress 3s infinite ease-in-out;
                    transform-origin: 0% 50%;
                }
                @keyframes subtle-float {
                    0%, 100% { transform: translateY(0); opacity: 0.7; }
                    50% { transform: translateY(-5px); opacity: 1; }
                }
                @keyframes slow-progress {
                    0% { transform: scaleX(0); left: 0; }
                    50% { transform: scaleX(0.4); left: 20%; }
                    100% { transform: scaleX(0); left: 100%; }
                }
            `}</style>
        </div>
    )
}
