"use client"

import { useRef, useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Atom, Sparkles, Zap, GitBranch } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, Line } from "@react-three/drei"
import type * as THREE from "three"

function CanvasLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-3 border-cyber/30 border-t-cyber rounded-full animate-spin mx-auto mb-3" />
        <p className="text-muted-foreground text-xs">Loading...</p>
      </div>
    </div>
  )
}

// Simple rotating Bloch sphere - v2
function BlochSphere({ 
  position, 
  color,
  stateColor
}: { 
  position: [number, number, number]
  color: string
  stateColor: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const innerRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
    if (innerRef.current) {
      innerRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Wireframe sphere */}
        <Sphere args={[0.8, 16, 16]}>
          <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
        </Sphere>
        
        {/* Axes */}
        <Line 
          points={[[0, -1, 0], [0, 1, 0]]} 
          color="#1640FF" 
          lineWidth={1.5}
        />
        <Line 
          points={[[-1, 0, 0], [1, 0, 0]]} 
          color="#00C9A7" 
          lineWidth={1}
          transparent
          opacity={0.5}
        />
        
        {/* Animated state vector */}
        <group ref={innerRef}>
          <Line 
            points={[[0, 0, 0], [0.5, 0.6, 0.2]]} 
            color={stateColor} 
            lineWidth={2}
          />
          <Sphere args={[0.06, 12, 12]} position={[0.5, 0.6, 0.2]}>
            <meshBasicMaterial color={stateColor} />
          </Sphere>
          <Sphere args={[0.1, 12, 12]} position={[0.5, 0.6, 0.2]}>
            <meshBasicMaterial color={stateColor} transparent opacity={0.3} />
          </Sphere>
        </group>
      </group>
    </group>
  )
}

// Entanglement curve
function EntanglementArc() {
  return (
    <Line
      points={[
        [-1.5, 0.3, 0],
        [-0.75, 0.8, 0],
        [0, 1, 0],
        [0.75, 0.8, 0],
        [1.5, 0.3, 0]
      ]}
      color="#00C9A7"
      lineWidth={1.5}
      transparent
      opacity={0.6}
    />
  )
}

function PreviewScene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      
      <BlochSphere 
        position={[-1.5, 0, 0]} 
        color="#1640FF"
        stateColor="#1640FF"
      />
      <BlochSphere 
        position={[1.5, 0, 0]} 
        color="#7B61FF"
        stateColor="#7B61FF"
      />
      
      <EntanglementArc />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  )
}

export function VisualizerPreview() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
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

  const features = [
    { icon: Atom, text: "Interactive 3D Bloch sphere representations" },
    { icon: Zap, text: "Real-time quantum gate operations" },
    { icon: GitBranch, text: "Entanglement pair visualization" },
    { icon: Sparkles, text: "Probability amplitude display" },
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-background overflow-hidden relative">
      {/* Background accents */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyber/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div 
            className="transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-40px)'
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber/10 border border-cyber/20 mb-6">
              <Atom className="w-4 h-4 text-cyber" />
              <span className="text-sm font-medium text-cyber">Interactive 3D Experience</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              Qubit State{" "}
              <span className="gradient-text">Visualizer</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Explore the quantum mechanics behind QADIS with our interactive Bloch sphere visualizer. 
              Configure 2-8 qubits, apply quantum gates, and observe entanglement in real-time.
            </p>
            
            <ul className="space-y-4 mb-10">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <li 
                    key={feature.text} 
                    className="flex items-center gap-4 transition-all duration-500"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'translateX(0)' : 'translateX(-20px)',
                      transitionDelay: `${300 + index * 100}ms`
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber/10 to-primary/10 border border-cyber/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-cyber" />
                    </div>
                    <span className="text-foreground">{feature.text}</span>
                  </li>
                )
              })}
            </ul>
            
            <Button 
              size="lg" 
              className="bg-cyber hover:bg-cyber/90 text-white font-semibold rounded-full px-8 shadow-lg shadow-cyber/25 transition-all duration-300 hover:scale-105" 
              asChild
            >
              <Link href="/visualizer">
                Launch Visualizer
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          {/* 3D Preview */}
          <div 
            className="relative transition-all duration-700 delay-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(40px)'
            }}
          >
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-slate-50 via-white to-cyber/5 border border-border shadow-2xl shadow-cyber/10 overflow-hidden relative">
              {/* 3D Canvas */}
              {isMounted ? (
                <Suspense fallback={<CanvasLoader />}>
                  <Canvas
                    camera={{ position: [0, 2, 6], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    dpr={[1, 2]}
                    onCreated={({ gl }) => {
                      gl.setClearColor('#fafbfc')
                    }}
                  >
                    <PreviewScene />
                  </Canvas>
                </Suspense>
              ) : (
                <CanvasLoader />
              )}
              
              {/* Overlay label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-border/50 text-xs text-muted-foreground">
                  2 Entangled Qubits
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              </div>
            </div>
            
            {/* Floating stat cards */}
            <div 
              className="absolute -top-4 -right-4 px-4 py-3 rounded-xl bg-white border border-border shadow-lg transition-all duration-500"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0, 0)' : 'translate(20px, -20px)',
                transitionDelay: '600ms'
              }}
            >
              <div className="text-2xl font-bold text-primary">8</div>
              <div className="text-xs text-muted-foreground">Max Qubits</div>
            </div>
            
            <div 
              className="absolute -bottom-4 -left-4 px-4 py-3 rounded-xl bg-white border border-border shadow-lg transition-all duration-500"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translate(0, 0)' : 'translate(-20px, 20px)',
                transitionDelay: '700ms'
              }}
            >
              <div className="text-2xl font-bold text-healthcare">60fps</div>
              <div className="text-xs text-muted-foreground">Smooth Render</div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-cyber/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-primary/15 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
