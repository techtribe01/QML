"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import type * as THREE from "three"

type Domain = "healthcare" | "finance" | "cybersecurity"

interface DomainState {
  position: [number, number, number]
  color: string
  label: string
  zone: "safe" | "warning" | "danger"
}

// Domain-specific configurations
const domainConfigs = {
  healthcare: {
    title: "Patient Health State Space",
    healthyZone: { label: "Healthy Patients", color: "#00C9A7", z: 0.8 },
    warningZone: { label: "Early Sepsis", color: "#FFA500", z: 0.3 },
    dangerZone: { label: "Critical Sepsis", color: "#EF4444", z: -0.8 },
    entanglementLabel: "Vital Signs Linked: HR ↔ BP",
    description: "6 hours earlier detection"
  },
  finance: {
    title: "Fraud Detection Feature Space",
    healthyZone: { label: "Legitimate Cluster", color: "#1640FF", z: 0.7 },
    warningZone: { label: "Suspicious", color: "#FFA500", z: 0.0 },
    dangerZone: { label: "Fraud Outliers", color: "#EF4444", z: -0.8 },
    entanglementLabel: "Features Linked: Amount ↔ Location ↔ Time",
    description: "94% detection accuracy"
  },
  cybersecurity: {
    title: "Network Traffic Pattern Space",
    healthyZone: { label: "Normal Orbit", color: "#00C9A7", z: 0.7 },
    warningZone: { label: "Anomaly", color: "#FFA500", z: 0.0 },
    dangerZone: { label: "Attack Detected", color: "#EF4444", z: -0.8 },
    entanglementLabel: "Packets Linked: IP ↔ Port ↔ Size ↔ Time",
    description: "Real-time threat detection"
  }
}

function BlochSphereContent({ domain }: { domain: Domain }) {
  const config = domainConfigs[domain]
  
  return (
    <>
      {/* Wireframe Bloch Sphere */}
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial wireframe transparent opacity={0.15} color="#CCCCCC" />
      </Sphere>

      {/* Axis lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([-1.3, 0, 0, 1.3, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#999999" transparent opacity={0.3} />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -1.3, 0, 0, 1.3, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#999999" transparent opacity={0.3} />
      </line>

      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, -1.3, 0, 0, 1.3])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#999999" transparent opacity={0.3} />
      </line>

      {/* Safe Zone - Top (Green) */}
      <Sphere args={[0.35, 20, 20]} position={[0, 0.9, 0]}>
        <meshBasicMaterial color={config.healthyZone.color} transparent opacity={0.1} />
      </Sphere>

      {/* Danger Zone - Bottom (Red) */}
      <Sphere args={[0.35, 20, 20]} position={[0, -0.9, 0]}>
        <meshBasicMaterial color={config.dangerZone.color} transparent opacity={0.1} />
      </Sphere>

      {/* Safe Zone States (Green dots clustered at top) */}
      {[
        [0.2, 0.85, 0.1],
        [0.15, 0.88, 0.15],
        [-0.1, 0.9, 0.05],
        [-0.2, 0.87, 0.12],
      ].map((pos, i) => (
        <Sphere key={`safe-${i}`} args={[0.05, 16, 16]} position={pos as [number, number, number]}>
          <meshBasicMaterial color={config.healthyZone.color} />
        </Sphere>
      ))}

      {/* Danger Zone States (Red dots clustered at bottom) */}
      {[
        [0.25, -0.82, -0.15],
        [0.1, -0.88, -0.1],
        [-0.15, -0.85, -0.2],
      ].map((pos, i) => (
        <Sphere key={`danger-${i}`} args={[0.06, 16, 16]} position={pos as [number, number, number]}>
          <meshBasicMaterial color={config.dangerZone.color} />
        </Sphere>
      ))}

      {/* Transition State (Orange dot - between zones) */}
      <Sphere args={[0.055, 16, 16]} position={[0.3, 0.2, 0.1]}>
        <meshBasicMaterial color={config.warningZone.color} />
      </Sphere>

      {/* Entanglement connections (purple dashed lines) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0.2, 0.85, 0.1, 0.15, 0.88, 0.15])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#7B61FF" transparent opacity={0.6} linewidth={3} />
      </line>

      {/* Time evolution arrow (showing state rotation) */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0.2, 0.85, 0.1, 0.35, -0.75, -0.15])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#EF4444" transparent opacity={0.5} />
      </line>
    </>
  )
}

export function DomainSpecificBloch({ domain = "healthcare" }: { domain?: Domain }) {
  const [isMounted, setIsMounted] = useState(false)
  const config = domainConfigs[domain]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 rounded-2xl overflow-hidden">
        {/* Title and Description */}
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">{config.title}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            {config.description}
          </p>
        </div>

        {/* 3D Canvas */}
        <div className="aspect-video relative">
          {isMounted ? (
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Loading visualization...</div>
              </div>
            }>
              <Canvas
                camera={{ position: [2, 2, 2.5], fov: 50 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                dpr={[1, 2]}
              >
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={0.6} />
                <BlochSphereContent domain={domain} />
                <OrbitControls 
                  enableZoom={true} 
                  autoRotate
                  autoRotateSpeed={2}
                />
              </Canvas>
            </Suspense>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-muted-foreground text-sm">Initializing...</div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-6 bg-white/50 border-t border-border grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ background: config.healthyZone.color }} />
            <span className="text-sm text-foreground">{config.healthyZone.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ background: config.warningZone.color }} />
            <span className="text-sm text-foreground">{config.warningZone.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full" style={{ background: config.dangerZone.color }} />
            <span className="text-sm text-foreground">{config.dangerZone.label}</span>
          </div>
        </div>

        {/* Entanglement Info */}
        <div className="p-6 bg-gradient-to-r from-cyber/5 to-primary/5 border-t border-border">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-cyber flex-shrink-0 mt-1.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">{config.entanglementLabel}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Quantum entanglement captures correlations between features that classical systems treat independently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
