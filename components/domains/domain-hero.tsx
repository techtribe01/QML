"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"

type Domain = "finance" | "healthcare" | "cybersecurity"

interface DomainHeroProps {
  domain: Domain
  title: string
  subtitle: string
  description: string
  stats: { label: string; value: string }[]
}

const domainColors: Record<Domain, { primary: string; gradient: string }> = {
  finance: { 
    primary: "#1640FF", 
    gradient: "from-[#1640FF] via-[#4169FF] to-[#6B8AFF]" 
  },
  healthcare: { 
    primary: "#00C9A7", 
    gradient: "from-[#00C9A7] via-[#00E6BE] to-[#4DFFE0]" 
  },
  cybersecurity: { 
    primary: "#7B61FF", 
    gradient: "from-[#7B61FF] via-[#9580FF] to-[#B8A6FF]" 
  },
}

const domainFeatures: Record<Domain, string[]> = {
  finance: ["Real-time monitoring", "PCI DSS compliant", "Multi-currency support"],
  healthcare: ["HIPAA compliant", "Claims analysis", "Provider verification"],
  cybersecurity: ["Zero-day detection", "SIEM integration", "Threat intelligence"],
}

export function DomainHero({ domain, title, subtitle, description, stats }: DomainHeroProps) {
  const colors = domainColors[domain]
  const features = domainFeatures[domain]
  const [mounted, setMounted] = useState(false)
  const [activeStatIndex, setActiveStatIndex] = useState(0)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [stats.length])

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 -top-32 -left-32"
          style={{ 
            background: colors.primary,
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 bottom-0 right-0"
          style={{ 
            background: colors.primary,
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ 
                backgroundColor: `${colors.primary}08`,
                borderColor: `${colors.primary}30`
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              />
              <span className="text-sm font-medium" style={{ color: colors.primary }}>
                {subtitle}
              </span>
            </div>
            
            {/* Title */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {title.split(' ').map((word, i) => (
                <span key={i}>
                  {i === 0 ? (
                    <span 
                      className={`bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}
                    >
                      {word}
                    </span>
                  ) : (
                    ` ${word}`
                  )}
                </span>
              ))}
            </h1>
            
            {/* Description */}
            <p 
              className={`text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {description}
            </p>

            {/* Features List */}
            <div 
              className={`flex flex-wrap gap-4 mb-8 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {features.map((feature) => (
                <div 
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 
                    className="w-4 h-4" 
                    style={{ color: colors.primary }}
                  />
                  {feature}
                </div>
              ))}
            </div>
            
            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Button 
                size="lg" 
                className="h-14 px-8 text-white font-semibold rounded-full group transition-all hover:scale-105"
                style={{ 
                  backgroundColor: colors.primary,
                  boxShadow: `0 8px 32px -8px ${colors.primary}50`
                }}
                asChild
              >
                <Link href="/demo">
                  Try Live Demo
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 group bg-white/60 backdrop-blur-sm border-border/60 hover:bg-white hover:border-border rounded-full" 
                asChild
              >
                <Link href="/docs" className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Play className="w-3 h-3 fill-current" />
                  </div>
                  Watch Overview
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Stats Grid with Animation */}
          <div 
            className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-500 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`group relative bg-white rounded-2xl p-6 border transition-all duration-500 cursor-pointer overflow-hidden ${
                  activeStatIndex === index 
                    ? 'border-transparent shadow-xl scale-105' 
                    : 'border-border hover:border-transparent hover:shadow-lg'
                }`}
                onClick={() => setActiveStatIndex(index)}
              >
                {/* Active indicator line */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-1 transition-all duration-500 ${
                    activeStatIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: colors.primary }}
                />

                {/* Background glow */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeStatIndex === index ? 'opacity-5' : 'opacity-0 group-hover:opacity-[0.03]'
                  }`}
                  style={{ backgroundColor: colors.primary }}
                />

                <div className="relative">
                  <div 
                    className={`text-3xl sm:text-4xl font-bold mb-2 transition-all duration-300 ${
                      activeStatIndex === index ? '' : 'group-hover:scale-105'
                    }`}
                    style={{ color: activeStatIndex === index ? colors.primary : 'inherit' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>

                {/* Corner decoration */}
                <div 
                  className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full blur-2xl transition-opacity duration-500 ${
                    activeStatIndex === index ? 'opacity-20' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: colors.primary }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
