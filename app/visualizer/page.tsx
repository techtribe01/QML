"use client"

import { useState, useCallback } from "react"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { VisualizerHero } from "@/components/visualizer/visualizer-hero"
import { QubitControls } from "@/components/visualizer/qubit-controls"
import { VisualizerCanvas } from "@/components/visualizer/visualizer-canvas"
import { QuantumInfo } from "@/components/visualizer/quantum-info"

interface QubitState {
  id: number
  theta: number
  phi: number
  measured: boolean
  entangledWith: number | null
}

function createInitialQubits(count: number): QubitState[] {
  const qubits: QubitState[] = []
  for (let i = 0; i < count; i++) {
    qubits.push({
      id: i,
      theta: Math.PI / 4 + (Math.random() * 0.2 - 0.1), // Slight variation
      phi: (i * Math.PI) / (count / 2),
      measured: false,
      entangledWith: i % 2 === 0 ? i + 1 : i - 1, // Pair adjacent qubits
    })
  }
  return qubits
}

export default function VisualizerPage() {
  const [qubits, setQubits] = useState<QubitState[]>(() => createInitialQubits(4))
  const [selectedQubit, setSelectedQubit] = useState<number | null>(0)
  const [isAnimating, setIsAnimating] = useState(true)
  
  // Handle qubit count change
  const handleQubitCountChange = useCallback((count: number) => {
    setQubits(createInitialQubits(count))
    setSelectedQubit(0)
  }, [])
  
  // Handle selecting a qubit
  const handleSelectQubit = useCallback((id: number) => {
    setSelectedQubit(id)
  }, [])
  
  // Apply quantum gate to a qubit
  const handleApplyGate = useCallback((gate: string, qubitId: number) => {
    setQubits(prev => prev.map(q => {
      if (q.id !== qubitId) return q
      
      let newTheta = q.theta
      let newPhi = q.phi
      
      switch (gate) {
        case 'H': // Hadamard - creates superposition
          if (q.theta < 0.1) {
            // If near |0⟩, go to |+⟩
            newTheta = Math.PI / 2
            newPhi = 0
          } else if (q.theta > Math.PI - 0.1) {
            // If near |1⟩, go to |-⟩
            newTheta = Math.PI / 2
            newPhi = Math.PI
          } else {
            // Otherwise collapse towards computational basis
            newTheta = Math.random() > 0.5 ? 0 : Math.PI
          }
          break
        case 'X': // Pauli-X (NOT gate) - flip theta
          newTheta = Math.PI - q.theta
          break
        case 'Z': // Pauli-Z - flip phase
          newPhi = q.phi + Math.PI
          break
        case 'T': // T-gate - π/4 phase rotation
          newPhi = q.phi + Math.PI / 4
          break
      }
      
      return {
        ...q,
        theta: newTheta,
        phi: newPhi % (2 * Math.PI),
        measured: false,
      }
    }))
  }, [])
  
  // Measure a qubit (collapse to |0⟩ or |1⟩)
  const handleMeasure = useCallback((qubitId: number) => {
    setQubits(prev => prev.map(q => {
      if (q.id !== qubitId) return q
      
      // Probability of measuring |0⟩
      const prob0 = Math.cos(q.theta / 2) ** 2
      const measuredValue = Math.random() < prob0 ? 0 : 1
      
      return {
        ...q,
        theta: measuredValue === 0 ? 0 : Math.PI,
        phi: 0,
        measured: true,
      }
    }))
  }, [])
  
  // Toggle animation
  const handleToggleAnimation = useCallback(() => {
    setIsAnimating(prev => !prev)
  }, [])
  
  // Reset all qubits
  const handleReset = useCallback(() => {
    setQubits(createInitialQubits(qubits.length))
    setSelectedQubit(0)
  }, [qubits.length])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <VisualizerHero />
      
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls Panel */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <QubitControls 
                qubits={qubits}
                selectedQubit={selectedQubit}
                isAnimating={isAnimating}
                onQubitCountChange={handleQubitCountChange}
                onSelectQubit={handleSelectQubit}
                onApplyGate={handleApplyGate}
                onMeasure={handleMeasure}
                onToggleAnimation={handleToggleAnimation}
                onReset={handleReset}
              />
            </div>
            
            {/* 3D Canvas */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <VisualizerCanvas 
                qubits={qubits}
                selectedQubit={selectedQubit}
                onSelectQubit={handleSelectQubit}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Educational Info */}
      <QuantumInfo />
      
      <Footer />
    </main>
  )
}
