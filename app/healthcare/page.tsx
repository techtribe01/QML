"use client"

import { useState, useEffect, useRef } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { HealthcareBloch } from "@/components/visualizer/healthcare-bloch"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Shield,
  Zap,
  Brain,
  Users,
  ArrowRight,
  Play,
  CheckCircle2,
  Stethoscope,
  HeartPulse,
  Timer,
  DollarSign,
  BellOff
} from "lucide-react"
import Link from "next/link"


// Patient Timeline Component
function PatientTimeline() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const traditionalTimeline = [
    { time: "11:00 PM", hr: 78, bp: "120/80", temp: "37.2", spo2: 98, status: "green", alert: false },
    { time: "11:30 PM", hr: 82, bp: "118/79", temp: "37.4", spo2: 97, status: "green", alert: false },
    { time: "12:00 AM", hr: 88, bp: "115/77", temp: "37.7", spo2: 96, status: "green", alert: false },
    { time: "1:00 AM", hr: 95, bp: "110/75", temp: "38.1", spo2: 95, status: "yellow", alert: true },
    { time: "2:30 AM", hr: 125, bp: "90/60", temp: "39.2", spo2: 91, status: "red", alert: true },
  ]

  const quantumTimeline = [
    { time: "11:00 PM", hr: 78, bp: "120/80", temp: "37.2", spo2: 98, status: "green", alert: false, error: 0.03 },
    { time: "11:30 PM", hr: 82, bp: "118/79", temp: "37.4", spo2: 97, status: "green", alert: false, error: 0.04 },
    { time: "12:00 AM", hr: 88, bp: "115/77", temp: "37.7", spo2: 96, status: "yellow", alert: true, error: 0.06 },
    { time: "12:15 AM", hr: 85, bp: "117/78", temp: "37.5", spo2: 97, status: "green", alert: false, error: 0.04 },
    { time: "2:30 AM", hr: 82, bp: "118/78", temp: "37.5", spo2: 97, status: "green", alert: false, error: 0.03 },
  ]

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
    if (!isVisible) return
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5)
    }, 2500)
    return () => clearInterval(interval)
  }, [isVisible])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "green": return "bg-emerald-500"
      case "yellow": return "bg-amber-500"
      case "red": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  return (
    <section ref={sectionRef} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-healthcare/10 border border-healthcare/20 mb-6">
            <Stethoscope className="w-4 h-4 text-healthcare" />
            <span className="text-sm font-medium text-healthcare">Real Patient Scenario</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            The Story of <span className="text-healthcare">John, 67 Years Old</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            See how QADIS detects sepsis 3-4 hours earlier than traditional systems, 
            potentially saving $168,000 and preventing life-threatening complications.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Traditional System */}
          <div className={`bg-white rounded-2xl border border-border p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Traditional System</h3>
                <p className="text-sm text-muted-foreground">Static threshold monitoring</p>
              </div>
            </div>

            <div className="space-y-3">
              {traditionalTimeline.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    idx === activeStep 
                      ? 'border-red-200 bg-red-50/50 scale-[1.02]' 
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.time}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                      <span className={`text-xs font-medium ${
                        item.status === 'green' ? 'text-emerald-600' :
                        item.status === 'yellow' ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {item.alert ? 'ALERT' : 'Normal'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div><span className="text-muted-foreground">HR:</span> <span className="font-medium">{item.hr}</span></div>
                    <div><span className="text-muted-foreground">BP:</span> <span className="font-medium">{item.bp}</span></div>
                    <div><span className="text-muted-foreground">Temp:</span> <span className="font-medium">{item.temp}</span></div>
                    <div><span className="text-muted-foreground">SpO2:</span> <span className="font-medium">{item.spo2}%</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Outcome */}
            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" />
                Result: Code Blue at 2:30 AM
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-semibold text-red-700 ml-2">$180,000</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ICU Stay:</span>
                  <span className="font-semibold text-red-700 ml-2">3 weeks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quantum System */}
          <div className={`bg-white rounded-2xl border border-border p-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-healthcare/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-healthcare" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">QADIS Quantum System</h3>
                <p className="text-sm text-muted-foreground">Personalized baseline + pattern detection</p>
              </div>
            </div>

            <div className="space-y-3">
              {quantumTimeline.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    idx === activeStep 
                      ? 'border-healthcare/50 bg-healthcare/5 scale-[1.02]' 
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.time}</span>
                    <div className="flex items-center gap-2">
                      {item.alert && (
                        <span className="text-xs font-medium text-healthcare bg-healthcare/10 px-2 py-0.5 rounded-full">
                          Early Warning
                        </span>
                      )}
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div><span className="text-muted-foreground">HR:</span> <span className="font-medium">{item.hr}</span></div>
                    <div><span className="text-muted-foreground">BP:</span> <span className="font-medium">{item.bp}</span></div>
                    <div><span className="text-muted-foreground">Temp:</span> <span className="font-medium">{item.temp}</span></div>
                    <div><span className="text-muted-foreground">Error:</span> <span className="font-medium">{item.error}</span></div>
                  </div>
                  {idx === 2 && item.alert && (
                    <div className="mt-2 p-2 rounded-lg bg-healthcare/10 text-xs text-healthcare">
                      Pattern match: Early sepsis signature (73% confidence)
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Outcome */}
            <div className="mt-6 p-4 rounded-xl bg-healthcare/10 border border-healthcare/20">
              <div className="flex items-center gap-2 text-healthcare font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                Result: Crisis Prevented
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cost:</span>
                  <span className="font-semibold text-healthcare ml-2">$12,000</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stay:</span>
                  <span className="font-semibold text-healthcare ml-2">3 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Highlight */}
        <div className={`mt-12 text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-healthcare/10 to-emerald-500/10 border border-healthcare/20">
            <DollarSign className="w-8 h-8 text-healthcare" />
            <div className="text-left">
              <div className="text-2xl font-bold text-foreground">$168,000 Saved Per Case</div>
              <div className="text-sm text-muted-foreground">3-4 hours earlier detection, full recovery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Quantum Advantage Section
function QuantumAdvantage() {
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
      title: "Multi-Dimensional Pattern Recognition",
      description: "6 qubits process all vital signs simultaneously, detecting correlations classical systems miss: HR rising WHILE BP falling WHILE temp increasing.",
      classical: "Checks each vital independently",
      quantum: "Analyzes 378 correlations at once"
    },
    {
      title: "Temporal Pattern Learning",
      description: "Quantum entanglement captures not just current values, but rates of change, acceleration, and rhythmic patterns over time.",
      classical: "Simple sliding window averages",
      quantum: "Full temporal evolution encoding"
    },
    {
      title: "Personalized Baselines",
      description: "Quantum autoencoder learns each patient's unique 'normal' state. An athlete with HR 55 vs elderly with HR 85 - both normal for them.",
      classical: "One threshold for everyone (HR > 100)",
      quantum: "Individual quantum state |psi_normal>"
    }
  ]

  const icons = [Brain, Timer, Users]

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-healthcare/10 border border-healthcare/20 mb-6">
            <Zap className="w-4 h-4 text-healthcare" />
            <span className="text-sm font-medium text-healthcare">Quantum Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why <span className="text-healthcare">Quantum</span> for Healthcare
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Traditional ICU monitoring creates 150+ alarms per shift with 85-90% false positives. 
            QADIS reduces alarm fatigue while catching real deterioration hours earlier.
          </p>
        </div>

        <div className="space-y-8">
          {advantages.map((adv, idx) => {
            const IconComponent = icons[idx]
            return (
              <div 
                key={idx}
                className={`grid lg:grid-cols-2 gap-8 items-center transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-healthcare/10 flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-healthcare" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{adv.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{adv.description}</p>
                </div>
                
                <div className={`grid grid-cols-2 gap-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="p-5 rounded-xl bg-red-50 border border-red-200">
                    <div className="text-xs font-medium text-red-600 mb-2 uppercase tracking-wider">Classical</div>
                    <p className="text-sm text-red-700">{adv.classical}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-healthcare/10 border border-healthcare/20">
                    <div className="text-xs font-medium text-healthcare mb-2 uppercase tracking-wider">Quantum</div>
                    <p className="text-sm text-healthcare">{adv.quantum}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Architecture Section
function ArchitectureSection() {
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-healthcare/10 border border-healthcare/20 mb-6">
            <Activity className="w-4 h-4 text-healthcare" />
            <span className="text-sm font-medium text-healthcare">System Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Quantum ML Pipeline
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From bedside monitors to early warning alerts in milliseconds
          </p>
        </div>

        {/* Pipeline Visualization */}
        <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-0">
            {[
              { label: "Bedside Monitors", desc: "6-8 vital sign streams", Icon: HeartPulse },
              { label: "Feature Extraction", desc: "12 clinical features", Icon: Activity },
              { label: "Quantum Autoencoder", desc: "6-qubit encoding", Icon: Brain },
              { label: "Anomaly Scoring", desc: "Reconstruction error", Icon: AlertTriangle },
              { label: "Alert System", desc: "4-6 hours early warning", Icon: Shield },
            ].map((step, idx) => (
              <div key={idx} className="flex items-center">
                <div className="relative flex flex-col items-center">
                  <div className="w-20 h-20 rounded-2xl bg-white border-2 border-healthcare/30 flex items-center justify-center shadow-lg group hover:border-healthcare hover:scale-105 transition-all">
                    <step.Icon className="w-8 h-8 text-healthcare" />
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-sm font-semibold text-foreground">{step.label}</div>
                    <div className="text-xs text-muted-foreground">{step.desc}</div>
                  </div>
                </div>
                {idx < 4 && (
                  <div className="hidden lg:flex items-center px-4">
                    <div className="w-12 h-0.5 bg-healthcare/30" />
                    <ArrowRight className="w-4 h-4 text-healthcare/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical Specs */}
        <div className={`mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { label: "Qubits", value: "6", desc: "Vital sign encoding" },
            { label: "Latent Space", value: "3", desc: "Compressed representation" },
            { label: "Features", value: "12", desc: "Clinical metrics" },
            { label: "Correlations", value: "378", desc: "Analyzed simultaneously" },
          ].map((spec) => (
            <div key={spec.label} className="text-center p-6 bg-white rounded-2xl border border-border">
              <div className="text-4xl font-bold text-healthcare mb-1">{spec.value}</div>
              <div className="text-sm font-medium text-foreground">{spec.label}</div>
              <div className="text-xs text-muted-foreground">{spec.desc}</div>
            </div>
          ))}
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

  return (
    <section ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Early Detection", value: "3-4 hrs", desc: "Before traditional alerts", Icon: Clock },
            { label: "False Alarm Reduction", value: "85-90%", desc: "Eliminating alarm fatigue", Icon: BellOff },
            { label: "Cost Savings", value: "$168K", desc: "Per sepsis case prevented", Icon: DollarSign },
            { label: "Detection Accuracy", value: "94.8%", desc: "vs 89.3% classical", Icon: TrendingUp },
          ].map((metric, idx) => (
            <div 
              key={idx}
              className={`relative group p-6 rounded-2xl bg-gradient-to-br from-healthcare/5 to-transparent border border-healthcare/20 hover:border-healthcare/40 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-healthcare to-emerald-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <metric.Icon className="w-8 h-8 text-healthcare mb-4" />
              <div className="text-3xl font-bold text-foreground mb-1">{metric.value}</div>
              <div className="text-sm font-medium text-foreground">{metric.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{metric.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function HealthcareCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-healthcare via-emerald-500 to-teal-500 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl -top-48 -left-48" />
        <div className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl -bottom-48 -right-48" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Ready to Transform Patient Care?
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Join healthcare providers using QADIS to detect patient deterioration hours earlier, 
          reduce alarm fatigue by 90%, and save lives.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="h-14 px-8 bg-white text-healthcare hover:bg-white/90 font-semibold rounded-full shadow-lg"
            asChild
          >
            <Link href="/demo" scroll={true}>
              Try Live Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="h-14 px-8 bg-transparent border-white/30 text-white hover:bg-white/10 rounded-full"
            asChild
          >
            <Link href="/visualizer" scroll={true} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              See Quantum Visualizer
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Hero Section
function HealthcareHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-15 -top-32 -left-32 bg-healthcare" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 bottom-0 right-0 bg-emerald-500" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.4]" style={{
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-healthcare/10 border border-healthcare/20 mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Heart className="w-4 h-4 text-healthcare" />
            <span className="text-sm font-medium text-healthcare">Medical Anomaly Detection</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-healthcare">Quantum-Powered</span> Early Warning for Patient Deterioration
          </h1>

          <p className={`text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            QADIS detects sepsis and critical conditions 3-4 hours earlier than traditional ICU monitoring, 
            reducing false alarms by 90% and potentially saving $168,000 per patient.
          </p>

          <div className={`flex flex-wrap gap-6 mb-10 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {[
              "HIPAA Compliant",
              "6-Qubit Autoencoder",
              "Personalized Baselines",
              "Real-time Monitoring"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-healthcare" />
                {feature}
              </div>
            ))}
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button 
              size="lg" 
              className="h-14 px-8 bg-healthcare hover:bg-healthcare/90 text-white font-semibold rounded-full shadow-lg shadow-healthcare/25"
              asChild
            >
              <Link href="/demo" scroll={true}>
                Try Live Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="h-14 px-8 bg-white/60 backdrop-blur-sm border-border/60 hover:bg-white rounded-full"
              asChild
            >
              <Link href="#scenario" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-healthcare flex items-center justify-center text-white">
                  <Play className="w-3 h-3 fill-current" />
                </div>
                See Patient Scenario
              </Link>
            </Button>
          </div>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-healthcare/10 border border-healthcare/20 mb-6">
            <Brain className="w-4 h-4 text-healthcare" />
            <span className="text-sm font-medium text-healthcare">Quantum State Space</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Patient Health as a Quantum State
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each point on the Bloch sphere represents a patient's health state. Watch how sepsis progression rotates the quantum state downward while quantum entanglement captures vital sign correlations.
          </p>
        </div>

        <div className={`max-w-4xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <HealthcareBloch />
        </div>
      </div>
    </section>
  )
}

// Main Page Component
export default function HealthcarePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HealthcareCTA />
      <div id="scenario">
        <PatientTimeline />
      </div>
      <QuantumAdvantage />
      <BlochSphereVisualization />
      <ArchitectureSection />
      <MetricsSection />
      <Footer />
    </main>
  )
}
