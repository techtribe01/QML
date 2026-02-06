// Quantum Backend Configuration
// Update these URLs each time you restart your Gradio quantum backends
// Each domain has its own Gradio instance with a unique URL

export const QUANTUM_BACKEND_CONFIG = {
  // ===========================================
  // UPDATE THESE URLs WHEN YOU RESTART GRADIO
  // ===========================================
  
  // Healthcare Gradio Backend URL
  HEALTHCARE_GRADIO_URL: "https://80e3e3d1aa216b300b.gradio.live",
  
  // Finance Gradio Backend URL
  FINANCE_GRADIO_URL: "https://542445116e84765c3f.gradio.live/",
  
  // Cybersecurity Gradio Backend URL
  CYBERSECURITY_GRADIO_URL: "https://40a12aa79675eee111.gradio.live/",
  
  // ===========================================
  // API ENDPOINTS (append to domain URL)
  // ===========================================
  ENDPOINTS: {
    // Healthcare endpoints
    HEALTHCARE: {
      PREDICT: "/api/predict",
      ANALYZE_SEPSIS: "/api/analyze/sepsis",
      PATIENT_STATE: "/api/patient/state",
      VITAL_SIGNS: "/api/vitals",
    },
    
    // Finance endpoints
    FINANCE: {
      PREDICT: "/api/predict",
      FRAUD_CHECK: "/api/fraud/check",
      KERNEL_COMPUTE: "/api/kernel/compute",
      TRANSACTION_SCORE: "/api/transaction/score",
    },
    
    // Cybersecurity endpoints
    CYBERSECURITY: {
      PREDICT: "/api/predict",
      ANOMALY_DETECT: "/api/anomaly/detect",
      TRAFFIC_ANALYZE: "/api/traffic/analyze",
      THREAT_SCORE: "/api/threat/score",
    },
  },
  
  // Timeout settings (ms)
  TIMEOUT: 30000,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
}

// Domain type
export type Domain = "healthcare" | "finance" | "cybersecurity"

// Get the base URL for a specific domain
export function getGradioUrl(domain: Domain): string {
  switch (domain) {
    case "healthcare":
      return QUANTUM_BACKEND_CONFIG.HEALTHCARE_GRADIO_URL
    case "finance":
      return QUANTUM_BACKEND_CONFIG.FINANCE_GRADIO_URL
    case "cybersecurity":
      return QUANTUM_BACKEND_CONFIG.CYBERSECURITY_GRADIO_URL
  }
}

// Get full API URL for a domain endpoint
export function getApiUrl(domain: Domain, endpoint: string): string {
  const baseUrl = getGradioUrl(domain)
  return `${baseUrl}${endpoint}`
}

// Check if a specific domain backend is configured
export function isBackendConfigured(domain: Domain): boolean {
  const url = getGradioUrl(domain)
  return !url.includes("your-") && url.includes("gradio.live")
}

// Check if all backends are configured
export function areAllBackendsConfigured(): boolean {
  return (
    isBackendConfigured("healthcare") &&
    isBackendConfigured("finance") &&
    isBackendConfigured("cybersecurity")
  )
}

// Helper to get all URLs (for status display)
export function getAllUrls() {
  return {
    healthcare: QUANTUM_BACKEND_CONFIG.HEALTHCARE_GRADIO_URL,
    finance: QUANTUM_BACKEND_CONFIG.FINANCE_GRADIO_URL,
    cybersecurity: QUANTUM_BACKEND_CONFIG.CYBERSECURITY_GRADIO_URL,
  }
}

// Update instructions
export const UPDATE_INSTRUCTIONS = `
To update the Gradio URLs:

1. Start your Healthcare quantum backend
   - Copy the public URL (e.g., https://abc123.gradio.live)
   - Paste it as HEALTHCARE_GRADIO_URL

2. Start your Finance quantum backend
   - Copy the public URL (e.g., https://def456.gradio.live)
   - Paste it as FINANCE_GRADIO_URL

3. Start your Cybersecurity quantum backend
   - Copy the public URL (e.g., https://ghi789.gradio.live)
   - Paste it as CYBERSECURITY_GRADIO_URL

4. Save this file - the app will automatically use the new URLs
`
