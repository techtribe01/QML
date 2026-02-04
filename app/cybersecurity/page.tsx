"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { DomainSpecificBloch } from "@/components/visualizer/domain-specific-bloch"
import { Button } from "@/components/ui/button"
import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  Server, 
  Globe, 
  Lock, 
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Network,
  Bug,
  Eye,
  Cpu,
  Database,
  Wifi,
  Terminal
} from "lucide-react"
import Link from "next/link"

// Attack Timeline Component
function AttackTimeline() {
  const [activePhase, setActivePhase] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
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

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActivePhase((prev) => (prev + 1) % 5)
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  const phases = [
    {
      time: "T+0:00",
      title: "Initial Reconnaissance",
      description: "Attacker begins port scanning from compromised IP",
      traditional: { status: "undetected", message: "Logs recorded, no alert" },
      quantum: { status: "detected", message: "Anomalous scan pattern detected" },
      metric: "500 ports scanned"
    },
    {
      time: "T+0:15",
      title: "Credential Stuffing",
      description: "Automated login attempts using stolen credentials",
      traditional: { status: "undetected", message: "Under rate limit threshold" },
      quantum: { status: "detected", message: "Entangled IP-timing-geo pattern flagged" },
      metric: "847 login attempts"
    },
    {
      time: "T+0:32",
      title: "Lateral Movement",
      description: "Attacker moves between internal systems",
      traditional: { status: "partial", message: "Single failed auth logged" },
      quantum: { status: "blocked", message: "Movement trajectory blocked" },
      metric: "12 systems accessed"
    },
    {
      time: "T+1:47",
      title: "Data Exfiltration Begins",
      description: "Sensitive data being transferred to external server",
      traditional: { status: "undetected", message: "Traffic within normal bandwidth" },
      quantum: { status: "blocked", message: "Blocked 1.5 hours earlier" },
      metric: "2.3 GB targeted"
    },
    {
      time: "T+3:22",
      title: "Traditional Detection",
      description: "SIEM finally correlates events and alerts",
      traditional: { status: "detected", message: "Alert triggered - 2.3GB exfiltrated" },
      quantum: { status: "resolved", message: "Incident contained at T+0:15" },
      metric: "$4.2M potential damage"
    }
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber/10 border border-cyber/20 mb-6">
            <AlertTriangle className="w-4 h-4 text-cyber" />
            <span className="text-sm font-medium text-cyber">Real Attack Scenario</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Anatomy of a Breach: Traditional vs Quantum
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how QADS detected and blocked a sophisticated APT attack 3 hours before traditional SIEM systems even raised an alert.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-border rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-cyber to-finance rounded-full transition-all duration-500"
              style={{ width: `${(activePhase / 4) * 100}%` }}
            />
          </div>

          {/* Phase Markers */}
          <div className="flex justify-between mb-12 relative">
            {phases.map((phase, index) => (
              <button
                key={phase.time}
                onClick={() => setActivePhase(index)}
                className={`relative flex flex-col items-center transition-all duration-300 ${
                  index <= activePhase ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  index <= activePhase 
                    ? 'bg-cyber border-cyber text-white' 
                    : 'bg-background border-border'
                }`}>
                  {index < activePhase ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : index === activePhase ? (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  ) : null}
                </div>
                <span className={`mt-2 text-xs font-mono ${
                  index === activePhase ? 'text-cyber' : 'text-muted-foreground'
                }`}>
                  {phase.time}
                </span>
              </button>
            ))}
          </div>

          {/* Active Phase Detail */}
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Traditional Response */}
              <div className="p-6 rounded-2xl bg-white border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Server className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Traditional SIEM</h3>
                    <p className="text-sm text-muted-foreground">Rule-based detection</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-secondary/50">
                    <h4 className="font-medium text-foreground mb-2">{phases[activePhase].title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{phases[activePhase].description}</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      phases[activePhase].traditional.status === 'undetected' 
                        ? 'bg-red-100 text-red-700'
                        : phases[activePhase].traditional.status === 'partial'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {phases[activePhase].traditional.status === 'undetected' ? (
                        <XCircle className="w-4 h-4" />
                      ) : phases[activePhase].traditional.status === 'partial' ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      {phases[activePhase].traditional.status.charAt(0).toUpperCase() + phases[activePhase].traditional.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{phases[activePhase].traditional.message}</p>
                </div>
              </div>

              {/* Quantum Response */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber/5 to-cyber/10 border border-cyber/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyber/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyber" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">QADS Quantum</h3>
                    <p className="text-sm text-muted-foreground">4-way entangled detection</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/60">
                    <h4 className="font-medium text-foreground mb-2">{phases[activePhase].title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{phases[activePhase].description}</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                      phases[activePhase].quantum.status === 'detected' 
                        ? 'bg-amber-100 text-amber-700'
                        : phases[activePhase].quantum.status === 'blocked'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-cyber/20 text-cyber'
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                      {phases[activePhase].quantum.status.charAt(0).toUpperCase() + phases[activePhase].quantum.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-sm text-cyber font-medium">{phases[activePhase].quantum.message}</p>
                </div>
              </div>
            </div>

            {/* Metric Badge */}
            <div className="mt-6 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm">
                <Activity className="w-4 h-4 text-cyber" />
                <span className="text-muted-foreground">Attack metric:</span>
                <span className="font-semibold text-foreground">{phases[activePhase].metric}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Detection Speed", quantum: "15 min", traditional: "3+ hours", icon: Clock },
            { label: "Data Protected", quantum: "2.3 GB", traditional: "0 GB", icon: Database },
            { label: "Damage Prevented", quantum: "$4.2M", traditional: "$0", icon: Shield },
            { label: "Attack Phases Blocked", quantum: "4/5", traditional: "1/5", icon: Lock },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-xl bg-white border border-border text-center">
              <stat.icon className="w-5 h-5 text-cyber mx-auto mb-2" />
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-cyber">{stat.quantum}</p>
              <p className="text-xs text-muted-foreground">vs {stat.traditional}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Threat Statistics Section
function ThreatStatistics() {
  const [isVisible, setIsVisible] = useState(false)
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

  const stats = [
    { value: "$10.5T", label: "Projected cybercrime cost by 2025", sublabel: "Cybersecurity Ventures" },
    { value: "2,200+", label: "Cyberattacks per day", sublabel: "University of Maryland" },
    { value: "287", label: "Days average breach detection", sublabel: "IBM Security Report" },
    { value: "$4.45M", label: "Average cost per data breach", sublabel: "Ponemon Institute 2023" },
  ]

  const attackTypes = [
    { name: "Ransomware", percentage: 32, growth: "+13%" },
    { name: "Phishing/BEC", percentage: 28, growth: "+22%" },
    { name: "Data Exfiltration", percentage: 18, growth: "+8%" },
    { name: "Supply Chain", percentage: 12, growth: "+42%" },
    { name: "Zero-Day Exploits", percentage: 10, growth: "+31%" },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-6">
            <Globe className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Global Threat Landscape</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Scale of the Problem
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Cyber threats are evolving faster than traditional defenses can adapt. Organizations need quantum-level detection to stay ahead.
          </p>
        </div>

        {/* Main Stats */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="p-6 rounded-2xl bg-white border border-border text-center"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground/60">{stat.sublabel}</p>
            </div>
          ))}
        </div>

        {/* Attack Types Breakdown */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-white border border-border">
            <h3 className="font-semibold text-foreground mb-6">Attack Type Distribution (2024)</h3>
            <div className="space-y-4">
              {attackTypes.map((type) => (
                <div key={type.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{type.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{type.percentage}%</span>
                      <span className="text-xs text-destructive">{type.growth}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyber to-cyber/60 rounded-full transition-all duration-1000"
                      style={{ width: isVisible ? `${type.percentage}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber/5 to-cyber/10 border border-cyber/20">
            <h3 className="font-semibold text-foreground mb-6">Why Traditional Security Fails</h3>
            <div className="space-y-4">
              {[
                { 
                  problem: "Signature-based detection", 
                  issue: "Can't detect zero-day attacks",
                  icon: Bug
                },
                { 
                  problem: "Rule threshold limits", 
                  issue: "Attackers stay just under detection",
                  icon: Terminal
                },
                { 
                  problem: "Siloed log analysis", 
                  issue: "Misses cross-system attack patterns",
                  icon: Database
                },
                { 
                  problem: "Alert fatigue", 
                  issue: "10,000+ daily alerts, 52% ignored",
                  icon: AlertTriangle
                },
              ].map((item) => (
                <div key={item.problem} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-cyber" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.problem}</p>
                    <p className="text-xs text-muted-foreground">{item.issue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Quantum Detection Explanation
function QuantumDetection() {
  const [activeTab, setActiveTab] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
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

  const tabs = [
    {
      title: "4-Way Entanglement",
      icon: Network,
      content: {
        description: "QADS creates quantum entanglement between four key network features, detecting correlations invisible to classical systems.",
        features: [
          { name: "Source IP", link: "Destination Port", insight: "Unusual service access patterns" },
          { name: "Packet Size", link: "Timing", insight: "Covert channel detection" },
          { name: "Protocol", link: "Payload Entropy", insight: "Encrypted malware identification" },
          { name: "Geo-location", link: "Time of Day", insight: "Impossible travel detection" },
        ]
      }
    },
    {
      title: "Orbit Pattern Analysis",
      icon: Activity,
      content: {
        description: "Normal network traffic follows predictable orbital patterns on the Bloch sphere. Attacks create distinctive spikes away from the orbit.",
        patterns: [
          { type: "Normal Traffic", behavior: "Smooth orbit around equator", color: "emerald" },
          { type: "Port Scan", behavior: "Rapid azimuthal rotation", color: "amber" },
          { type: "Data Exfiltration", behavior: "Polar drift toward |1⟩", color: "red" },
          { type: "C2 Beacon", behavior: "Periodic phase jumps", color: "purple" },
        ]
      }
    },
    {
      title: "Real-Time Kernel",
      icon: Zap,
      content: {
        description: "Quantum kernel computes behavioral distance in 12ms, classifying packets before they complete transmission.",
        metrics: [
          { label: "Kernel Computation", value: "12ms" },
          { label: "Classification Latency", value: "23ms" },
          { label: "Throughput", value: "1.2M packets/sec" },
          { label: "Memory Footprint", value: "< 2GB" },
        ]
      }
    }
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber/10 border border-cyber/20 mb-6">
            <Cpu className="w-4 h-4 text-cyber" />
            <span className="text-sm font-medium text-cyber">Quantum Detection Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How Quantum Catches What Others Miss
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Four entangled qubits capture network behavior in a 16-dimensional Hilbert space, detecting attack patterns invisible to classical ML.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.title}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === index
                  ? 'bg-cyber text-white'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {activeTab === 0 && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white border border-border">
                <p className="text-muted-foreground mb-6">{tabs[0].content.description}</p>
                <div className="space-y-4">
                  {tabs[0].content.features?.map((feature, i) => (
                    <div key={feature.name} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-mono text-sm text-cyber">{feature.name}</span>
                        <Wifi className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm text-cyber">{feature.link}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{feature.insight}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber/5 to-cyber/10 border border-cyber/20">
                <h4 className="font-semibold text-foreground mb-4">Entanglement Advantage</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Classical systems analyze each feature independently. Our 4-qubit entanglement creates 2^4 = 16 basis states, 
                  capturing all possible feature correlations simultaneously.
                </p>
                <div className="p-4 rounded-xl bg-white/60 font-mono text-sm">
                  <p className="text-muted-foreground">// Quantum state encoding</p>
                  <p className="text-cyber">|ψ⟩ = α|0000⟩ + β|0001⟩ + ... + ω|1111⟩</p>
                  <p className="text-muted-foreground mt-2">// 16 correlation patterns in superposition</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white border border-border">
                <p className="text-muted-foreground mb-6">{tabs[1].content.description}</p>
                <div className="space-y-3">
                  {tabs[1].content.patterns?.map((pattern) => (
                    <div key={pattern.type} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50">
                      <div className={`w-3 h-3 rounded-full ${
                        pattern.color === 'emerald' ? 'bg-emerald-500' :
                        pattern.color === 'amber' ? 'bg-amber-500' :
                        pattern.color === 'red' ? 'bg-red-500' : 'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{pattern.type}</p>
                        <p className="text-xs text-muted-foreground">{pattern.behavior}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber/5 to-cyber/10 border border-cyber/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full border-2 border-dashed border-cyber/40 flex items-center justify-center relative">
                    <div className="absolute w-full h-full animate-spin-slow">
                      <div className="absolute top-0 left-1/2 w-2 h-2 -ml-1 rounded-full bg-emerald-500" />
                    </div>
                    <div className="absolute w-4 h-4 bg-red-500 rounded-full top-2 right-2 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Orbit Pattern</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Green = Normal | Red = Attack</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-white border border-border">
                <p className="text-muted-foreground mb-6">{tabs[2].content.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {tabs[2].content.metrics?.map((metric) => (
                    <div key={metric.label} className="p-4 rounded-xl bg-secondary/50 text-center">
                      <p className="text-2xl font-bold text-cyber">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-cyber/5 to-cyber/10 border border-cyber/20">
                <h4 className="font-semibold text-foreground mb-4">Speed Comparison</h4>
                <div className="space-y-4">
                  {[
                    { system: "Rule-based IDS", time: "50ms", bar: 40 },
                    { system: "ML Anomaly Detection", time: "120ms", bar: 70 },
                    { system: "Deep Learning", time: "85ms", bar: 55 },
                    { system: "QADS Quantum Kernel", time: "12ms", bar: 10 },
                  ].map((item) => (
                    <div key={item.system}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground">{item.system}</span>
                        <span className="text-sm font-mono text-cyber">{item.time}</span>
                      </div>
                      <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyber rounded-full"
                          style={{ width: `${item.bar}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Bloch Sphere Visualization Section
function BlochSphereVisualization() {
  const [isVisible, setIsVisible] = useState(false)
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
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber/10 border border-cyber/20 mb-6">
            <Eye className="w-4 h-4 text-cyber" />
            <span className="text-sm font-medium text-cyber">Quantum State Space</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Network Traffic as Quantum States
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Normal traffic follows a predictable orbit on the Bloch sphere. Attacks create distinctive spikes and anomalous trajectories that our quantum system detects instantly.
          </p>
        </div>

        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <DomainSpecificBloch domain="cybersecurity" />
        </div>

        {/* Interpretation Guide */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-border">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Normal Orbit (Green)</h3>
                <p className="text-sm text-muted-foreground">Regular traffic patterns following predictable behavioral orbits around the equator.</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white border border-border">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Anomalous Pattern (Orange)</h3>
                <p className="text-sm text-muted-foreground">Unusual but not definitively malicious. May indicate reconnaissance or misconfiguration.</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-white border border-border">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Attack Spike (Red)</h3>
                <p className="text-sm text-muted-foreground">Definitive attack signature. Quantum state diverges sharply from all known legitimate patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Metrics Section
function MetricsSection() {
  const [isVisible, setIsVisible] = useState(false)
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

  const metrics = [
    { label: "Detection Accuracy", value: "96.2%", improvement: "+12.5% vs ML", icon: Shield },
    { label: "False Positive Rate", value: "1.8%", improvement: "-89% vs rules", icon: CheckCircle2 },
    { label: "Mean Time to Detect", value: "23ms", improvement: "12,000x faster", icon: Zap },
    { label: "Throughput", value: "1.2M pps", improvement: "Enterprise scale", icon: Activity },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Performance Metrics
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Validated on CICIDS2017 and real enterprise network data
          </p>
        </div>

        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {metrics.map((metric, index) => (
            <div 
              key={metric.label}
              className="p-6 rounded-2xl bg-white border border-border text-center group hover:border-cyber/30 hover:shadow-lg hover:shadow-cyber/5 transition-all"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-cyber/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-cyber/20 transition-colors">
                <metric.icon className="w-6 h-6 text-cyber" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{metric.value}</p>
              <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
              <p className="text-xs text-cyber font-medium">{metric.improvement}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button size="lg" className="bg-cyber hover:bg-cyber/90 text-white rounded-full px-8" asChild>
            <Link href="/demo">
              See Live Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Hero Section
function CybersecurityHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber/5 via-background to-background" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(123, 97, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(123, 97, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber/10 border border-cyber/20 mb-8">
            <Shield className="w-4 h-4 text-cyber" />
            <span className="text-sm font-medium text-cyber">Quantum-Powered Defense</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Detect Threats at{' '}
            <span className="text-cyber">Quantum Speed</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            While traditional SIEM takes hours to correlate attacks, QADS detects intrusions in 23 milliseconds 
            using 4-way quantum entanglement of network features.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-cyber hover:bg-cyber/90 text-white rounded-full px-8" asChild>
              <Link href="/demo">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 bg-transparent" asChild>
              <Link href="/visualizer">
                View Quantum Visualizer
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {[
            { value: "23ms", label: "Detection Latency" },
            { value: "96.2%", label: "Accuracy Rate" },
            { value: "3 hrs", label: "Earlier Detection" },
            { value: "89%", label: "Fewer False Positives" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main Page Component
export default function CybersecurityPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <CybersecurityHero />
      <AttackTimeline />
      <ThreatStatistics />
      <QuantumDetection />
      <BlochSphereVisualization />
      <MetricsSection />
      <Footer />
    </main>
  )
}
