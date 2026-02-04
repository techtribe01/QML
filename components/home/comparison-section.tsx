"use client"

import { useState, useEffect, useRef } from "react"
import { Check, X, TrendingUp, Zap, Brain, Shield, Clock, RefreshCw } from "lucide-react"

const comparisonData = [
  {
    metric: "Precision Rate",
    classical: { value: "82-85%", score: 83 },
    quantum: { value: "92-97%", score: 95 },
    icon: TrendingUp,
    description: "Accuracy in detecting true fraud cases"
  },
  {
    metric: "False Positive Rate",
    classical: { value: "15-20%", score: 18 },
    quantum: { value: "5-8%", score: 6 },
    icon: Shield,
    description: "Legitimate transactions incorrectly flagged",
    inverse: true
  },
  {
    metric: "Feature Processing",
    classical: { value: "Limited", score: 40 },
    quantum: { value: "Exponential", score: 95 },
    icon: Brain,
    description: "Ability to process complex data patterns"
  },
  {
    metric: "Pattern Recognition",
    classical: { value: "Linear Models", score: 55 },
    quantum: { value: "Superposition", score: 92 },
    icon: Zap,
    description: "Detection of subtle anomaly patterns"
  },
  {
    metric: "Processing Latency",
    classical: { value: "500-800ms", score: 60 },
    quantum: { value: "<100ms", score: 95 },
    icon: Clock,
    description: "Time to score each transaction"
  },
  {
    metric: "Model Adaptability",
    classical: { value: "Manual Retrain", score: 35 },
    quantum: { value: "Continuous", score: 90 },
    icon: RefreshCw,
    description: "Ability to adapt to new fraud patterns"
  },
]

function AnimatedBar({ 
  score, 
  isQuantum, 
  isVisible,
  delay = 0 
}: { 
  score: number
  isQuantum: boolean
  isVisible: boolean
  delay?: number
}) {
  const [width, setWidth] = useState(0)
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setWidth(score)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isVisible, score, delay])
  
  return (
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${
          isQuantum 
            ? 'bg-gradient-to-r from-primary via-cyber to-healthcare' 
            : 'bg-muted-foreground/30'
        }`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

export function ComparisonSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeRow, setActiveRow] = useState<number | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.03) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>
      
      {/* Gradient Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-healthcare/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-healthcare" />
            <span className="text-sm font-medium text-muted-foreground">Performance Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Classical ML vs{" "}
            <span className="gradient-text">Quantum ML</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            See the measurable difference quantum machine learning brings to fraud detection accuracy and speed.
          </p>
        </div>
        
        {/* Comparison Cards */}
        <div className="max-w-5xl mx-auto">
          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <span className="text-sm text-muted-foreground">Classical ML</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-healthcare" />
              <span className="text-sm font-medium text-foreground">QADIS Quantum</span>
            </div>
          </div>
          
          {/* Comparison Grid */}
          <div className="grid gap-4">
            {comparisonData.map((row, index) => {
              const Icon = row.icon
              const isActive = activeRow === index
              
              return (
                <div 
                  key={row.metric}
                  className={`
                    relative bg-white rounded-2xl border transition-all duration-500
                    ${isActive ? 'border-primary/30 shadow-lg shadow-primary/5 scale-[1.02]' : 'border-border hover:border-border/80'}
                  `}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${index * 100}ms`
                  }}
                  onMouseEnter={() => setActiveRow(index)}
                  onMouseLeave={() => setActiveRow(null)}
                >
                  {/* Active Indicator */}
                  <div className={`
                    absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300
                    ${isActive ? 'bg-gradient-to-b from-primary via-cyber to-healthcare' : 'bg-transparent'}
                  `} />
                  
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                        ${isActive 
                          ? 'bg-gradient-to-br from-primary/10 to-healthcare/10' 
                          : 'bg-secondary'
                        }
                      `}>
                        <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-foreground">{row.metric}</h3>
                          <div className="flex items-center gap-1 text-healthcare">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-semibold">
                              +{row.inverse 
                                ? Math.round((row.classical.score - row.quantum.score) / row.classical.score * 100)
                                : Math.round((row.quantum.score - row.classical.score) / row.classical.score * 100)
                              }%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{row.description}</p>
                        
                        {/* Comparison Bars */}
                        <div className="space-y-3">
                          {/* Classical */}
                          <div className="flex items-center gap-4">
                            <div className="w-24 flex items-center gap-2">
                              <X className="w-4 h-4 text-muted-foreground/50" />
                              <span className="text-sm text-muted-foreground">{row.classical.value}</span>
                            </div>
                            <div className="flex-1">
                              <AnimatedBar 
                                score={row.classical.score} 
                                isQuantum={false} 
                                isVisible={isVisible}
                                delay={index * 100 + 200}
                              />
                            </div>
                          </div>
                          
                          {/* Quantum */}
                          <div className="flex items-center gap-4">
                            <div className="w-24 flex items-center gap-2">
                              <Check className="w-4 h-4 text-healthcare" />
                              <span className="text-sm font-medium text-foreground">{row.quantum.value}</span>
                            </div>
                            <div className="flex-1">
                              <AnimatedBar 
                                score={row.quantum.score} 
                                isQuantum={true} 
                                isVisible={isVisible}
                                delay={index * 100 + 400}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Avg. Precision Gain", value: "+15%", color: "text-primary" },
              { label: "False Positive Reduction", value: "-67%", color: "text-healthcare" },
              { label: "Latency Improvement", value: "5x", color: "text-cyber" },
              { label: "Adaptation Speed", value: "Real-time", color: "text-primary" },
            ].map((stat, i) => (
              <div 
                key={stat.label}
                className="text-center p-4 rounded-xl bg-white border border-border"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${800 + i * 100}ms`,
                  transition: 'all 0.5s ease-out'
                }}
              >
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
