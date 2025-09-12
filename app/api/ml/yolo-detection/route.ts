import { type NextRequest, NextResponse } from "next/server"

// Simulated YOLOv8 detection results
export async function POST(request: NextRequest) {
  try {
    const { imageData, confidence_threshold = 0.5 } = await request.json()

    // Simulate YOLOv8 processing time
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Mock YOLOv8 detection results
    const detections = [
      {
        class: "car",
        confidence: 0.94,
        bbox: [120, 80, 180, 140],
        center: [150, 110],
        area: 3600,
      },
      {
        class: "truck",
        confidence: 0.91,
        bbox: [300, 60, 380, 160],
        center: [340, 110],
        area: 8000,
      },
      {
        class: "motorcycle",
        confidence: 0.89,
        bbox: [200, 120, 230, 160],
        center: [215, 140],
        area: 1200,
      },
      {
        class: "person",
        confidence: 0.96,
        bbox: [450, 100, 470, 180],
        center: [460, 140],
        area: 1600,
      },
      {
        class: "bicycle",
        confidence: 0.87,
        bbox: [80, 140, 110, 180],
        center: [95, 160],
        area: 1200,
      },
    ].filter((detection) => detection.confidence >= confidence_threshold)

    const summary = {
      total_detections: detections.length,
      vehicle_count: detections.filter((d) => ["car", "truck", "motorcycle", "bicycle"].includes(d.class)).length,
      pedestrian_count: detections.filter((d) => d.class === "person").length,
      average_confidence: detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length,
      processing_time: "0.2s",
      model_version: "YOLOv8n",
      image_size: [640, 640],
    }

    return NextResponse.json({
      success: true,
      detections,
      summary,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Detection failed" }, { status: 500 })
  }
}
