"use client"

import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

const stats = [
  {
    title: "Events Processed",
    value: 1284392,
    format: "number",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Fraud Detected",
    value: 847,
    format: "number",
    change: "+8.2%",
    changeType: "negative" as const,
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "True Positives",
    value: 94.2,
    format: "percent",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "text-healthcare",
    bgColor: "bg-healthcare/10",
  },
  {
    title: "Avg Latency",
    value: 1.8,
    format: "seconds",
    change: "-0.3s",
    changeType: "positive" as const,
    icon: Clock,
    color: "text-cyber",
    bgColor: "bg-cyber/10",
  },
]

function AnimatedNumber({ value, format }: { value: number; format: string }) {
  const [displayValue, setDisplayValue] = useState(0)
  
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = value / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue(current)
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [value])
  
  if (format === "number") {
    return <>{Math.round(displayValue).toLocaleString()}</>
  }
  if (format === "percent") {
    return <>{displayValue.toFixed(1)}%</>
  }
  if (format === "seconds") {
    return <>{displayValue.toFixed(1)}s</>
  }
  return <>{displayValue}</>
}

export function StatsOverview() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.title}
          className="group bg-white rounded-xl border border-border p-6 hover:shadow-lg hover:border-border/80 transition-all duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
              stat.changeType === 'positive' 
                ? 'bg-healthcare/10 text-healthcare' 
                : 'bg-destructive/10 text-destructive'
            }`}>
              {stat.changeType === 'positive' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stat.change}
            </div>
          </div>
          
          <div className="text-3xl font-bold text-foreground mb-1">
            <AnimatedNumber value={stat.value} format={stat.format} />
          </div>
          <div className="text-sm text-muted-foreground">
            {stat.title}
          </div>
          
          {/* Mini sparkline placeholder */}
          <div className="mt-4 h-8 flex items-end gap-0.5">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
              <div 
                key={i}
                className={`flex-1 rounded-sm ${stat.bgColor} group-hover:opacity-80 transition-opacity`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
