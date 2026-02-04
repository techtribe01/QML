"use client"

import { useState, useEffect, useRef } from "react"
import { Atom, GitBranch, Zap, ChevronRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

const concepts = [
  {
    title: "Bloch Sphere",
    description: "A geometric representation of a qubit state. The north pole represents |0⟩, the south pole represents |1⟩, and points on the surface represent superposition states.",
    icon: Atom,
    color: "primary",
    details: [
      "Pure states lie on the surface",
      "Mixed states are inside the sphere",
      "Rotation = quantum gate operation"
    ]
  },
  {
    title: "Quantum Gates",
    description: "Operations that manipulate qubit states. The Hadamard gate (H) creates superposition, while CNOT creates entanglement between qubits.",
    icon: GitBranch,
    color: "cyber",
    details: [
      "Hadamard: |0⟩ → |+⟩ superposition",
      "Pauli-X: Bit flip operation",
      "T-gate: Phase rotation"
    ]
  },
  {
    title: "Entanglement",
    description: "A quantum phenomenon where qubits become correlated. Measuring one entangled qubit instantly affects its partner, enabling powerful quantum computations.",
    icon: Zap,
    color: "healthcare",
    details: [
      "Bell states: Maximally entangled",
      "Non-local correlations",
      "Key for quantum advantage"
    ]
  },
]

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    glow: "shadow-primary/20"
  },
  cyber: {
    bg: "bg-cyber/10",
    border: "border-cyber/20",
    text: "text-cyber",
    glow: "shadow-cyber/20"
  },
  healthcare: {
    bg: "bg-healthcare/10",
    border: "border-healthcare/20",
    text: "text-healthcare",
    glow: "shadow-healthcare/20"
  }
}

export function QuantumInfo() {
  const [isVisible, setIsVisible] = useState(false)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
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
    <section ref={sectionRef} className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.03) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div 
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out'
          }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-border mb-6">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Learn Quantum Basics</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Understanding{" "}
            <span className="gradient-text">Quantum Computing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn the fundamentals of quantum mechanics that power QADIS anomaly detection.
          </p>
        </div>
        
        {/* Concept Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {concepts.map((concept, index) => {
            const colors = colorClasses[concept.color as keyof typeof colorClasses]
            const isExpanded = expandedCard === index
            
            return (
              <div 
                key={concept.title}
                className={`
                  group relative bg-white rounded-2xl border border-border overflow-hidden
                  transition-all duration-500 cursor-pointer
                  ${isExpanded ? `shadow-lg ${colors.glow}` : 'hover:shadow-md'}
                `}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${index * 150}ms`
                }}
                onClick={() => setExpandedCard(isExpanded ? null : index)}
              >
                {/* Top Accent */}
                <div className={`h-1 ${colors.bg} transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <div 
                    className={`h-full bg-gradient-to-r from-transparent via-current to-transparent ${colors.text}`}
                    style={{ width: isExpanded ? '100%' : '0%', transition: 'width 0.5s ease-out' }}
                  />
                </div>
                
                <div className="p-8">
                  {/* Icon */}
                  <div className={`
                    w-14 h-14 rounded-xl ${colors.bg} border ${colors.border}
                    flex items-center justify-center mb-6
                    transition-all duration-300 group-hover:scale-110
                    ${isExpanded ? 'scale-110' : ''}
                  `}>
                    <concept.icon className={`w-7 h-7 ${colors.text}`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    {concept.title}
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {concept.description}
                  </p>
                  
                  {/* Expandable Details */}
                  <div 
                    className="overflow-hidden transition-all duration-500"
                    style={{ maxHeight: isExpanded ? '200px' : '0px', opacity: isExpanded ? 1 : 0 }}
                  >
                    <div className="pt-4 border-t border-border space-y-2">
                      {concept.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.bg} ${colors.text}`} />
                          <span className="text-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Bottom CTA */}
        <div 
          className="mt-12 text-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease-out',
            transitionDelay: '600ms'
          }}
        >
          <Button variant="outline" className="bg-white">
            <BookOpen className="w-4 h-4 mr-2" />
            View Full Documentation
          </Button>
        </div>
      </div>
    </section>
  )
}
