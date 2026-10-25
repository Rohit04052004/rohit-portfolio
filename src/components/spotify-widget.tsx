"use client"

import { Play, Pause, SkipBack, SkipForward } from "lucide-react"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"

interface SpotifyWidgetProps {
  onOpen: () => void
}

export default function SpotifyWidget({ onOpen }: SpotifyWidgetProps) {
  const { currentTrack, isPlaying, isAudioReady, togglePlay, next, previous } = useSpotifyPlayer()

  return (
    <div className="liquid-glass-panel w-44 rounded-3xl shadow-xl p-4 text-white">
      <div className="flex items-center gap-3 cursor-pointer" onClick={onOpen}>
        <img
          src={currentTrack.cover || "/placeholder.svg"}
          alt={currentTrack.title}
          className="w-10 h-10 rounded-lg object-cover shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{currentTrack.title}</p>
          <p className="text-xs text-white/60 truncate">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            previous()
          }}
          className="text-white/70 hover:text-white"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            togglePlay()
          }}
          disabled={!isAudioReady}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black disabled:opacity-50"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            next()
          }}
          className="text-white/70 hover:text-white"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
