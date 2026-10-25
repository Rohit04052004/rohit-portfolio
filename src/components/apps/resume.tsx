"use client"

import { Download, FileWarning } from "lucide-react"
import { usePortfolioData } from "@/lib/portfolio-data-context"

interface ResumeProps {
  isDarkMode?: boolean
}

export default function Resume({ isDarkMode = true }: ResumeProps) {
  const { resume, loaded } = usePortfolioData()

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const mutedColor = isDarkMode ? "text-gray-400" : "text-gray-500"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"

  if (!loaded) {
    return (
      <div className={`h-full ${bgColor} ${textColor} flex items-center justify-center`}>
        <p className={mutedColor}>Loading...</p>
      </div>
    )
  }

  if (!resume.fileUrl) {
    return (
      <div className={`h-full ${bgColor} ${textColor} p-8 flex items-center justify-center`}>
        <div className="text-center">
          <FileWarning className={`w-16 h-16 mx-auto mb-4 ${mutedColor}`} />
          <h2 className="text-xl font-semibold mb-2">No resume uploaded yet</h2>
          <p className={mutedColor}>The admin can upload one from the dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-full ${bgColor} ${textColor} flex flex-col`}>
      <div className={`flex items-center justify-between gap-3 px-4 py-2.5 border-b ${borderColor}`}>
        <p className="text-sm font-medium truncate">{resume.fileName ?? "Resume"}</p>
        <a
          href={resume.fileUrl}
          download
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
        >
          <Download className="w-3.5 h-3.5" /> Download
        </a>
      </div>
      <iframe src={resume.fileUrl} title={resume.fileName ?? "Resume"} className="flex-1 w-full bg-white" />
    </div>
  )
}
