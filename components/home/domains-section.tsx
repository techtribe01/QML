"use client"

import Link from "next/link"
import { ArrowRight, Building2, Heart, Shield, TrendingUp, TrendingDown } from "lucide-react"
import { useState } from "react"

const domains = [
  {
    id: "finance",
    title: "Finance",
    subtitle: "Financial Fraud Detection",
    description: "Credit card fraud detection, transaction anomaly identification, and real-time risk scoring for financial institutions.",
    icon: Building2,
    color: "finance",
    gradient: "from-[#1640FF] to-[#4169FF]",
    bgGradient: "from-[#1640FF]/5 via-transparent to-transparent",
    stats: [
      { label: "Precision", value: "94.2%", trend: "up", change: "+12%" },
      { label: "FP Reduction", value: "22%", trend: "down", change: "-8%" },
    ],
    features: ["Real-time scoring", "Pattern recognition", "Risk analytics"],
    href: "/finance",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    subtitle: "Claims Fraud Detection",
    description: "Insurance claims abuse detection, billing fraud identification, and provider anomaly monitoring.",
    icon: Heart,
    color: "healthcare",
    gradient: "from-[#00C9A7] to-[#00E6BE]",
    bgGradient: "from-[#00C9A7]/5 via-transparent to-transparent",
    stats: [
      { label: "Precision", value: "91.8%", trend: "up", change: "+10%" },
      { label: "FP Reduction", value: "19%", trend: "down", change: "-6%" },
    ],
    features: ["Claims analysis", "Provider scoring", "Abuse detection"],
    href: "/healthcare",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    subtitle: "Threat Detection System",
    description: "Network intrusion detection, threat pattern recognition, and real-time security event analysis.",
    icon: Shield,
    color: "cyber",
    gradient: "from-[#7B61FF] to-[#9580FF]",
    bgGradient: "from-[#7B61FF]/5 via-transparent to-transparent",
    stats: [
      { label: "Precision", value: "93.5%", trend: "up", change: "+11%" },
      { label: "FP Reduction", value: "21%", trend: "down", change: "-7%" },
    ],
    features: ["Intrusion detection", "Threat analysis", "Event monitoring"],
    href: "/cybersecurity",
  },
]

function DomainCard({ domain, index }: { domain: typeof domains[0], index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link
      href={domain.href}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Container */}
      <div className="relative h-full bg-white rounded-2xl border border-border/60 overflow-hidden transition-all duration-500 hover:border-transparent hover:shadow-2xl hover:shadow-black/[0.08] hover:-translate-y-1">
        
        {/* Gradient Background on Hover */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${domain.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        />
        
        {/* Animated Border Gradient */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, var(--${domain.color}) 0%, transparent 50%)`,
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        />
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${domain.gradient} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out`}
          />
        </div>
        
        {/* Content */}
        <div className="relative p-8">
          {/* Icon & Badge Row */}
          <div className="flex items-start justify-between mb-6">
            <div 
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
              style={{
                boxShadow: isHovered ? `0 8px 32px -8px var(--${domain.color})` : 'none'
              }}
            >
              <domain.icon className="w-7 h-7 text-white" />
            </div>
            
            {/* Live Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/80 text-xs font-medium text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
          </div>
          
          {/* Title & Description */}
          <div className="mb-6">
            <p 
              className="text-xs font-semibold uppercase tracking-wider mb-1 transition-colors duration-300"
              style={{ color: `var(--${domain.color})` }}
            >
              {domain.subtitle}
            </p>
            <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-foreground transition-colors">
              {domain.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {domain.description}
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {domain.stats.map((stat) => (
              <div 
                key={stat.label}
                className="bg-secondary/50 rounded-xl p-4 group-hover:bg-secondary/80 transition-colors duration-300"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span 
                    className={`flex items-center text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-blue-600'
                    }`}
                  >
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          
          {/* Features Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {domain.features.map((feature) => (
              <span 
                key={feature}
                className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/60 text-muted-foreground group-hover:bg-secondary transition-colors duration-300"
              >
                {feature}
              </span>
            ))}
          </div>
          
          {/* CTA */}
          <div 
            className="flex items-center gap-2 text-sm font-semibold transition-all duration-300"
            style={{ color: `var(--${domain.color})` }}
          >
            <span>Explore {domain.title}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
        
        {/* Decorative Corner Gradient */}
        <div 
          className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${domain.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`}
        />
      </div>
    </Link>
  )
}

export function DomainsSection() {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border/60 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-finance via-healthcare to-cyber" />
            <span className="text-sm font-medium text-muted-foreground">Industry Solutions</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-tight">
            Three Domains.{" "}
            <span className="gradient-text">One Platform.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Purpose-built quantum machine learning models optimized for each industry vertical, 
            delivering unparalleled precision and reduced false positives.
          </p>
        </div>
        
        {/* Domain Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {domains.map((domain, index) => (
            <DomainCard key={domain.id} domain={domain} index={index} />
          ))}
        </div>
        
        {/* Bottom Stats Bar */}
        <div className="mt-16 lg:mt-20 p-6 lg:p-8 rounded-2xl bg-white border border-border/60 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              { value: "10K+", label: "Events/Second" },
              { value: "<2s", label: "Scoring Latency" },
              { value: "99.9%", label: "Uptime SLA" },
              { value: "3", label: "Industry Domains" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
