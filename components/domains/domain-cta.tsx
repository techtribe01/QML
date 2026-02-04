"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react"

type Domain = "finance" | "healthcare" | "cybersecurity"

const domainColors: Record<Domain, { primary: string; light: string }> = {
  finance: { primary: "#1640FF", light: "#4169FF" },
  healthcare: { primary: "#00C9A7", light: "#00E6BE" },
  cybersecurity: { primary: "#7B61FF", light: "#9580FF" },
}

const domainLabels: Record<Domain, string> = {
  finance: "Financial",
  healthcare: "Healthcare",
  cybersecurity: "Cybersecurity",
}

export function DomainCTA({ domain }: { domain: Domain }) {
  const colors = domainColors[domain]
  const label = domainLabels[domain]
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with Gradient */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.light} 100%)`
        }}
      />

      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-30 -top-20 -left-20"
          style={{ 
            backgroundColor: 'white',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 bottom-0 right-0"
          style={{ 
            backgroundColor: 'white',
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '3s'
          }}
        />
      </div>

      {/* Dot Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-8 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">
            Start Your Free Trial Today
          </span>
        </div>

        <h2 
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 transition-all duration-700 delay-100 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Ready to Transform Your<br />{label} Security?
        </h2>
        
        <p 
          className={`text-lg text-white/80 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Get started with QADIS today and experience the power of quantum-enhanced 
          anomaly detection for your organization.
        </p>
        
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button 
            size="lg" 
            className="h-14 px-10 bg-white hover:bg-white/90 font-semibold group rounded-full transition-all hover:scale-105"
            style={{ 
              color: colors.primary,
              boxShadow: '0 8px 32px -8px rgba(0,0,0,0.3)'
            }}
            asChild
          >
            <Link href="/demo">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-14 px-10 border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold bg-transparent rounded-full"
            asChild
          >
            <Link href="/api">
              API Documentation
              <ExternalLink className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Trust Indicators */}
        <div 
          className={`mt-16 pt-10 border-t border-white/20 transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-white/60 text-sm mb-6">Trusted by leading organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {['Enterprise A', 'FinCorp', 'SecureBank', 'TrustCo'].map((company, index) => (
              <div 
                key={company}
                className="text-white/40 font-semibold text-lg hover:text-white/60 transition-colors cursor-pointer"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
