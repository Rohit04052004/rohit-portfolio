"use client"

import { useState, useEffect } from "react"
import BootScreen from "@/components/boot-screen"
import Desktop from "@/components/desktop"
import SleepScreen from "@/components/sleep-screen"
import ShutdownScreen from "@/components/shutdown-screen"
import { PortfolioDataProvider } from "@/lib/portfolio-data-context"
import { SpotifyPlayerProvider } from "@/lib/spotify-player-context"

type SystemState = "booting" | "desktop" | "sleeping" | "shutdown" | "restarting"

export default function Home() {
  const [systemState, setSystemState] = useState<SystemState>("booting")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [screenBrightness, setScreenBrightness] = useState(90)

  useEffect(() => {
    if (systemState === "booting" || systemState === "restarting") {
      const timer = setTimeout(() => {
        setSystemState("desktop")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [systemState])

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("isDarkMode")
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === "true")
    }

    const savedBrightness = localStorage.getItem("screenBrightness")
    if (savedBrightness !== null) {
      setScreenBrightness(Number.parseInt(savedBrightness))
    }
  }, [])

  const handleLogout = () => setSystemState("restarting")
  const handleSleep = () => setSystemState("sleeping")
  const handleWakeUp = () => setSystemState("desktop")
  const handleShutdown = () => setSystemState("shutdown")
  const handleBoot = () => setSystemState("booting")
  const handleRestart = () => setSystemState("restarting")

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("isDarkMode", newMode.toString())
  }

  const updateBrightness = (value: number) => {
    setScreenBrightness(value)
    localStorage.setItem("screenBrightness", value.toString())
  }

  const renderScreen = () => {
    switch (systemState) {
      case "booting":
      case "restarting":
        return <BootScreen />

      case "desktop":
        return (
          <Desktop
            onLogout={handleLogout}
            onSleep={handleSleep}
            onShutdown={handleShutdown}
            onRestart={handleRestart}
            initialDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            initialBrightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        )

      case "sleeping":
        return <SleepScreen onWakeUp={handleWakeUp} isDarkMode={isDarkMode} />

      case "shutdown":
        return <ShutdownScreen onBoot={handleBoot} />

      default:
        return <BootScreen />
    }
  }

  return (
    <PortfolioDataProvider>
      <SpotifyPlayerProvider>
        <div className="relative">
          {renderScreen()}

          <div
            className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
            style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
          />
        </div>
      </SpotifyPlayerProvider>
    </PortfolioDataProvider>
  )
}
