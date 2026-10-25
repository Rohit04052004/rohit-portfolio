"use client"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"

interface HoverHeadingProps {
  text: string
  className?: string
}

export default function HoverHeading({ text, className }: HoverHeadingProps) {
  const [mouseX, setMouseX] = useState<number | null>(null)
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([])
  const baseCenters = useRef<number[]>([])

  // Measure each letter's resting (untransformed) center once, not on every
  // mousemove - reading getBoundingClientRect() of an already-scaled letter
  // would feed its own transform back into the distance calculation and
  // cause the whole line to jitter.
  const measureBaseCenters = () => {
    baseCenters.current = spanRefs.current.map((el) => {
      if (!el) return 0
      const rect = el.getBoundingClientRect()
      return rect.left + rect.width / 2
    })
  }

  useLayoutEffect(() => {
    measureBaseCenters()
  }, [text])

  useEffect(() => {
    const handleResize = () => {
      if (mouseX === null) measureBaseCenters()
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mouseX])

  const handleMouseEnter = () => measureBaseCenters()
  const handleMouseMove = (e: MouseEvent<HTMLHeadingElement>) => setMouseX(e.clientX)
  const handleMouseLeave = () => setMouseX(null)

  const getLetterStyle = (index: number): CSSProperties => {
    const base: CSSProperties = {
      display: "inline-block",
      transformOrigin: "bottom center",
    }

    if (mouseX === null) {
      return {
        ...base,
        transform: "scale(1)",
        fontWeight: 400,
        transition: "transform 0.25s ease-out, font-weight 0.25s ease-out",
      }
    }

    const center = baseCenters.current[index]
    if (center === undefined) return base

    const distance = Math.abs(mouseX - center)
    const maxDistance = 90
    const maxScale = 1.4

    if (distance > maxDistance) {
      return {
        ...base,
        transform: "scale(1)",
        fontWeight: 400,
        transition: "transform 0.15s ease-out, font-weight 0.15s ease-out",
      }
    }

    const influence = 1 - distance / maxDistance
    const scale = 1 + (maxScale - 1) * influence
    const weight = 400 + Math.round(500 * influence)

    return {
      ...base,
      transform: `scale(${scale}) translateY(${-influence * 10}px)`,
      fontWeight: weight,
      transition: "none",
    }
  }

  return (
    <h1
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto cursor-default select-none ${className ?? ""}`}
    >
      {text.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            spanRefs.current[i] = el
          }}
          style={getLetterStyle(i)}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </h1>
  )
}
