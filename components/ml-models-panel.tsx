"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Eye,
  Cpu,
  Activity,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  Upload,
  Play,
  Pause,
  Video,
} from "lucide-react"

interface MLModelStatus {
  name: string
  status: "active" | "loading" | "error"
  accuracy: number
  lastUpdate: string
  processingTime: string
}

interface VideoAnalysisResult {
  detections: any[]
  summary: {
    total_detections: number
    average_confidence: number
    violations: number
    vehicle_types: Record<string, number>
  }
  processing_info: {
    duration: number
    frames_processed: number
    fps: number
  }
}

export function MLModelsPanel() {
  const [modelStatuses, setModelStatuses] = useState<MLModelStatus[]>([
    {
      name: "YOLOv8 Detection",
      status: "active",
      accuracy: 94.2,
      lastUpdate: "2 min ago",
      processingTime: "0.2s",
    },
    {
      name: "OpenCV Analysis",
      status: "active",
      accuracy: 91.8,
      lastUpdate: "1 min ago",
      processingTime: "0.15s",
    },
    {
      name: "TensorFlow Prediction",
      status: "active",
      accuracy: 89.5,
      lastUpdate: "30 sec ago",
      processingTime: "0.3s",
    },
  ])

  const [detectionResults, setDetectionResults] = useState({
    yolo: null,
    opencv: null,
    tensorflow: null,
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [videoAnalysisResult, setVideoAnalysisResult] = useState<VideoAnalysisResult | null>(null)
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate real-time model updates
  useEffect(() => {
    const interval = setInterval(() => {
      setModelStatuses((prev) =>
        prev.map((model) => ({
          ...model,
          accuracy: Math.max(85, Math.min(99, model.accuracy + (Math.random() - 0.5) * 2)),
          lastUpdate: "Just now",
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const runYOLODetection = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/ml/yolo-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: "mock_image_data",
          confidence_threshold: 0.5,
        }),
      })
      const result = await response.json()
      setDetectionResults((prev) => ({ ...prev, yolo: result }))
    } catch (error) {
      console.error("YOLO detection failed:", error)
    }
    setIsProcessing(false)
  }

  const runOpenCVAnalysis = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/ml/opencv-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageData: "mock_image_data",
          analysis_type: "traffic_flow",
        }),
      })
      const result = await response.json()
      setDetectionResults((prev) => ({ ...prev, opencv: result }))
    } catch (error) {
      console.error("OpenCV analysis failed:", error)
    }
    setIsProcessing(false)
  }

  const runTensorFlowPrediction = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/ml/tensorflow-predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_type: "traffic_prediction",
          input_data: "mock_traffic_data",
          time_horizon: 30,
        }),
      })
      const result = await response.json()
      setDetectionResults((prev) => ({ ...prev, tensorflow: result }))
    } catch (error) {
      console.error("TensorFlow prediction failed:", error)
    }
    setIsProcessing(false)
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file")
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      // 100MB limit
      alert("File size must be less than 100MB")
      return
    }

    setUploadedVideo(file)
    setVideoAnalysisResult(null)
  }

  const analyzeVideo = async () => {
    if (!uploadedVideo) return

    setIsAnalyzingVideo(true)
    setVideoProgress(0)

    try {
      // Simulate video analysis progress
      const progressInterval = setInterval(() => {
        setVideoProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 500)

      // Simulate API call for video analysis
      await new Promise((resolve) => setTimeout(resolve, 5000))

      clearInterval(progressInterval)
      setVideoProgress(100)

      // Mock analysis results
      const mockResult: VideoAnalysisResult = {
        detections: [
          { class: "car", confidence: 0.94, bbox: [100, 150, 200, 250], frame: 45 },
          { class: "truck", confidence: 0.89, bbox: [300, 100, 450, 300], frame: 67 },
          { class: "motorcycle", confidence: 0.92, bbox: [50, 200, 120, 280], frame: 89 },
          { class: "bus", confidence: 0.87, bbox: [200, 80, 400, 320], frame: 123 },
          { class: "person", confidence: 0.91, bbox: [150, 250, 180, 350], frame: 156 },
        ],
        summary: {
          total_detections: 47,
          average_confidence: 0.906,
          violations: 3,
          vehicle_types: {
            car: 23,
            truck: 8,
            motorcycle: 12,
            bus: 4,
          },
        },
        processing_info: {
          duration: 120, // seconds
          frames_processed: 3600,
          fps: 30,
        },
      }

      setVideoAnalysisResult(mockResult)
    } catch (error) {
      console.error("Video analysis failed:", error)
    } finally {
      setIsAnalyzingVideo(false)
    }
  }

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  return (
    <div className="space-y-6">
      {/* Model Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modelStatuses.map((model, index) => (
          <Card key={model.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
              {index === 0 && <Eye className="h-4 w-4 text-muted-foreground" />}
              {index === 1 && <Cpu className="h-4 w-4 text-muted-foreground" />}
              {index === 2 && <Brain className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-primary">{model.accuracy.toFixed(1)}%</div>
                <Badge variant={model.status === "active" ? "default" : "secondary"}>
                  {model.status === "active" && <CheckCircle className="h-3 w-3 mr-1" />}
                  {model.status}
                </Badge>
              </div>
              <Progress value={model.accuracy} className="mb-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{model.lastUpdate}</span>
                <span>{model.processingTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ML Models Interface */}
      <Tabs defaultValue="yolo" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="yolo">YOLOv8 Detection</TabsTrigger>
          <TabsTrigger value="opencv">OpenCV Analysis</TabsTrigger>
          <TabsTrigger value="tensorflow">TensorFlow AI</TabsTrigger>
          <TabsTrigger value="video-analysis">Video Analysis</TabsTrigger>
        </TabsList>

        {/* YOLOv8 Tab */}
        <TabsContent value="yolo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  YOLOv8 Vehicle Detection
                </CardTitle>
                <CardDescription>Real-time object detection with bounding boxes and confidence scores</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runYOLODetection} disabled={isProcessing} className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Run YOLO Detection"}
                </Button>

                {detectionResults.yolo && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Total Detections:</span>
                        <div className="text-lg font-bold text-primary">
                          {detectionResults.yolo.summary?.total_detections || 0}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Avg Confidence:</span>
                        <div className="text-lg font-bold text-accent">
                          {(detectionResults.yolo.summary?.average_confidence * 100)?.toFixed(1) || 0}%
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Detected Objects:</h4>
                      {detectionResults.yolo.detections?.map((detection: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                          <span className="capitalize">{detection.class}</span>
                          <Badge variant="outline">{(detection.confidence * 100).toFixed(1)}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detection Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/placeholder.svg?height=300&width=400&text=Traffic+Camera+Feed"
                    alt="Traffic detection visualization"
                    className="w-full h-full object-cover opacity-60"
                  />

                  {detectionResults.yolo && (
                    <>
                      {/* Simulated bounding boxes */}
                      <div className="absolute top-1/4 left-1/4 w-16 h-12 border-2 border-primary rounded animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-1 rounded">
                          Car 94%
                        </div>
                      </div>
                      <div className="absolute top-1/3 right-1/4 w-20 h-16 border-2 border-accent rounded animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs bg-accent text-accent-foreground px-1 rounded">
                          Truck 91%
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* OpenCV Tab */}
        <TabsContent value="opencv">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  OpenCV Image Analysis
                </CardTitle>
                <CardDescription>Advanced computer vision for traffic flow and lane detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runOpenCVAnalysis} disabled={isProcessing} className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  {isProcessing ? "Analyzing..." : "Run OpenCV Analysis"}
                </Button>

                {detectionResults.opencv && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Flow Direction:</span>
                        <div className="text-lg font-bold text-primary capitalize">
                          {detectionResults.opencv.results?.flow_direction || "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Avg Speed:</span>
                        <div className="text-lg font-bold text-accent">
                          {detectionResults.opencv.results?.average_speed?.toFixed(1) || 0} km/h
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Processing Steps:</h4>
                      {detectionResults.opencv.processing_info?.image_preprocessing?.map(
                        (step: string, idx: number) => (
                          <div key={idx} className="flex items-center p-2 bg-muted/20 rounded">
                            <CheckCircle className="h-4 w-4 text-primary mr-2" />
                            <span className="capitalize">{step.replace("_", " ")}</span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <img
                    src="/placeholder.svg?height=300&width=400&text=Traffic+Flow+Analysis"
                    alt="Traffic flow analysis"
                    className="w-full h-full object-cover opacity-60"
                  />

                  {detectionResults.opencv && (
                    <>
                      {/* Flow vectors visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-primary font-bold">Flow Vectors Detected</div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TensorFlow Tab */}
        <TabsContent value="tensorflow">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  TensorFlow Predictions
                </CardTitle>
                <CardDescription>Custom AI models for traffic prediction and optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={runTensorFlowPrediction} disabled={isProcessing} className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {isProcessing ? "Predicting..." : "Generate Predictions"}
                </Button>

                {detectionResults.tensorflow && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Model Accuracy:</span>
                        <div className="text-lg font-bold text-primary">
                          {(detectionResults.tensorflow.predictions?.model_accuracy * 100)?.toFixed(1) || 0}%
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Confidence:</span>
                        <div className="text-lg font-bold text-accent">
                          {detectionResults.tensorflow.predictions?.confidence_interval?.[1]
                            ? (detectionResults.tensorflow.predictions.confidence_interval[1] * 100).toFixed(1) + "%"
                            : "N/A"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Model Info:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Framework:</span>
                          <span className="font-medium">{detectionResults.tensorflow.model_info?.framework}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Training Data:</span>
                          <span className="font-medium">
                            {detectionResults.tensorflow.model_info?.training_data_size}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Inference Time:</span>
                          <span className="font-medium">{detectionResults.tensorflow.model_info?.inference_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/20 rounded-lg flex items-center justify-center">
                  {detectionResults.tensorflow ? (
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium">Traffic Predictions Generated</div>
                      <div className="text-xs text-muted-foreground">
                        {detectionResults.tensorflow.predictions?.future_traffic?.length || 0} data points
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-sm">Run prediction to see results</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Video Analysis Tab */}
        <TabsContent value="video-analysis">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Upload & Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2" />
                  Traffic Video Analysis
                </CardTitle>
                <CardDescription>Upload traffic clips for AI-powered analysis and violation detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="video-upload">Upload Traffic Video</Label>
                  <div className="flex gap-2">
                    <Input
                      id="video-upload"
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      ref={fileInputRef}
                      className="flex-1"
                    />
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Video Preview */}
                {uploadedVideo && (
                  <div className="space-y-2">
                    <Label>Video Preview</Label>
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <video
                        ref={videoRef}
                        className="w-full h-48 object-cover"
                        src={URL.createObjectURL(uploadedVideo)}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                      />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                        <Button size="sm" variant="secondary" onClick={toggleVideoPlayback}>
                          {isVideoPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <div className="text-xs text-white bg-black/50 px-2 py-1 rounded">{uploadedVideo.name}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Analysis Controls */}
                <Button onClick={analyzeVideo} disabled={!uploadedVideo || isAnalyzingVideo} className="w-full">
                  <Brain className="h-4 w-4 mr-2" />
                  {isAnalyzingVideo ? "Analyzing Video..." : "Analyze with AI Models"}
                </Button>

                {/* Analysis Progress */}
                {isAnalyzingVideo && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processing frames...</span>
                      <span>{videoProgress.toFixed(0)}%</span>
                    </div>
                    <Progress value={videoProgress} className="w-full" />
                  </div>
                )}

                {/* Analysis Results Summary */}
                {videoAnalysisResult && (
                  <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                    <h4 className="font-medium">Analysis Complete</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Detections:</span>
                        <div className="text-lg font-bold text-primary">
                          {videoAnalysisResult.summary.total_detections}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Confidence:</span>
                        <div className="text-lg font-bold text-accent">
                          {(videoAnalysisResult.summary.average_confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Violations Found:</span>
                        <div className="text-lg font-bold text-destructive">
                          {videoAnalysisResult.summary.violations}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="text-lg font-bold">
                          {Math.floor(videoAnalysisResult.processing_info.duration / 60)}:
                          {(videoAnalysisResult.processing_info.duration % 60).toString().padStart(2, "0")}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Detection Results</CardTitle>
                <CardDescription>Detailed analysis of detected objects and violations</CardDescription>
              </CardHeader>
              <CardContent>
                {videoAnalysisResult ? (
                  <div className="space-y-4">
                    {/* Vehicle Type Breakdown */}
                    <div>
                      <h4 className="font-medium mb-2">Vehicle Types Detected</h4>
                      <div className="space-y-2">
                        {Object.entries(videoAnalysisResult.summary.vehicle_types).map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between">
                            <span className="capitalize text-sm">{type}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-secondary rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${(count / videoAnalysisResult.summary.total_detections) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm font-medium w-8">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Detections */}
                    <div>
                      <h4 className="font-medium mb-2">Recent Detections</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {videoAnalysisResult.detections.slice(0, 8).map((detection, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-muted/20 rounded text-sm">
                            <div className="flex items-center gap-2">
                              <span className="capitalize font-medium">{detection.class}</span>
                              <span className="text-muted-foreground">Frame {detection.frame}</span>
                            </div>
                            <Badge variant="outline">{(detection.confidence * 100).toFixed(1)}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Processing Info */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Frames Processed: {videoAnalysisResult.processing_info.frames_processed}</div>
                      <div>Processing FPS: {videoAnalysisResult.processing_info.fps}</div>
                      <div>Analysis Duration: {videoAnalysisResult.processing_info.duration}s</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Upload and analyze a traffic video to see detailed results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
