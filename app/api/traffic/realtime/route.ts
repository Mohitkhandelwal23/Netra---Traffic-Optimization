import { type NextRequest, NextResponse } from "next/server"

// Simulate real-time traffic data
let realtimeData = {
  activeIntersections: 24,
  totalVehicles: 1247,
  averageSpeed: 32,
  congestionLevel: 68,
  emergencyVehicles: 3,
  pedestrianCount: 156,
  systemStatus: "operational",
  lastUpdate: new Date().toISOString(),
}

// Simulate live updates
setInterval(() => {
  realtimeData = {
    ...realtimeData,
    totalVehicles: Math.max(800, realtimeData.totalVehicles + Math.floor((Math.random() - 0.5) * 50)),
    averageSpeed: Math.max(15, Math.min(50, realtimeData.averageSpeed + Math.floor((Math.random() - 0.5) * 5))),
    congestionLevel: Math.max(20, Math.min(95, realtimeData.congestionLevel + Math.floor((Math.random() - 0.5) * 10))),
    emergencyVehicles: Math.max(0, realtimeData.emergencyVehicles + Math.floor((Math.random() - 0.5) * 2)),
    pedestrianCount: Math.max(50, realtimeData.pedestrianCount + Math.floor((Math.random() - 0.5) * 20)),
    lastUpdate: new Date().toISOString(),
  }
}, 5000)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")

  // City-specific adjustments
  const cityMultipliers = {
    mumbai: { traffic: 1.5, congestion: 1.3 },
    delhi: { traffic: 1.4, congestion: 1.2 },
    bangalore: { traffic: 1.2, congestion: 1.1 },
    chennai: { traffic: 1.1, congestion: 1.0 },
    kolkata: { traffic: 1.3, congestion: 1.2 },
  }

  const adjustedData = { ...realtimeData }

  if (city && cityMultipliers[city.toLowerCase() as keyof typeof cityMultipliers]) {
    const multiplier = cityMultipliers[city.toLowerCase() as keyof typeof cityMultipliers]
    adjustedData.totalVehicles = Math.floor(adjustedData.totalVehicles * multiplier.traffic)
    adjustedData.congestionLevel = Math.min(95, Math.floor(adjustedData.congestionLevel * multiplier.congestion))
  }

  // Generate alerts based on current conditions
  const alerts = []

  if (adjustedData.congestionLevel > 80) {
    alerts.push({
      id: "alert-001",
      type: "congestion",
      severity: "high",
      message: "Heavy congestion detected",
      location: "Multiple intersections",
      timestamp: new Date().toISOString(),
    })
  }

  if (adjustedData.emergencyVehicles > 0) {
    alerts.push({
      id: "alert-002",
      type: "emergency",
      severity: "medium",
      message: `${adjustedData.emergencyVehicles} emergency vehicle(s) active`,
      location: "Various routes",
      timestamp: new Date().toISOString(),
    })
  }

  if (adjustedData.averageSpeed < 20) {
    alerts.push({
      id: "alert-003",
      type: "slowdown",
      severity: "medium",
      message: "Significant traffic slowdown",
      location: "City-wide",
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({
    success: true,
    data: adjustedData,
    alerts,
    city: city || "All Cities",
    timestamp: new Date().toISOString(),
  })
}

export async function POST(request: NextRequest) {
  try {
    const { emergencyMode, signalOverride, intersectionId } = await request.json()

    if (emergencyMode !== undefined) {
      realtimeData.systemStatus = emergencyMode ? "emergency" : "operational"
    }

    if (signalOverride && intersectionId) {
      // Handle signal override logic here
      console.log(`Signal override for intersection ${intersectionId}`)
    }

    return NextResponse.json({
      success: true,
      message: "Real-time data updated",
      data: realtimeData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update real-time data" }, { status: 500 })
  }
}
