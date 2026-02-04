"use client"

import { useEffect, useState } from "react"
import { CreditCard, Banknote, Building, FileText, Wifi, ArrowUpRight } from "lucide-react"

const initialEvents = [
  { id: 1, type: "Credit Card", icon: CreditCard, score: 0.92, status: "high", time: "Just now", amount: "$4,892", domain: "finance" },
  { id: 2, type: "Wire Transfer", icon: Banknote, score: 0.78, status: "medium", time: "2 min ago", amount: "$12,500", domain: "finance" },
  { id: 3, type: "ACH Payment", icon: Building, score: 0.45, status: "low", time: "5 min ago", amount: "$890", domain: "finance" },
  { id: 4, type: "Insurance Claim", icon: FileText, score: 0.88, status: "high", time: "8 min ago", amount: "$8,750", domain: "healthcare" },
  { id: 5, type: "Network Event", icon: Wifi, score: 0.34, status: "low", time: "12 min ago", amount: "-", domain: "cyber" },
]

const statusColors = {
  high: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/20", label: "High Risk" },
  medium: { bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-500/20", label: "Medium" },
  low: { bg: "bg-healthcare/10", text: "text-healthcare", border: "border-healthcare/20", label: "Low Risk" },
}

const domainColors = {
  finance: "bg-finance",
  healthcare: "bg-healthcare",
  cyber: "bg-cyber",
}

export function RiskFeed() {
  const [events, setEvents] = useState(initialEvents)
  const [newEventId, setNewEventId] = useState<number | null>(null)

  // Simulate new events coming in
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        type: ["Credit Card", "Wire Transfer", "Insurance Claim", "Network Event"][Math.floor(Math.random() * 4)],
        icon: [CreditCard, Banknote, FileText, Wifi][Math.floor(Math.random() * 4)],
        score: Math.random() * 0.6 + 0.3,
        status: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        time: "Just now",
        amount: `$${(Math.random() * 10000 + 500).toFixed(0)}`,
        domain: ["finance", "healthcare", "cyber"][Math.floor(Math.random() * 3)],
      }
      
      setNewEventId(newEvent.id)
      setEvents(prev => [newEvent as typeof prev[0], ...prev.slice(0, 4)])
      
      setTimeout(() => setNewEventId(null), 1000)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white rounded-xl border border-border h-full">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Live Risk Feed</h3>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-healthcare/10 text-healthcare text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-healthcare animate-pulse" />
              Live
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Real-time scoring events</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1">
          View All
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {events.map((event) => {
          const Icon = event.icon
          return (
            <div 
              key={event.id} 
              className={`px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-all duration-300 cursor-pointer ${
                newEventId === event.id ? "bg-primary/5 animate-pulse" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Score ring */}
                <div className="relative w-14 h-14">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-secondary"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${event.score * 150.8} 150.8`}
                      strokeLinecap="round"
                      className={statusColors[event.status as keyof typeof statusColors].text}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
                    {Math.round(event.score * 100)}
                  </span>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{event.type}</span>
                    <div className={`w-2 h-2 rounded-full ${domainColors[event.domain as keyof typeof domainColors]}`} />
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{event.time}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-foreground">{event.amount}</div>
                </div>
                
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  statusColors[event.status as keyof typeof statusColors].bg
                } ${statusColors[event.status as keyof typeof statusColors].text} ${
                  statusColors[event.status as keyof typeof statusColors].border
                }`}>
                  {statusColors[event.status as keyof typeof statusColors].label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
