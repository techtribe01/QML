"use client"

import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { DomainHero } from "@/components/domains/domain-hero"
import { UseCases } from "@/components/domains/use-cases"
import { PipelineDiagram } from "@/components/domains/pipeline-diagram"
import { BenchmarkTable } from "@/components/domains/benchmark-table"
import { DomainCTA } from "@/components/domains/domain-cta"

const financeData = {
  domain: "finance" as const,
  title: "Financial Fraud Detection",
  subtitle: "Quantum-Enhanced Security for Financial Institutions",
  description: "Leverage quantum machine learning to detect credit card fraud, identify transaction anomalies, and protect your financial operations with unprecedented precision.",
  stats: [
    { label: "Precision Rate", value: "94.2%" },
    { label: "FP Reduction", value: "22%" },
    { label: "Events/Second", value: "10,000+" },
    { label: "Avg Latency", value: "1.8s" },
  ],
  useCases: [
    {
      title: "Credit Card Fraud Detection",
      description: "Real-time transaction monitoring with quantum-enhanced pattern recognition to identify fraudulent activities before they complete.",
      iconName: "creditCard" as const,
    },
    {
      title: "Transaction Anomaly Detection",
      description: "Identify unusual transaction patterns, velocity attacks, and account takeover attempts using quantum superposition analysis.",
      iconName: "lineChart" as const,
    },
    {
      title: "Risk Scoring & Alerting",
      description: "Multi-dimensional risk scoring with confidence intervals and intelligent alert prioritization for investigation teams.",
      iconName: "alertTriangle" as const,
    },
  ],
  benchmarks: [
    { metric: "Precision", classical: "84.5%", quantum: "94.2%", improvement: "+11.5%" },
    { metric: "Recall", classical: "79.3%", quantum: "91.8%", improvement: "+15.7%" },
    { metric: "F1 Score", classical: "81.8%", quantum: "93.0%", improvement: "+13.7%" },
    { metric: "False Positive Rate", classical: "18.2%", quantum: "5.8%", improvement: "-68.1%" },
    { metric: "AUC-ROC", classical: "0.89", quantum: "0.97", improvement: "+9.0%" },
  ],
}

export default function FinancePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <DomainHero {...financeData} />
      <UseCases useCases={financeData.useCases} domain="finance" />
      <PipelineDiagram domain="finance" />
      <BenchmarkTable benchmarks={financeData.benchmarks} domain="finance" />
      <DomainCTA domain="finance" />
      <Footer />
    </main>
  )
}
