"use client"

import { useEffect, useRef } from "react"
import { FaGithub } from "react-icons/fa6"
import { usePortfolioData } from "@/lib/portfolio-data-context"

interface GitHubProps {
  isDarkMode?: boolean
}

export default function GitHub({ isDarkMode = true }: GitHubProps) {
  const { contact, loaded } = usePortfolioData()
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const hasOpenedRef = useRef(false)

  useEffect(() => {
    if (!loaded || hasOpenedRef.current || !contact.github) return
    hasOpenedRef.current = true
    window.open(contact.github, "_blank")
  }, [loaded, contact.github])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center">
        <FaGithub className="w-16 h-16 mx-auto mb-4" />
        {contact.github ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Opening GitHub...</h2>
            <p>Redirecting to {contact.github}</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">No GitHub link yet</h2>
            <p>The admin can add one from the dashboard.</p>
          </>
        )}
      </div>
    </div>
  )
}
