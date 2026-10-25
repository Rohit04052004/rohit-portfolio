"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { AppleIcon } from "@/components/icons"
import { usePortfolioData } from "@/lib/portfolio-data-context"
import type { AppWindow } from "@/types"

// Window titles that duplicate one of the custom nav buttons already shown
// (e.g. opening the Resume app while "Resume" nav is visible)
const NAV_LABELS = ["Projects", "Contact", "Resume"]

interface BatteryManager {
  level: number
  charging: boolean
  addEventListener: (type: "levelchange" | "chargingchange", listener: () => void) => void
}

interface MenubarProps {
  time: Date
  onLogout: () => void
  onSleep: () => void
  onShutdown: () => void
  onRestart: () => void
  onSpotlightClick: () => void
  onControlCenterClick: () => void
  onAppClick: (app: AppWindow) => void
  isDarkMode: boolean
  activeWindow: { id: string; title: string } | null
}

export default function Menubar({
  time,
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  onSpotlightClick,
  onControlCenterClick,
  onAppClick,
  isDarkMode,
  activeWindow,
}: MenubarProps) {
  const router = useRouter()
  const { profile } = usePortfolioData()
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isCharging, setIsCharging] = useState(false)
  const [showWifiToggle, setShowWifiToggle] = useState(false)
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const wifiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const formattedTime = isMobile
    ? time.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    : time.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })

  const updateBatteryStatus = (battery: BatteryManager) => {
    setBatteryLevel(Math.round(battery.level * 100))
    setIsCharging(battery.charging)
  }

  useEffect(() => {
    // Try to get battery information if available
    if ("getBattery" in navigator) {
      // @ts-expect-error - getBattery is not in the standard navigator type
      navigator
        .getBattery()
        .then((battery: BatteryManager) => {
          updateBatteryStatus(battery)

          // Listen for battery status changes
          battery.addEventListener("levelchange", () => updateBatteryStatus(battery))
          battery.addEventListener("chargingchange", () => updateBatteryStatus(battery))
        })
        .catch(() => {
          // If there's an error, default to 100%
          setBatteryLevel(100)
          setIsCharging(false)
        })
    }

    // Load WiFi state from localStorage
    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null)
      }

      if (
        wifiRef.current &&
        !wifiRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".wifi-icon")
      ) {
        setShowWifiToggle(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleMenu = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null)
    } else {
      setActiveMenu(menuName)
    }
  }

  const toggleWifi = () => {
    const newState = !wifiEnabled
    setWifiEnabled(newState)
    localStorage.setItem("wifiEnabled", newState.toString())
  }

  const toggleWifiPopup = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowWifiToggle(!showWifiToggle)
  }

  const openNavApp = (id: string, title: string, component: string) => {
    onAppClick({
      id,
      title,
      component,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
      size: { width: 800, height: 600 },
    })
  }

  const menuBgClass = isDarkMode ? "bg-black/40 backdrop-blur-md" : "bg-white/20 backdrop-blur-md"
  const dropdownBgClass = isDarkMode ? "bg-gray-800/90 backdrop-blur-md" : "bg-gray-200/90 backdrop-blur-md"
  const textClass = isDarkMode ? "text-white" : "text-gray-800"
  const hoverClass = isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 h-6 ${menuBgClass} z-50 flex items-center px-4 ${textClass} text-sm`}
    >
      <div className="flex-1 flex items-center min-w-0">
        <button
          className="flex items-center mr-4 hover:bg-white/10 px-2 py-0.5 rounded"
          onClick={() => toggleMenu("apple")}
        >
          <AppleIcon className="w-4 h-4" />
        </button>

        <span className="hidden sm:inline font-bold mr-4 truncate">
          {profile.name ? `${profile.name}'s Portfolio` : "Portfolio"}
        </span>

        <button
          className="hidden sm:inline-block mr-4 hover:bg-white/10 px-2 py-0.5 rounded"
          onClick={() => openNavApp("safari", "Safari", "Safari")}
        >
          Projects
        </button>
        <button
          className="hidden sm:inline-block mr-4 hover:bg-white/10 px-2 py-0.5 rounded"
          onClick={() => openNavApp("mail", "Mail", "Mail")}
        >
          Contact
        </button>
        <button
          className="hidden sm:inline-block mr-4 hover:bg-white/10 px-2 py-0.5 rounded"
          onClick={() => openNavApp("resume", "Resume", "Resume")}
        >
          Resume
        </button>

        {activeMenu === "apple" && (
          <div className={`absolute top-6 left-2 ${dropdownBgClass} rounded-lg shadow-xl ${textClass} py-1 w-56`}>
            <div className="sm:hidden">
              <button
                className={`w-full text-left px-4 py-1 ${hoverClass}`}
                onClick={() => {
                  openNavApp("safari", "Safari", "Safari")
                  setActiveMenu(null)
                }}
              >
                Projects
              </button>
              <button
                className={`w-full text-left px-4 py-1 ${hoverClass}`}
                onClick={() => {
                  openNavApp("mail", "Mail", "Mail")
                  setActiveMenu(null)
                }}
              >
                Contact
              </button>
              <button
                className={`w-full text-left px-4 py-1 ${hoverClass}`}
                onClick={() => {
                  openNavApp("resume", "Resume", "Resume")
                  setActiveMenu(null)
                }}
              >
                Resume
              </button>
              <div className="border-t border-gray-700 my-1"></div>
            </div>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`}>About This Mac</button>
            <div className="border-t border-gray-700 my-1"></div>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`} onClick={() => router.push("/admin")}>
              System Settings...
            </button>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`}>App Store...</button>
            <div className="border-t border-gray-700 my-1"></div>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`} onClick={onSleep}>
              Sleep
            </button>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`} onClick={onRestart}>
              Restart...
            </button>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`} onClick={onShutdown}>
              Shut Down...
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button className={`w-full text-left px-4 py-1 ${hoverClass}`} onClick={onLogout}>
              Log Out Rohit...
            </button>
          </div>
        )}

        {activeWindow && !NAV_LABELS.includes(activeWindow.title) && (
          <button
            className={`mr-4 font-medium hover:bg-white/10 px-2 py-0.5 rounded ${activeMenu === "app" ? "bg-white/10" : ""}`}
            onClick={() => toggleMenu("app")}
          >
            {activeWindow.title}
          </button>
        )}
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 whitespace-nowrap">
        <span className="mr-1 hidden sm:inline">{batteryLevel}%</span>
        <div className="relative shrink-0">
          <div className="w-6 h-3 border border-current rounded-sm relative">
            <div className="absolute top-0 left-0 bottom-0 bg-current" style={{ width: `${batteryLevel}%` }}></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-current rounded-r-sm"></div>
            {isCharging && <div className="absolute inset-0 flex items-center justify-center text-xs">⚡</div>}
          </div>
        </div>

        <div className="relative hidden sm:block">
          <button className="wifi-icon" onClick={toggleWifiPopup}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5"
            >
              {wifiEnabled ? (
                <>
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" />
                </>
              ) : (
                <>
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
                  <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
                  <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
                  <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" />
                </>
              )}
            </svg>
          </button>

          {showWifiToggle && (
            <div
              ref={wifiRef}
              className={`absolute top-6 right-0 ${dropdownBgClass} rounded-lg shadow-xl ${textClass} py-3 px-4 w-64`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Wi-Fi</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={wifiEnabled} onChange={toggleWifi} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        <button onClick={onSpotlightClick} className="shrink-0">
          <Search className="w-4 h-4" />
        </button>

        <button onClick={onControlCenterClick} className="flex items-center justify-center shrink-0">
          <img
            src="/control-center-icon.webp"
            alt="Control Center"
            className="w-4 h-4"
            style={{
              filter: isDarkMode ? "invert(1)" : "none",
              opacity: 0.9,
            }}
          />
        </button>

        <span className="whitespace-nowrap">{formattedTime}</span>
      </div>
    </div>
  )
}
