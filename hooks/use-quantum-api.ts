"use client"

import { useState, useCallback } from "react"
import { 
  QUANTUM_BACKEND_CONFIG, 
  getApiUrl, 
  isBackendConfigured 
} from "@/lib/quantum-config"

interface QuantumApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface UseQuantumApiReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  isConfigured: boolean
  callApi: (endpoint: keyof typeof QUANTUM_BACKEND_CONFIG.ENDPOINTS, body?: unknown) => Promise<T | null>
}

export function useQuantumApi<T = unknown>(): UseQuantumApiReturn<T> {
  const [state, setState] = useState<QuantumApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const callApi = useCallback(async (
    endpoint: keyof typeof QUANTUM_BACKEND_CONFIG.ENDPOINTS,
    body?: unknown
  ): Promise<T | null> => {
    if (!isBackendConfigured()) {
      setState(prev => ({ 
        ...prev, 
        error: "Quantum backend URL not configured. Update /lib/quantum-config.ts with your Gradio URL." 
      }))
      return null
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    const url = getApiUrl(endpoint)
    let retries = 0

    while (retries < QUANTUM_BACKEND_CONFIG.MAX_RETRIES) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(
          () => controller.abort(), 
          QUANTUM_BACKEND_CONFIG.TIMEOUT
        )

        const response = await fetch(url, {
          method: body ? "POST" : "GET",
          headers: {
            "Content-Type": "application/json",
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json() as T
        setState({ data, loading: false, error: null })
        return data

      } catch (err) {
        retries++
        
        if (retries >= QUANTUM_BACKEND_CONFIG.MAX_RETRIES) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error"
          setState({ 
            data: null, 
            loading: false, 
            error: `Failed to connect to quantum backend: ${errorMessage}` 
          })
          return null
        }

        // Wait before retry
        await new Promise(resolve => 
          setTimeout(resolve, QUANTUM_BACKEND_CONFIG.RETRY_DELAY * retries)
        )
      }
    }

    return null
  }, [])

  return {
    ...state,
    isConfigured: isBackendConfigured(),
    callApi,
  }
}

// Specific hooks for each domain
export function useHealthcareApi() {
  return useQuantumApi<{
    prediction: string
    confidence: number
    risk_score: number
    quantum_state: { theta: number; phi: number }
  }>()
}

export function useFinanceApi() {
  return useQuantumApi<{
    is_fraud: boolean
    kernel_value: number
    confidence: number
    blocked: boolean
    detection_time_ms: number
  }>()
}

export function useCybersecurityApi() {
  return useQuantumApi<{
    is_attack: boolean
    attack_type: string | null
    anomaly_score: number
    confidence: number
    detection_time_ms: number
  }>()
}
