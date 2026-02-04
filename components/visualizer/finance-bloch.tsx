"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Html } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Play, Pause, CreditCard, ShieldAlert, DollarSign } from "lucide-react"

interface Transaction {
  id: number
  position: [number, number, number]
  type: "legitimate" | "suspicious" | "fraud"
  kernelValue: number
  amount: number
  merchant: string
  time: string
  velocity: number
}

// Sarah's behavioral fingerprint - her normal spending pattern forms a tight cluster
function BehavioralFingerprint({ opacity }: { opacity: number }) {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group position={[0.3, 0.5, 0.2]}>
      {/* Fingerprint core - Sarah's baseline */}
      <mesh>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshBasicMaterial color="#1640FF" transparent opacity={opacity * 0.15} />
      </mesh>
      
      {/* Pulsing ring showing normal variance */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.2, 0.01, 8, 32]} />
        <meshBasicMaterial color="#1640FF" transparent opacity={opacity * 0.3} />
      </mesh>
      
      <Html position={[0.25, 0.15, 0]} distanceFactor={10}>
        <div className="text-[10px] text-primary font-medium bg-white/80 px-2 py-0.5 rounded whitespace-nowrap">
          Sarah's Fingerprint
        </div>
      </Html>
    </group>
  )
}

// Real-time transaction that flows in and gets measured
function LiveTransaction({ 
  transaction,
  isActive,
  showMeasurement,
  fingerprintCenter
}: { 
  transaction: Transaction | null
  isActive: boolean
  showMeasurement: boolean
  fingerprintCenter: [number, number, number]
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [animProgress, setAnimProgress] = useState(0)
  
  useEffect(() => {
    if (isActive && transaction) {
      setAnimProgress(0)
      const interval = setInterval(() => {
        setAnimProgress(prev => Math.min(prev + 0.03, 1))
      }, 20)
      return () => clearInterval(interval)
    }
  }, [isActive, transaction]) // Updated dependency array

  useFrame((state) => {
    if (meshRef.current && isActive) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 5) * 0.2
      meshRef.current.scale.setScalar(pulse)
    }
  })

  if (!transaction || !isActive) return null

  const startPos: [number, number, number] = [0, 1.3, 0]
  const targetPos = transaction.position
  
  const currentPos: [number, number, number] = [
    startPos[0] + (targetPos[0] - startPos[0]) * animProgress,
    startPos[1] + (targetPos[1] - startPos[1]) * animProgress,
    startPos[2] + (targetPos[2] - startPos[2]) * animProgress,
  ]
  
  const color = transaction.type === "legitimate" ? "#1640FF" : 
                transaction.type === "suspicious" ? "#FFA500" : "#EF4444"

  // Kernel measurement line
  const measurementPoints = showMeasurement && animProgress > 0.8 ? [
    new THREE.Vector3(...currentPos),
    new THREE.Vector3(...fingerprintCenter)
  ] : null

  return (
    <>
      {/* Transaction point */}
      <group position={currentPos}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
        
        {animProgress > 0.9 && (
          <Html distanceFactor={8} position={[0.15, 0.1, 0]}>
            <div className={`bg-white/95 backdrop-blur px-3 py-2 rounded-lg text-xs shadow-lg border min-w-[130px] ${
              transaction.type === "fraud" ? "border-destructive/50" : "border-border"
            }`}>
              <div className="font-semibold text-foreground">${transaction.amount}</div>
              <div className="text-muted-foreground">{transaction.merchant}</div>
              <div className="text-muted-foreground">{transaction.time}</div>
              <div className="mt-1 pt-1 border-t border-border">
                <span className="text-muted-foreground">K = </span>
                <span className={`font-bold ${
                  transaction.type === "legitimate" ? "text-primary" :
                  transaction.type === "suspicious" ? "text-amber-600" : "text-destructive"
                }`}>{transaction.kernelValue.toFixed(2)}</span>
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* Kernel measurement line */}
      {measurementPoints && (
        <line geometry={new THREE.BufferGeometry().setFromPoints(measurementPoints)}>
          <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={2} />
        </line>
      )}
    </>
  )
}

// Historical transactions that stay on the sphere
function HistoricalTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <>
      {transactions.map((tx) => {
        const color = tx.type === "legitimate" ? "#1640FF" : 
                      tx.type === "suspicious" ? "#FFA500" : "#EF4444"
        return (
          <mesh key={tx.id} position={tx.position}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.7} />
          </mesh>
        )
      })}
    </>
  )
}

// 8-way entanglement visualization
function EntanglementOctagon() {
  const groupRef = useRef<THREE.Group>(null)
  
  const features = [
    { angle: 0, label: "Amt" },
    { angle: 45, label: "Loc" },
    { angle: 90, label: "Time" },
    { angle: 135, label: "Dev" },
    { angle: 180, label: "Merch" },
    { angle: 225, label: "Vel" },
    { angle: 270, label: "Hist" },
    { angle: 315, label: "Peer" },
  ]

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  const radius = 0.4
  const y = -1.35

  return (
    <group ref={groupRef}>
      {/* Feature nodes */}
      {features.map((f, i) => {
        const rad = (f.angle * Math.PI) / 180
        const x = radius * Math.cos(rad)
        const z = radius * Math.sin(rad)
        return (
          <group key={i} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.025, 8, 8]} />
              <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={0.5} />
            </mesh>
          </group>
        )
      })}
      
      {/* Connecting lines (octagon) */}
      {features.map((f, i) => {
        const nextI = (i + 1) % features.length
        const rad1 = (f.angle * Math.PI) / 180
        const rad2 = (features[nextI].angle * Math.PI) / 180
        const points = [
          new THREE.Vector3(radius * Math.cos(rad1), y, radius * Math.sin(rad1)),
          new THREE.Vector3(radius * Math.cos(rad2), y, radius * Math.sin(rad2)),
        ]
        return (
          <line key={i} geometry={new THREE.BufferGeometry().setFromPoints(points)}>
            <lineBasicMaterial color="#7B61FF" transparent opacity={0.4} />
          </line>
        )
      })}
      
      {/* Cross connections */}
      {[0, 1, 2, 3].map((i) => {
        const rad1 = (features[i].angle * Math.PI) / 180
        const rad2 = (features[i + 4].angle * Math.PI) / 180
        const points = [
          new THREE.Vector3(radius * Math.cos(rad1), y, radius * Math.sin(rad1)),
          new THREE.Vector3(radius * Math.cos(rad2), y, radius * Math.sin(rad2)),
        ]
        return (
          <line key={`cross-${i}`} geometry={new THREE.BufferGeometry().setFromPoints(points)}>
            <lineBasicMaterial color="#7B61FF" transparent opacity={0.2} />
          </line>
        )
      })}

      <Html position={[0, y - 0.15, 0]} distanceFactor={10}>
        <div className="text-[10px] text-cyber font-semibold whitespace-nowrap">8-Way Entanglement</div>
      </Html>
    </group>
  )
}

function FinanceScene({ 
  historicalTxns,
  currentTxn,
  isStreaming,
  showMeasurement
}: { 
  historicalTxns: Transaction[]
  currentTxn: Transaction | null
  isStreaming: boolean
  showMeasurement: boolean
}) {
  const fingerprintCenter: [number, number, number] = [0.3, 0.5, 0.2]

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* Wireframe Bloch Sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial wireframe transparent opacity={0.08} color="#000000" />
      </Sphere>
      
      {/* Axes with labels */}
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
      
      {/* Pole labels */}
      <Html position={[0.15, 1.15, 0]} distanceFactor={10}>
        <div className="text-[10px] text-primary font-semibold bg-white/80 px-1.5 py-0.5 rounded">Legitimate</div>
      </Html>
      <Html position={[0.15, -1.15, 0]} distanceFactor={10}>
        <div className="text-[10px] text-destructive font-semibold bg-white/80 px-1.5 py-0.5 rounded">Fraudulent</div>
      </Html>

      {/* Sarah's behavioral fingerprint */}
      <BehavioralFingerprint opacity={1} />
      
      {/* Historical transactions */}
      <HistoricalTransactions transactions={historicalTxns} />
      
      {/* Current live transaction */}
      <LiveTransaction 
        transaction={currentTxn}
        isActive={isStreaming}
        showMeasurement={showMeasurement}
        fingerprintCenter={fingerprintCenter}
      />
      
      {/* 8-way entanglement */}
      <EntanglementOctagon />
      
      <OrbitControls enableZoom={true} autoRotate={!isStreaming} autoRotateSpeed={0.5} />
    </>
  )
}

// Transaction data generator
function generateTransaction(index: number, isFraud: boolean): Transaction {
  if (isFraud) {
    // Fraud transactions - far from fingerprint cluster
    const fraudPatterns = [
      { merchant: "Electronics Store", amount: 847, time: "3:42 AM", pos: [-0.6, -0.7, 0.4] as [number, number, number] },
      { merchant: "Gift Cards", amount: 500, time: "3:58 AM", pos: [-0.5, -0.8, -0.3] as [number, number, number] },
      { merchant: "Wire Transfer", amount: 2500, time: "4:15 AM", pos: [-0.7, -0.6, -0.2] as [number, number, number] },
    ]
    const pattern = fraudPatterns[index % fraudPatterns.length]
    return {
      id: index,
      position: pattern.pos,
      type: "fraud",
      kernelValue: 0.05 + Math.random() * 0.1,
      amount: pattern.amount,
      merchant: pattern.merchant,
      time: pattern.time,
      velocity: 12 + Math.random() * 5
    }
  } else {
    // Legitimate transactions - cluster near fingerprint
    const legitPatterns = [
      { merchant: "Coffee Shop", amount: 5.50, time: "8:15 AM" },
      { merchant: "Grocery Store", amount: 67.32, time: "6:30 PM" },
      { merchant: "Gas Station", amount: 45.00, time: "7:45 AM" },
      { merchant: "Restaurant", amount: 34.50, time: "12:30 PM" },
      { merchant: "Online Shopping", amount: 29.99, time: "9:00 PM" },
    ]
    const pattern = legitPatterns[index % legitPatterns.length]
    const basePos: [number, number, number] = [0.3, 0.5, 0.2]
    const offset = 0.15
    return {
      id: index,
      position: [
        basePos[0] + (Math.random() - 0.5) * offset,
        basePos[1] + (Math.random() - 0.5) * offset,
        basePos[2] + (Math.random() - 0.5) * offset
      ] as [number, number, number],
      type: "legitimate",
      kernelValue: 0.88 + Math.random() * 0.1,
      amount: pattern.amount + (Math.random() - 0.5) * 10,
      merchant: pattern.merchant,
      time: pattern.time,
      velocity: 1 + Math.random() * 2
    }
  }
}

export function FinanceBloch() {
  const [isMounted, setIsMounted] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [simulateFraud, setSimulateFraud] = useState(false)
  const [historicalTxns, setHistoricalTxns] = useState<Transaction[]>([])
  const [currentTxn, setCurrentTxn] = useState<Transaction | null>(null)
  const [txnIndex, setTxnIndex] = useState(0)
  const [stats, setStats] = useState({ total: 0, legitimate: 0, fraud: 0, blocked: 0 })
  const streamRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
    // Initialize with some historical legitimate transactions
    const initial = Array.from({ length: 8 }, (_, i) => generateTransaction(i, false))
    setHistoricalTxns(initial)
    setStats({ total: 8, legitimate: 8, fraud: 0, blocked: 0 })
    return () => {
      if (streamRef.current) clearInterval(streamRef.current)
    }
  }, [])

  useEffect(() => {
    if (isStreaming) {
      streamRef.current = setInterval(() => {
        const isFraudTxn = simulateFraud && Math.random() < 0.4
        const newTxn = generateTransaction(txnIndex, isFraudTxn)
        setCurrentTxn(newTxn)
        setTxnIndex(prev => prev + 1)
        
        // After animation, add to history
        setTimeout(() => {
          setHistoricalTxns(prev => [...prev.slice(-15), newTxn])
          setStats(prev => ({
            total: prev.total + 1,
            legitimate: prev.legitimate + (isFraudTxn ? 0 : 1),
            fraud: prev.fraud + (isFraudTxn ? 1 : 0),
            blocked: prev.blocked + (isFraudTxn ? 1 : 0)
          }))
        }, 1500)
      }, 2500)
    } else {
      if (streamRef.current) clearInterval(streamRef.current)
    }
    
    return () => {
      if (streamRef.current) clearInterval(streamRef.current)
    }
  }, [isStreaming, simulateFraud, txnIndex])

  const handleToggleStream = () => {
    setIsStreaming(!isStreaming)
  }

  const handleToggleFraud = () => {
    setSimulateFraud(!simulateFraud)
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-bold text-foreground mb-2">Real-Time Transaction Scoring</h3>
        <p className="text-sm text-muted-foreground">
          Watch transactions flow in and get scored against Sarah's behavioral fingerprint. Quantum kernel measures distance in 8-dimensional entangled space.
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
              <FinanceScene 
                historicalTxns={historicalTxns}
                currentTxn={currentTxn}
                isStreaming={isStreaming}
                showMeasurement={true}
              />
            </Canvas>
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Initializing...</div>
          </div>
        )}

        {/* Live stats */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-xs font-semibold">{isStreaming ? "LIVE" : "PAUSED"}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-mono text-right">{stats.total}</span>
            <span className="text-muted-foreground">Approved:</span>
            <span className="font-mono text-right text-primary">{stats.legitimate}</span>
            <span className="text-muted-foreground">Blocked:</span>
            <span className="font-mono text-right text-destructive">{stats.blocked}</span>
          </div>
        </div>

        {/* Current transaction */}
        {currentTxn && isStreaming && (
          <div className={`absolute top-4 right-4 backdrop-blur rounded-lg p-3 shadow-lg border ${
            currentTxn.type === "fraud" ? "bg-destructive/10 border-destructive/30" : "bg-white/90"
          }`}>
            <div className="text-xs font-semibold mb-1">
              {currentTxn.type === "fraud" ? "FRAUD DETECTED" : "Processing..."}
            </div>
            <div className="text-lg font-bold">${currentTxn.amount.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">{currentTxn.merchant}</div>
            {currentTxn.type === "fraud" && (
              <div className="text-xs text-destructive font-semibold mt-1">Blocked in 47ms</div>
            )}
          </div>
        )}

        {/* Kernel scale */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg border">
          <div className="text-[10px] text-muted-foreground mb-1">Kernel Distance</div>
          <div className="flex items-center gap-1">
            <div className="w-16 h-2 rounded-full bg-gradient-to-r from-primary via-amber-500 to-destructive" />
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground mt-0.5">
            <span>K=1.0</span>
            <span>K=0.0</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={isStreaming ? "secondary" : "default"}
            onClick={handleToggleStream}
            className="gap-2"
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isStreaming ? "Pause Stream" : "Start Stream"}
          </Button>
          
          <Button 
            size="sm" 
            variant={simulateFraud ? "destructive" : "outline"}
            onClick={handleToggleFraud}
            className="gap-2 bg-transparent"
            disabled={!isStreaming}
          >
            <ShieldAlert className="w-4 h-4" />
            {simulateFraud ? "Fraud Active" : "Inject Fraud"}
          </Button>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Legitimate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <span>Fraud</span>
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
