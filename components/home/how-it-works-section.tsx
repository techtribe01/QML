"use client"

import { useState, useEffect } from "react"
import { Database, Cpu, BarChart3, Bell, ArrowRight, Zap, Check } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Data Ingestion",
    subtitle: "Connect & Stream",
    description: "Real-time event streaming from your existing data infrastructure with zero-latency connectors",
    icon: Database,
    color: "#1640FF",
    features: ["10K+ events/sec", "Multi-source", "Real-time"],
    detail: "Seamlessly integrate with existing databases, APIs, and streaming platforms"
  },
  {
    id: 2,
    title: "QML Processing",
    subtitle: "Quantum Analysis",
    description: "Quantum-enhanced feature encoding using variational circuits for superior pattern detection",
    icon: Cpu,
    color: "#7B61FF",
    features: ["8-qubit circuits", "Hybrid model", "GPU accelerated"],
    detail: "Proprietary quantum algorithms that outperform classical ML by 15%"
  },
  {
    id: 3,
    title: "Risk Scoring",
    subtitle: "Intelligent Assessment",
    description: "Multi-dimensional risk analysis with confidence intervals and explainable outputs",
    icon: BarChart3,
    color: "#00C9A7",
    features: ["0-100 score", "Confidence %", "Explainable AI"],
    detail: "Transparent scoring with full audit trail and reasoning"
  },
  {
    id: 4,
    title: "Alert & Action",
    subtitle: "Automated Response",
    description: "Intelligent alerting with customizable thresholds and automated response workflows",
    icon: Bell,
    color: "#F59E0B",
    features: ["< 2s latency", "Auto-block", "Webhooks"],
    detail: "Integrate with your existing SIEM, ticketing, and response systems"
  },
]

function AnimatedConnector({ isActive, color }: { isActive: boolean; color: string }) {
  return (
    <div className="hidden lg:flex items-center justify-center w-16 relative">
      {/* Line */}
      <div className="absolute h-0.5 w-full bg-border overflow-hidden">
        <div 
          className="h-full transition-all duration-700 ease-out"
          style={{ 
            width: isActive ? '100%' : '0%',
            background: `linear-gradient(90deg, ${color}, ${color})`
          }}
        />
      </div>
      {/* Arrow */}
      <div 
        className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
          isActive ? 'bg-white shadow-md' : 'bg-secondary'
        }`}
      >
        <ArrowRight 
          className={`w-3 h-3 transition-colors duration-300 ${
            isActive ? 'text-foreground' : 'text-muted-foreground'
          }`} 
        />
      </div>
    </div>
  )
}

function StepCard({ 
  step, 
  index, 
  isActive, 
  isCompleted,
  onClick 
}: { 
  step: typeof steps[0]
  index: number
  isActive: boolean
  isCompleted: boolean
  onClick: () => void
}) {
  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 ${
        isActive ? 'scale-105 z-20' : 'scale-100 z-10'
      }`}
      onClick={onClick}
    >
      {/* Card */}
      <div 
        className={`relative bg-white rounded-2xl p-6 border transition-all duration-500 h-full ${
          isActive 
            ? 'border-transparent shadow-xl' 
            : 'border-border hover:border-border/80 hover:shadow-lg'
        }`}
        style={{
          boxShadow: isActive ? `0 20px 40px -12px ${step.color}20` : undefined
        }}
      >
        {/* Active indicator line */}
        <div 
          className="absolute top-0 left-6 right-6 h-1 rounded-b-full transition-all duration-500"
          style={{ 
            background: isActive ? step.color : 'transparent',
            opacity: isActive ? 1 : 0
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div 
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
              isActive ? 'scale-110' : 'group-hover:scale-105'
            }`}
            style={{ 
              background: isActive ? step.color : `${step.color}10`,
            }}
          >
            <step.icon 
              className={`w-7 h-7 transition-colors duration-300 ${
                isActive ? 'text-white' : ''
              }`}
              style={{ color: isActive ? 'white' : step.color }}
            />
          </div>

          {/* Step number / Check */}
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              isCompleted 
                ? 'bg-green-500 text-white' 
                : isActive 
                  ? 'text-white' 
                  : 'bg-secondary text-muted-foreground'
            }`}
            style={{ 
              background: isActive && !isCompleted ? step.color : undefined 
            }}
          >
            {isCompleted ? <Check className="w-4 h-4" /> : step.id}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 mb-4">
          <p 
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: step.color }}
          >
            {step.subtitle}
          </p>
          <h3 className="text-lg font-semibold text-foreground">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {step.features.map((feature) => (
            <span 
              key={feature}
              className="px-2 py-1 text-xs font-medium rounded-md bg-secondary text-muted-foreground"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Expanded detail (only when active) */}
        <div 
          className={`overflow-hidden transition-all duration-500 ${
            isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <Zap className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: step.color }} />
              {step.detail}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile connector */}
      {index < steps.length - 1 && (
        <div className="lg:hidden flex justify-center py-4">
          <div className="flex flex-col items-center gap-1">
            <div 
              className="w-0.5 h-6 transition-colors duration-300"
              style={{ background: isCompleted ? step.color : '#E2E8F0' }}
            />
            <ArrowRight 
              className="w-4 h-4 rotate-90 transition-colors duration-300"
              style={{ color: isCompleted ? step.color : '#94A3B8' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Auto-advance steps
  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [mounted])

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-finance via-cyber to-healthcare" />
            <span className="text-sm font-medium text-muted-foreground">Quantum Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From data ingestion to actionable insights in under 2 seconds, 
            powered by our quantum-classical hybrid architecture.
          </p>
        </div>
        
        {/* Pipeline Steps */}
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-0 lg:gap-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col lg:flex-row lg:items-stretch flex-1">
              <StepCard 
                step={step}
                index={index}
                isActive={activeStep === index}
                isCompleted={activeStep > index}
                onClick={() => setActiveStep(index)}
              />
              {index < steps.length - 1 && (
                <AnimatedConnector 
                  isActive={activeStep > index} 
                  color={step.color}
                />
              )}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2 mt-12">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeStep === index ? 'w-8' : 'w-2'
              }`}
              style={{ 
                background: activeStep === index ? step.color : '#E2E8F0'
              }}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
