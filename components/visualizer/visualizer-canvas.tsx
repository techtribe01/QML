"use client"

// Visualizer Canvas v2 - Updated with proper 3D Bloch spheres
import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Line, Text, Html } from "@react-three/drei"
import type * as THREE from "three"

interface QubitState {
  id: number
  theta: number
  phi: number
  measured: boolean
  entangledWith: number | null
}

// Bloch Sphere component
function BlochSphere({ 
  qubit, 
  position, 
  isSelected, 
  onSelect, 
  color 
}: { 
  qubit: QubitState
  position: [number, number, number]
  isSelected: boolean
  onSelect: () => void
  color: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const stateGroupRef = useRef<THREE.Group>(null)
  
  // Calculate state vector endpoint
  const r = 1
  const stateX = r * Math.sin(qubit.theta) * Math.cos(qubit.phi)
  const stateY = r * Math.cos(qubit.theta)
  const stateZ = r * Math.sin(qubit.theta) * Math.sin(qubit.phi)
  
  useFrame((state) => {
    if (groupRef.current && !isSelected) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group position={position} onClick={onSelect}>
      <group ref={groupRef}>
        {/* Main wireframe sphere */}
        <Sphere args={[1, 24, 24]}>
          <meshBasicMaterial 
            color={isSelected ? color : "#e2e8f0"} 
            wireframe 
            transparent 
            opacity={isSelected ? 0.3 : 0.15}
          />
        </Sphere>
        
        {/* Inner sphere */}
        <Sphere args={[0.98, 24, 24]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.03} />
        </Sphere>
        
        {/* Equator circle */}
        <Line
          points={Array.from({ length: 65 }, (_, i) => {
            const angle = (i / 64) * Math.PI * 2
            return [Math.cos(angle), 0, Math.sin(angle)] as [number, number, number]
          })}
          color={isSelected ? color : "#94a3b8"}
          lineWidth={1}
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
          points={[[0, -1.3, 0], [0, 1.3, 0]]}
          color="#1640FF"
          lineWidth={2}
        />
        
        {/* X-axis */}
        <Line
          points={[[-1.3, 0, 0], [1.3, 0, 0]]}
          color="#00C9A7"
          lineWidth={1}
          transparent
          opacity={0.6}
        />
        
        {/* Y-axis */}
        <Line
          points={[[0, 0, -1.3], [0, 0, 1.3]]}
          color="#7B61FF"
          lineWidth={1}
          transparent
          opacity={0.6}
        />
        
        {/* Axis labels */}
        <Text position={[0, 1.5, 0]} fontSize={0.15} color="#1640FF" font="/fonts/Geist-Bold.ttf">
          |0⟩
        </Text>
        <Text position={[0, -1.5, 0]} fontSize={0.15} color="#1640FF" font="/fonts/Geist-Bold.ttf">
          |1⟩
        </Text>
        <Text position={[1.5, 0, 0]} fontSize={0.12} color="#00C9A7" font="/fonts/Geist-Regular.ttf">
          |+⟩
        </Text>
        <Text position={[-1.5, 0, 0]} fontSize={0.12} color="#00C9A7" font="/fonts/Geist-Regular.ttf">
          |-⟩
        </Text>
        
        {/* State vector group */}
        <group ref={stateGroupRef}>
          {/* State vector line */}
          <Line
            points={[[0, 0, 0], [stateX, stateY, stateZ]]}
            color={color}
            lineWidth={2}
          />
          
          {/* State point */}
          <Sphere args={[0.08, 16, 16]} position={[stateX, stateY, stateZ]}>
            <meshBasicMaterial color={color} />
          </Sphere>
          
          {/* Glow */}
          <Sphere args={[0.14, 16, 16]} position={[stateX, stateY, stateZ]}>
            <meshBasicMaterial color={color} transparent opacity={0.25} />
          </Sphere>
        </group>
        
        {/* Qubit label */}
        <Html position={[0, -1.8, 0]} center>
          <div className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
            isSelected 
              ? 'bg-primary text-white' 
              : 'bg-secondary text-foreground'
          }`}>
            Q{qubit.id}
            {qubit.entangledWith !== null && (
              <span className="ml-1 text-cyan-500">⟷Q{qubit.entangledWith}</span>
            )}
          </div>
        </Html>
      </group>
    </group>
  )
}

// Entanglement connection
function EntanglementConnection({ 
  start, 
  end 
}: { 
  start: [number, number, number]
  end: [number, number, number]
}) {
  // Create bezier curve points
  const midY = Math.max(start[1], end[1]) + 1.5
  const points: [number, number, number][] = []
  
  for (let t = 0; t <= 1; t += 0.05) {
    const x = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * ((start[0] + end[0]) / 2) + t * t * end[0]
    const y = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * midY + t * t * end[1]
    const z = (1 - t) * (1 - t) * start[2] + 2 * (1 - t) * t * ((start[2] + end[2]) / 2) + t * t * end[2]
    points.push([x, y, z])
  }
  
  return (
    <Line
      points={points}
      color="#7B61FF"
      lineWidth={1.5}
      transparent
      opacity={0.5}
    />
  )
}

function Scene({ 
  qubits, 
  selectedQubit, 
  onSelectQubit 
}: { 
  qubits: QubitState[]
  selectedQubit: number | null
  onSelectQubit: (id: number) => void
}) {
  const getPosition = (index: number, total: number): [number, number, number] => {
    const spacing = 3.5
    const offset = ((total - 1) * spacing) / 2
    return [index * spacing - offset, 0, 0]
  }
  
  const colors = ["#1640FF", "#00C9A7", "#7B61FF", "#F59E0B", "#EF4444", "#EC4899", "#06B6D4", "#84CC16"]
  
  // Calculate entanglement pairs
  const entanglementPairs: { start: [number, number, number], end: [number, number, number] }[] = []
  const processed = new Set<number>()
  
  qubits.forEach((qubit, index) => {
    if (qubit.entangledWith !== null && !processed.has(qubit.id)) {
      const partnerIndex = qubits.findIndex(q => q.id === qubit.entangledWith)
      if (partnerIndex !== -1) {
        entanglementPairs.push({
          start: getPosition(index, qubits.length),
          end: getPosition(partnerIndex, qubits.length)
        })
        processed.add(qubit.id)
        processed.add(qubit.entangledWith)
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {qubits.map((qubit, index) => (
        <BlochSphere
          key={qubit.id}
          qubit={qubit}
          position={getPosition(index, qubits.length)}
          isSelected={selectedQubit === qubit.id}
          onSelect={() => onSelectQubit(qubit.id)}
          color={colors[index % colors.length]}
        />
      ))}
      
      {entanglementPairs.map((pair, index) => (
        <EntanglementConnection 
          key={index} 
          start={pair.start} 
          end={pair.end}
        />
      ))}
      
      <OrbitControls 
        enablePan={false} 
        minDistance={5} 
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </>
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

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Bloch Sphere Visualization</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#1640FF]" />
            <span className="text-xs text-muted-foreground">|0⟩ / |1⟩</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#00C9A7]" />
            <span className="text-xs text-muted-foreground">|+⟩ / |-⟩</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#7B61FF]" />
            <span className="text-xs text-muted-foreground">Entangled</span>
          </div>
        </div>
      </div>
      
      <div className="aspect-video bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative">
        {isMounted ? (
          <Canvas
            camera={{ position: [0, 3, 10], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
          >
            <color attach="background" args={["#f8fafc"]} />
            <Scene 
              qubits={qubits} 
              selectedQubit={selectedQubit}
              onSelectQubit={onSelectQubit}
            />
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground">Loading 3D visualization...</div>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
          Drag to rotate | Scroll to zoom | Click qubit to select
        </div>
      </div>
      
      <div className="px-6 py-4 border-t border-border bg-secondary/30">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{qubits.length}</div>
            <div className="text-xs text-muted-foreground">Qubits</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-cyan-500">
              {qubits.filter(q => q.entangledWith !== null).length / 2}
            </div>
            <div className="text-xs text-muted-foreground">Entangled Pairs</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">
              {selectedQubit !== null && qubits[selectedQubit]
                ? `${Math.round(Math.cos(qubits[selectedQubit].theta) ** 2 * 100)}%`
                : '--'
              }
            </div>
            <div className="text-xs text-muted-foreground">P(|0⟩)</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-emerald-500">
              {selectedQubit !== null && qubits[selectedQubit]
                ? `${Math.round(Math.sin(qubits[selectedQubit].theta) ** 2 * 100)}%`
                : '--'
              }
            </div>
            <div className="text-xs text-muted-foreground">P(|1⟩)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
