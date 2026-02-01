import QRCode from 'qrcode'

export interface QRCodeOptions {
    width?: number
    margin?: number
    color?: {
        dark?: string
        light?: string
    }
}

export async function generateQRCode(
    data: string,
    options: QRCodeOptions = {}
): Promise<string> {
    try {
        const defaultOptions: QRCodeOptions = {
            width: 300,
            margin: 2,
            color: {
                dark: '#1a3a52', // Navy Blue from brand
                light: '#f5f1e8', // Beige from brand
            },
        }

        const qrOptions = { ...defaultOptions, ...options }

        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(data, qrOptions)
        return qrCodeDataUrl
    } catch (error) {
        console.error('Error generating QR code:', error)
        throw new Error('Failed to generate QR code')
    }
}

export async function generateQRCodeBuffer(
    data: string,
    options: QRCodeOptions = {}
): Promise<Buffer> {
    try {
        const defaultOptions: QRCodeOptions = {
            width: 300,
            margin: 2,
            color: {
                dark: '#1a3a52',
                light: '#f5f1e8',
            },
        }

        const qrOptions = { ...defaultOptions, ...options }

        // Generate QR code as buffer for download
        const buffer = await QRCode.toBuffer(data, qrOptions)
        return buffer
    } catch (error) {
        console.error('Error generating QR code buffer:', error)
        throw new Error('Failed to generate QR code buffer')
    }
}

export function getEntityQRUrl(entityType: string, entityId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    switch (entityType) {
        case 'form':
            return `${baseUrl}/register/${entityId}`
        case 'survey':
            return `${baseUrl}/survey/${entityId}`
        case 'announcement':
            return `${baseUrl}/announcements/${entityId}`
        case 'program':
            return `${baseUrl}/programs/${entityId}`
        default:
            return baseUrl
    }
}
