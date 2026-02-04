"use client"

import { useEffect, useState } from "react"

const chartData = [
  { time: "00:00", finance: 45, healthcare: 32, cyber: 28 },
  { time: "04:00", finance: 52, healthcare: 38, cyber: 35 },
  { time: "08:00", finance: 78, healthcare: 55, cyber: 48 },
  { time: "12:00", finance: 92, healthcare: 68, cyber: 62 },
  { time: "16:00", finance: 85, healthcare: 72, cyber: 58 },
  { time: "20:00", finance: 68, healthcare: 45, cyber: 42 },
  { time: "Now", finance: 75, healthcare: 52, cyber: 38 },
]

const maxValue = 100

export function RiskChart() {
  const [mounted, setMounted] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Risk Score Trends</h3>
          <p className="text-sm text-muted-foreground">Events by domain over time</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-finance" />
            <span className="text-xs text-muted-foreground">Finance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-healthcare" />
            <span className="text-xs text-muted-foreground">Healthcare</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyber" />
            <span className="text-xs text-muted-foreground">Cyber</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-muted-foreground">
          <span>100</span>
          <span>75</span>
          <span>50</span>
          <span>25</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 bottom-8">
          {[0, 25, 50, 75, 100].map((value) => (
            <div 
              key={value}
              className="absolute w-full border-t border-dashed border-border/50"
              style={{ bottom: `${(value / maxValue) * 100}%` }}
            />
          ))}
        </div>

        {/* Chart area */}
        <svg className="absolute left-10 right-0 top-0 bottom-8 w-[calc(100%-2.5rem)] h-[calc(100%-2rem)]" preserveAspectRatio="none">
          {/* Finance line */}
          <polyline
            fill="none"
            stroke="var(--finance)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            points={chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100
              const y = 100 - (d.finance / maxValue) * 100
              return `${x}%,${y}%`
            }).join(' ')}
          />
          
          {/* Healthcare line */}
          <polyline
            fill="none"
            stroke="var(--healthcare)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-1000 delay-200 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            points={chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100
              const y = 100 - (d.healthcare / maxValue) * 100
              return `${x}%,${y}%`
            }).join(' ')}
          />
          
          {/* Cyber line */}
          <polyline
            fill="none"
            stroke="var(--cyber)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-1000 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}
            points={chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 100
              const y = 100 - (d.cyber / maxValue) * 100
              return `${x}%,${y}%`
            }).join(' ')}
          />

          {/* Data points */}
          {chartData.map((d, i) => {
            const x = (i / (chartData.length - 1)) * 100
            return (
              <g key={i}>
                <circle
                  cx={`${x}%`}
                  cy={`${100 - (d.finance / maxValue) * 100}%`}
                  r={hoveredPoint === i ? 6 : 4}
                  fill="var(--finance)"
                  className="transition-all duration-200"
                />
                <circle
                  cx={`${x}%`}
                  cy={`${100 - (d.healthcare / maxValue) * 100}%`}
                  r={hoveredPoint === i ? 6 : 4}
                  fill="var(--healthcare)"
                  className="transition-all duration-200"
                />
                <circle
                  cx={`${x}%`}
                  cy={`${100 - (d.cyber / maxValue) * 100}%`}
                  r={hoveredPoint === i ? 6 : 4}
                  fill="var(--cyber)"
                  className="transition-all duration-200"
                />
                {/* Hover area */}
                <rect
                  x={`${x - 7}%`}
                  y="0"
                  width="14%"
                  height="100%"
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(i)}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="cursor-pointer"
                />
              </g>
            )
          })}
        </svg>

        {/* Tooltip */}
        {hoveredPoint !== null && (
          <div 
            className="absolute bg-white border border-border rounded-lg shadow-lg p-3 z-10 pointer-events-none"
            style={{ 
              left: `calc(${(hoveredPoint / (chartData.length - 1)) * 100}% + 2.5rem)`,
              top: '20%',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="text-xs font-medium text-foreground mb-2">{chartData[hoveredPoint].time}</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-finance" />
                <span className="text-muted-foreground">Finance:</span>
                <span className="font-medium">{chartData[hoveredPoint].finance}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-healthcare" />
                <span className="text-muted-foreground">Healthcare:</span>
                <span className="font-medium">{chartData[hoveredPoint].healthcare}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyber" />
                <span className="text-muted-foreground">Cyber:</span>
                <span className="font-medium">{chartData[hoveredPoint].cyber}</span>
              </div>
            </div>
          </div>
        )}

        {/* X-axis labels */}
        <div className="absolute left-10 right-0 bottom-0 h-8 flex justify-between items-end text-xs text-muted-foreground">
          {chartData.map((d, i) => (
            <span key={i} className="text-center">{d.time}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
