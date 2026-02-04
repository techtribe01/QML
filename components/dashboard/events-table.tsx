"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal, Eye, Flag, CheckCircle } from "lucide-react"
import { useState } from "react"

const allEvents = [
  { id: "TXN-001", type: "Credit Card", source: "Finance", score: 0.92, status: "Flagged", time: "2025-02-04 14:32:18", amount: "$4,892.00" },
  { id: "TXN-002", type: "Wire Transfer", source: "Finance", score: 0.78, status: "Review", time: "2025-02-04 14:28:45", amount: "$12,500.00" },
  { id: "TXN-003", type: "ACH Payment", source: "Finance", score: 0.45, status: "Cleared", time: "2025-02-04 14:25:12", amount: "$890.00" },
  { id: "CLM-001", type: "Insurance Claim", source: "Healthcare", score: 0.88, status: "Flagged", time: "2025-02-04 14:22:33", amount: "$8,750.00" },
  { id: "NET-001", type: "Network Event", source: "Cybersecurity", score: 0.67, status: "Review", time: "2025-02-04 14:18:09", amount: "-" },
  { id: "TXN-004", type: "Credit Card", source: "Finance", score: 0.35, status: "Cleared", time: "2025-02-04 14:15:42", amount: "$234.50" },
  { id: "CLM-002", type: "Billing Anomaly", source: "Healthcare", score: 0.72, status: "Review", time: "2025-02-04 14:12:18", amount: "$3,200.00" },
]

const statusStyles = {
  Flagged: { bg: "bg-destructive/10", text: "text-destructive", icon: Flag },
  Review: { bg: "bg-yellow-500/10", text: "text-yellow-600", icon: Eye },
  Cleared: { bg: "bg-healthcare/10", text: "text-healthcare", icon: CheckCircle },
}

const sourceStyles = {
  Finance: { bg: "bg-finance/10", text: "text-finance", border: "border-finance/20" },
  Healthcare: { bg: "bg-healthcare/10", text: "text-healthcare", border: "border-healthcare/20" },
  Cybersecurity: { bg: "bg-cyber/10", text: "text-cyber", border: "border-cyber/20" },
}

interface EventsTableProps {
  selectedDomain: string
}

export function EventsTable({ selectedDomain }: EventsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filter events based on domain
  const filteredEvents = allEvents.filter(event => {
    if (selectedDomain === "all") return true
    if (selectedDomain === "finance") return event.source === "Finance"
    if (selectedDomain === "healthcare") return event.source === "Healthcare"
    if (selectedDomain === "cyber") return event.source === "Cybersecurity"
    return true
  }).filter(event => 
    searchQuery === "" || 
    event.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (selectedRows.length === filteredEvents.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredEvents.map(e => e.id))
    }
  }

  return (
    <div className="bg-white rounded-xl border border-border">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">Recent Events</h3>
          <p className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} of {allEvents.length} events
            {selectedRows.length > 0 && (
              <span className="ml-2 text-primary">({selectedRows.length} selected)</span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-4 w-48 rounded-lg border border-border bg-secondary/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
            />
          </div>
          <Button variant="outline" size="sm" className="bg-white">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left px-6 py-3 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedRows.length === filteredEvents.length && filteredEvents.length > 0}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Event ID</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Type</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Domain</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Risk Score</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Timestamp</th>
              <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Amount</th>
              <th className="px-6 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredEvents.map((event) => {
              const StatusIcon = statusStyles[event.status as keyof typeof statusStyles].icon
              return (
                <tr 
                  key={event.id} 
                  className={`hover:bg-secondary/30 transition-colors ${
                    selectedRows.includes(event.id) ? "bg-primary/5" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.includes(event.id)}
                      onChange={() => toggleRow(event.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-foreground">{event.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{event.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${
                      sourceStyles[event.source as keyof typeof sourceStyles].bg
                    } ${sourceStyles[event.source as keyof typeof sourceStyles].text} ${
                      sourceStyles[event.source as keyof typeof sourceStyles].border
                    }`}>
                      {event.source}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 rounded-full bg-secondary overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            event.score >= 0.8 ? 'bg-destructive' : 
                            event.score >= 0.6 ? 'bg-yellow-500' : 'bg-healthcare'
                          }`}
                          style={{ width: `${event.score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono font-medium text-foreground w-10">{(event.score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
                      statusStyles[event.status as keyof typeof statusStyles].bg
                    } ${statusStyles[event.status as keyof typeof statusStyles].text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">{event.time}</td>
                  <td className="px-6 py-4 text-sm text-foreground text-right font-semibold">{event.amount}</td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No events found matching your criteria</p>
        </div>
      )}
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {Math.ceil(filteredEvents.length / 10) || 1}
        </p>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[1, 2, 3].map(page => (
            <Button 
              key={page}
              variant={currentPage === page ? "default" : "outline"} 
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "" : "bg-white"}
            >
              {page}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentPage(p => p + 1)}
            className="bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
