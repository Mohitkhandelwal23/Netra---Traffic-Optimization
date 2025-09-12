"use client"

import { useState, useEffect } from "react"
import { apiClient, type TrafficIntersection, type CityData } from "@/lib/api-client"

export function useTrafficData(city?: string) {
  const [intersections, setIntersections] = useState<TrafficIntersection[]>([])
  const [realtimeData, setRealtimeData] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [intersectionsRes, realtimeRes, analyticsRes] = await Promise.all([
        apiClient.getIntersections(city),
        apiClient.getRealtimeData(city),
        apiClient.getTrafficAnalytics(city, "24h"),
      ])

      if (intersectionsRes.success) {
        setIntersections(intersectionsRes.data || [])
      }

      if (realtimeRes.success) {
        setRealtimeData(realtimeRes.data)
      }

      if (analyticsRes.success) {
        setAnalytics(analyticsRes.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch traffic data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchData, 30000)

    return () => clearInterval(interval)
  }, [city])

  return {
    intersections,
    realtimeData,
    analytics,
    loading,
    error,
    refetch: fetchData,
  }
}

export function useCities() {
  const [cities, setCities] = useState<CityData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getCities()

        if (response.success) {
          setCities(response.data || [])
        } else {
          setError(response.error || "Failed to fetch cities")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch cities")
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [])

  return { cities, loading, error }
}
