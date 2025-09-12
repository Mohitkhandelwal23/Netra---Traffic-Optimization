// Serverless function for traffic prediction and optimization
import { type NextRequest, NextResponse } from "next/server"
import { DatabaseQueries } from "@/lib/database"
import { realtimeService } from "@/lib/realtime"

interface TrafficPredictionRequest {
  intersectionId: number
  currentData: {
    vehicleCount: number
    pedestrianCount: number
    trafficDensity: string
    averageSpeed: number
    weatherCondition?: string
  }
  timeHorizon: number // minutes to predict ahead
}

export async function POST(request: NextRequest) {
  try {
    const data: TrafficPredictionRequest = await request.json()

    console.log("[v0] Generating traffic predictions for intersection:", data.intersectionId)

    // 1. Get historical data
    const historicalData = await DatabaseQueries.getTrafficAnalytics(data.intersectionId, "7 days")

    // 2. Run prediction algorithm
    const predictions = await generateTrafficPredictions(data, historicalData)

    // 3. Calculate optimal signal timing
    const optimalTiming = await calculateOptimalSignalTiming(predictions)

    // 4. Generate recommendations
    const recommendations = await generateTrafficRecommendations(predictions, optimalTiming)

    // 5. Store predictions for future analysis
    await storePredictions(data.intersectionId, predictions)

    // 6. Broadcast real-time updates
    realtimeService.broadcast("traffic-predictions", "prediction-update", {
      intersectionId: data.intersectionId,
      predictions,
      optimalTiming,
      recommendations,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      intersectionId: data.intersectionId,
      predictions,
      optimalTiming,
      recommendations,
      processingTime: Date.now() - Date.now(),
    })
  } catch (error) {
    console.error("[v0] Traffic prediction error:", error)
    return NextResponse.json({ error: "Traffic prediction failed" }, { status: 500 })
  }
}

// Traffic prediction algorithm (simulated ML model)
async function generateTrafficPredictions(data: TrafficPredictionRequest, historicalData: any[]) {
  // Simulate ML processing
  await new Promise((resolve) => setTimeout(resolve, 300))

  const predictions = []
  const currentTime = new Date()

  for (let i = 1; i <= data.timeHorizon; i += 5) {
    // 5-minute intervals
    const futureTime = new Date(currentTime.getTime() + i * 60 * 1000)

    // Simulate traffic pattern prediction
    const hourOfDay = futureTime.getHours()
    const dayOfWeek = futureTime.getDay()

    // Peak hours simulation
    let trafficMultiplier = 1
    if ((hourOfDay >= 8 && hourOfDay <= 10) || (hourOfDay >= 17 && hourOfDay <= 19)) {
      trafficMultiplier = 1.5 // Rush hour
    } else if (hourOfDay >= 22 || hourOfDay <= 6) {
      trafficMultiplier = 0.3 // Night time
    }

    // Weekend adjustment
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      trafficMultiplier *= 0.7
    }

    const predictedVehicleCount = Math.round(
      data.currentData.vehicleCount * trafficMultiplier * (0.8 + Math.random() * 0.4),
    )

    const predictedSpeed = Math.max(
      10,
      data.currentData.averageSpeed * (2 - trafficMultiplier) * (0.9 + Math.random() * 0.2),
    )

    predictions.push({
      timestamp: futureTime.toISOString(),
      vehicleCount: predictedVehicleCount,
      pedestrianCount: Math.round(data.currentData.pedestrianCount * (0.8 + Math.random() * 0.4)),
      averageSpeed: Math.round(predictedSpeed),
      trafficDensity: predictedVehicleCount > 40 ? "high" : predictedVehicleCount > 20 ? "medium" : "low",
      congestionLevel: Math.min(100, Math.round((50 - predictedSpeed) * 2)),
      confidence: 0.75 + Math.random() * 0.2,
    })
  }

  return predictions
}

// Calculate optimal signal timing based on predictions
async function calculateOptimalSignalTiming(predictions: any[]) {
  // Simulate optimization algorithm
  await new Promise((resolve) => setTimeout(resolve, 100))

  const avgVehicleCount = predictions.reduce((sum, p) => sum + p.vehicleCount, 0) / predictions.length
  const avgCongestion = predictions.reduce((sum, p) => sum + p.congestionLevel, 0) / predictions.length

  // Dynamic timing calculation
  let northSouth = 30 // Base timing
  let eastWest = 25 // Base timing

  // Adjust based on predicted traffic
  if (avgVehicleCount > 35) {
    northSouth += 10
    eastWest += 8
  } else if (avgVehicleCount < 15) {
    northSouth -= 5
    eastWest -= 3
  }

  // Adjust based on congestion
  if (avgCongestion > 70) {
    northSouth += 15
    eastWest += 12
  }

  // Ensure minimum timing
  northSouth = Math.max(20, Math.min(60, northSouth))
  eastWest = Math.max(15, Math.min(50, eastWest))

  return {
    northSouth,
    eastWest,
    cycleTime: northSouth + eastWest + 10, // +10 for transitions
    efficiency: Math.round(100 - avgCongestion * 0.5),
    estimatedImprovement: Math.round(Math.random() * 20 + 10), // 10-30% improvement
  }
}

// Generate traffic management recommendations
async function generateTrafficRecommendations(predictions: any[], optimalTiming: any) {
  const recommendations = []

  const maxCongestion = Math.max(...predictions.map((p) => p.congestionLevel))
  const avgSpeed = predictions.reduce((sum, p) => sum + p.averageSpeed, 0) / predictions.length

  if (maxCongestion > 80) {
    recommendations.push({
      type: "emergency",
      title: "High Congestion Alert",
      description: "Predicted severe congestion. Consider traffic diversion.",
      priority: "high",
      action: "Deploy traffic police for manual control",
    })
  }

  if (avgSpeed < 15) {
    recommendations.push({
      type: "optimization",
      title: "Speed Optimization",
      description: "Low average speed detected. Optimize signal timing.",
      priority: "medium",
      action: `Implement ${optimalTiming.northSouth}s/${optimalTiming.eastWest}s timing`,
    })
  }

  if (optimalTiming.estimatedImprovement > 20) {
    recommendations.push({
      type: "improvement",
      title: "Significant Improvement Possible",
      description: `Traffic flow can be improved by ${optimalTiming.estimatedImprovement}%`,
      priority: "medium",
      action: "Apply recommended signal timing changes",
    })
  }

  // Time-based recommendations
  const currentHour = new Date().getHours()
  if (currentHour >= 7 && currentHour <= 9) {
    recommendations.push({
      type: "schedule",
      title: "Morning Rush Hour",
      description: "Peak traffic period detected",
      priority: "low",
      action: "Monitor closely and be ready for manual intervention",
    })
  }

  return recommendations
}

// Store predictions for analysis
async function storePredictions(intersectionId: number, predictions: any[]) {
  // In a real implementation, this would store in the database
  console.log("[v0] Storing predictions for intersection:", intersectionId, "count:", predictions.length)

  // Simulate database storage
  await new Promise((resolve) => setTimeout(resolve, 50))
}
