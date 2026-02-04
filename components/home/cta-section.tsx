"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const features = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
  "24/7 support"
]

const stats = [
  { value: "500+", label: "Enterprise Clients" },
  { value: "$2.3B", label: "Fraud Prevented" },
  { value: "99.9%", label: "Uptime SLA" }
]

export function CTASection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.2 })

  return (
    <section 
      ref={ref}
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-healthcare" />
      
      {/* Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 blur-3xl animate-float"
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-float-delayed"
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl"
        />
      </div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Heading */}
          <h2 
            className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 text-balance transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Ready to Detect Fraud at{' '}
            <span className="relative">
              <span className="relative z-10">Quantum Speed?</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-white/20 -z-0 rounded" />
            </span>
          </h2>
          
          {/* Description */}
          <p 
            className={`text-lg lg:text-xl text-white/80 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Join leading enterprises already using QADS to protect their operations 
            with next-generation quantum machine learning.
          </p>

          {/* Feature Pills */}
          <div 
            className={`flex flex-wrap items-center justify-center gap-3 mb-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {features.map((feature, index) => (
              <div 
                key={feature}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm"
                style={{ transitionDelay: `${300 + index * 50}ms` }}
              >
                <Check className="w-3.5 h-3.5 text-healthcare" />
                <span className="text-sm text-white/90">{feature}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              size="lg" 
              className="h-14 px-10 bg-white text-primary hover:bg-white/90 font-semibold rounded-full group magnetic-btn shadow-lg shadow-black/20"
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
              className="h-14 px-10 border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold bg-transparent rounded-full magnetic-btn"
              asChild
            >
              <Link href="/contact">
                Talk to Sales
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div 
            className={`grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center"
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
