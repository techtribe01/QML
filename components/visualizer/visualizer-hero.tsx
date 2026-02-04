"use client"

import { useState, useEffect } from "react"
import { Atom, Sparkles, Cpu, Waves } from "lucide-react"

export function VisualizerHero() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyber/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          {/* Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber/10 border border-cyber/20 mb-6 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="relative">
              <Atom className="w-4 h-4 text-cyber animate-spin-slow" />
              <div className="absolute inset-0 bg-cyber/30 blur-sm rounded-full" />
            </div>
            <span className="text-sm font-medium text-cyber">Interactive 3D Visualization</span>
          </div>
          
          <h1 
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="gradient-text">Qubit State</span> Visualizer
          </h1>
          
          <p 
            className={`text-lg text-muted-foreground max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Explore quantum states through interactive Bloch sphere visualizations. 
            Configure qubits, apply gates, and observe quantum behavior in real-time.
          </p>
          
          {/* Feature Pills */}
          <div 
            className={`flex flex-wrap items-center justify-center gap-3 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {[
              { icon: Cpu, label: "2-8 Qubits" },
              { icon: Waves, label: "Gate Operations" },
              { icon: Sparkles, label: "Entanglement Viz" },
            ].map((feature, i) => (
              <div 
                key={feature.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border text-sm"
                style={{ transitionDelay: `${400 + i * 100}ms` }}
              >
                <feature.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
