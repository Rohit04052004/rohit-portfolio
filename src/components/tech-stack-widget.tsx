"use client"

import { useEffect, useState } from "react"
import { Code2 } from "lucide-react"

type TechStackItem = {
  id: number
  name: string
  logoUrl: string | null
}

export default function TechStackWidget() {
  const [items, setItems] = useState<TechStackItem[] | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/tech-stack")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setItems(data)
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (items === null || items.length === 0) return null

  return (
    <div className="liquid-glass-panel w-44 rounded-3xl shadow-xl p-4 text-white">
      <p className="text-sm font-medium mb-3">Tech Stack</p>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            title={item.name}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 overflow-hidden"
          >
            {item.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.logoUrl} alt={item.name} className="h-full w-full object-contain p-1" />
            ) : (
              <Code2 className="w-4 h-4 text-white/60" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
