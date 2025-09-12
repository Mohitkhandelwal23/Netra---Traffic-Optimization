import { type NextRequest, NextResponse } from "next/server"

// Generate realistic traffic analytics data
function generateTrafficAnalytics(city?: string, timeRange?: string) {
  const cities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ]
  const selectedCity = city || cities[Math.floor(Math.random() * cities.length)]

  // Generate hourly data for the last 24 hours
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date()
    hour.setHours(hour.getHours() - (23 - i))

    // Simulate traffic patterns (higher during rush hours)
    const isRushHour = (i >= 7 && i <= 10) || (i >= 17 && i <= 20)
    const baseTraffic = isRushHour ? 400 : 200
    const variation = Math.random() * 100

    return {
      timestamp: hour.toISOString(),
      hour: hour.getHours(),
      vehicleCount: Math.floor(baseTraffic + variation),
      averageSpeed: Math.floor(isRushHour ? 20 + Math.random() * 15 : 35 + Math.random() * 15),
      congestionLevel: isRushHour ? 0.7 + Math.random() * 0.3 : 0.3 + Math.random() * 0.4,
      pedestrianCount: Math.floor(50 + Math.random() * 100),
    }
  })

  // Generate weekly efficiency data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date()
    day.setDate(day.getDate() - (6 - i))

    return {
      date: day.toISOString().split("T")[0],
      day: day.toLocaleDateString("en-US", { weekday: "short" }),
      efficiency: Math.floor(80 + Math.random() * 20),
      congestion: Math.floor(30 + Math.random() * 50),
      incidents: Math.floor(Math.random() * 5),
      co2Reduction: Math.floor(10 + Math.random() * 15),
    }
  })

  // Vehicle type distribution
  const vehicleTypes = [
    { type: "cars", count: Math.floor(1000 + Math.random() * 500), percentage: 65 },
    { type: "motorcycles", count: Math.floor(300 + Math.random() * 200), percentage: 20 },
    { type: "trucks", count: Math.floor(100 + Math.random() * 100), percentage: 8 },
    { type: "buses", count: Math.floor(50 + Math.random() * 50), percentage: 4 },
    { type: "others", count: Math.floor(30 + Math.random() * 30), percentage: 3 },
  ]

  // Intersection performance
  const intersectionPerformance = Array.from({ length: 5 }, (_, i) => ({
    id: `int-${String(i + 1).padStart(3, "0")}`,
    name: `Intersection ${i + 1}`,
    efficiency: Math.floor(80 + Math.random() * 20),
    averageWaitTime: Math.floor(30 + Math.random() * 30),
    throughput: Math.floor(300 + Math.random() * 200),
    violations: Math.floor(Math.random() * 10),
  }))

  return {
    city: selectedCity,
    timeRange: timeRange || "24h",
    summary: {
      totalVehicles: hourlyData.reduce((sum, h) => sum + h.vehicleCount, 0),
      averageSpeed: Math.floor(hourlyData.reduce((sum, h) => sum + h.averageSpeed, 0) / hourlyData.length),
      averageCongestion: Math.floor(
        (hourlyData.reduce((sum, h) => sum + h.congestionLevel, 0) / hourlyData.length) * 100,
      ),
      totalPedestrians: hourlyData.reduce((sum, h) => sum + h.pedestrianCount, 0),
      co2Reduction: Math.floor(10 + Math.random() * 20),
    },
    hourlyData,
    weeklyData,
    vehicleTypes,
    intersectionPerformance,
    generatedAt: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const timeRange = searchParams.get("timeRange") || "24h"
  const metric = searchParams.get("metric")

  try {
    const analytics = generateTrafficAnalytics(city || undefined, timeRange)

    // If specific metric requested, return only that data
    if (metric) {
      const metricData = {
        hourly: analytics.hourlyData,
        weekly: analytics.weeklyData,
        vehicles: analytics.vehicleTypes,
        intersections: analytics.intersectionPerformance,
      }[metric]

      if (!metricData) {
        return NextResponse.json({ success: false, error: "Invalid metric requested" }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        metric,
        data: metricData,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate analytics" }, { status: 500 })
  }
}
