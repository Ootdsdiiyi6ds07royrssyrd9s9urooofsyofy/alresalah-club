'use client'

import { useState } from 'react'
import QRCodeDisplay from './QRCodeDisplay'

interface ShareButtonProps {
    entityType: string
    entityId: string
    title: string
}

export default function ShareButton({ entityType, entityId, title }: ShareButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [copied, setCopied] = useState(false)

    const handleShare = async () => {
        // Generate shareable link
        const baseUrl = window.location.origin
        let url = ''

        switch (entityType) {
            case 'form':
                url = `${baseUrl}/register/${entityId}`
                break
            case 'survey':
                url = `${baseUrl}/survey/${entityId}`
                break
            case 'announcement':
                url = `${baseUrl}/announcements/${entityId}`
                break
            case 'program':
                url = `${baseUrl}/programs/${entityId}`
                break
            default:
                url = baseUrl
        }

        setShareUrl(url)
        setShowModal(true)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <>
            <button onClick={handleShare} className="btn btn-secondary btn-sm">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
            </button>

            {showModal && (
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="modal-content card"
                        style={{
                            maxWidth: '500px',
                            width: '90%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Share: {title}</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn btn-secondary btn-sm"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="label">Shareable Link</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="input"
                                    style={{ flex: 1 }}
                                />
                                <button onClick={handleCopy} className="btn btn-primary">
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="label">QR Code</label>
                            <QRCodeDisplay data={shareUrl} title={title} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
