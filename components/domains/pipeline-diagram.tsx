"use client"

import { useState, useEffect } from "react"
import { Database, Cog, Cpu, Zap, BarChart3, ChevronRight } from "lucide-react"

type Domain = "finance" | "healthcare" | "cybersecurity"

const domainColors: Record<Domain, { primary: string; gradient: string }> = {
  finance: { 
    primary: "#1640FF", 
    gradient: "from-[#1640FF] to-[#4169FF]" 
  },
  healthcare: { 
    primary: "#00C9A7", 
    gradient: "from-[#00C9A7] to-[#00E6BE]" 
  },
  cybersecurity: { 
    primary: "#7B61FF", 
    gradient: "from-[#7B61FF] to-[#9580FF]" 
  },
}

const pipelineSteps = [
  { 
    id: 1, 
    title: "Data Ingestion", 
    description: "Real-time event streaming", 
    detail: "10K+ events/second",
    icon: Database 
  },
  { 
    id: 2, 
    title: "Preprocessing", 
    description: "Feature extraction & normalization", 
    detail: "50+ features",
    icon: Cog 
  },
  { 
    id: 3, 
    title: "Classical ML", 
    description: "Initial filtering & scoring", 
    detail: "Ensemble models",
    icon: Cpu 
  },
  { 
    id: 4, 
    title: "QML Enhancement", 
    description: "Quantum circuit optimization", 
    detail: "8-qubit variational",
    icon: Zap 
  },
  { 
    id: 5, 
    title: "Risk Output", 
    description: "Final score & confidence", 
    detail: "0-100 scale",
    icon: BarChart3 
  },
]

export function PipelineDiagram({ domain }: { domain: Domain }) {
  const colors = domainColors[domain]
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [isAnimating])

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
            style={{ 
              backgroundColor: `${colors.primary}08`,
              borderColor: `${colors.primary}20`
            }}
          >
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              Architecture
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Processing Pipeline
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From raw data to actionable risk scores in under 2 seconds.
          </p>
        </div>
        
        {/* Pipeline Visualization */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-[72px] left-[10%] right-[10%] h-1 bg-border rounded-full" />
          <div 
            className="hidden lg:block absolute top-[72px] left-[10%] h-1 rounded-full transition-all duration-500"
            style={{ 
              backgroundColor: colors.primary,
              width: `${(activeStep / (pipelineSteps.length - 1)) * 80}%`
            }}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
            {pipelineSteps.map((step, index) => {
              const isActive = index === activeStep
              const isPast = index < activeStep

              return (
                <div 
                  key={step.id} 
                  className="relative flex flex-col items-center cursor-pointer group"
                  onClick={() => {
                    setActiveStep(index)
                    setIsAnimating(false)
                  }}
                >
                  {/* Step Circle */}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 z-10 transition-all duration-500 ${
                      isActive ? 'scale-110' : isPast ? '' : ''
                    }`}
                    style={{ 
                      backgroundColor: isActive || isPast ? colors.primary : 'white',
                      border: isActive || isPast ? 'none' : '2px solid #E2E8F0',
                      boxShadow: isActive ? `0 8px 24px -4px ${colors.primary}50` : 'none'
                    }}
                  >
                    <step.icon 
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: isActive || isPast ? 'white' : '#64748B' }}
                    />
                  </div>

                  {/* Card */}
                  <div 
                    className={`w-full bg-secondary/50 rounded-xl p-4 text-center transition-all duration-500 border ${
                      isActive 
                        ? 'bg-white shadow-lg border-transparent' 
                        : 'border-transparent hover:bg-white hover:shadow-md'
                    }`}
                  >
                    {/* Step Number */}
                    <div 
                      className="text-xs font-bold mb-2 transition-colors duration-300"
                      style={{ color: isActive ? colors.primary : '#94A3B8' }}
                    >
                      STEP {step.id}
                    </div>

                    {/* Title */}
                    <h3 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground mb-2">
                      {step.description}
                    </p>

                    {/* Detail Badge */}
                    <div 
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        isActive ? '' : 'opacity-60'
                      }`}
                      style={{ 
                        backgroundColor: `${colors.primary}10`,
                        color: colors.primary
                      }}
                    >
                      {step.detail}
                    </div>
                  </div>

                  {/* Arrow - Mobile & Tablet */}
                  {index < pipelineSteps.length - 1 && (
                    <div className="lg:hidden flex justify-center py-3">
                      <ChevronRight 
                        className="w-5 h-5 rotate-90 sm:rotate-0"
                        style={{ color: isPast ? colors.primary : '#CBD5E1' }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {pipelineSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveStep(index)
                  setIsAnimating(false)
                }}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ 
                  backgroundColor: index === activeStep ? colors.primary : '#E2E8F0',
                  transform: index === activeStep ? 'scale(1.5)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
