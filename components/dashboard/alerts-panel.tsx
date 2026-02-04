"use client"

import { AlertTriangle, Bell, Shield, Info, X, Check, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const initialAlerts = [
  {
    id: 1,
    type: "critical",
    title: "High-Risk Transaction Cluster",
    description: "12 related high-risk events detected in the last hour",
    time: "5 min ago",
    icon: AlertTriangle,
    actionable: true,
  },
  {
    id: 2,
    type: "warning",
    title: "Unusual Activity Pattern",
    description: "Velocity anomaly detected for merchant ID #4829",
    time: "23 min ago",
    icon: Bell,
    actionable: true,
  },
  {
    id: 3,
    type: "info",
    title: "Model Update Available",
    description: "New QML model version ready for deployment",
    time: "1 hour ago",
    icon: Info,
    actionable: false,
  },
  {
    id: 4,
    type: "success",
    title: "Threat Mitigated",
    description: "Automated response blocked suspicious activity",
    time: "2 hours ago",
    icon: Shield,
    actionable: false,
  },
]

const alertStyles = {
  critical: { 
    bg: "bg-destructive/5", 
    border: "border-destructive/20", 
    icon: "text-destructive bg-destructive/10",
    dot: "bg-destructive"
  },
  warning: { 
    bg: "bg-yellow-500/5", 
    border: "border-yellow-500/20", 
    icon: "text-yellow-600 bg-yellow-500/10",
    dot: "bg-yellow-500"
  },
  info: { 
    bg: "bg-primary/5", 
    border: "border-primary/20", 
    icon: "text-primary bg-primary/10",
    dot: "bg-primary"
  },
  success: { 
    bg: "bg-healthcare/5", 
    border: "border-healthcare/20", 
    icon: "text-healthcare bg-healthcare/10",
    dot: "bg-healthcare"
  },
}

export function AlertsPanel() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  const activeAlerts = alerts.filter(a => a.type === "critical" || a.type === "warning").length

  return (
    <div className="bg-white rounded-xl border border-border h-fit">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Alerts</h3>
            {activeAlerts > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground text-xs font-medium">
                {activeAlerts}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{alerts.length} notifications</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Mark all read
        </Button>
      </div>
      
      <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
        {alerts.map((alert) => {
          const styles = alertStyles[alert.type as keyof typeof alertStyles]
          const isExpanded = expandedId === alert.id
          
          return (
            <div 
              key={alert.id}
              className={`relative p-4 rounded-lg border transition-all duration-200 cursor-pointer ${styles.bg} ${styles.border} ${
                isExpanded ? "ring-2 ring-primary/20" : "hover:border-border"
              }`}
              onClick={() => setExpandedId(isExpanded ? null : alert.id)}
            >
              {/* Priority dot */}
              {(alert.type === "critical" || alert.type === "warning") && (
                <div className={`absolute top-4 right-4 w-2 h-2 rounded-full ${styles.dot} animate-pulse`} />
              )}
              
              <div className="flex gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
                  <alert.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                  <div className="font-medium text-foreground text-sm">{alert.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.description}</div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground/60">{alert.time}</span>
                    {alert.actionable && (
                      <span className="text-xs text-primary font-medium flex items-center gap-0.5">
                        Take action
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  
                  {/* Expanded actions */}
                  {isExpanded && alert.actionable && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-white">
                        <Check className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs bg-white">
                        Investigate
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Dismiss button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    dismissAlert(alert.id)
                  }}
                  className="absolute top-3 right-3 p-1 rounded-md hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
        
        {alerts.length === 0 && (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-healthcare" />
            </div>
            <p className="text-sm text-muted-foreground">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  )
}
