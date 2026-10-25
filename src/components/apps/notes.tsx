"use client"

import { useState } from "react"
import { usePortfolioData } from "@/lib/portfolio-data-context"

interface NotesProps {
  isDarkMode?: boolean
}

export default function Notes({ isDarkMode = true }: NotesProps) {
  const { profile, loaded } = usePortfolioData()

  const notes = [
    {
      id: 1,
      title: "About Me",
      content: loaded
        ? `# ${profile.name}\n${profile.title}\n\n${profile.bio}`
        : "Loading...",
      date: "Today",
    },
    {
      id: 2,
      title: "Learning Goals",
      content: loaded
        ? `# Learning Goals\n\n${profile.learningGoals || "No learning goals set yet."}`
        : "Loading...",
      date: "Yesterday",
    },
  ]

  const [selectedNoteId, setSelectedNoteId] = useState(1)
  const selectedNote = notes.find((note) => note.id === selectedNoteId) ?? notes[0]

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const selectedBg = isDarkMode ? "bg-gray-700" : "bg-gray-300"

  return (
    <div className={`flex h-full ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`w-64 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-medium">Notes</h2>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 cursor-pointer ${selectedNoteId === note.id ? selectedBg : hoverBg}`}
              onClick={() => setSelectedNoteId(note.id)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{note.date}</p>
              <p className={`text-sm mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {note.content.split("\n")[0].replace(/^#+ /, "")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Note content */}
      <div className="flex-1 flex flex-col">
        <div className={`p-3 border-b ${borderColor}`}>
          <h2 className="font-medium">{selectedNote.title}</h2>
          <p className="text-xs text-gray-500">{selectedNote.date}</p>
        </div>
        <div className="flex-1 p-4 overflow-auto whitespace-pre-wrap">{selectedNote.content}</div>
      </div>
    </div>
  )
}
