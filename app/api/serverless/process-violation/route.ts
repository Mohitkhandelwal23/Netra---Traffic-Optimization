// Serverless function for processing traffic violations
import { type NextRequest, NextResponse } from "next/server"
import { DatabaseQueries } from "@/lib/database"
import { storageService } from "@/lib/storage"
import { realtimeService } from "@/lib/realtime"

interface ViolationProcessingRequest {
  intersectionId: number
  imageData: string // base64 image
  detectionResults: {
    vehicleNumber?: string
    violationType: string
    confidence: number
    boundingBox: { x: number; y: number; width: number; height: number }
  }
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ViolationProcessingRequest = await request.json()

    console.log("[v0] Processing violation:", data.detectionResults.violationType)

    // 1. Store violation image
    const imageFile = await storageService.uploadBase64Image(data.imageData, `violation_${Date.now()}.jpg`)

    // 2. Enhanced AI processing (simulated)
    const enhancedResults = await processViolationWithAI(data)

    // 3. Store violation in database
    const violation = await DatabaseQueries.insertViolation({
      intersection_id: data.intersectionId,
      vehicle_number: enhancedResults.vehicleNumber,
      violation_type: enhancedResults.violationType,
      confidence_score: enhancedResults.confidence,
      image_url: imageFile.url,
      created_by: null, // System generated
    })

    // 4. Send real-time notification
    realtimeService.broadcast("violations", "violation-processed", {
      violationId: violation[0]?.id,
      intersectionId: data.intersectionId,
      violationType: enhancedResults.violationType,
      vehicleNumber: enhancedResults.vehicleNumber,
      confidence: enhancedResults.confidence,
      imageUrl: imageFile.url,
      timestamp: data.timestamp,
    })

    // 5. Generate automated response actions
    const actions = await generateAutomatedActions(enhancedResults)

    return NextResponse.json({
      success: true,
      violationId: violation[0]?.id,
      enhancedResults,
      actions,
      processingTime: Date.now() - new Date(data.timestamp).getTime(),
    })
  } catch (error) {
    console.error("[v0] Violation processing error:", error)
    return NextResponse.json({ error: "Violation processing failed" }, { status: 500 })
  }
}

// AI processing simulation
async function processViolationWithAI(data: ViolationProcessingRequest) {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const { detectionResults } = data

  // Enhanced vehicle number recognition
  let vehicleNumber = detectionResults.vehicleNumber
  if (!vehicleNumber && detectionResults.confidence > 0.8) {
    // Simulate OCR processing
    const states = ["MH", "DL", "KA", "TN", "WB", "AP", "GJ", "RJ"]
    const state = states[Math.floor(Math.random() * states.length)]
    const numbers = Math.floor(Math.random() * 99) + 1
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
    const digits = Math.floor(Math.random() * 9999) + 1000
    vehicleNumber = `${state}${numbers.toString().padStart(2, "0")}${letter}${digits}`
  }

  // Enhanced confidence scoring
  let enhancedConfidence = detectionResults.confidence
  if (detectionResults.violationType === "red_light" && detectionResults.confidence > 0.7) {
    enhancedConfidence = Math.min(0.95, detectionResults.confidence + 0.1)
  }

  return {
    vehicleNumber,
    violationType: detectionResults.violationType,
    confidence: enhancedConfidence,
    processingMethod: "enhanced_ai",
    additionalData: {
      weatherCondition: "clear",
      lightingCondition: "daylight",
      trafficDensity: "medium",
    },
  }
}

// Generate automated actions based on violation
async function generateAutomatedActions(results: any) {
  const actions = []

  // High confidence violations get immediate actions
  if (results.confidence > 0.9) {
    actions.push({
      type: "immediate_alert",
      description: "Send alert to nearest traffic police",
      priority: "high",
    })
  }

  // Repeat offender check (simulated)
  if (results.vehicleNumber) {
    actions.push({
      type: "offender_check",
      description: "Check violation history for repeat offenses",
      priority: "medium",
    })
  }

  // Traffic pattern analysis
  actions.push({
    type: "pattern_analysis",
    description: "Update intersection violation patterns",
    priority: "low",
  })

  return actions
}
