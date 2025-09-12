"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  Car,
  MapPin,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Shield,
  Settings,
  BarChart3,
  Navigation,
  Zap,
} from "lucide-react"
import { TrafficMap } from "@/components/traffic-map"
import { VehicleDetection } from "@/components/vehicle-detection"
import { SignalControl } from "@/components/signal-control"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { AdminPanel } from "@/components/admin-panel"
import { MLModelsPanel } from "@/components/ml-models-panel"
import { PoliceChallanDashboard } from "@/components/police-challan-dashboard"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)

  // Mock real-time data
  const [trafficData, setTrafficData] = useState({
    totalVehicles: 1247,
    averageSpeed: 32,
    congestionLevel: 68,
    activeSignals: 24,
    emergencyVehicles: 3,
    pedestrianCount: 156,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Navigation className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">Netra AI Traffic</h1>
            </div>
            <Badge variant={isEmergencyMode ? "destructive" : "secondary"}>
              {isEmergencyMode ? "Emergency Mode" : "Normal Operation"}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant={isEmergencyMode ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsEmergencyMode(!isEmergencyMode)}
            >
              <Shield className="h-4 w-4 mr-2" />
              Emergency Override
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Overview Tab */}
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitor</TabsTrigger>
            <TabsTrigger value="detection">AI Detection</TabsTrigger>
            <TabsTrigger value="signals">Signal Control</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="ml-models">ML Models</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
            <TabsTrigger value="police-challan">Police E-Challan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
                  <Car className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{trafficData.totalVehicles}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% from last hour
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Speed</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{trafficData.averageSpeed} km/h</div>
                  <p className="text-xs text-muted-foreground">Optimal range: 30-40 km/h</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Congestion Level</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{trafficData.congestionLevel}%</div>
                  <Progress value={trafficData.congestionLevel} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Signals</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{trafficData.activeSignals}/26</div>
                  <p className="text-xs text-muted-foreground">2 signals under maintenance</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Traffic Map */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Real-time Traffic Map
                  </CardTitle>
                  <CardDescription>Live traffic flow and signal status across the city</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrafficMap />
                </CardContent>
              </Card>

              {/* Quick Actions & Alerts */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Active Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Heavy congestion</p>
                        <p className="text-xs text-muted-foreground">Main St & 5th Ave</p>
                      </div>
                      <Badge variant="destructive">High</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Emergency vehicle</p>
                        <p className="text-xs text-muted-foreground">Route 101 North</p>
                      </div>
                      <Badge className="bg-accent text-accent-foreground">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">Signal maintenance</p>
                        <p className="text-xs text-muted-foreground">Park Ave & 2nd St</p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Zap className="h-4 w-4 mr-2" />
                      Optimize All Signals
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Pedestrian Mode
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Live Monitoring Tab */}
          <TabsContent value="monitoring">
            <TrafficMap />
          </TabsContent>

          {/* AI Detection Tab */}
          <TabsContent value="detection">
            <VehicleDetection />
          </TabsContent>

          {/* Signal Control Tab */}
          <TabsContent value="signals">
            <SignalControl />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* ML Models Tab */}
          <TabsContent value="ml-models">
            <MLModelsPanel />
          </TabsContent>

          {/* Admin Tab */}
          <TabsContent value="admin">
            <AdminPanel />
          </TabsContent>

          {/* Police E-Challan Tab */}
          <TabsContent value="police-challan">
            <PoliceChallanDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
