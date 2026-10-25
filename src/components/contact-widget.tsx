"use client"

import { Mail } from "lucide-react"
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6"
import { usePortfolioData } from "@/lib/portfolio-data-context"

export default function ContactWidget() {
  const { contact, loaded } = usePortfolioData()

  if (!loaded) return null

  const links = [
    contact.email && { href: `mailto:${contact.email}`, icon: Mail, label: "Email" },
    contact.github && { href: contact.github, icon: FaGithub, label: "GitHub" },
    contact.linkedin && { href: contact.linkedin, icon: FaLinkedin, label: "LinkedIn" },
    contact.twitter && { href: contact.twitter, icon: FaXTwitter, label: "Twitter" },
  ].filter((link): link is { href: string; icon: typeof Mail; label: string } => Boolean(link))

  if (links.length === 0) return null

  return (
    <div className="liquid-glass-panel w-32 min-[425px]:w-44 rounded-3xl shadow-xl p-3 min-[425px]:p-4 text-white">
      <p className="text-sm font-medium mb-2 min-[425px]:mb-3">Contact</p>
      <div className="flex items-center gap-2 min-[425px]:gap-3">
        {links.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            title={label}
            className="flex h-7 w-7 min-[425px]:h-8 min-[425px]:w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <Icon className="h-3.5 w-3.5 min-[425px]:h-4 min-[425px]:w-4" />
          </a>
        ))}
      </div>
    </div>
  )
}
