"use client"

import { useEffect, useState } from "react"
import { Sun, Moon, MoonStar, Cloud, CloudRain, CloudSnow, CloudFog, CloudLightning } from "lucide-react"

type WeatherData = {
  city: string
  temp: number
  condition: string
  isDay: boolean
  high: number
  low: number
}

function conditionIcon(condition: string, isDay: boolean) {
  const lower = condition.toLowerCase()
  if (lower.includes("thunder")) return CloudLightning
  if (lower.includes("snow")) return CloudSnow
  if (lower.includes("rain") || lower.includes("drizzle")) return CloudRain
  if (lower.includes("fog")) return CloudFog
  if (lower.includes("cloud")) return Cloud
  if (lower === "clear" || lower === "mostly clear") return isDay ? Sun : MoonStar
  return isDay ? Sun : Moon
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && !data.error) setWeather(data)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const Icon = weather ? conditionIcon(weather.condition, weather.isDay) : MoonStar

  return (
    <div className="liquid-glass-panel w-32 min-[425px]:w-44 rounded-3xl shadow-xl p-3 min-[425px]:p-4 text-white">
      <p className="text-sm font-medium truncate">{weather?.city ?? "Bengaluru"}</p>
      <p className="text-4xl min-[425px]:text-5xl font-light leading-tight mt-1">{weather ? `${weather.temp}°` : "--°"}</p>

      <div className="mt-5 flex items-center gap-1.5 text-white/90">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm mt-1">{weather?.condition ?? "Loading..."}</p>
      <p className="text-sm text-white/70">{weather ? `H:${weather.high}° L:${weather.low}°` : ""}</p>
    </div>
  )
}
