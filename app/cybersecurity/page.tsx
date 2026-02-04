"use client"

import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { DomainHero } from "@/components/domains/domain-hero"
import { UseCases } from "@/components/domains/use-cases"
import { PipelineDiagram } from "@/components/domains/pipeline-diagram"
import { BenchmarkTable } from "@/components/domains/benchmark-table"
import { DomainCTA } from "@/components/domains/domain-cta"

const cybersecurityData = {
  domain: "cybersecurity" as const,
  title: "Cybersecurity Threat Detection",
  subtitle: "Quantum-Powered Network Defense",
  description: "Detect network intrusions, identify threat patterns, and analyze security events in real-time with quantum machine learning.",
  stats: [
    { label: "Precision Rate", value: "93.5%" },
    { label: "FP Reduction", value: "21%" },
    { label: "Events/Second", value: "15,000+" },
    { label: "Avg Latency", value: "1.5s" },
  ],
  useCases: [
    {
      title: "Network Intrusion Detection",
      description: "Real-time monitoring of network traffic to identify malicious activities, zero-day attacks, and lateral movement attempts.",
      iconName: "network" as const,
    },
    {
      title: "Malware Pattern Recognition",
      description: "Quantum-enhanced analysis of file behavior patterns to detect known and unknown malware variants with high accuracy.",
      iconName: "bug" as const,
    },
    {
      title: "Threat Intelligence Correlation",
      description: "Correlate security events across multiple sources using quantum superposition for comprehensive threat analysis.",
      iconName: "radar" as const,
    },
  ],
  benchmarks: [
    { metric: "Precision", classical: "83.7%", quantum: "93.5%", improvement: "+11.7%" },
    { metric: "Recall", classical: "78.9%", quantum: "92.1%", improvement: "+16.7%" },
    { metric: "F1 Score", classical: "81.2%", quantum: "92.8%", improvement: "+14.3%" },
    { metric: "False Positive Rate", classical: "19.8%", quantum: "6.5%", improvement: "-67.2%" },
    { metric: "AUC-ROC", classical: "0.88", quantum: "0.96", improvement: "+9.1%" },
  ],
}

export default function CybersecurityPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <DomainHero {...cybersecurityData} />
      <UseCases useCases={cybersecurityData.useCases} domain="cybersecurity" />
      <PipelineDiagram domain="cybersecurity" />
      <BenchmarkTable benchmarks={cybersecurityData.benchmarks} domain="cybersecurity" />
      <DomainCTA domain="cybersecurity" />
      <Footer />
    </main>
  )
}
