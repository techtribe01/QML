"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useEffect, useState } from "react"
import { VIDEO_CONFIG } from "@/lib/video-config"

function AnimatedOrb({ 
  className, 
  color, 
  delay = 0,
  size = "w-72 h-72"
}: { 
  className?: string
  color: string
  delay?: number
  size?: string
}) {
  return (
    <div 
      className={`absolute ${size} rounded-full blur-[120px] opacity-20 ${className}`}
      style={{ 
        background: color,
        animation: `float 8s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  )
}

function GridPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(255,255,255,0.8)_70%)]" />
    </div>
  )
}

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 50)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])
  
  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

function StatItem({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])
  
  return (
    <div 
      className={`text-center transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground mt-2 tracking-wide uppercase">{label}</div>
    </div>
  )
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatedOrb 
          color="#1640FF" 
          className="top-1/4 -left-20" 
          delay={0}
          size="w-[500px] h-[500px]"
        />
        <AnimatedOrb 
          color="#00C9A7" 
          className="top-1/3 -right-20" 
          delay={2}
          size="w-[450px] h-[450px]"
        />
        <AnimatedOrb 
          color="#7B61FF" 
          className="bottom-1/4 left-1/3" 
          delay={4}
          size="w-[400px] h-[400px]"
        />
      </div>
      
      {/* Grid Pattern */}
      <GridPattern />
      
      {/* Noise Texture */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Video Modal */}
      {showVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowVideo(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setShowVideo(false) }}
          role="dialog"
          aria-modal="true"
          aria-label="Demo Video"
        >
          <div 
            className="relative w-[90vw] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {VIDEO_CONFIG.DEMO_VIDEO_URL ? (
              <video
                src={VIDEO_CONFIG.DEMO_VIDEO_URL}
                className="w-full h-full object-contain"
                autoPlay
                controls
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/70">
                  <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Video not configured yet.</p>
                  <p className="text-xs mt-1 opacity-60">Upload at /admin/upload-video</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors z-10"
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass mb-10 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-healthcare opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-healthcare" />
            </span>
            <span className="text-sm font-medium text-muted-foreground tracking-wide">
              Quantum-Powered Anomaly Detection
            </span>
          </div>
          
          {/* Headline */}
          <h1 
            className={`text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-foreground mb-8 text-balance transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Detect Anomalies at{" "}
            <span className="gradient-text animate-text-shimmer inline-block">
              Quantum Speed
            </span>
          </h1>
          
          {/* Subheadline */}
          <p 
            className={`text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-pretty transition-all duration-1000 delay-400 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            QADIS (Quantum Anomaly Detection Intelligence System) leverages Quantum Machine Learning to deliver unprecedented precision 
            across Finance, Healthcare, and Cybersecurity domains.
          </p>
          
          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Button 
              size="lg" 
              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full group transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/25" 
              asChild
            >
              <Link href="/demo">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 bg-white/60 backdrop-blur-sm border-border/60 hover:bg-white hover:border-border text-foreground font-medium rounded-full group transition-all duration-300"
              onClick={() => setShowVideo(true)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-finance to-healthcare flex items-center justify-center text-white">
                <Play className="w-3 h-3 fill-current" />
              </div>
              Watch Demo
            </Button>
          </div>
          
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
