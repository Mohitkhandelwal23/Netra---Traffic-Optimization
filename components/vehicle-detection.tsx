"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Car,
  Truck,
  Bike,
  Users,
  Activity,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Brain,
  Zap,
  AlertTriangle,
  FileText,
} from "lucide-react"
import { MLModelsPanel } from "@/components/ml-models-panel"

export function VehicleDetection() {
  const [isLive, setIsLive] = useState(true)
  const [detectionData, setDetectionData] = useState({
    cars: 45,
    trucks: 8,
    motorcycles: 12,
    pedestrians: 23,
    confidence: 94,
  })

  const [violations, setViolations] = useState([
    {
      id: "V001",
      type: "Red Light Violation",
      vehicle: "MH12AB1234",
      confidence: 0.94,
      timestamp: new Date().toISOString(),
      location: "Main St & 5th Ave",
    },
    {
      id: "V002",
      type: "Speed Violation",
      vehicle: "DL08CA5678",
      confidence: 0.89,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      location: "Highway 101",
    },
  ])

  const [mlModelsActive, setMlModelsActive] = useState({
    yolo: true,
    opencv: true,
    tensorflow: true,
  })

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setDetectionData((prev) => ({
        cars: Math.max(0, prev.cars + Math.floor(Math.random() * 6) - 3),
        trucks: Math.max(0, prev.trucks + Math.floor(Math.random() * 3) - 1),
        motorcycles: Math.max(0, prev.motorcycles + Math.floor(Math.random() * 4) - 2),
        pedestrians: Math.max(0, prev.pedestrians + Math.floor(Math.random() * 8) - 4),
        confidence: Math.max(85, Math.min(99, prev.confidence + Math.floor(Math.random() * 6) - 3)),
      }))

      if (Math.random() < 0.1) {
        const violationTypes = ["Red Light Violation", "Speed Violation", "Wrong Lane", "No Helmet"]
        const vehicleNumbers = ["MH12CD5678", "DL09EF9012", "KA03GH3456", "TN07IJ7890"]

        const newViolation = {
          id: `V${String(violations.length + 1).padStart(3, "0")}`,
          type: violationTypes[Math.floor(Math.random() * violationTypes.length)],
          vehicle: vehicleNumbers[Math.floor(Math.random() * vehicleNumbers.length)],
          confidence: Math.random() * 0.2 + 0.8,
          timestamp: new Date().toISOString(),
          location: "Main St & 5th Ave",
        }

        setViolations((prev) => [newViolation, ...prev.slice(0, 9)])

        createEChallan(newViolation)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive, violations.length])

  const createEChallan = async (violation: any) => {
    try {
      const fineAmounts: { [key: string]: number } = {
        "Red Light Violation": 1000,
        "Speed Violation": 2000,
        "Wrong Lane": 500,
        "No Helmet": 1000,
      }

      await fetch("/api/challan/violations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleNumber: violation.vehicle,
          violationType: violation.type,
          location: violation.location,
          fine: fineAmounts[violation.type] || 500,
          evidence: `/evidence/${violation.id}.jpg`,
          aiConfidence: violation.confidence,
          officerId: "AI-CAM-001",
        }),
      })
    } catch (error) {
      console.error("Failed to create e-challan:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Detection Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{detectionData.cars}</div>
            <p className="text-xs text-muted-foreground">YOLOv8 detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trucks</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{detectionData.trucks}</div>
            <p className="text-xs text-muted-foreground">Heavy vehicles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motorcycles</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{detectionData.motorcycles}</div>
            <p className="text-xs text-muted-foreground">Two wheelers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedestrians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{detectionData.pedestrians}</div>
            <p className="text-xs text-muted-foreground">OpenCV tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{detectionData.confidence}%</div>
            <Progress value={detectionData.confidence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{violations.length}</div>
            <p className="text-xs text-muted-foreground">Auto e-challan</p>
          </CardContent>
        </Card>
      </div>

      {violations.length > 0 && (
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Violations Detected
            </CardTitle>
            <CardDescription>AI-detected traffic violations with automatic e-challan generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {violations.slice(0, 5).map((violation) => (
                <div
                  key={violation.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant="destructive">{violation.type}</Badge>
                    <span className="font-mono text-sm">{violation.vehicle}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(violation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{(violation.confidence * 100).toFixed(1)}%</Badge>
                    <Button size="sm" variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      E-Challan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Detection Interface with ML Models */}
      <Tabs defaultValue="live-feed" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live-feed">Live Detection Feed</TabsTrigger>
          <TabsTrigger value="ml-models">ML Models Control</TabsTrigger>
        </TabsList>

        <TabsContent value="live-feed">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Camera Feed */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Live Camera Feed
                    </CardTitle>
                    <CardDescription>AI-powered vehicle and pedestrian detection with YOLOv8 + OpenCV</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={isLive ? "default" : "secondary"}>{isLive ? "LIVE" : "PAUSED"}</Badge>
                    <Button variant="outline" size="sm" onClick={() => setIsLive(!isLive)}>
                      {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden">
                  {/* Simulated Camera Feed */}
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/10 to-muted/30">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Traffic+Camera+Feed+with+AI+Detection"
                      alt="Traffic camera feed"
                      className="w-full h-full object-cover opacity-60"
                    />
                  </div>

                  {/* Detection Overlays */}
                  {isLive && (
                    <>
                      {/* YOLOv8 Vehicle Detection Boxes */}
                      <div className="absolute top-1/4 left-1/4 w-16 h-12 border-2 border-primary rounded animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-1 rounded">
                          YOLOv8: Car 94%
                        </div>
                      </div>

                      <div className="absolute top-1/3 right-1/4 w-20 h-16 border-2 border-accent rounded animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs bg-accent text-accent-foreground px-1 rounded">
                          YOLOv8: Truck 91%
                        </div>
                      </div>

                      <div className="absolute bottom-1/3 left-1/3 w-8 h-6 border-2 border-chart-2 rounded animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs bg-chart-2 text-background px-1 rounded">
                          YOLOv8: Bike 89%
                        </div>
                      </div>

                      {/* Violation Detection Overlay */}
                      <div className="absolute top-1/2 left-1/2 w-16 h-12 border-2 border-red-500 rounded animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs bg-red-500 text-white px-1 rounded">
                          VIOLATION: Red Light
                        </div>
                      </div>

                      {/* OpenCV Pedestrian Detection */}
                      <div className="absolute bottom-1/4 right-1/3 w-6 h-12 border-2 border-chart-3 rounded animate-pulse">
                        <div className="absolute -top-6 left-0 text-xs bg-chart-3 text-background px-1 rounded">
                          OpenCV: Person 96%
                        </div>
                      </div>

                      {/* TensorFlow Prediction Overlay */}
                      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded px-3 py-2">
                        <div className="text-xs font-medium text-primary">TensorFlow Prediction</div>
                        <div className="text-xs text-muted-foreground">Traffic increase: +15% in 10min</div>
                      </div>
                    </>
                  )}

                  {/* Camera Info Overlay */}
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                    <p className="text-xs font-mono">CAM-001 | Main St & 5th Ave | AI Enhanced</p>
                  </div>

                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                    <p className="text-xs font-mono">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detection Controls & Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Detection Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="vehicles" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
                      <TabsTrigger value="pedestrians">Pedestrians</TabsTrigger>
                    </TabsList>

                    <TabsContent value="vehicles" className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cars (YOLOv8)</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Trucks (YOLOv8)</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Motorcycles (YOLOv8)</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bicycles (OpenCV)</span>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                    </TabsContent>

                    <TabsContent value="pedestrians" className="space-y-3 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Adults (OpenCV)</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Children (YOLOv8)</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Wheelchairs (Custom TF)</span>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Recalibrate All Models
                    </Button>
                    <Button className="w-full bg-transparent" variant="outline" size="sm">
                      Export ML Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ML Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>YOLOv8 Accuracy</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>OpenCV Processing</span>
                      <span className="font-medium">0.15s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>TensorFlow Inference</span>
                      <span className="font-medium">0.3s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Total Pipeline</span>
                      <span className="font-medium">0.65s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ml-models">
          <MLModelsPanel />
        </TabsContent>
      </Tabs>

      {/* Active ML Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Active ML Models
          </CardTitle>
          <CardDescription>Real-time AI processing pipeline status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-primary mr-2" />
                <span className="font-medium">YOLOv8</span>
              </div>
              <Badge variant={mlModelsActive.yolo ? "default" : "secondary"}>
                {mlModelsActive.yolo ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-accent mr-2" />
                <span className="font-medium">OpenCV</span>
              </div>
              <Badge variant={mlModelsActive.opencv ? "default" : "secondary"}>
                {mlModelsActive.opencv ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-chart-2/10 rounded-lg">
              <div className="flex items-center">
                <Brain className="h-4 w-4 text-chart-2 mr-2" />
                <span className="font-medium">TensorFlow</span>
              </div>
              <Badge variant={mlModelsActive.tensorflow ? "default" : "secondary"}>
                {mlModelsActive.tensorflow ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
