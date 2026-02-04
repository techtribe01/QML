"use client"

import { useState, useEffect, useRef } from "react"
import { TrendingUp, Sparkles } from "lucide-react"

type Domain = "finance" | "healthcare" | "cybersecurity"

interface Benchmark {
  metric: string
  classical: string
  quantum: string
  improvement: string
}

interface BenchmarkTableProps {
  benchmarks: Benchmark[]
  domain: Domain
}

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

export function BenchmarkTable({ benchmarks, domain }: BenchmarkTableProps) {
  const colors = domainColors[domain]
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

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

  const parseValue = (value: string): number => {
    return parseFloat(value.replace('%', '').replace('+', '').replace('-', ''))
  }

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
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
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            <span className="text-sm font-medium" style={{ color: colors.primary }}>
              Performance
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Benchmark Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Head-to-head comparison with classical machine learning baselines.
          </p>
        </div>
        
        {/* Table */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-5 bg-secondary/50 border-b border-border">
              <div className="text-sm font-semibold text-foreground">Metric</div>
              <div className="text-sm font-semibold text-muted-foreground text-center">Classical ML</div>
              <div 
                className="text-sm font-semibold text-center flex items-center justify-center gap-2"
                style={{ color: colors.primary }}
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient}`} />
                QADIS Quantum
              </div>
              <div className="text-sm font-semibold text-foreground text-center">Improvement</div>
            </div>
            
            {/* Table Rows */}
            {benchmarks.map((row, index) => {
              const classicalValue = parseValue(row.classical)
              const quantumValue = parseValue(row.quantum)
              const maxValue = Math.max(classicalValue, quantumValue)
              const isFPR = row.metric.toLowerCase().includes('false')
              
              return (
                <div 
                  key={row.metric}
                  className={`grid grid-cols-4 gap-4 p-5 items-center transition-all duration-300 cursor-pointer ${
                    index !== benchmarks.length - 1 ? 'border-b border-border' : ''
                  } ${hoveredRow === index ? 'bg-secondary/30' : ''}`}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    transitionDelay: isVisible ? `${index * 100}ms` : '0ms'
                  }}
                >
                  {/* Metric Name */}
                  <div className="text-sm font-medium text-foreground">{row.metric}</div>
                  
                  {/* Classical Value with Bar */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground">{row.classical}</span>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-muted-foreground/30 rounded-full transition-all duration-1000"
                        style={{ 
                          width: isVisible ? `${(classicalValue / maxValue) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Quantum Value with Bar */}
                  <div className="flex flex-col items-center gap-2">
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {row.quantum}
                    </span>
                    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${colors.gradient}`}
                        style={{ 
                          width: isVisible ? `${(quantumValue / maxValue) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Improvement Badge */}
                  <div className="flex justify-center">
                    <div 
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-500 ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                      }`}
                      style={{ 
                        backgroundColor: isFPR ? '#00C9A710' : '#00C9A710',
                        color: '#00C9A7',
                        transitionDelay: isVisible ? `${index * 100 + 300}ms` : '0ms'
                      }}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      {row.improvement}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Card */}
          <div 
            className="mt-6 p-6 rounded-2xl border border-border bg-white flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}05 100%)` }}
              >
                <Sparkles className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <div className="font-semibold text-foreground">Average Improvement</div>
                <div className="text-sm text-muted-foreground">Across all metrics</div>
              </div>
            </div>
            <div 
              className="text-3xl font-bold"
              style={{ color: colors.primary }}
            >
              +12.4%
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
