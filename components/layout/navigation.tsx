"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Finance", href: "/finance" },
  { name: "Healthcare", href: "/healthcare" },
  { name: "Cybersecurity", href: "/cybersecurity" },
  { name: "Visualizer", href: "/visualizer" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-500",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" scroll={true} className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-finance via-cyber to-healthcare opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative text-white font-bold text-base">Q</span>
          </div>
          <span className="font-semibold text-lg text-foreground tracking-tight">QADS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              scroll={true}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href="/dashboard" scroll={true}>Dashboard</Link>
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full px-5"
            asChild
          >
            <Link href="/demo" scroll={true}>Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                scroll={true}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-lg transition-all",
                  pathname === item.href
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-border/50 space-y-2">
              <Button variant="outline" className="w-full bg-transparent border-border" asChild>
                <Link href="/dashboard" scroll={true}>Dashboard</Link>
              </Button>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium" asChild>
                <Link href="/demo" scroll={true}>Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
