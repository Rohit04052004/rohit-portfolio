"use client"

import { usePortfolioData } from "@/lib/portfolio-data-context"

interface VSCodeProps {
  isDarkMode?: boolean
}

export default function VSCode(_props: VSCodeProps) {
  const { profile, projects } = usePortfolioData()

  const lines = [
    { text: `const ${profile.name.toLowerCase().replace(/\s+/g, "") || "developer"} = {`, color: "text-gray-300" },
    { text: `  role: "${profile.title || "Software Engineer"}",`, color: "text-amber-300" },
    { text: `  projects: [`, color: "text-amber-300" },
    ...projects.slice(0, 5).map((p) => ({ text: `    "${p.title}",`, color: "text-emerald-300" })),
    { text: `  ],`, color: "text-amber-300" },
    { text: `  openToWork: true,`, color: "text-amber-300" },
    { text: `}`, color: "text-gray-300" },
  ]

  return (
    <div className="h-full w-full bg-[#1e1e1e] text-sm font-mono p-6 overflow-auto">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="w-8 text-gray-500 select-none">{i + 1}</span>
          <span className={line.color}>{line.text}</span>
        </div>
      ))}
    </div>
  )
}
