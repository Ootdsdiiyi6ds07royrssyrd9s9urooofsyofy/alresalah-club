'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
    prompt(): Promise<void>
}

export function usePWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstallable, setIsInstallable] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
    const [isIOS, setIsIOS] = useState(false)

    useEffect(() => {
        // Check if app is already installed
        const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true
        setIsStandalone(isStandaloneMode)

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
        setIsIOS(isIOSDevice)

        // Log PWA state for debugging
        console.log('PWA Check:', { isStandaloneMode, isIOSDevice })

        const handler = (e: Event) => {
            console.log('beforeinstallprompt event fired')
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setIsInstallable(true)
        }

        window.addEventListener('beforeinstallprompt', handler)

        window.addEventListener('appinstalled', () => {
            setDeferredPrompt(null)
            setIsInstallable(false)
            setIsStandalone(true)
            console.log('PWA was installed')
        })

        return () => {
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    const installPWA = async () => {
        if (!deferredPrompt) {
            console.log('No deferred prompt available')
            return
        }

        // Show the install prompt
        await deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null)
        setIsInstallable(false)
    }

    return { isInstallable, isStandalone, isIOS, installPWA }
}
