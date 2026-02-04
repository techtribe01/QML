"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { FinanceBloch } from "@/components/visualizer/finance-bloch"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  CreditCard, 
  Shield, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Smartphone,
  Laptop,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Globe,
  ArrowRight,
  Activity,
  Lock,
  Cpu
} from "lucide-react"

// Sarah's Story - Transaction Timeline
function TransactionTimeline() {
  const [activePhase, setActivePhase] = useState<'legitimate' | 'fraud' | 'quantum' | 'traditional'>('legitimate')
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

  const legitimateTransactions = [
    { time: "7:42 PM", merchant: "Whole Foods", location: "Boston, MA", amount: "$87.34", category: "Groceries", status: "approved", device: "iPhone" },
    { time: "8:15 PM", merchant: "Shell Gas Station", location: "Boston, MA", amount: "$45.00", category: "Gas", status: "approved", device: "Physical Card" },
  ]

  const fraudTransaction = {
    time: "8:17 PM",
    merchant: "Amazon.com",
    location: "Miami, FL (IP)",
    amount: "$1.99",
    category: "Digital Content",
    device: "Unknown Laptop",
    traditional: {
      analysis: ["Amount below $50 threshold", "Trusted merchant", "Common category"],
      decision: "APPROVED",
      outcome: "Fraud continues..."
    },
    quantum: {
      analysis: ["Previous transaction 2 min ago in Boston", "New IP: Miami (1,500 miles)", "Impossible travel time", "Device: NEVER SEEN", "Pattern: Sarah never buys digital"],
      correlation: "Amount(low) + Location(far) + Device(new) + Time(rapid) = 0.87 fraud similarity",
      decision: "FLAGGED",
      outcome: "2FA sent, Sarah confirms 'NOT ME', Card frozen"
    }
  }

  const traditionalContinuation = [
    { time: "8:19 PM", merchant: "Amazon", amount: "$4.99", status: "approved" },
    { time: "8:22 PM", merchant: "Best Buy", amount: "$299.99", status: "approved" },
    { time: "8:25 PM", merchant: "Apple Store", amount: "$999.99", status: "approved" },
    { time: "8:28 PM", merchant: "Newegg", amount: "$1,499.99", status: "approved" },
    { time: "8:31 PM", merchant: "Dell.com", amount: "$2,199.99", status: "flagged" },
    { time: "8:35 PM", merchant: "eBay", amount: "$899.99", status: "approved" },
    { time: "8:38 PM", merchant: "Walmart", amount: "$1,549.99", status: "approved" },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-finance/10 border border-finance/20 mb-6">
            <CreditCard className="w-4 h-4 text-finance" />
            <span className="text-sm font-medium text-finance">Real Banking Scenario</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Sarah's Credit Card: Friday Evening, 7:42 PM
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Watch how quantum detection catches fraud that traditional systems miss completely.
          </p>
        </div>

        {/* Phase Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'legitimate', label: 'Legitimate Activity', icon: CheckCircle2 },
            { id: 'fraud', label: 'Fraud Begins', icon: AlertTriangle },
            { id: 'quantum', label: 'Quantum Response', icon: Shield },
            { id: 'traditional', label: 'Traditional Outcome', icon: XCircle },
          ].map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id as typeof activePhase)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                activePhase === phase.id
                  ? 'bg-finance text-white shadow-lg shadow-finance/25'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              <phase.icon className="w-4 h-4" />
              {phase.label}
            </button>
          ))}
        </div>

        {/* Timeline Content */}
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {activePhase === 'legitimate' && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Sarah's Normal Pattern
                </span>
              </div>
              {legitimateTransactions.map((tx, i) => (
                <div key={i} className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{tx.time} - {tx.merchant}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{tx.location}</span>
                          <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" />{tx.device}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-foreground">{tx.amount}</p>
                      <p className="text-sm text-emerald-600 flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-4 h-4" /> Both systems: APPROVED
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activePhase === 'fraud' && (
            <div className="p-8 rounded-3xl bg-amber-50 border-2 border-amber-300">
              <div className="text-center mb-6">
                <span className="text-sm font-bold text-amber-700 bg-amber-200 px-4 py-2 rounded-full">
                  CARD NUMBER STOLEN (Dark Web Purchase)
                </span>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-2xl font-bold text-foreground mb-2">{fraudTransaction.time} - {fraudTransaction.merchant}</p>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500" />{fraudTransaction.location}</p>
                    <p className="flex items-center gap-2"><Laptop className="w-4 h-4 text-red-500" />{fraudTransaction.device}</p>
                    <p className="flex items-center gap-2"><DollarSign className="w-4 h-4" />{fraudTransaction.amount} (Test Transaction)</p>
                  </div>
                </div>
                <div className="text-4xl font-bold text-amber-600">{fraudTransaction.amount}</div>
              </div>
            </div>
          )}

          {activePhase === 'quantum' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
                <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Traditional System
                </h3>
                <ul className="space-y-2 mb-4">
                  {fraudTransaction.traditional.analysis.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-red-400" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="p-4 rounded-xl bg-red-100 text-center">
                  <p className="text-lg font-bold text-red-700">Decision: APPROVED</p>
                  <p className="text-sm text-red-600">{fraudTransaction.traditional.outcome}</p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h3 className="font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Quantum System
                </h3>
                <ul className="space-y-2 mb-4">
                  {fraudTransaction.quantum.analysis.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> {item}
                    </li>
                  ))}
                </ul>
                <div className="p-3 rounded-lg bg-cyber/10 text-sm text-cyber mb-4 font-mono">
                  {fraudTransaction.quantum.correlation}
                </div>
                <div className="p-4 rounded-xl bg-emerald-100 text-center">
                  <p className="text-lg font-bold text-emerald-700">Decision: FLAGGED</p>
                  <p className="text-sm text-emerald-600">{fraudTransaction.quantum.outcome}</p>
                </div>
              </div>
            </div>
          )}

          {activePhase === 'traditional' && (
            <div className="space-y-4">
              <div className="text-center mb-8">
                <span className="text-sm font-bold text-red-600 bg-red-100 px-4 py-2 rounded-full">
                  What Would Have Happened Without Quantum
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {traditionalContinuation.map((tx, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${tx.status === 'flagged' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{tx.time}</p>
                        <p className="text-sm text-muted-foreground">{tx.merchant}</p>
                      </div>
                      <p className="font-bold text-foreground">{tx.amount}</p>
                    </div>
                    <p className={`text-xs mt-2 ${tx.status === 'flagged' ? 'text-amber-600' : 'text-red-600'}`}>
                      {tx.status === 'flagged' ? 'Finally flagged (too late)' : 'APPROVED'}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 rounded-2xl bg-red-100 border-2 border-red-300 text-center">
                <p className="text-3xl font-bold text-red-700 mb-2">Total Loss: $7,454.95</p>
                <p className="text-muted-foreground">Discovered next morning. Bank absorbs loss. Sarah's card frozen.</p>
              </div>
              <div className="mt-4 p-6 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-center">
                <p className="text-3xl font-bold text-emerald-700 mb-2">Quantum Saved: $8,450</p>
                <p className="text-muted-foreground">Fraud stopped at first $1.99 test transaction.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Global Fraud Statistics
function FraudStatistics() {
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
    { label: "Credit Card Fraud (US)", value: "$32.34B", icon: CreditCard },
    { label: "Credit Card Fraud (Global)", value: "$165.87B", icon: Globe },
    { label: "Identity Theft", value: "$56B", icon: Lock },
    { label: "Account Takeover", value: "$11B", icon: AlertTriangle },
    { label: "Wire Transfer Fraud", value: "$26B", icon: TrendingDown },
  ]

  const perTransaction = [
    { label: "Daily US Transactions", value: "1.2 Billion" },
    { label: "Fraudulent/Day", value: "2.4 Million" },
    { label: "Avg Fraud Amount", value: "$135" },
    { label: "Traditional Detection", value: "2-48 hours" },
    { label: "Quantum Detection", value: "<300ms" },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-500">The Scale of the Problem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            $291 Billion Lost Annually
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Global financial fraud statistics for 2024-2025 reveal an unprecedented crisis.
          </p>
        </div>

        <div className={`grid md:grid-cols-5 gap-4 mb-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-border text-center hover:shadow-lg transition-shadow">
              <stat.icon className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className={`p-8 rounded-3xl bg-white border border-border transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">Per-Transaction Statistics</h3>
          <div className="grid sm:grid-cols-5 gap-6">
            {perTransaction.map((item, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-bold text-finance">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Why Traditional Systems Fail
function TraditionalFailures() {
  const [activeTab, setActiveTab] = useState<'rules' | 'ml' | 'deep'>('rules')
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

  const systems = {
    rules: {
      title: "Rule-Based Detection",
      era: "1990s-2000s",
      code: `if transaction_amount > 1000:
    flag_fraud()

if location != home_location:
    flag_fraud()`,
      problems: [
        "Fraudsters make multiple $999 transactions",
        "VPNs spoof home location easily",
        "Static rules can't adapt to new patterns"
      ]
    },
    ml: {
      title: "Classical Machine Learning",
      era: "2010s",
      code: `features = [amount, merchant, location, time]
model.predict(features) → fraud probability`,
      problems: [
        "Each feature analyzed independently",
        "Misses multi-variable correlations",
        "High false positive rate (10-15%)",
        "Slow to adapt to new fraud patterns"
      ]
    },
    deep: {
      title: "Deep Learning",
      era: "2015-2025",
      code: `# Neural networks with 5-10 layers
# Better but still limited`,
      problems: [
        "Requires massive training data",
        "Computationally expensive (>500ms)",
        "Black box - hard to explain declines",
        "Vulnerable to adversarial attacks"
      ]
    }
  }

  const active = systems[activeTab]

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <XCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">The Problem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Traditional Systems Fail
          </h2>
        </div>

        <div className="flex justify-center gap-3 mb-8">
          {Object.entries(systems).map(([key, system]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`px-5 py-3 rounded-xl font-medium transition-all ${
                activeTab === key
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              {system.title}
            </button>
          ))}
        </div>

        <div className={`grid lg:grid-cols-2 gap-8 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-6 rounded-2xl bg-secondary border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">{active.title}</h3>
              <span className="text-sm text-muted-foreground">{active.era}</span>
            </div>
            <pre className="p-4 rounded-xl bg-foreground text-background text-sm font-mono overflow-x-auto">
              {active.code}
            </pre>
          </div>

          <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
            <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Problems
            </h3>
            <ul className="space-y-3">
              {active.problems.map((problem, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  {problem}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// Quantum Solution
function QuantumSolution() {
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

  const advantages = [
    {
      title: "Exponential Feature Space",
      classical: "10 features = 45 correlations (pairwise)",
      quantum: "10 qubits = 1,024 dimensions (all correlations)",
      icon: Cpu
    },
    {
      title: "Quantum Kernel",
      classical: "Measures Euclidean distance",
      quantum: "Measures quantum state overlap - captures patterns invisible to classical",
      icon: Activity
    },
    {
      title: "Real-Time Speed",
      classical: "530ms (too slow for card-present)",
      quantum: "230-280ms (within 300ms limit)",
      icon: Zap
    }
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-finance/10 border border-finance/20 mb-6">
            <Shield className="w-4 h-4 text-finance" />
            <span className="text-sm font-medium text-finance">The Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Quantum ML is Superior
          </h2>
        </div>

        <div className={`grid md:grid-cols-3 gap-6 mb-16 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {advantages.map((adv, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-border">
              <adv.icon className="w-10 h-10 text-finance mb-4" />
              <h3 className="font-bold text-foreground mb-4">{adv.title}</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-red-50">
                  <p className="text-xs text-red-600 font-medium mb-1">Classical</p>
                  <p className="text-sm text-muted-foreground">{adv.classical}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50">
                  <p className="text-xs text-emerald-600 font-medium mb-1">Quantum</p>
                  <p className="text-sm text-muted-foreground">{adv.quantum}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekend Warrior Example */}
        <div className={`p-8 rounded-3xl bg-white border border-border transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">The "Weekend Warrior" Fraud Pattern</h3>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200">
              <h4 className="font-bold text-red-700 mb-4">Classical Sees:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> Saturday purchase: $500 electronics (weekend shopping)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> Online transaction (common)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-red-400" /> New merchant (people try new stores)</li>
              </ul>
              <div className="mt-4 p-3 rounded-xl bg-red-100 text-center">
                <p className="font-bold text-red-700">Decision: APPROVED</p>
                <p className="text-xs text-red-600">Each feature individually normal</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200">
              <h4 className="font-bold text-emerald-700 mb-4">Quantum Sees (8-way correlation):</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Saturday + Electronics + Online + New Merchant</li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Amount 3x above typical weekend spending</li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> First online purchase in 6 months</li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Time: 3 AM + IP: Different state</li>
              </ul>
              <div className="mt-4 p-3 rounded-xl bg-emerald-100 text-center">
                <p className="font-bold text-emerald-700">Score: 0.91 = KNOWN FRAUD</p>
                <p className="text-xs text-emerald-600">BLOCK + Request verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Bloch Sphere Visualization
function BlochVisualization() {
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
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber/10 border border-cyber/20 mb-6">
            <Activity className="w-4 h-4 text-cyber" />
            <span className="text-sm font-medium text-cyber">Quantum State Space</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Transactions as Quantum States
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Legitimate transactions cluster tightly in blue. Fraudulent transactions scatter as red outliers. 
            The quantum kernel measures "distance" in this high-dimensional space.
          </p>
        </div>

        <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <FinanceBloch />
        </div>
      </div>
    </section>
  )
}

// Architecture Section
function Architecture() {
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

  const steps = [
    { title: "Transaction Stream", desc: "Real-time card swipes and online purchases", icon: CreditCard },
    { title: "Feature Engineering", desc: "Behavioral, contextual, velocity, device fingerprint", icon: Activity },
    { title: "Quantum Encoding", desc: "12 qubits with ZZ Feature Map entanglement", icon: Cpu },
    { title: "Kernel Computation", desc: "Compare to historical legitimate & fraud patterns", icon: Shield },
    { title: "SVM Classification", desc: "Decision boundary in quantum feature space", icon: TrendingUp },
    { title: "Decision Engine", desc: "Approve / Decline / 2FA / Manual Review", icon: CheckCircle2 },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            System Architecture
          </h2>
          <p className="text-lg text-muted-foreground">End-to-end quantum fraud detection pipeline</p>
        </div>

        <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {steps.map((step, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-border hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl bg-finance/10 flex items-center justify-center text-finance group-hover:bg-finance group-hover:text-white transition-colors">
                  <step.icon className="w-5 h-5" />
                </div>
                <span className="w-6 h-6 rounded-full bg-secondary text-sm font-bold flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className={`mt-8 p-6 rounded-2xl bg-finance text-white text-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-2xl font-bold">Authorization Response: {"<"}300ms</p>
          <p className="text-finance-foreground/80">Fast enough for card-present transactions</p>
        </div>
      </div>
    </section>
  )
}

// CTA Section
function FinanceCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-finance via-finance to-cyber text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Stop Fraud Before It Starts
        </h2>
        <p className="text-xl text-white/80 mb-8">
          Join financial institutions protecting billions with quantum-powered detection.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-finance hover:bg-white/90 font-semibold rounded-full px-8" asChild>
            <Link href="/demo">
              Request Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 bg-transparent" asChild>
            <Link href="/visualizer">
              Explore Visualizer
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function FinancePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <TransactionTimeline />
        <FraudStatistics />
        <TraditionalFailures />
        <QuantumSolution />
        <BlochVisualization />
        <Architecture />
        <FinanceCTA />
      </div>
      <Footer />
    </main>
  )
}
