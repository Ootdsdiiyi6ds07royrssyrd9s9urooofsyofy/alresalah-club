'use client'

import { useState } from 'react'
import { generateQRCode } from '@/lib/qr/generator'

interface QRCodeDisplayProps {
    data: string
    title?: string
    size?: number
}

export default function QRCodeDisplay({ data, title, size = 300 }: QRCodeDisplayProps) {
    const [qrCode, setQrCode] = useState<string>('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const handleGenerate = async () => {
        setLoading(true)
        setError('')
        try {
            const qr = await generateQRCode(data, { width: size })
            setQrCode(qr)
        } catch (err) {
            setError('Failed to generate QR code')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (!qrCode) return

        const link = document.createElement('a')
        link.href = qrCode
        link.download = `${title || 'qrcode'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="qr-code-display">
            {!qrCode && !loading && (
                <button onClick={handleGenerate} className="btn btn-primary">
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
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    Generate QR Code
                </button>
            )}

            {loading && (
                <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="loading"></div>
                    <p style={{ marginTop: '1rem' }}>Generating QR Code...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            {qrCode && !loading && (
                <div className="qr-code-result fade-in" style={{ textAlign: 'center' }}>
                    {title && <h3 style={{ marginBottom: '1rem' }}>{title}</h3>}
                    <img
                        src={qrCode}
                        alt="QR Code"
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                            border: '2px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            backgroundColor: 'white',
                        }}
                    />
                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button onClick={handleDownload} className="btn btn-primary">
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
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download
                        </button>
                        <button onClick={() => setQrCode('')} className="btn btn-secondary">
                            Generate New
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
