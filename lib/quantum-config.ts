// Quantum Backend Configuration
// Update this URL each time you restart your Gradio quantum backend
// The Gradio public URL changes on each run

export const QUANTUM_BACKEND_CONFIG = {
  // Replace this URL with your current Gradio public URL
  // Example: "https://abc123def456.gradio.live"
  GRADIO_URL: "https://your-gradio-url.gradio.live",
  
  // API endpoints (append to GRADIO_URL)
  ENDPOINTS: {
    // Healthcare endpoints
    HEALTHCARE_PREDICT: "/api/predict/healthcare",
    HEALTHCARE_ANALYZE: "/api/analyze/sepsis",
    
    // Finance endpoints
    FINANCE_PREDICT: "/api/predict/finance",
    FINANCE_FRAUD_CHECK: "/api/analyze/fraud",
    FINANCE_KERNEL: "/api/kernel/compute",
    
    // Cybersecurity endpoints
    CYBER_PREDICT: "/api/predict/cyber",
    CYBER_ANOMALY: "/api/analyze/anomaly",
    
    // General quantum endpoints
    QUANTUM_STATE: "/api/quantum/state",
    BLOCH_SPHERE: "/api/quantum/bloch",
    ENTANGLEMENT: "/api/quantum/entangle",
  },
  
  // Timeout settings (ms)
  TIMEOUT: 30000,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
}

// Helper function to get full API URL
export function getApiUrl(endpoint: keyof typeof QUANTUM_BACKEND_CONFIG.ENDPOINTS): string {
  return `${QUANTUM_BACKEND_CONFIG.GRADIO_URL}${QUANTUM_BACKEND_CONFIG.ENDPOINTS[endpoint]}`
}

// Helper function to check if backend is configured
export function isBackendConfigured(): boolean {
  return !QUANTUM_BACKEND_CONFIG.GRADIO_URL.includes("your-gradio-url")
}

// Helper to update URL (for reference - actual update is manual)
export const UPDATE_INSTRUCTIONS = `
To update the Gradio URL:
1. Start your quantum backend (python app.py or gradio app.py)
2. Copy the public URL from the terminal (e.g., https://abc123.gradio.live)
3. Open /lib/quantum-config.ts
4. Replace the GRADIO_URL value with your new URL
5. Save the file - the app will use the new URL
`
