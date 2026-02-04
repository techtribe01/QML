"use client"

import { useState } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RiskFeed } from "@/components/dashboard/risk-feed"
import { EventsTable } from "@/components/dashboard/events-table"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { RiskChart } from "@/components/dashboard/risk-chart"

export default function DashboardPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("24h")

  return (
    <main className="min-h-screen bg-secondary/30">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DashboardHeader 
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
          
          {/* Stats Overview */}
          <StatsOverview />
          
          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <RiskChart />
            <RiskFeed />
          </div>
          
          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            {/* Events Table */}
            <div className="lg:col-span-2">
              <EventsTable selectedDomain={selectedDomain} />
            </div>
            
            {/* Alerts Panel */}
            <div className="lg:col-span-1">
              <AlertsPanel />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}
