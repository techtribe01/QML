"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Html } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Shield, Skull, Activity } from "lucide-react"

// Normal traffic follows an orbital pattern
function NormalTrafficOrbit({ showAttack }: { showAttack: boolean }) {
  const orbitRef = useRef<THREE.Group>(null)
  const packetsRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (packetsRef.current) {
      packetsRef.current.rotation.y = state.clock.elapsedTime * 0.8
    }
  })

  // Create orbit ring
  const orbitPoints: THREE.Vector3[] = []
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2
    orbitPoints.push(new THREE.Vector3(
      0.7 * Math.cos(angle),
      0.3,
      0.7 * Math.sin(angle)
    ))
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints)

  return (
    <group ref={orbitRef}>
      {/* Orbit path */}
      <line geometry={orbitGeometry}>
        <lineBasicMaterial color="#00C9A7" transparent opacity={showAttack ? 0.2 : 0.4} />
      </line>
      
      {/* Packets moving along orbit */}
      <group ref={packetsRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2
          return (
            <mesh key={i} position={[0.7 * Math.cos(angle), 0.3, 0.7 * Math.sin(angle)]}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial 
                color="#00C9A7" 
                emissive="#00C9A7" 
                emissiveIntensity={showAttack ? 0.2 : 0.5} 
              />
            </mesh>
          )
        })}
      </group>
      
      {/* Label */}
      <Html position={[0.9, 0.5, 0]} distanceFactor={10}>
        <div className="text-[10px] text-healthcare font-medium bg-white/80 px-2 py-0.5 rounded whitespace-nowrap">
          Normal Traffic
        </div>
      </Html>
    </group>
  )
}

// Attack visualization - spikes outward from normal pattern
function AttackSpike({ 
  visible, 
  attackType,
  isHighlighted,
  onClick
}: { 
  visible: boolean
  attackType: "ddos" | "exfiltration" | "lateral"
  isHighlighted: boolean
  onClick: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [animProgress, setAnimProgress] = useState(0)
  
  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setAnimProgress(prev => Math.min(prev + 0.03, 1))
      }, 20)
      return () => clearInterval(interval)
    } else {
      setAnimProgress(0)
    }
  }, [visible])

  // Different attack positions
  const attackConfigs = {
    ddos: { 
      start: [0.7, 0.3, 0] as [number, number, number], 
      end: [0.95, -0.6, 0.3] as [number, number, number],
      label: "DDoS Attack",
      packets: 15
    },
    exfiltration: { 
      start: [0, 0.3, 0.7] as [number, number, number], 
      end: [-0.5, -0.8, 0.7] as [number, number, number],
      label: "Data Exfiltration",
      packets: 8
    },
    lateral: { 
      start: [-0.7, 0.3, 0] as [number, number, number], 
      end: [-0.9, 0.1, -0.6] as [number, number, number],
      label: "Lateral Movement",
      packets: 5
    }
  }
  
  const config = attackConfigs[attackType]
  
  const currentPos: [number, number, number] = [
    config.start[0] + (config.end[0] - config.start[0]) * animProgress,
    config.start[1] + (config.end[1] - config.start[1]) * animProgress,
    config.start[2] + (config.end[2] - config.start[2]) * animProgress,
  ]
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.2
      groupRef.current.scale.setScalar(scale)
    }
  })

  if (!visible || animProgress === 0) return null

  // Create spike trail
  const trailPoints = [
    new THREE.Vector3(...config.start),
    new THREE.Vector3(...currentPos)
  ]
  const trailGeometry = new THREE.BufferGeometry().setFromPoints(trailPoints)

  return (
    <>
      {/* Spike trail */}
      <line geometry={trailGeometry}>
        <lineBasicMaterial color="#EF4444" transparent opacity={0.7} />
      </line>
      
      {/* Attack point */}
      <group ref={groupRef} position={currentPos} onClick={onClick}>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.8} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#EF4444" transparent opacity={0.3} />
        </mesh>
        
        {isHighlighted && (
          <Html distanceFactor={8} position={[0.2, 0.15, 0]}>
            <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-lg text-xs shadow-lg border border-destructive/30 min-w-[140px]">
              <div className="font-semibold text-destructive">{config.label}</div>
              <div className="text-muted-foreground mt-1">{config.packets} anomalous packets</div>
              <div className="text-destructive font-medium mt-1">Detected: 23ms</div>
            </div>
          </Html>
        )}
      </group>
    </>
  )
}

// 4-way entanglement visualization
function EntanglementWeb({ visible }: { visible: boolean }) {
  const webRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (webRef.current && visible) {
      webRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  if (!visible) return null

  const features = [
    { pos: [-0.3, -1.3, 0.3] as [number, number, number], label: "Src IP" },
    { pos: [0.3, -1.3, 0.3] as [number, number, number], label: "Dst Port" },
    { pos: [0.3, -1.3, -0.3] as [number, number, number], label: "Size" },
    { pos: [-0.3, -1.3, -0.3] as [number, number, number], label: "Time" },
  ]

  // Create connection lines
  const connections: Array<{ from: [number, number, number]; to: [number, number, number] }> = []
  for (let i = 0; i < features.length; i++) {
    for (let j = i + 1; j < features.length; j++) {
      connections.push({ from: features[i].pos, to: features[j].pos })
    }
  }

  return (
    <group ref={webRef}>
      {/* Feature nodes */}
      {features.map((f, i) => (
        <group key={i} position={f.pos}>
          <mesh>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={0.5} />
          </mesh>
          <Html distanceFactor={10} position={[0, -0.12, 0]}>
            <div className="text-[9px] text-cyber font-medium whitespace-nowrap">{f.label}</div>
          </Html>
        </group>
      ))}
      
      {/* Connection lines */}
      {connections.map((conn, i) => {
        const points = [new THREE.Vector3(...conn.from), new THREE.Vector3(...conn.to)]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#7B61FF" transparent opacity={0.4} />
          </line>
        )
      })}
      
      <Html position={[0, -1.55, 0]} distanceFactor={10}>
        <div className="text-[10px] text-cyber font-semibold">4-Way Entanglement</div>
      </Html>
    </group>
  )
}

function CybersecurityScene({ 
  showAttack, 
  attackType,
  selectedAttack,
  onSelectAttack
}: { 
  showAttack: boolean
  attackType: "ddos" | "exfiltration" | "lateral" | "all"
  selectedAttack: string | null
  onSelectAttack: (type: string | null) => void
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* Wireframe Bloch Sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial wireframe transparent opacity={0.08} color="#000000" />
      </Sphere>
      
      {/* Axes */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -1.2, 0, 0, 1.2, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#CCCCCC" transparent opacity={0.3} />
      </line>

      {/* Normal traffic orbit */}
      <NormalTrafficOrbit showAttack={showAttack} />
      
      {/* Attack spikes */}
      <AttackSpike 
        visible={showAttack && (attackType === "ddos" || attackType === "all")} 
        attackType="ddos"
        isHighlighted={selectedAttack === "ddos"}
        onClick={() => onSelectAttack(selectedAttack === "ddos" ? null : "ddos")}
      />
      <AttackSpike 
        visible={showAttack && (attackType === "exfiltration" || attackType === "all")} 
        attackType="exfiltration"
        isHighlighted={selectedAttack === "exfiltration"}
        onClick={() => onSelectAttack(selectedAttack === "exfiltration" ? null : "exfiltration")}
      />
      <AttackSpike 
        visible={showAttack && (attackType === "lateral" || attackType === "all")} 
        attackType="lateral"
        isHighlighted={selectedAttack === "lateral"}
        onClick={() => onSelectAttack(selectedAttack === "lateral" ? null : "lateral")}
      />
      
      {/* Entanglement visualization */}
      <EntanglementWeb visible={true} />
      
      <OrbitControls enableZoom={true} autoRotate={!showAttack} autoRotateSpeed={0.8} />
    </>
  )
}

export function CybersecurityBloch() {
  const [isMounted, setIsMounted] = useState(false)
  const [showAttack, setShowAttack] = useState(false)
  const [attackType, setAttackType] = useState<"ddos" | "exfiltration" | "lateral" | "all">("all")
  const [selectedAttack, setSelectedAttack] = useState<string | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleAttack = () => {
    setShowAttack(!showAttack)
    if (!showAttack) {
      setSelectedAttack("ddos")
    } else {
      setSelectedAttack(null)
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-bold text-foreground mb-2">Network Traffic Pattern Space</h3>
        <p className="text-sm text-muted-foreground">
          Normal traffic follows predictable orbital patterns. Attacks spike outward as anomalies detected by 4-way entanglement.
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
              <CybersecurityScene 
                showAttack={showAttack}
                attackType={attackType}
                selectedAttack={selectedAttack}
                onSelectAttack={setSelectedAttack}
              />
            </Canvas>
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Initializing...</div>
          </div>
        )}

        {/* Status panel */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Activity className={`w-4 h-4 ${showAttack ? 'text-destructive animate-pulse' : 'text-healthcare'}`} />
            <span className="text-xs font-semibold">
              {showAttack ? "THREAT DETECTED" : "MONITORING"}
            </span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Packets/sec:</span>
              <span className="font-mono">{showAttack ? "1,247,392" : "842,156"}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">Anomaly score:</span>
              <span className={`font-mono ${showAttack ? 'text-destructive' : 'text-healthcare'}`}>
                {showAttack ? "0.92" : "0.03"}
              </span>
            </div>
          </div>
        </div>

        {/* Detection latency */}
        {showAttack && (
          <div className="absolute top-4 right-4 bg-destructive/10 backdrop-blur rounded-lg p-3 shadow-lg border border-destructive/30">
            <div className="text-xs text-destructive font-semibold mb-1">Detection Latency</div>
            <div className="text-2xl font-bold text-destructive">23ms</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={showAttack ? "destructive" : "default"}
            onClick={handleAttack}
            className="gap-2"
          >
            {showAttack ? <Skull className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {showAttack ? "Attack in Progress" : "Simulate APT Attack"}
          </Button>
          
          {showAttack && (
            <select 
              value={attackType}
              onChange={(e) => setAttackType(e.target.value as typeof attackType)}
              className="text-xs border rounded px-2 py-1 bg-white"
            >
              <option value="all">All Attacks</option>
              <option value="ddos">DDoS Only</option>
              <option value="exfiltration">Data Exfiltration</option>
              <option value="lateral">Lateral Movement</option>
            </select>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-healthcare" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Attack</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyber" />
            <span>Entangled</span>
          </div>
        </div>
      </div>
    </div>
  )
}
