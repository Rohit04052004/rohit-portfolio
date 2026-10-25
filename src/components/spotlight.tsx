"use client"

import { useState, useEffect, useRef } from "react"
import { Search, AppWindow, Folder, Layers, FileStack } from "lucide-react"
import type { AppWindow as AppWindowType } from "@/types"

const spotlightApps = [
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes" },
  { id: "facetime", title: "FaceTime", icon: "/facetime.png", component: "FaceTime" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify" },
  { id: "snake", title: "Snake", icon: "/snake.png", component: "Snake" },
  { id: "weather", title: "Weather", icon: "/weather.png", component: "Weather" },
  { id: "resume", title: "Resume", icon: "/resume.svg", component: "Resume" },
]

interface SpotlightProps {
  onClose: () => void
  onAppClick: (app: AppWindowType) => void
  isDarkMode: boolean
}

export default function Spotlight({ onClose, onAppClick, isDarkMode }: SpotlightProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredApps, setFilteredApps] = useState(spotlightApps)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const panelClass = isDarkMode ? "liquid-glass-panel" : "liquid-glass-panel-light"
  const cardClass = isDarkMode ? "liquid-glass-card" : "liquid-glass-card-light"
  const textClass = isDarkMode ? "text-white" : "text-gray-900"
  const mutedClass = isDarkMode ? "text-white/70" : "text-gray-600"
  const placeholderClass = isDarkMode ? "placeholder:text-white/50" : "placeholder:text-gray-500"
  const hoverClass = isDarkMode ? "hover:bg-white/10" : "hover:bg-black/5"

  const handleAppClick = (app: (typeof spotlightApps)[0]) => {
    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
      size: { width: 800, height: 600 },
    })
    onClose()
  }

  useEffect(() => {
    // Focus the input when spotlight opens
    inputRef.current?.focus()

    // Handle escape key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev < filteredApps.length - 1 ? prev + 1 : prev))
        e.preventDefault()
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
        e.preventDefault()
      } else if (e.key === "Enter" && filteredApps.length > 0) {
        handleAppClick(filteredApps[selectedIndex])
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredApps, selectedIndex])

  useEffect(() => {
    if (searchTerm) {
      const filtered = spotlightApps.filter((app) => app.title.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredApps(filtered)
      setSelectedIndex(0) // Reset selection when search changes
    } else {
      setFilteredApps(spotlightApps)
    }
  }, [searchTerm])

  return (
    <div className="fixed inset-0 bg-transparent z-40 flex flex-col items-center pt-24 px-4" onClick={onClose}>
      <div className="w-full max-w-[480px] flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
        {/* Search pill */}
        <div className={`${panelClass} w-full rounded-full flex items-center gap-3 px-5 py-3.5 min-w-0`}>
          <Search className={`w-5 h-5 shrink-0 ${mutedClass}`} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            className={`w-full bg-transparent border-0 focus:outline-none text-base min-w-0 ${textClass} ${placeholderClass}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Decorative category shortcuts, matching macOS's compact Spotlight bar */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          {[AppWindow, Folder, Layers, FileStack].map((Icon, i) => (
            <div
              key={i}
              className={`${cardClass} h-11 w-11 rounded-full flex items-center justify-center ${mutedClass}`}
            >
              <Icon className="w-[18px] h-[18px]" />
            </div>
          ))}
        </div>
      </div>

      {/* Results */}
      {searchTerm && filteredApps.length > 0 && (
        <div
          className={`${panelClass} w-full max-w-[480px] mt-2 rounded-2xl overflow-hidden max-h-80 overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          {filteredApps.map((app, index) => (
            <div
              key={app.id}
              className={`flex items-center px-4 py-3 cursor-pointer ${
                index === selectedIndex ? "bg-blue-500" : hoverClass
              }`}
              onClick={() => handleAppClick(app)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <img src={app.icon || "/placeholder.svg"} alt={app.title} className="w-6 h-6 object-contain" />
              </div>
              <span className={`text-sm ${index === selectedIndex ? "text-white" : textClass}`}>{app.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
