"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Html } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

// Patient state that rotates from healthy (top) to critical (bottom) over time
function PatientState({ 
  isAnimating, 
  progress 
}: { 
  isAnimating: boolean
  progress: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  // Calculate position based on progress (0 = healthy at top, 1 = critical at bottom)
  const theta = progress * Math.PI // 0 to PI (top to bottom)
  const phi = progress * Math.PI * 2 // Spiral rotation
  
  const x = 0.85 * Math.sin(theta) * Math.cos(phi)
  const y = 0.85 * Math.cos(theta)
  const z = 0.85 * Math.sin(theta) * Math.sin(phi)
  
  // Color interpolation: green -> orange -> red
  const getColor = (p: number) => {
    if (p < 0.4) return "#00C9A7" // Green - healthy
    if (p < 0.7) return "#FFA500" // Orange - warning
    return "#EF4444" // Red - critical
  }
  
  useFrame((state) => {
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.2
      glowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group position={[x, y, z]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={getColor(progress)} emissive={getColor(progress)} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color={getColor(progress)} transparent opacity={0.3} />
      </mesh>
      <Html distanceFactor={10} position={[0.2, 0.1, 0]}>
        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-lg border">
          Patient State
        </div>
      </Html>
    </group>
  )
}

// Trail showing the path from healthy to critical
function StateTrail({ progress }: { progress: number }) {
  const points: THREE.Vector3[] = []
  const segments = 50
  
  for (let i = 0; i <= segments * progress; i++) {
    const t = i / segments
    const theta = t * Math.PI
    const phi = t * Math.PI * 2
    const x = 0.85 * Math.sin(theta) * Math.cos(phi)
    const y = 0.85 * Math.cos(theta)
    const z = 0.85 * Math.sin(theta) * Math.sin(phi)
    points.push(new THREE.Vector3(x, y, z))
  }
  
  if (points.length < 2) return null
  
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#EF4444" transparent opacity={0.6} />
    </line>
  )
}

// Vital signs as entangled qubits
function VitalSigns({ progress }: { progress: number }) {
  const hrRef = useRef<THREE.Mesh>(null)
  const bpRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (hrRef.current && bpRef.current) {
      // Heart rate and blood pressure oscillate in correlation
      const offset = Math.sin(state.clock.elapsedTime * 2) * 0.1
      hrRef.current.position.x = -0.5 + offset
      bpRef.current.position.x = 0.5 - offset // Inversely correlated
    }
  })
  
  const hrColor = progress > 0.5 ? "#EF4444" : "#00C9A7"
  const bpColor = progress > 0.5 ? "#EF4444" : "#00C9A7"
  
  return (
    <group position={[0, -1.5, 0]}>
      {/* Heart Rate */}
      <mesh ref={hrRef} position={[-0.5, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={hrColor} />
      </mesh>
      <Html position={[-0.5, -0.15, 0]} distanceFactor={10}>
        <div className="text-[10px] text-muted-foreground whitespace-nowrap">HR</div>
      </Html>
      
      {/* Blood Pressure */}
      <mesh ref={bpRef} position={[0.5, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color={bpColor} />
      </mesh>
      <Html position={[0.5, -0.15, 0]} distanceFactor={10}>
        <div className="text-[10px] text-muted-foreground whitespace-nowrap">BP</div>
      </Html>
      
      {/* Entanglement line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-0.5, 0, 0, 0.5, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7B61FF" transparent opacity={0.6} />
      </line>
      
      <Html position={[0, 0.15, 0]} distanceFactor={10}>
        <div className="text-[10px] text-cyber font-medium">Entangled</div>
      </Html>
    </group>
  )
}

// Zone indicators
function HealthZones() {
  return (
    <>
      {/* Healthy zone - top */}
      <mesh position={[0, 0.85, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshBasicMaterial color="#00C9A7" transparent opacity={0.4} />
      </mesh>
      
      {/* Warning zone - middle */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.85, 0.02, 8, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.3} />
      </mesh>
      
      {/* Critical zone - bottom */}
      <mesh position={[0, -0.85, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 32]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.4} />
      </mesh>
    </>
  )
}

function HealthcareScene({ isAnimating, progress }: { isAnimating: boolean; progress: number }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* Wireframe Bloch Sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial wireframe transparent opacity={0.1} color="#000000" />
      </Sphere>
      
      {/* Z-axis (vertical) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -1.2, 0, 0, 1.2, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#1640FF" transparent opacity={0.5} />
      </line>
      
      {/* Zone labels */}
      <Html position={[0.4, 1.1, 0]} distanceFactor={10}>
        <div className="text-xs font-semibold text-healthcare bg-white/80 px-2 py-1 rounded shadow">Healthy |0⟩</div>
      </Html>
      <Html position={[0.4, -1.1, 0]} distanceFactor={10}>
        <div className="text-xs font-semibold text-destructive bg-white/80 px-2 py-1 rounded shadow">Critical |1⟩</div>
      </Html>
      
      <HealthZones />
      <StateTrail progress={progress} />
      <PatientState isAnimating={isAnimating} progress={progress} />
      <VitalSigns progress={progress} />
      
      <OrbitControls enableZoom={true} autoRotate={!isAnimating} autoRotateSpeed={1} />
    </>
  )
}

export function HealthcareBloch() {
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [progress, setProgress] = useState(0)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (animationRef.current) clearInterval(animationRef.current)
    }
  }, [])

  useEffect(() => {
    if (isAnimating) {
      animationRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            setIsAnimating(false)
            return 1
          }
          return prev + 0.005
        })
      }, 50)
    } else {
      if (animationRef.current) clearInterval(animationRef.current)
    }
    
    return () => {
      if (animationRef.current) clearInterval(animationRef.current)
    }
  }, [isAnimating])

  const handleReset = () => {
    setIsAnimating(false)
    setProgress(0)
  }

  const getPhaseLabel = () => {
    if (progress < 0.2) return "Normal Vitals"
    if (progress < 0.4) return "Subtle Changes"
    if (progress < 0.6) return "QADS Alert"
    if (progress < 0.8) return "Traditional Alert"
    return "Critical State"
  }

  const getTimeLabel = () => {
    const hours = Math.round(progress * 8)
    return `T + ${hours}h`
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-bold text-foreground mb-2">Sepsis Progression on Bloch Sphere</h3>
        <p className="text-sm text-muted-foreground">
          Watch the patient state rotate from healthy (top) to critical (bottom). QADS detects the drift 4-6 hours earlier.
        </p>
      </div>

      {/* 3D Visualization */}
      <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-white relative">
        {isMounted ? (
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Loading 3D visualization...</div>
            </div>
          }>
            <Canvas
              camera={{ position: [2, 1.5, 2.5], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              dpr={[1, 2]}
            >
              <HealthcareScene isAnimating={isAnimating} progress={progress} />
            </Canvas>
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Initializing...</div>
          </div>
        )}

        {/* Status overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border">
          <div className="text-xs text-muted-foreground mb-1">{getTimeLabel()}</div>
          <div className="text-sm font-semibold text-foreground">{getPhaseLabel()}</div>
          <div className="mt-2 w-32 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${progress * 100}%`,
                background: progress < 0.4 ? '#00C9A7' : progress < 0.7 ? '#FFA500' : '#EF4444'
              }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={isAnimating ? "destructive" : "default"}
            onClick={() => setIsAnimating(!isAnimating)}
            className="gap-2"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAnimating ? "Pause" : "Simulate Sepsis"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleReset} className="gap-2 bg-transparent">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-healthcare" />
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Critical</span>
          </div>
        </div>
      </div>
    </div>
  )
}
