"use client"

import { useState, useCallback } from "react"
import { 
  QUANTUM_BACKEND_CONFIG, 
  getGradioUrl, 
  getApiUrl, 
  isBackendConfigured,
  type Domain 
} from "@/lib/quantum-config"

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface UseQuantumApiOptions {
  domain: Domain
}

export function useQuantumApi({ domain }: UseQuantumApiOptions) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callApi = useCallback(async (endpoint: string, data?: Record<string, unknown>): Promise<ApiResponse<unknown>> => {
    // Check if backend is configured
    if (!isBackendConfigured(domain)) {
      return {
        success: false,
        error: `${domain} backend URL not configured. Please update /lib/quantum-config.ts`,
      }
    }

    setLoading(true)
    setError(null)

    const url = getApiUrl(domain, endpoint)
    let retries = 0

    while (retries < QUANTUM_BACKEND_CONFIG.MAX_RETRIES) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(
          () => controller.abort(),
          QUANTUM_BACKEND_CONFIG.TIMEOUT
        )

        const response = await fetch(url, {
          method: data ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        setLoading(false)
        return { success: true, data: result }

      } catch (err) {
        retries++
        if (retries >= QUANTUM_BACKEND_CONFIG.MAX_RETRIES) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error"
          setError(errorMessage)
          setLoading(false)
          return { success: false, error: errorMessage }
        }
        await new Promise(resolve => 
          setTimeout(resolve, QUANTUM_BACKEND_CONFIG.RETRY_DELAY * retries)
        )
      }
    }

    setLoading(false)
    return { success: false, error: "Max retries exceeded" }
  }, [domain])

  const getBackendUrl = useCallback(() => {
    return getGradioUrl(domain)
  }, [domain])

  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (!isBackendConfigured(domain)) return false
    
    try {
      await fetch(getGradioUrl(domain), { 
        method: "HEAD",
        mode: "no-cors"
      })
      return true
    } catch {
      return false
    }
  }, [domain])

  return {
    callApi,
    loading,
    error,
    isConfigured: isBackendConfigured(domain),
    backendUrl: getBackendUrl(),
    checkConnection,
  }
}

// Healthcare API hook
export function useHealthcareApi() {
  const api = useQuantumApi({ domain: "healthcare" })
  
  return {
    ...api,
    predictSepsis: (patientData: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.HEALTHCARE.PREDICT, patientData),
    analyzeSepsis: (vitalSigns: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.HEALTHCARE.ANALYZE_SEPSIS, vitalSigns),
    getPatientState: (patientId: string) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.HEALTHCARE.PATIENT_STATE, { patientId }),
    getVitalSigns: (patientId: string) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.HEALTHCARE.VITAL_SIGNS, { patientId }),
  }
}

// Finance API hook
export function useFinanceApi() {
  const api = useQuantumApi({ domain: "finance" })
  
  return {
    ...api,
    predictFraud: (transactionData: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.FINANCE.PREDICT, transactionData),
    checkFraud: (transaction: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.FINANCE.FRAUD_CHECK, transaction),
    computeKernel: (data: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.FINANCE.KERNEL_COMPUTE, data),
    scoreTransaction: (transaction: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.FINANCE.TRANSACTION_SCORE, transaction),
  }
}

// Cybersecurity API hook
export function useCybersecurityApi() {
  const api = useQuantumApi({ domain: "cybersecurity" })
  
  return {
    ...api,
    predictThreat: (trafficData: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.CYBERSECURITY.PREDICT, trafficData),
    detectAnomaly: (packet: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.CYBERSECURITY.ANOMALY_DETECT, packet),
    analyzeTraffic: (trafficData: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.CYBERSECURITY.TRAFFIC_ANALYZE, trafficData),
    getThreatScore: (data: Record<string, unknown>) => 
      api.callApi(QUANTUM_BACKEND_CONFIG.ENDPOINTS.CYBERSECURITY.THREAT_SCORE, data),
  }
}
