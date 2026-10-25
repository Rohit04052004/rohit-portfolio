"use client"

import { useState, useEffect } from "react"
import { Wifi, Bluetooth, Volume2, VolumeX, Maximize } from "lucide-react"

interface ControlCenterProps {
  onClose: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  brightness: number
  onBrightnessChange: (value: number) => void
}

function DarkModeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
    </svg>
  )
}

export default function ControlCenter({
  onClose,
  isDarkMode,
  onToggleDarkMode,
  brightness,
  onBrightnessChange,
}: ControlCenterProps) {
  const [wifiEnabled, setWifiEnabled] = useState(true)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)
  const [volume, setVolume] = useState(75)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Load WiFi state from localStorage
  useEffect(() => {
    const savedWifi = localStorage.getItem("wifiEnabled")
    if (savedWifi !== null) {
      setWifiEnabled(savedWifi === "true")
    }

    // Check if we're in fullscreen mode
    setIsFullscreen(!!document.fullscreenElement)

    // Add fullscreen change event listener
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Update the Control Center to store WiFi state in localStorage
  const toggleWifi = () => {
    const newState = !wifiEnabled
    setWifiEnabled(newState)
    localStorage.setItem("wifiEnabled", newState.toString())
  }

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const panelClass = isDarkMode ? "liquid-glass-panel" : "liquid-glass-panel-light"
  const cardClass = isDarkMode ? "liquid-glass-card" : "liquid-glass-card-light"
  const textClass = isDarkMode ? "text-white" : "text-gray-900"
  const subTextClass = isDarkMode ? "text-white/70" : "text-gray-600"
  const iconMutedClass = isDarkMode ? "text-white/80" : "text-gray-700"
  const trackClass = isDarkMode ? "bg-white/20" : "bg-black/10"

  return (
    <div
      className={`${panelClass} fixed top-8 right-4 w-80 rounded-[28px] overflow-hidden shadow-2xl z-40`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-3">
        {/* Wi-Fi / Bluetooth pills */}
        <div className="flex flex-col gap-2 mb-3">
          <button
            className={`w-full flex items-center gap-3 rounded-2xl p-3 transition-colors ${
              wifiEnabled ? "bg-blue-500" : cardClass
            }`}
            onClick={toggleWifi}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <Wifi className={`w-5 h-5 ${wifiEnabled ? "text-blue-500" : "text-gray-400"}`} />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className={`text-sm font-semibold ${wifiEnabled ? "text-white" : textClass}`}>Wi-Fi</span>
              <span className={`text-xs ${wifiEnabled ? "text-white/70" : subTextClass}`}>
                {wifiEnabled ? "On" : "Off"}
              </span>
            </span>
          </button>

          <button
            className={`w-full flex items-center gap-3 rounded-2xl p-3 transition-colors ${
              bluetoothEnabled ? "bg-blue-500" : cardClass
            }`}
            onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
              <Bluetooth className={`w-5 h-5 ${bluetoothEnabled ? "text-blue-500" : "text-gray-400"}`} />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span className={`text-sm font-semibold ${bluetoothEnabled ? "text-white" : textClass}`}>
                Bluetooth
              </span>
              <span className={`text-xs ${bluetoothEnabled ? "text-white/70" : subTextClass}`}>
                {bluetoothEnabled ? "On" : "Off"}
              </span>
            </span>
          </button>
        </div>

        {/* Dark mode / fullscreen circles */}
        <div className="flex items-center gap-3 mb-3">
          <button
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
              isDarkMode ? "bg-white" : cardClass
            }`}
            onClick={onToggleDarkMode}
            title="Dark Mode"
          >
            <DarkModeIcon className={`w-8 h-8 ${isDarkMode ? "text-black" : "text-gray-800"}`} />
          </button>

          <button
            className={`h-16 w-16 rounded-full flex items-center justify-center transition-colors ${
              isFullscreen ? "bg-blue-500" : cardClass
            }`}
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <Maximize className={`w-6 h-6 ${isFullscreen ? "text-white" : iconMutedClass}`} />
          </button>
        </div>

        <div className={`${cardClass} rounded-2xl p-3 mb-2`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${textClass}`}>Display</span>
            <span className={`text-xs ${subTextClass}`}>{brightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={brightness}
            onChange={(e) => onBrightnessChange(Number.parseInt(e.target.value))}
            className={`w-full h-1.5 ${trackClass} rounded-full appearance-none cursor-pointer`}
          />
        </div>

        <div className={`${cardClass} rounded-2xl p-3`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${textClass}`}>Sound</span>
            <span className={`text-xs ${subTextClass}`}>{volume}%</span>
          </div>
          <div className="flex items-center gap-2">
            {volume === 0 ? (
              <VolumeX className={`w-4 h-4 ${iconMutedClass}`} />
            ) : (
              <Volume2 className={`w-4 h-4 ${iconMutedClass}`} />
            )}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number.parseInt(e.target.value))}
              className={`flex-1 h-1.5 ${trackClass} rounded-full appearance-none cursor-pointer`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
