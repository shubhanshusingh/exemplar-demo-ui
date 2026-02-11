"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import tabConfig from "../tab-config.json"

declare global {
  interface Window {
    Tally?: {
      openPopup: (formId: string, options?: {
        layout?: 'default' | 'modal';
        width?: number;
        alignLeft?: boolean;
        hideTitle?: boolean;
        overlay?: boolean;
        emoji?: {
          text: string;
          animation: 'none' | 'wave' | 'tada' | 'heart-beat' | 'spin' | 'flash' | 'bounce' | 'rubber-band' | 'head-shake';
        };
        autoClose?: number;
        showOnce?: boolean;
        doNotShowAfterSubmit?: boolean;
        customFormUrl?: string;
        hiddenFields?: {
          [key: string]: any;
        };
        onOpen?: () => void;
        onClose?: () => void;
        onPageView?: (page: number) => void;
        onSubmit?: (payload: any) => void;
      }) => void;
      closePopup: (formId: string) => void;
    };
  }
}

export default function RootPage() {
  const router = useRouter()
  const formSubmittedRef = useRef(false)

  useEffect(() => {
    // Get the first enabled tab as default
    const enabledTabs = Object.entries(tabConfig.tabs)
      .filter(([_, config]) => config.enabled)
    
    if (enabledTabs.length > 0) {
      const defaultTab = enabledTabs[0][0]
      router.replace(`/${defaultTab}`)
    }
  }, [router])

  useEffect(() => {
    const formId = 'BzzvjQ'
    
    // Function to open popup with recursive onClose handler
    const openPopupWithLoop = () => {
      if (window.Tally && !formSubmittedRef.current) {
        window.Tally.openPopup(formId, {
          layout: 'modal',
          width: 700,
          overlay: true,
          doNotShowAfterSubmit: true,
          onSubmit: (payload: any) => {
            // Mark form as submitted
            formSubmittedRef.current = true
            // Form was submitted, you can handle the payload here if needed
            console.log('Form submitted:', payload)
          },
          onClose: () => {
            // Continuously reopen popup in a loop until form is submitted
            if (!formSubmittedRef.current) {
              setTimeout(openPopupWithLoop, 100)
            }
          }
        })
      }
    }
    
    // Wait for Tally script to load and open popup
    const checkTallyAndOpen = () => {
      if (window.Tally) {
        openPopupWithLoop()
      } else {
        // Retry after a short delay if Tally hasn't loaded yet
        setTimeout(checkTallyAndOpen, 100)
      }
    }

    // Start checking once component mounts
    checkTallyAndOpen()
  }, [])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Redirecting to console...</p>
      </div>
    </div>
  )
}
