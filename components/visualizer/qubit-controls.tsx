"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RotateCcw, Play, Pause, Atom, Zap, GitBranch, Target, Info } from "lucide-react"

interface QubitState {
  id: number
  theta: number
  phi: number
  measured: boolean
  entangledWith: number | null
}

interface QubitControlsProps {
  qubits: QubitState[]
  selectedQubit: number | null
  isAnimating: boolean
  onQubitCountChange: (count: number) => void
  onSelectQubit: (id: number) => void
  onApplyGate: (gate: string, qubitId: number) => void
  onMeasure: (qubitId: number) => void
  onToggleAnimation: () => void
  onReset: () => void
}

export function QubitControls({
  qubits,
  selectedQubit,
  isAnimating,
  onQubitCountChange,
  onSelectQubit,
  onApplyGate,
  onMeasure,
  onToggleAnimation,
  onReset,
}: QubitControlsProps) {
  const selectedQubitData = selectedQubit !== null ? qubits.find(q => q.id === selectedQubit) : null
  
  // Calculate probabilities for selected qubit
  const prob0 = selectedQubitData ? Math.cos(selectedQubitData.theta / 2) ** 2 : 0.5
  const prob1 = selectedQubitData ? Math.sin(selectedQubitData.theta / 2) ** 2 : 0.5
  
  return (
    <div className="space-y-6">
      {/* Main Controls Card */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Qubit Configuration</h3>
            <p className="text-sm text-muted-foreground">Configure and manipulate quantum states</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/30'}`} />
            <span className="text-xs text-muted-foreground">{isAnimating ? 'Animating' : 'Paused'}</span>
          </div>
        </div>
        
        {/* Qubit Count Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Atom className="w-4 h-4 text-primary" />
              Number of Qubits
            </label>
            <span className="text-sm font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {qubits.length}
            </span>
          </div>
          <Slider
            value={[qubits.length]}
            onValueChange={(value) => onQubitCountChange(value[0])}
            min={2}
            max={8}
            step={2}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>2 qubits</span>
            <span>8 qubits</span>
          </div>
        </div>
        
        {/* Qubit Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <Target className="w-4 h-4 text-cyber" />
            Select Qubit
          </label>
          <div className="grid grid-cols-4 gap-2">
            {qubits.map((qubit) => (
              <button
                key={qubit.id}
                onClick={() => onSelectQubit(qubit.id)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-200
                  ${selectedQubit === qubit.id 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                  }
                  ${qubit.measured ? 'ring-2 ring-healthcare ring-offset-2' : ''}
                `}
              >
                Q{qubit.id}
              </button>
            ))}
          </div>
        </div>
        
        {/* Entanglement Pairs */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyber" />
            Entanglement Pairs
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: Math.floor(qubits.length / 2) }).map((_, i) => (
              <div 
                key={i}
                className="px-3 py-2.5 rounded-lg bg-cyber/10 border border-cyber/20 text-center flex items-center justify-center gap-2"
              >
                <span className="text-sm font-mono font-medium text-cyber">
                  Q{i * 2}
                </span>
                <div className="w-4 h-px bg-cyber/40" />
                <span className="text-xs text-cyber/60">Bell</span>
                <div className="w-4 h-px bg-cyber/40" />
                <span className="text-sm font-mono font-medium text-cyber">
                  Q{i * 2 + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Gate Operations Card */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-finance" />
          Quantum Gates
          {selectedQubit === null && (
            <span className="text-xs text-muted-foreground ml-auto">(Select a qubit first)</span>
          )}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'H', label: 'Hadamard', description: 'Creates superposition' },
            { name: 'X', label: 'Pauli-X', description: 'Bit flip (NOT gate)' },
            { name: 'Z', label: 'Pauli-Z', description: 'Phase flip' },
            { name: 'T', label: 'T-Gate', description: 'π/4 phase rotation' },
          ].map((gate) => (
            <Button 
              key={gate.name}
              variant="outline" 
              size="sm" 
              className="h-auto py-3 px-4 flex flex-col items-start bg-transparent hover:bg-primary/5 hover:border-primary/30 disabled:opacity-50"
              disabled={selectedQubit === null}
              onClick={() => selectedQubit !== null && onApplyGate(gate.name, selectedQubit)}
            >
              <span className="font-mono font-bold text-primary">{gate.name}</span>
              <span className="text-xs text-muted-foreground mt-0.5">{gate.description}</span>
            </Button>
          ))}
        </div>
        
        {/* Measure Button */}
        <Button 
          variant="outline" 
          className="w-full bg-healthcare/5 border-healthcare/30 hover:bg-healthcare/10 text-healthcare disabled:opacity-50"
          disabled={selectedQubit === null}
          onClick={() => selectedQubit !== null && onMeasure(selectedQubit)}
        >
          <Target className="w-4 h-4 mr-2" />
          Measure Q{selectedQubit ?? '-'}
        </Button>
      </div>
      
      {/* Playback Controls */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex gap-2">
          <Button 
            variant={isAnimating ? "default" : "outline"}
            className={`flex-1 ${isAnimating ? 'bg-primary' : 'bg-transparent'}`}
            onClick={onToggleAnimation}
          >
            {isAnimating ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Animation
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Animation
              </>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={onReset} className="bg-transparent">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* State Display Card */}
      {selectedQubitData && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              Qubit Q{selectedQubit} State
            </label>
            {selectedQubitData.measured && (
              <span className="text-xs px-2 py-1 rounded-full bg-healthcare/10 text-healthcare font-medium">
                Measured
              </span>
            )}
          </div>
          
          <div className="bg-secondary/50 rounded-xl p-4 font-mono text-sm space-y-3">
            {/* State vector */}
            <div>
              <div className="text-xs text-muted-foreground mb-1">State Vector</div>
              <div className="text-foreground">
                |ψ⟩ = {Math.cos(selectedQubitData.theta / 2).toFixed(3)}|0⟩ + {Math.sin(selectedQubitData.theta / 2).toFixed(3)}e<sup>i{(selectedQubitData.phi / Math.PI).toFixed(2)}π</sup>|1⟩
              </div>
            </div>
            
            {/* Probabilities */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">P(|0⟩)</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${prob0 * 100}%` }}
                    />
                  </div>
                  <span className="text-primary font-semibold">{(prob0 * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">P(|1⟩)</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-healthcare rounded-full transition-all duration-500"
                      style={{ width: `${prob1 * 100}%` }}
                    />
                  </div>
                  <span className="text-healthcare font-semibold">{(prob1 * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            {/* Bloch coordinates */}
            <div>
              <div className="text-xs text-muted-foreground mb-1">Bloch Coordinates</div>
              <div className="text-foreground">
                θ = {(selectedQubitData.theta / Math.PI).toFixed(2)}π, φ = {(selectedQubitData.phi / Math.PI).toFixed(2)}π
              </div>
            </div>
            
            {/* Entanglement info */}
            {selectedQubitData.entangledWith !== null && (
              <div className="pt-3 border-t border-border">
                <div className="text-xs text-muted-foreground mb-1">Entanglement</div>
                <div className="flex items-center gap-2 text-cyber">
                  <GitBranch className="w-4 h-4" />
                  Bell pair with Q{selectedQubitData.entangledWith}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
