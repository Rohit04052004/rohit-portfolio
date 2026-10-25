"use client"

import { useEffect, useRef } from "react"
import { Mail } from "lucide-react"
import { usePortfolioData } from "@/lib/portfolio-data-context"

interface MailProps {
  isDarkMode?: boolean
}

export default function MailApp({ isDarkMode = true }: MailProps) {
  const { contact, loaded } = usePortfolioData()
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const hasOpenedRef = useRef(false)

  useEffect(() => {
    if (!loaded || hasOpenedRef.current || !contact.email) return
    hasOpenedRef.current = true
    window.location.href = `mailto:${contact.email}`
  }, [loaded, contact.email])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center">
        <Mail className="w-16 h-16 mx-auto mb-4" />
        {contact.email ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Opening Mail...</h2>
            <p>Redirecting to your default mail application</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">No email set yet</h2>
            <p>The admin can add one from the dashboard.</p>
          </>
        )}
      </div>
    </div>
  )
}
