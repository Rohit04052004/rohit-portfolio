"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, RefreshCw, Home, Star, Plus, Search, ExternalLink } from "lucide-react"
import { FaGithub } from "react-icons/fa6"
import { usePortfolioData } from "@/lib/portfolio-data-context"

interface SafariProps {
  isDarkMode?: boolean
}

export default function Safari({ isDarkMode = true }: SafariProps) {
  const { profile, contact, projects, loaded } = usePortfolioData()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab] = useState("home")

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const toolbarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const inputBg = isDarkMode ? "bg-gray-700" : "bg-gray-200"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const cardBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }

  const socialLinks = [
    contact.github && { title: "GitHub", url: contact.github, icon: "/github.png" },
    contact.linkedin && { title: "LinkedIn", url: contact.linkedin, icon: "/linkedin.png" },
    contact.email && { title: "Email", url: `mailto:${contact.email}`, icon: "/mail.png" },
  ].filter(Boolean) as { title: string; url: string; icon: string }[]

  const frequentlyVisited = [
    { title: "GitHub", url: "https://github.com", icon: "/github.png" },
    { title: "Reddit", url: "https://reddit.com", icon: "/reddit.png" },
    { title: "ChatGPT", url: "https://chatgpt.com", icon: "/chatgpt.png" },
    { title: "Stack Overflow", url: "https://stackoverflow.com", icon: "/stackoverflow.png" },
  ]

  return (
    <div className={`h-full flex flex-col ${bgColor} ${textColor}`}>
      {/* Toolbar */}
      <div className={`${toolbarBg} border-b ${borderColor} p-2 flex items-center space-x-2`}>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          onClick={handleRefresh}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <Home className="w-4 h-4" />
        </button>

        <div className={`flex-1 flex items-center ${inputBg} rounded px-3 py-1`}>
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            value={url}
            placeholder="Search or enter a project link"
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full bg-transparent focus:outline-none text-sm ${textColor}`}
          />
        </div>

        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <Star className="w-4 h-4" />
        </button>
      </div>

      {/* Tab bar */}
      <div className={`${toolbarBg} border-b ${borderColor} px-2 flex items-center`}>
        <div
          className={`px-3 py-1 text-sm rounded-t flex items-center ${activeTab === "home" ? (isDarkMode ? "bg-gray-900" : "bg-white") : ""}`}
        >
          <span className="mr-2">Home</span>
        </div>
        <button className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
            {socialLinks.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6">SNS Links</h2>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-6 mb-12">
                  {socialLinks.map((link) => (
                    <a
                      key={link.title}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center p-4 rounded-lg ${hoverBg} cursor-pointer`}
                    >
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                        <img src={link.icon} alt={link.title} className="w-8 h-8 object-contain" />
                      </div>
                      <span className="text-sm text-center">{link.title}</span>
                    </a>
                  ))}
                </div>
              </>
            )}

            {projects.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6">Projects</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                  {projects.map((project) => (
                    <div key={project.id} className={`p-4 rounded-lg ${cardBg}`}>
                      <h3 className="font-semibold mb-1">{project.title}</h3>
                      <p className={`text-sm mb-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {project.description}
                      </p>
                      <div className="flex gap-3 text-sm">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Live
                          </a>
                        )}
                        {project.repoUrl && (
                          <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-400 hover:underline"
                          >
                            <FaGithub className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="text-2xl font-bold mb-6">Frequently Visited</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 mb-12">
              {frequentlyVisited.map((site) => (
                <a
                  key={site.title}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center p-4 rounded-lg ${hoverBg} cursor-pointer`}
                >
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                    <img src={site.icon} alt={site.title} className="w-8 h-8 object-contain" />
                  </div>
                  <span className="text-sm text-center">{site.title}</span>
                </a>
              ))}
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
              <div className={`p-6 rounded-lg ${cardBg}`}>
                <h3 className="text-xl font-semibold mb-4">
                  {loaded ? `${profile.name} - Portfolio` : "Loading..."}
                </h3>
                <p className="mb-4">{profile.bio}</p>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
