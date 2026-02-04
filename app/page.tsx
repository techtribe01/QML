import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { DomainsSection } from "@/components/home/domains-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { ComparisonSection } from "@/components/home/comparison-section"
import { VisualizerPreview } from "@/components/home/visualizer-preview"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Three Domains Overview */}
      <DomainsSection />
      
      {/* How It Works Pipeline */}
      <HowItWorksSection />
      
      {/* Classical vs Quantum Comparison */}
      <ComparisonSection />
      
      {/* Qubit Visualizer Preview */}
      <VisualizerPreview />
      
      {/* Final CTA */}
      <CTASection />
      
      <Footer />
    </main>
  )
}
