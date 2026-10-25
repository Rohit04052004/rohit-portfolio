"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"

export type PlaylistTrack = {
  title: string
  artist: string
  cover: string
  file: string
  duration: string
}

// Demo track shown until the admin uploads real tracks from the dashboard
const fallbackPlaylist: PlaylistTrack[] = [
  {
    title: "Lofi Study Beat",
    artist: "Chill Artist",
    cover: "/cozy-corner-beats.png",
    file: "/lofi-study-112191.mp3",
    duration: "3:42",
  },
]

type SpotifyPlayerValue = {
  playlist: PlaylistTrack[]
  currentTrack: PlaylistTrack
  currentTrackIndex: number
  isPlaying: boolean
  isAudioReady: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  error: string | null
  togglePlay: () => void
  next: () => void
  previous: () => void
  selectTrack: (index: number) => void
  seek: (time: number) => void
  setVolume: (value: number) => void
  toggleMute: () => void
}

const SpotifyPlayerContext = createContext<SpotifyPlayerValue | null>(null)

export function SpotifyPlayerProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>(fallbackPlaylist)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const currentTrack = playlist[currentTrackIndex] ?? playlist[0]

  // Load admin-uploaded tracks, falling back to the demo track if none exist yet
  useEffect(() => {
    let cancelled = false

    fetch("/api/tracks")
      .then((res) => res.json())
      .then((tracks: { title: string; artist: string; coverUrl: string | null; fileUrl: string }[]) => {
        if (cancelled || !Array.isArray(tracks) || tracks.length === 0) return
        setPlaylist(
          tracks.map((track) => ({
            title: track.title,
            artist: track.artist || "Unknown artist",
            cover: track.coverUrl || "/placeholder.svg",
            file: track.fileUrl,
            duration: "--:--",
          }))
        )
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  const next = () => {
    if (isPlaying && audioRef.current) audioRef.current.pause()
    setIsPlaying(false)
    setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsPlaying(true), 100)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    setIsAudioReady(false)
    setError(null)

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsAudioReady(true)
    }
    const handleEnd = () => next()
    const handleCanPlayThrough = () => setIsAudioReady(true)
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e)
      setError("Error loading audio")
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("canplaythrough", handleCanPlayThrough)
    audio.addEventListener("ended", handleEnd)
    audio.addEventListener("error", handleError as EventListener)

    audio.load()

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("canplaythrough", handleCanPlayThrough)
      audio.removeEventListener("ended", handleEnd)
      audio.removeEventListener("error", handleError as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isAudioReady) return

    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error("Error playing audio:", err)
          setIsPlaying(false)
          setError("Playback was prevented by the browser. Try clicking play again.")
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, isAudioReady])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const togglePlay = () => {
    if (!isAudioReady) return
    setIsPlaying((prev) => !prev)
  }

  const previous = () => {
    if (isPlaying && audioRef.current) audioRef.current.pause()
    setIsPlaying(false)
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
    setTimeout(() => setIsPlaying(true), 100)
  }

  const selectTrack = (index: number) => {
    if (index === currentTrackIndex) {
      togglePlay()
      return
    }
    if (isPlaying && audioRef.current) audioRef.current.pause()
    setIsPlaying(false)
    setCurrentTrackIndex(index)
    setTimeout(() => setIsPlaying(true), 100)
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (!audio) return
    try {
      audio.currentTime = time
      setCurrentTime(time)
    } catch (err) {
      console.error("Error setting time:", err)
    }
  }

  const toggleMute = () => setIsMuted((prev) => !prev)

  const value: SpotifyPlayerValue = {
    playlist,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isAudioReady,
    currentTime,
    duration,
    volume,
    isMuted,
    error,
    togglePlay,
    next,
    previous,
    selectTrack,
    seek,
    setVolume: (value: number) => {
      setVolume(value)
      setIsMuted(value === 0)
    },
    toggleMute,
  }

  return (
    <SpotifyPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} src={currentTrack.file} preload="auto" />
    </SpotifyPlayerContext.Provider>
  )
}

export function useSpotifyPlayer() {
  const ctx = useContext(SpotifyPlayerContext)
  if (!ctx) throw new Error("useSpotifyPlayer must be used within a SpotifyPlayerProvider")
  return ctx
}
