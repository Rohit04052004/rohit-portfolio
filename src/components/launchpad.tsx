"use client"

import { useState, useEffect } from "react"
import { LayoutGrid, MoreHorizontal, Search } from "lucide-react"
import type { AppWindow } from "@/types"

// Same apps as dock, except launchpad itself - grouped into categories like
// the real macOS Launchpad "Applications" browser
const launchpadApps = [
  { id: "safari", title: "Safari", icon: "/safari.png", component: "Safari", category: "Utilities" },
  { id: "mail", title: "Mail", icon: "/mail.png", component: "Mail", category: "Social" },
  { id: "vscode", title: "VS Code", icon: "/vscode.png", component: "VSCode", category: "Productivity" },
  { id: "notes", title: "Notes", icon: "/notes.png", component: "Notes", category: "Productivity" },
  { id: "resume", title: "Resume", icon: "/resume.svg", component: "Resume", category: "Productivity" },
  { id: "facetime", title: "FaceTime", icon: "/facetime.png", component: "FaceTime", category: "Social" },
  { id: "terminal", title: "Terminal", icon: "/terminal.png", component: "Terminal", category: "Utilities" },
  { id: "github", title: "GitHub", icon: "/github.png", component: "GitHub", category: "Social" },
  { id: "spotify", title: "Spotify", icon: "/spotify.png", component: "Spotify", category: "Entertainment" },
  { id: "snake", title: "Snake", icon: "/snake.png", component: "Snake", category: "Entertainment" },
  { id: "weather", title: "Weather", icon: "/weather.png", component: "Weather", category: "Utilities" },
]

const categories = ["All", "Productivity", "Utilities", "Entertainment", "Social"]

interface LaunchpadProps {
  onAppClick: (app: AppWindow) => void
  onClose: () => void
}

export default function Launchpad({ onAppClick, onClose }: LaunchpadProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [filteredApps, setFilteredApps] = useState(launchpadApps)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    let apps = launchpadApps
    if (activeCategory !== "All") {
      apps = apps.filter((app) => app.category === activeCategory)
    }
    if (searchTerm) {
      apps = apps.filter((app) => app.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    setFilteredApps(apps)
  }, [searchTerm, activeCategory])

  const handleAppClick = (app: (typeof launchpadApps)[0]) => {
    onAppClick({
      id: app.id,
      title: app.title,
      component: app.component,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
      size: { width: 800, height: 600 },
    })
    onClose()
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-black/20 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        className={`liquid-glass-panel-dark w-full max-w-3xl rounded-3xl overflow-hidden transition-transform duration-300 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <LayoutGrid className="w-5 h-5 text-white/70 shrink-0" />
          <span className="text-white font-semibold">Applications</span>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 w-56">
              <Search className="w-3.5 h-3.5 text-white/50 shrink-0" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <MoreHorizontal className="w-5 h-5 text-white/50 shrink-0" />
        </div>

        {/* Category tabs */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/10 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                activeCategory === category
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* App grid */}
        <div className="p-6 max-h-[55vh] overflow-y-auto">
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-6">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer group"
                  onClick={() => handleAppClick(app)}
                >
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl group-hover:bg-white/10 transition-colors">
                    <img src={app.icon || "/placeholder.svg"} alt={app.title} className="w-12 h-12 object-contain" />
                  </div>
                  <span className="text-white text-xs text-center">{app.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-white/50 text-sm py-8">No apps found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
