"use client"

import { useRef, useState, useEffect, Suspense, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Html } from "@react-three/drei"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { CreditCard, ShieldAlert, ShieldCheck } from "lucide-react"

interface Transaction {
  id: number
  position: [number, number, number]
  type: "legitimate" | "suspicious" | "fraud"
  kernelValue: number
  label: string
}

// Generate clustered legitimate transactions
function generateLegitimateCluster(): Transaction[] {
  const transactions: Transaction[] = []
  for (let i = 0; i < 12; i++) {
    const theta = (Math.random() * 0.4 + 0.1) * Math.PI // Top portion
    const phi = Math.random() * Math.PI * 2
    const r = 0.75 + Math.random() * 0.15
    transactions.push({
      id: i,
      position: [
        r * Math.sin(theta) * Math.cos(phi),
        r * Math.cos(theta),
        r * Math.sin(theta) * Math.sin(phi)
      ],
      type: "legitimate",
      kernelValue: 0.85 + Math.random() * 0.12,
      label: `TXN-${1000 + i}`
    })
  }
  return transactions
}

// Single transaction point
function TransactionPoint({ 
  transaction, 
  isHighlighted,
  onClick 
}: { 
  transaction: Transaction
  isHighlighted: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  const color = transaction.type === "legitimate" ? "#1640FF" : 
                transaction.type === "suspicious" ? "#FFA500" : "#EF4444"
  
  useFrame((state) => {
    if (glowRef.current && isHighlighted) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3
      glowRef.current.scale.setScalar(scale)
    }
  })

  const size = transaction.type === "fraud" ? 0.08 : 0.05

  return (
    <group position={transaction.position} onClick={onClick}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isHighlighted ? 0.8 : 0.3} />
      </mesh>
      {isHighlighted && (
        <>
          <mesh ref={glowRef}>
            <sphereGeometry args={[size * 2, 12, 12]} />
            <meshBasicMaterial color={color} transparent opacity={0.2} />
          </mesh>
          <Html distanceFactor={8} position={[0.15, 0.1, 0]}>
            <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-lg text-xs shadow-lg border min-w-[120px]">
              <div className="font-semibold text-foreground">{transaction.label}</div>
              <div className="text-muted-foreground mt-1">
                K = {transaction.kernelValue.toFixed(2)}
              </div>
              <div className={`mt-1 font-medium ${
                transaction.type === "legitimate" ? "text-primary" :
                transaction.type === "suspicious" ? "text-amber-600" : "text-destructive"
              }`}>
                {transaction.type === "legitimate" ? "Approved" :
                 transaction.type === "suspicious" ? "Review" : "Blocked"}
              </div>
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

// Fraud transaction that animates in
function FraudTransaction({ 
  visible, 
  isHighlighted,
  onClick 
}: { 
  visible: boolean
  isHighlighted: boolean
  onClick: () => void
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [animProgress, setAnimProgress] = useState(0)
  
  useEffect(() => {
    if (visible) {
      const interval = setInterval(() => {
        setAnimProgress(prev => Math.min(prev + 0.02, 1))
      }, 20)
      return () => clearInterval(interval)
    } else {
      setAnimProgress(0)
    }
  }, [visible])
  
  // Fraud position - far from cluster (outlier)
  const targetPos: [number, number, number] = [-0.6, -0.7, 0.5]
  const startPos: [number, number, number] = [0.2, 0.6, 0.1]
  
  const currentPos: [number, number, number] = [
    startPos[0] + (targetPos[0] - startPos[0]) * animProgress,
    startPos[1] + (targetPos[1] - startPos[1]) * animProgress,
    startPos[2] + (targetPos[2] - startPos[2]) * animProgress,
  ]
  
  useFrame((state) => {
    if (groupRef.current && visible) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 2
    }
  })

  if (!visible) return null

  return (
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
            <div className="font-semibold text-destructive">FRAUD DETECTED</div>
            <div className="text-muted-foreground mt-1">K = 0.08</div>
            <div className="text-destructive font-medium mt-1">Blocked in 47ms</div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Kernel distance line
function KernelDistanceLine({ from, to, visible }: { from: [number, number, number]; to: [number, number, number]; visible: boolean }) {
  if (!visible) return null
  
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)]
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
  
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#EF4444" transparent opacity={0.5} linewidth={2} />
    </line>
  )
}

function FinanceScene({ 
  transactions, 
  showFraud, 
  selectedId, 
  onSelect 
}: { 
  transactions: Transaction[]
  showFraud: boolean
  selectedId: number | null
  onSelect: (id: number | null) => void
}) {
  // Calculate cluster center
  const clusterCenter = useMemo(() => {
    const sum = transactions.reduce((acc, t) => ({
      x: acc.x + t.position[0],
      y: acc.y + t.position[1],
      z: acc.z + t.position[2]
    }), { x: 0, y: 0, z: 0 })
    const n = transactions.length
    return [sum.x / n, sum.y / n, sum.z / n] as [number, number, number]
  }, [transactions])

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
            array={new Float32Array([-1.2, 0, 0, 1.2, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#CCCCCC" transparent opacity={0.3} />
      </line>
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
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -1.2, 0, 0, 1.2])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#CCCCCC" transparent opacity={0.3} />
      </line>

      {/* Legitimate cluster boundary indicator */}
      <mesh position={clusterCenter}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial color="#1640FF" transparent opacity={0.05} />
      </mesh>
      
      {/* Transactions */}
      {transactions.map((tx) => (
        <TransactionPoint 
          key={tx.id} 
          transaction={tx} 
          isHighlighted={selectedId === tx.id}
          onClick={() => onSelect(selectedId === tx.id ? null : tx.id)}
        />
      ))}
      
      {/* Fraud transaction */}
      <FraudTransaction 
        visible={showFraud} 
        isHighlighted={selectedId === -1}
        onClick={() => onSelect(selectedId === -1 ? null : -1)}
      />
      
      {/* Distance line from fraud to cluster */}
      <KernelDistanceLine 
        from={[-0.6, -0.7, 0.5]} 
        to={clusterCenter} 
        visible={showFraud && selectedId === -1}
      />
      
      <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

export function FinanceBloch() {
  const [isMounted, setIsMounted] = useState(false)
  const [showFraud, setShowFraud] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [transactions] = useState<Transaction[]>(() => generateLegitimateCluster())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="w-full bg-white rounded-2xl border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-bold text-foreground mb-2">Transaction Feature Space</h3>
        <p className="text-sm text-muted-foreground">
          Legitimate transactions cluster tightly (K {'>'} 0.85). Fraud appears as outliers far from the cluster (K {'<'} 0.3).
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
                transactions={transactions} 
                showFraud={showFraud}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            </Canvas>
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Initializing...</div>
          </div>
        )}

        {/* Kernel Value Legend */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border">
          <div className="text-xs font-semibold text-foreground mb-2">Quantum Kernel (K)</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span>K {'>'} 0.85 = Legitimate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span>0.3-0.85 = Suspicious</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>K {'<'} 0.3 = Fraud</span>
            </div>
          </div>
        </div>

        {/* Transaction count */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg border text-center">
          <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
          <div className="text-xs text-muted-foreground">Legitimate TXNs</div>
          {showFraud && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="text-lg font-bold text-destructive">1</div>
              <div className="text-xs text-destructive">Fraud Blocked</div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant={showFraud ? "destructive" : "default"}
            onClick={() => {
              setShowFraud(!showFraud)
              if (!showFraud) setSelectedId(-1)
              else setSelectedId(null)
            }}
            className="gap-2"
          >
            {showFraud ? <ShieldAlert className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
            {showFraud ? "Fraud Detected!" : "Simulate Fraud"}
          </Button>
          {showFraud && (
            <div className="flex items-center gap-2 text-sm text-destructive font-medium animate-pulse">
              <ShieldCheck className="w-4 h-4" />
              Blocked in 47ms
            </div>
          )}
        </div>
        
        <div className="text-xs text-muted-foreground">
          Click any point to inspect
        </div>
      </div>
    </div>
  )
}
