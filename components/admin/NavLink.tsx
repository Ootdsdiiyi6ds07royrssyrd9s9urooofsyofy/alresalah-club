'use client'

import React from 'react'

interface NavLinkProps {
    href: string
    icon: string
    children: React.ReactNode
}

export default function NavLink({ href, icon, children }: NavLinkProps) {
    return (
        <a
            href={href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                marginBottom: 'var(--spacing-xs)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
            }}
            className="nav-link"
        >
            <span>{icon}</span>
            <span>{children}</span>
            <style jsx>{`
                .nav-link:hover {
                    background-color: var(--color-surface-elevated);
                    color: var(--color-primary);
                }
            `}</style>
        </a>
    )
}
