"use client"

import type React from "react"

import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react"
import { useSpotifyPlayer } from "@/lib/spotify-player-context"

interface SpotifyProps {
  isDarkMode?: boolean
}

export default function Spotify({ isDarkMode = true }: SpotifyProps) {
  const {
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
    setVolume,
    toggleMute,
  } = useSpotifyPlayer()

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const secondaryBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className={`h-full ${bgColor} ${textColor} flex flex-col`}>
      {/* Header */}
      <div className={`${secondaryBg} p-4 flex items-center justify-between`}>
        <div className="flex items-center">
          <img src="/spotify.png" alt="Spotify" className="w-8 h-8 mr-3" />
          <h2 className="font-semibold">Spotify</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-1 rounded-full hover:bg-gray-700">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-700">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-48 h-48 mb-6 rounded-md overflow-hidden shadow-lg">
          <img
            src={currentTrack.cover || "/placeholder.svg"}
            alt={`${currentTrack.title} cover`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{isAudioReady ? formatTime(duration) : currentTrack.duration}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => seek(Number.parseFloat(e.target.value))}
            disabled={!isAudioReady}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
                (currentTime / (duration || 1)) * 100
              }%, #4D4D4D ${(currentTime / (duration || 1)) * 100}%, #4D4D4D 100%)`,
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white" onClick={previous}>
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            className={`p-3 ${isAudioReady ? "bg-white hover:scale-105" : "bg-gray-400"} rounded-full transition-transform`}
            onClick={togglePlay}
            disabled={!isAudioReady}
          >
            {isPlaying ? <Pause className="w-8 h-8 text-black" /> : <Play className="w-8 h-8 text-black" />}
          </button>

          <button className="p-2 rounded-full hover:bg-gray-700 text-gray-300 hover:text-white" onClick={next}>
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center w-full max-w-xs">
          <button className="p-2 rounded-full hover:bg-gray-700 mr-2" onClick={toggleMute}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number.parseFloat(e.target.value))}
            className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${(isMuted ? 0 : volume) * 100}%, #4D4D4D ${
                (isMuted ? 0 : volume) * 100
              }%, #4D4D4D 100%)`,
            }}
          />
        </div>
      </div>

      {/* Playlist */}
      <div className={`${secondaryBg} p-4`}>
        <h3 className="font-medium mb-2">Playlist</h3>
        <div className="space-y-2">
          {playlist.map((track, index) => (
            <div
              key={index}
              className={`flex items-center p-2 rounded cursor-pointer ${
                currentTrackIndex === index ? "bg-green-900/30" : "hover:bg-gray-700/30"
              }`}
              onClick={() => selectTrack(index)}
            >
              <div className="w-10 h-10 mr-3 rounded overflow-hidden">
                <img src={track.cover || "/placeholder.svg"} alt={track.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${currentTrackIndex === index ? "text-green-500" : ""}`}>
                  {track.title}
                </p>
                <p className="text-xs text-gray-400">{track.artist}</p>
              </div>
              <div className="text-xs text-gray-400">{track.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
