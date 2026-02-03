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
            backgroundColor: 'rgba(var(--color-surface), 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            pointerEvents: 'all',
            opacity: isLoading ? 1 : 0,
            visibility: isLoading ? 'visible' : 'hidden',
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.4s'
        }}>
            <div className="loading-container">
                <img src="/logo.png" alt="Loading..." style={{ height: '160px', width: 'auto' }} />
                <div className="progress-bar-container">
                    <div className="progress-bar-fill"></div>
                </div>
            </div>

            <style jsx>{`
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--spacing-xl);
                    animation: float 3s infinite ease-in-out;
                }
                .progress-bar-container {
                    width: 200px;
                    height: 4px;
                    background: var(--color-border);
                    border-radius: 2px;
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
                    animation: progress 2s infinite ease-in-out;
                    transform-origin: 0% 50%;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes progress {
                    0% { transform: scaleX(0); left: 0; opacity: 1; }
                    50% { transform: scaleX(0.7); left: 30%; opacity: 0.8; }
                    100% { transform: scaleX(0); left: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    )
}
