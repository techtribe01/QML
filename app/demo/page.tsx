"use client"

import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Heart, Shield, Play, ExternalLink, Clock, Sparkles, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const demoOptions = [
  {
    id: "finance",
    title: "Finance Demo",
    subtitle: "Credit Card Fraud Detection",
    description: "Test our quantum model on sample transaction data with real-time anomaly scoring",
    icon: Building2,
    color: "finance",
    bgGradient: "from-finance/10 to-finance/5",
    colabUrl: "#",
    features: ["10K+ sample transactions", "Real-time scoring", "ROC curve analysis"],
    duration: "~5 min"
  },
  {
    id: "healthcare",
    title: "Healthcare Demo",
    subtitle: "Insurance Claims Analysis",
    description: "Analyze insurance claims for billing anomalies and potential fraud patterns",
    icon: Heart,
    color: "healthcare",
    bgGradient: "from-healthcare/10 to-healthcare/5",
    colabUrl: "#",
    features: ["Claims dataset", "Pattern visualization", "Risk scoring"],
    duration: "~7 min"
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Demo",
    subtitle: "Network Intrusion Detection",
    description: "Detect network intrusions using simulated event streams and quantum analysis",
    icon: Shield,
    color: "cyber",
    bgGradient: "from-cyber/10 to-cyber/5",
    colabUrl: "#",
    features: ["Live event stream", "Threat classification", "Alert dashboard"],
    duration: "~6 min"
  },
]

const steps = [
  { step: 1, title: "Choose Demo", description: "Select your domain" },
  { step: 2, title: "Open in Colab", description: "One-click launch" },
  { step: 3, title: "Run Cells", description: "Execute the notebook" },
  { step: 4, title: "See Results", description: "Analyze outputs" },
]

export default function DemoPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-healthcare/5 rounded-full blur-3xl" />
        </div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.03) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border shadow-sm mb-6">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-healthcare flex items-center justify-center">
                <Play className="w-2.5 h-2.5 text-white fill-white" />
              </div>
              <span className="text-sm font-medium text-foreground">Interactive Demos</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Try <span className="gradient-text">QADS</span> Live
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Experience the power of quantum machine learning with our interactive demos.
              No setup required - run directly in Google Colab.
            </p>

            {/* Process Steps */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {steps.map((step, i) => (
                <div key={step.step} className="flex items-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                      {step.step}
                    </span>
                    <span className="text-sm text-foreground font-medium">{step.title}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Demo Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {demoOptions.map((demo, index) => {
              const isHovered = hoveredCard === demo.id
              
              return (
                <div 
                  key={demo.id}
                  className={`
                    relative bg-white rounded-2xl border transition-all duration-500 overflow-hidden
                    ${isHovered ? 'border-transparent shadow-xl scale-[1.02]' : 'border-border shadow-sm'}
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                  onMouseEnter={() => setHoveredCard(demo.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Top Gradient Bar */}
                  <div 
                    className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-70'
                    }`}
                    style={{ backgroundColor: `var(--${demo.color})` }}
                  />
                  
                  {/* Background Gradient on Hover */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${demo.bgGradient} transition-opacity duration-500 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  
                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div 
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          isHovered ? 'scale-110' : ''
                        }`}
                        style={{ 
                          backgroundColor: `color-mix(in srgb, var(--${demo.color}) 15%, white)`,
                          boxShadow: isHovered ? `0 8px 24px color-mix(in srgb, var(--${demo.color}) 25%, transparent)` : 'none'
                        }}
                      >
                        <demo.icon 
                          className="w-7 h-7 transition-transform duration-300"
                          style={{ 
                            color: `var(--${demo.color})`,
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{demo.duration}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="mb-6">
                      <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: `var(--${demo.color})` }}>
                        {demo.subtitle}
                      </p>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {demo.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {demo.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 mb-8">
                      {demo.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle2 
                            className="w-4 h-4 shrink-0" 
                            style={{ color: `var(--${demo.color})` }}
                          />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA */}
                    <Button 
                      className="w-full text-white group magnetic-btn font-medium"
                      style={{ backgroundColor: `var(--${demo.color})` }}
                      asChild
                    >
                      <Link href={demo.colabUrl} className="flex items-center justify-center gap-2">
                        <span>Launch Demo</span>
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Bottom Info */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">No Account Required</h3>
                  <p className="text-sm text-muted-foreground">
                    All demos run on Google Colab with pre-loaded sample datasets. 
                    Sign in to Colab to save your results, or run anonymously for quick testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  )
}
