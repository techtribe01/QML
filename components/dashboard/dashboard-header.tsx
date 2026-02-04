"use client"

import { Button } from "@/components/ui/button"
import { RefreshCcw, Download, Settings, Building2, Heart, Shield, LayoutGrid } from "lucide-react"

interface DashboardHeaderProps {
  selectedDomain: string
  setSelectedDomain: (domain: string) => void
  timeRange: string
  setTimeRange: (range: string) => void
}

const domains = [
  { id: "all", name: "All Domains", icon: LayoutGrid },
  { id: "finance", name: "Finance", icon: Building2, color: "text-finance" },
  { id: "healthcare", name: "Healthcare", icon: Heart, color: "text-healthcare" },
  { id: "cyber", name: "Cybersecurity", icon: Shield, color: "text-cyber" },
]

const timeRanges = [
  { id: "1h", name: "1H" },
  { id: "24h", name: "24H" },
  { id: "7d", name: "7D" },
  { id: "30d", name: "30D" },
]

export function DashboardHeader({ 
  selectedDomain, 
  setSelectedDomain,
  timeRange,
  setTimeRange
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      {/* Top Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Risk Dashboard
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-healthcare/10 text-healthcare text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-healthcare animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            Real-time fraud detection monitoring and analytics
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white hover:bg-secondary/50">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="bg-white hover:bg-secondary/50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 bg-white hover:bg-secondary/50">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-border">
        {/* Domain Tabs */}
        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                ${selectedDomain === domain.id 
                  ? "bg-white text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
            >
              <domain.icon className={`w-4 h-4 ${selectedDomain === domain.id && domain.color ? domain.color : ""}`} />
              <span className="hidden sm:inline">{domain.name}</span>
            </button>
          ))}
        </div>

        {/* Time Range */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground mr-2">Time Range:</span>
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-all
                  ${timeRange === range.id 
                    ? "bg-white text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {range.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
