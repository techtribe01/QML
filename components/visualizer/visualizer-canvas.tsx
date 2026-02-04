"use client"

// Visualizer Canvas v3 - Enhanced with probability clouds, animated entanglement, tooltips
import { useRef, useState, useEffect, Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Line, Html } from "@react-three/drei"
import * as THREE from "three"

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground text-sm">Loading 3D visualization...</p>
      </div>
    </div>
  )
}

interface QubitState {
  id: number
  theta: number
  phi: number
  measured: boolean
  entangledWith: number | null
}

// Probability density cloud around qubit state
function ProbabilityCloud({ 
  theta, 
  phi, 
  color,
  isSelected 
}: { 
  theta: number
  phi: number
  color: string
  isSelected: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Calculate state position
  const r = 1
  const stateX = r * Math.sin(theta) * Math.cos(phi)
  const stateY = r * Math.cos(theta)
  const stateZ = r * Math.sin(theta) * Math.sin(phi)
  
  // Probability of |0⟩ state affects cloud opacity
  const prob0 = Math.cos(theta / 2) ** 2
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      const scale = 0.25 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      meshRef.current.scale.setScalar(scale)
    }
  })
  
  if (!isSelected) return null
  
  return (
    <mesh ref={meshRef} position={[stateX, stateY, stateZ]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.15 + prob0 * 0.1}
        depthWrite={false}
      />
    </mesh>
  )
}

// Animated particles along entanglement connection
function EntanglementParticles({ 
  start, 
  end,
  isActive 
}: { 
  start: [number, number, number]
  end: [number, number, number]
  isActive: boolean
}) {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 20
  
  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    return positions
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current && isActive) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < particleCount; i++) {
        // Calculate position along bezier curve
        const t = ((i / particleCount) + state.clock.elapsedTime * 0.3) % 1
        const midY = Math.max(start[1], end[1]) + 1.5
        
        const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * ((start[0] + end[0]) / 2) + t * t * end[0]
        const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * midY + t * t * end[1]
        const z = (1 - t) * (1 - t) * start[2] + 2 * (1 - t) * t * ((start[2] + end[2]) / 2) + t * t * end[2]
        
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })
  
  if (!isActive) return null
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="#7B61FF" 
        size={0.08} 
        transparent 
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Bloch Sphere component with enhanced visuals
function BlochSphere({ 
  qubit, 
  position, 
  isSelected,
  isEntangledPartnerSelected,
  onSelect, 
  color,
  showTooltip
}: { 
  qubit: QubitState
  position: [number, number, number]
  isSelected: boolean
  isEntangledPartnerSelected: boolean
  onSelect: () => void
  color: string
  showTooltip: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  // Calculate state vector endpoint
  const r = 1
  const stateX = r * Math.sin(qubit.theta) * Math.cos(qubit.phi)
  const stateY = r * Math.cos(qubit.theta)
  const stateZ = r * Math.sin(qubit.theta) * Math.sin(qubit.phi)
  
  // Probabilities
  const prob0 = Math.cos(qubit.theta / 2) ** 2
  const prob1 = Math.sin(qubit.theta / 2) ** 2
  
  useFrame((state) => {
    if (groupRef.current && !isSelected) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
    
    // Glow pulsing for selected or entangled partner
    if (glowRef.current && (isSelected || isEntangledPartnerSelected)) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group position={position}>
      <group 
        ref={groupRef} 
        onClick={onSelect}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Selection/entanglement glow ring */}
        {(isSelected || isEntangledPartnerSelected) && (
          <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.1, 1.3, 32]} />
            <meshBasicMaterial 
              color={isSelected ? color : "#7B61FF"} 
              transparent 
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
        
        {/* Main wireframe sphere */}
        <Sphere args={[1, 32, 32]}>
          <meshBasicMaterial 
            color={isSelected ? color : hovered ? "#cbd5e1" : "#e2e8f0"} 
            wireframe 
            transparent 
            opacity={isSelected ? 0.35 : hovered ? 0.25 : 0.15}
          />
        </Sphere>
        
        {/* Inner translucent sphere */}
        <Sphere args={[0.98, 32, 32]}>
          <meshBasicMaterial 
            color={isSelected ? color : "#ffffff"} 
            transparent 
            opacity={isSelected ? 0.05 : 0.02} 
          />
        </Sphere>
        
        {/* Probability cloud */}
        <ProbabilityCloud 
          theta={qubit.theta} 
          phi={qubit.phi} 
          color={color}
          isSelected={isSelected}
        />
        
        {/* Equator circle */}
        <Line
          points={Array.from({ length: 65 }, (_, i) => {
            const angle = (i / 64) * Math.PI * 2
            return [Math.cos(angle), 0, Math.sin(angle)] as [number, number, number]
          })}
          color={isSelected ? color : "#94a3b8"}
          lineWidth={isSelected ? 1.5 : 1}
          transparent
          opacity={0.6}
        />
        
        {/* Meridian circle */}
        <Line
          points={Array.from({ length: 65 }, (_, i) => {
            const angle = (i / 64) * Math.PI * 2
            return [Math.cos(angle), Math.sin(angle), 0] as [number, number, number]
          })}
          color={isSelected ? color : "#94a3b8"}
          lineWidth={1}
          transparent
          opacity={0.4}
        />
        
        {/* Z-axis (|0⟩ to |1⟩) */}
        <Line
          points={[[0, -1.4, 0], [0, 1.4, 0]]}
          color="#1640FF"
          lineWidth={2}
        />
        
        {/* X-axis (|+⟩ to |-⟩) */}
        <Line
          points={[[-1.4, 0, 0], [1.4, 0, 0]]}
          color="#00C9A7"
          lineWidth={1.5}
          transparent
          opacity={0.7}
        />
        
        {/* Y-axis */}
        <Line
          points={[[0, 0, -1.4], [0, 0, 1.4]]}
          color="#7B61FF"
          lineWidth={1.5}
          transparent
          opacity={0.7}
        />
        
        {/* Axis labels */}
        <Html position={[0, 1.6, 0]} center>
          <div className="text-xs font-mono text-blue-600 font-bold">|0⟩</div>
        </Html>
        <Html position={[0, -1.6, 0]} center>
          <div className="text-xs font-mono text-blue-600 font-bold">|1⟩</div>
        </Html>
        <Html position={[1.6, 0, 0]} center>
          <div className="text-xs font-mono text-emerald-600">|+⟩</div>
        </Html>
        <Html position={[-1.6, 0, 0]} center>
          <div className="text-xs font-mono text-emerald-600">|-⟩</div>
        </Html>
        
        {/* State vector line */}
        <Line
          points={[[0, 0, 0], [stateX, stateY, stateZ]]}
          color={qubit.measured ? "#EF4444" : color}
          lineWidth={2.5}
        />
        
        {/* State point with glow */}
        <Sphere args={[0.1, 16, 16]} position={[stateX, stateY, stateZ]}>
          <meshBasicMaterial color={qubit.measured ? "#EF4444" : color} />
        </Sphere>
        <Sphere args={[0.18, 16, 16]} position={[stateX, stateY, stateZ]}>
          <meshBasicMaterial 
            color={qubit.measured ? "#EF4444" : color} 
            transparent 
            opacity={0.3} 
          />
        </Sphere>
        
        {/* Qubit label with tooltip */}
        <Html position={[0, -2, 0]} center>
          <div 
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              isSelected 
                ? 'bg-primary text-white shadow-lg scale-110' 
                : isEntangledPartnerSelected
                ? 'bg-violet-100 text-violet-700 border border-violet-300'
                : 'bg-white text-foreground border border-border shadow-sm hover:shadow-md'
            }`}
          >
            <span className="font-bold">Q{qubit.id}</span>
            {qubit.entangledWith !== null && (
              <span className="ml-1.5 text-violet-500">⟷ Q{qubit.entangledWith}</span>
            )}
            {qubit.measured && (
              <span className="ml-1.5 text-red-500">●</span>
            )}
          </div>
        </Html>
        
        {/* Detailed tooltip on hover/select */}
        {(showTooltip && (hovered || isSelected)) && (
          <Html position={[1.8, 1.2, 0]} center>
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-border p-3 text-xs w-44">
              <div className="font-semibold text-foreground mb-2 flex items-center justify-between">
                <span>Qubit {qubit.id}</span>
                {qubit.measured && <span className="text-red-500 text-[10px]">MEASURED</span>}
              </div>
              <div className="space-y-1.5 text-muted-foreground">
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="font-mono text-foreground">
                    |ψ⟩ = {Math.sqrt(prob0).toFixed(2)}|0⟩ + {Math.sqrt(prob1).toFixed(2)}|1⟩
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>θ (theta):</span>
                  <span className="font-mono text-foreground">{(qubit.theta * 180 / Math.PI).toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span>φ (phi):</span>
                  <span className="font-mono text-foreground">{(qubit.phi * 180 / Math.PI).toFixed(1)}°</span>
                </div>
                <div className="pt-1.5 border-t border-border mt-1.5">
                  <div className="flex justify-between mb-1">
                    <span>P(|0⟩):</span>
                    <span className="font-mono text-blue-600">{(prob0 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${prob0 * 100}%` }}
                    />
                  </div>
                </div>
                {qubit.entangledWith !== null && (
                  <div className="pt-1.5 text-violet-600">
                    Entangled with Q{qubit.entangledWith}
                  </div>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  )
}

// Enhanced entanglement connection with particles
function EntanglementConnection({ 
  start, 
  end,
  isActive
}: { 
  start: [number, number, number]
  end: [number, number, number]
  isActive: boolean
}) {
  const lineRef = useRef<THREE.Line>(null)
  
  // Create bezier curve points
  const midY = Math.max(start[1], end[1]) + 1.5
  const points: [number, number, number][] = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let t = 0; t <= 1; t += 0.02) {
      const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * ((start[0] + end[0]) / 2) + t * t * end[0]
      const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * midY + t * t * end[1]
      const z = (1 - t) * (1 - t) * start[2] + 2 * (1 - t) * t * ((start[2] + end[2]) / 2) + t * t * end[2]
      pts.push([x, y, z])
    }
    return pts
  }, [start, end, midY])
  
  return (
    <>
      <Line
        points={points}
        color="#7B61FF"
        lineWidth={isActive ? 2.5 : 1.5}
        transparent
        opacity={isActive ? 0.8 : 0.4}
      />
      <EntanglementParticles start={start} end={end} isActive={isActive} />
    </>
  )
}

function Scene({ 
  qubits, 
  selectedQubit, 
  onSelectQubit,
  showTooltips
}: { 
  qubits: QubitState[]
  selectedQubit: number | null
  onSelectQubit: (id: number) => void
  showTooltips: boolean
}) {
  const getPosition = (index: number, total: number): [number, number, number] => {
    const spacing = 4
    const offset = ((total - 1) * spacing) / 2
    return [index * spacing - offset, 0, 0]
  }
  
  const colors = ["#1640FF", "#00C9A7", "#7B61FF", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#84CC16"]
  
  // Calculate entanglement pairs
  const entanglementPairs: { start: [number, number, number], end: [number, number, number], isActive: boolean }[] = []
  const processed = new Set<number>()
  
  qubits.forEach((qubit, index) => {
    if (qubit.entangledWith !== null && !processed.has(qubit.id)) {
      const partnerIndex = qubits.findIndex(q => q.id === qubit.entangledWith)
      if (partnerIndex !== -1) {
        const isActive = selectedQubit === qubit.id || selectedQubit === qubit.entangledWith
        entanglementPairs.push({
          start: getPosition(index, qubits.length),
          end: getPosition(partnerIndex, qubits.length),
          isActive
        })
        processed.add(qubit.id)
        processed.add(qubit.entangledWith)
      }
    }
  })

  // Get selected qubit's entangled partner
  const selectedEntangledPartner = selectedQubit !== null 
    ? qubits.find(q => q.id === selectedQubit)?.entangledWith 
    : null

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {qubits.map((qubit, index) => (
        <BlochSphere
          key={qubit.id}
          qubit={qubit}
          position={getPosition(index, qubits.length)}
          isSelected={selectedQubit === qubit.id}
          isEntangledPartnerSelected={selectedEntangledPartner === qubit.id}
          onSelect={() => onSelectQubit(qubit.id)}
          color={colors[index % colors.length]}
          showTooltip={showTooltips}
        />
      ))}
      
      {entanglementPairs.map((pair, index) => (
        <EntanglementConnection 
          key={index} 
          start={pair.start} 
          end={pair.end}
          isActive={pair.isActive}
        />
      ))}
      
      <OrbitControls 
        enablePan={false} 
        minDistance={6} 
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.15}
      />
    </>
  )
}

// Density Matrix Heatmap
function DensityMatrixDisplay({ qubits, selectedQubit }: { qubits: QubitState[], selectedQubit: number | null }) {
  const qubit = selectedQubit !== null ? qubits.find(q => q.id === selectedQubit) : null
  
  if (!qubit) return null
  
  const prob0 = Math.cos(qubit.theta / 2) ** 2
  const prob1 = Math.sin(qubit.theta / 2) ** 2
  const coherence = Math.sqrt(prob0 * prob1)
  
  // Density matrix elements
  const rho = [
    [prob0, coherence * Math.cos(qubit.phi)],
    [coherence * Math.cos(qubit.phi), prob1]
  ]
  
  const getColor = (value: number) => {
    const intensity = Math.abs(value)
    if (value >= 0) {
      return `rgba(22, 64, 255, ${intensity})`
    }
    return `rgba(239, 68, 68, ${intensity})`
  }
  
  return (
    <div className="bg-white rounded-lg border border-border p-3">
      <div className="text-xs font-medium text-muted-foreground mb-2">Density Matrix ρ</div>
      <div className="grid grid-cols-2 gap-1">
        {rho.map((row, i) => 
          row.map((val, j) => (
            <div 
              key={`${i}-${j}`}
              className="aspect-square rounded flex items-center justify-center text-xs font-mono"
              style={{ backgroundColor: getColor(val) }}
            >
              <span className={val > 0.5 ? 'text-white' : 'text-foreground'}>
                {val.toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="text-[10px] text-muted-foreground mt-2 text-center">
        Tr(ρ) = {(rho[0][0] + rho[1][1]).toFixed(2)}
      </div>
    </div>
  )
}

interface VisualizerCanvasProps {
  qubits?: QubitState[]
  selectedQubit?: number | null
  onSelectQubit?: (id: number) => void
}

export function VisualizerCanvas({ 
  qubits: externalQubits, 
  selectedQubit: externalSelected,
  onSelectQubit: externalOnSelect 
}: VisualizerCanvasProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [showTooltips, setShowTooltips] = useState(true)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const [internalQubits] = useState<QubitState[]>([
    { id: 0, theta: Math.PI / 4, phi: 0, measured: false, entangledWith: 1 },
    { id: 1, theta: Math.PI / 4, phi: 0, measured: false, entangledWith: 0 },
    { id: 2, theta: Math.PI / 2, phi: Math.PI / 4, measured: false, entangledWith: 3 },
    { id: 3, theta: Math.PI / 2, phi: Math.PI / 4, measured: false, entangledWith: 2 },
  ])
  const [internalSelected, setInternalSelected] = useState<number | null>(0)
  
  const qubits = externalQubits || internalQubits
  const selectedQubit = externalSelected !== undefined ? externalSelected : internalSelected
  const onSelectQubit = externalOnSelect || setInternalSelected
  
  const selectedQubitData = selectedQubit !== null ? qubits.find(q => q.id === selectedQubit) : null

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
        <div>
          <h3 className="font-semibold text-foreground">Quantum State Visualization</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Interactive Bloch sphere representation</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input 
              type="checkbox" 
              checked={showTooltips}
              onChange={(e) => setShowTooltips(e.target.checked)}
              className="rounded border-border"
            />
            Show tooltips
          </label>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1640FF]" />
              <span className="text-muted-foreground">|0⟩/|1⟩</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]" />
              <span className="text-muted-foreground">|+⟩/|-⟩</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#7B61FF]" />
              <span className="text-muted-foreground">Entangled</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <div className="aspect-[16/9] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative">
        {isMounted ? (
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              camera={{ position: [0, 4, 12], fov: 50 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              dpr={[1, 2]}
              onCreated={({ gl }) => {
                gl.setClearColor('#f8fafc')
              }}
            >
              <Scene 
                qubits={qubits} 
                selectedQubit={selectedQubit}
                onSelectQubit={onSelectQubit}
                showTooltips={showTooltips}
              />
            </Canvas>
          </Suspense>
        ) : (
          <LoadingFallback />
        )}
        
        {/* Density Matrix overlay */}
        {selectedQubitData && (
          <div className="absolute top-4 right-4">
            <DensityMatrixDisplay qubits={qubits} selectedQubit={selectedQubit} />
          </div>
        )}
        
        {/* Instructions */}
        <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Controls:</span> Drag to rotate | Scroll to zoom | Click qubit to select
        </div>
      </div>
      
      {/* Bottom stats panel */}
      <div className="px-6 py-4 border-t border-border bg-secondary/30">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{qubits.length}</div>
            <div className="text-xs text-muted-foreground">Total Qubits</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-violet-500">
              {qubits.filter(q => q.entangledWith !== null).length / 2}
            </div>
            <div className="text-xs text-muted-foreground">Entangled Pairs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {selectedQubitData
                ? `${(Math.cos(selectedQubitData.theta / 2) ** 2 * 100).toFixed(1)}%`
                : '--'
              }
            </div>
            <div className="text-xs text-muted-foreground">P(|0⟩)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-500">
              {selectedQubitData
                ? `${(Math.sin(selectedQubitData.theta / 2) ** 2 * 100).toFixed(1)}%`
                : '--'
              }
            </div>
            <div className="text-xs text-muted-foreground">P(|1⟩)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-500">
              {qubits.filter(q => q.measured).length}
            </div>
            <div className="text-xs text-muted-foreground">Measured</div>
          </div>
        </div>
      </div>
    </div>
  )
}
