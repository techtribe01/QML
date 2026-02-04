"use client"

import { useState } from "react"
import { 
  ArrowRight, 
  CreditCard, 
  LineChart, 
  AlertTriangle,
  Network,
  Bug,
  Radar,
  Activity,
  FileSearch,
  Users
} from "lucide-react"

type Domain = "finance" | "healthcare" | "cybersecurity"

type IconName = "creditCard" | "lineChart" | "alertTriangle" | "network" | "bug" | "radar" | "activity" | "fileSearch" | "users"

interface UseCase {
  title: string
  description: string
  iconName: IconName
}

interface UseCasesProps {
  useCases: UseCase[]
  domain: Domain
}

const iconMap: Record<IconName, typeof CreditCard> = {
  creditCard: CreditCard,
  lineChart: LineChart,
  alertTriangle: AlertTriangle,
  network: Network,
  bug: Bug,
  radar: Radar,
  activity: Activity,
  fileSearch: FileSearch,
  users: Users,
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

export function UseCases({ useCases, domain }: UseCasesProps) {
  const colors = domainColors[domain]
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-secondary/30">
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
              Applications
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Real-World Use Cases
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how quantum machine learning transforms fraud detection across critical scenarios.
          </p>
        </div>
        
        {/* Use Case Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const IconComponent = iconMap[useCase.iconName]
            return (
              <div 
                key={useCase.title}
                className="group relative bg-white rounded-2xl p-8 border border-border hover:border-transparent transition-all duration-500 cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  boxShadow: hoveredIndex === index 
                    ? `0 20px 40px -12px ${colors.primary}20`
                    : 'none'
                }}
              >
                {/* Top accent line */}
                <div 
                  className="absolute top-0 left-0 h-1 transition-all duration-500"
                  style={{ 
                    backgroundColor: colors.primary,
                    width: hoveredIndex === index ? '100%' : '0%'
                  }}
                />

                {/* Background glow */}
                <div 
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-opacity duration-500"
                  style={{ 
                    backgroundColor: colors.primary,
                    opacity: hoveredIndex === index ? 0.1 : 0
                  }}
                />
                
                {/* Number Badge */}
                <div 
                  className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  style={{ 
                    backgroundColor: hoveredIndex === index ? colors.primary : `${colors.primary}10`,
                    color: hoveredIndex === index ? 'white' : colors.primary
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primary}05 100%)`
                  }}
                >
                  <IconComponent 
                    className="w-7 h-7 transition-transform duration-300"
                    style={{ color: colors.primary }}
                  />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-3 pr-12 transition-colors duration-300">
                  {useCase.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {useCase.description}
                </p>

                {/* Learn More Link */}
                <div 
                  className="flex items-center gap-2 text-sm font-medium transition-all duration-300"
                  style={{ 
                    color: colors.primary,
                    transform: hoveredIndex === index ? 'translateX(4px)' : 'translateX(0)'
                  }}
                >
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
