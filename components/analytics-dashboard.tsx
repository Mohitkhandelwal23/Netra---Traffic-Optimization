"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, BarChart3, Download, Calendar, Clock } from "lucide-react"

export function AnalyticsDashboard() {
  // Mock data for charts
  const hourlyTraffic = [
    { hour: "6AM", vehicles: 120, pedestrians: 45 },
    { hour: "7AM", vehicles: 280, pedestrians: 78 },
    { hour: "8AM", vehicles: 450, pedestrians: 120 },
    { hour: "9AM", vehicles: 320, pedestrians: 95 },
    { hour: "10AM", vehicles: 180, pedestrians: 65 },
    { hour: "11AM", vehicles: 220, pedestrians: 80 },
    { hour: "12PM", vehicles: 380, pedestrians: 140 },
    { hour: "1PM", vehicles: 420, pedestrians: 160 },
    { hour: "2PM", vehicles: 350, pedestrians: 110 },
    { hour: "3PM", vehicles: 480, pedestrians: 180 },
    { hour: "4PM", vehicles: 520, pedestrians: 200 },
    { hour: "5PM", vehicles: 580, pedestrians: 220 },
    { hour: "6PM", vehicles: 460, pedestrians: 170 },
    { hour: "7PM", vehicles: 320, pedestrians: 120 },
    { hour: "8PM", vehicles: 240, pedestrians: 85 },
  ]

  const weeklyTrends = [
    { day: "Mon", efficiency: 85, congestion: 65 },
    { day: "Tue", efficiency: 88, congestion: 58 },
    { day: "Wed", efficiency: 82, congestion: 72 },
    { day: "Thu", efficiency: 90, congestion: 55 },
    { day: "Fri", efficiency: 78, congestion: 85 },
    { day: "Sat", efficiency: 92, congestion: 45 },
    { day: "Sun", efficiency: 95, congestion: 35 },
  ]

  const vehicleTypes = [
    { name: "Cars", value: 65, color: "hsl(var(--primary))" },
    { name: "Trucks", value: 15, color: "hsl(var(--accent))" },
    { name: "Motorcycles", value: 12, color: "hsl(var(--chart-2))" },
    { name: "Buses", value: 8, color: "hsl(var(--chart-3))" },
  ]

  const signalPerformance = [
    { intersection: "Main & 5th", efficiency: 92, avgWait: 35, throughput: 450 },
    { intersection: "Park & 2nd", efficiency: 88, avgWait: 42, throughput: 380 },
    { intersection: "Broadway & Oak", efficiency: 85, avgWait: 48, throughput: 320 },
    { intersection: "1st & Elm", efficiency: 90, avgWait: 38, throughput: 410 },
  ]

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Traffic Analytics</h2>
          <p className="text-muted-foreground">Comprehensive traffic flow analysis and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 7 Days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">87.2%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.4% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour Flow</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">580</div>
            <p className="text-xs text-muted-foreground">vehicles/hour at 5PM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">41s</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -8s from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
            <TrendingDown className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">15.3%</div>
            <p className="text-xs text-muted-foreground">vs traditional signals</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Traffic Flow</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle Types</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic Volume</CardTitle>
              <CardDescription>Vehicle and pedestrian count throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={hourlyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vehicles" fill="hsl(var(--primary))" name="Vehicles" />
                  <Bar dataKey="pedestrians" fill="hsl(var(--accent))" name="Pedestrians" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Efficiency Trends</CardTitle>
              <CardDescription>Signal efficiency vs congestion levels by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={weeklyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    stroke="hsl(var(--accent))"
                    strokeWidth={3}
                    name="Efficiency %"
                  />
                  <Line
                    type="monotone"
                    dataKey="congestion"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={3}
                    name="Congestion %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Type Distribution</CardTitle>
                <CardDescription>Breakdown of detected vehicle types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={vehicleTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {vehicleTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle Type Trends</CardTitle>
                <CardDescription>Daily averages and patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicleTypes.map((type, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: type.color }} />
                      <span className="font-medium">{type.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{type.value}%</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 1000) + 500} daily
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signal Performance Metrics</CardTitle>
              <CardDescription>Individual intersection efficiency and throughput</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signalPerformance.map((signal, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{signal.intersection}</h4>
                      <Badge
                        variant={
                          signal.efficiency > 90 ? "default" : signal.efficiency > 85 ? "secondary" : "destructive"
                        }
                      >
                        {signal.efficiency}% Efficient
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Avg Wait</p>
                        <p className="font-medium">{signal.avgWait}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Throughput</p>
                        <p className="font-medium">{signal.throughput}/hr</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-medium text-accent">Optimal</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
