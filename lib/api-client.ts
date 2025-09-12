// Centralized API client for all backend calls
class ApiClient {
  private baseUrl: string

  constructor(baseUrl = "") {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "API request failed")
      }

      return result
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Traffic Management APIs
  async getIntersections(city?: string, status?: string) {
    const params = new URLSearchParams()
    if (city) params.append("city", city)
    if (status) params.append("status", status)

    return this.request(`/api/traffic/intersections?${params}`)
  }

  async createIntersection(data: any) {
    return this.request("/api/traffic/intersections", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateIntersection(id: string, data: any) {
    return this.request("/api/traffic/intersections", {
      method: "PUT",
      body: JSON.stringify({ id, ...data }),
    })
  }

  // Analytics APIs
  async getTrafficAnalytics(city?: string, timeRange?: string, metric?: string) {
    const params = new URLSearchParams()
    if (city) params.append("city", city)
    if (timeRange) params.append("timeRange", timeRange)
    if (metric) params.append("metric", metric)

    return this.request(`/api/traffic/analytics?${params}`)
  }

  // Real-time Data APIs
  async getRealtimeData(city?: string) {
    const params = new URLSearchParams()
    if (city) params.append("city", city)

    return this.request(`/api/traffic/realtime?${params}`)
  }

  async updateRealtimeData(data: any) {
    return this.request("/api/traffic/realtime", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Violations APIs
  async getViolations(
    filters: {
      type?: string
      status?: string
      vehicleNumber?: string
      limit?: number
      offset?: number
    } = {},
  ) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString())
    })

    return this.request(`/api/traffic/violations?${params}`)
  }

  async recordViolation(data: any) {
    return this.request("/api/traffic/violations", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Cities APIs
  async getCities(state?: string, trafficDensity?: string, id?: string) {
    const params = new URLSearchParams()
    if (state) params.append("state", state)
    if (trafficDensity) params.append("trafficDensity", trafficDensity)
    if (id) params.append("id", id)

    return this.request(`/api/cities?${params}`)
  }

  // ML Model APIs
  async runYOLODetection(imageData: string, confidenceThreshold = 0.5) {
    return this.request("/api/ml/yolo-detection", {
      method: "POST",
      body: JSON.stringify({
        imageData,
        confidence_threshold: confidenceThreshold,
      }),
    })
  }

  async runOpenCVAnalysis(imageData: string, analysisType = "traffic_flow") {
    return this.request("/api/ml/opencv-analysis", {
      method: "POST",
      body: JSON.stringify({
        imageData,
        analysis_type: analysisType,
      }),
    })
  }

  async runTensorFlowPrediction(modelType = "traffic_prediction", inputData: any, timeHorizon = 30) {
    return this.request("/api/ml/tensorflow-predict", {
      method: "POST",
      body: JSON.stringify({
        model_type: modelType,
        input_data: inputData,
        time_horizon: timeHorizon,
      }),
    })
  }

  // OpenStreetMap APIs
  async getOSMRoads(bbox: { minLat: number; minLon: number; maxLat: number; maxLon: number }) {
    const params = new URLSearchParams()
    Object.entries(bbox).forEach(([key, value]) => {
      params.append(key, value.toString())
    })

    return this.request(`/api/osm/roads?${params}`)
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export types for better TypeScript support
export interface TrafficIntersection {
  id: string
  name: string
  location: { lat: number; lng: number }
  city: string
  status: "active" | "maintenance" | "offline"
  currentPhase: "green" | "yellow" | "red"
  timeRemaining: number
  signalTiming: { green: number; yellow: number; red: number }
  trafficDensity: number
  vehicleCount: number
  averageSpeed: number
  lastUpdated: string
}

export interface TrafficViolation {
  id: string
  type: "red_light" | "speeding" | "no_helmet" | "wrong_lane"
  vehicleNumber: string
  location: string
  timestamp: string
  confidence: number
  imageUrl?: string
  status: "detected" | "verified" | "dismissed"
  fineAmount?: number
  speed?: number
  speedLimit?: number
}

export interface CityData {
  id: string
  name: string
  state: string
  coordinates: { lat: number; lng: number }
  population: number
  area: number
  timezone: string
  trafficDensity: "low" | "medium" | "high" | "very_high"
  intersections: number
  averageSpeed: number
  peakHours: string[]
}
