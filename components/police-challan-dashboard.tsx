"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Car,
  MapPin,
  IndianRupee,
  Clock,
  CheckCircle,
  BarChart3,
  Search,
  Download,
  Eye,
  Edit,
  Camera,
  Shield,
} from "lucide-react"

interface Violation {
  id: string
  vehicleNumber: string
  violationType: string
  location: string
  timestamp: string
  fineAmount: number
  status: "pending" | "paid" | "disputed" | "cancelled"
  officerId: string
  evidence: string[]
  confidence: number
}

interface Junction {
  id: string
  name: string
  location: string
  activeViolations: number
  totalToday: number
  revenue: number
  status: "active" | "maintenance" | "offline"
}

export function PoliceChallanDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [violations, setViolations] = useState<Violation[]>([])
  const [junctions, setJunctions] = useState<Junction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedJunction, setSelectedJunction] = useState("all")

  // Mock data initialization
  useEffect(() => {
    // Mock violations data
    const mockViolations: Violation[] = [
      {
        id: "CH001",
        vehicleNumber: "MH12AB1234",
        violationType: "Red Light Violation",
        location: "Bandra Junction",
        timestamp: "2024-01-15 14:30:25",
        fineAmount: 1000,
        status: "pending",
        officerId: "OFF001",
        evidence: ["camera1_img1.jpg", "camera2_img1.jpg"],
        confidence: 95,
      },
      {
        id: "CH002",
        vehicleNumber: "DL08CA5678",
        violationType: "No Helmet",
        location: "Andheri Signal",
        timestamp: "2024-01-15 15:45:12",
        fineAmount: 500,
        status: "paid",
        officerId: "OFF002",
        evidence: ["camera3_img1.jpg"],
        confidence: 88,
      },
      {
        id: "CH003",
        vehicleNumber: "KA03BB9876",
        violationType: "Wrong Lane",
        location: "Worli Junction",
        timestamp: "2024-01-15 16:20:45",
        fineAmount: 750,
        status: "disputed",
        officerId: "OFF001",
        evidence: ["camera4_img1.jpg", "camera4_img2.jpg"],
        confidence: 92,
      },
      {
        id: "CH004",
        vehicleNumber: "TN09CC4321",
        violationType: "Overspeeding",
        location: "Marine Drive",
        timestamp: "2024-01-15 17:10:30",
        fineAmount: 2000,
        status: "pending",
        officerId: "OFF003",
        evidence: ["speed_camera1.jpg"],
        confidence: 97,
      },
      {
        id: "CH005",
        vehicleNumber: "GJ01DD8765",
        violationType: "Signal Jump",
        location: "Dadar Junction",
        timestamp: "2024-01-15 18:05:15",
        fineAmount: 1500,
        status: "paid",
        officerId: "OFF002",
        evidence: ["camera5_img1.jpg"],
        confidence: 94,
      },
    ]

    // Mock junctions data
    const mockJunctions: Junction[] = [
      {
        id: "J001",
        name: "Bandra Junction",
        location: "Bandra West, Mumbai",
        activeViolations: 12,
        totalToday: 45,
        revenue: 67500,
        status: "active",
      },
      {
        id: "J002",
        name: "Andheri Signal",
        location: "Andheri East, Mumbai",
        activeViolations: 8,
        totalToday: 32,
        revenue: 48000,
        status: "active",
      },
      {
        id: "J003",
        name: "Worli Junction",
        location: "Worli, Mumbai",
        activeViolations: 15,
        totalToday: 58,
        revenue: 89250,
        status: "active",
      },
      {
        id: "J004",
        name: "Marine Drive Signal",
        location: "Marine Drive, Mumbai",
        activeViolations: 6,
        totalToday: 28,
        revenue: 42000,
        status: "maintenance",
      },
      {
        id: "J005",
        name: "Dadar Junction",
        location: "Dadar West, Mumbai",
        activeViolations: 20,
        totalToday: 72,
        revenue: 108000,
        status: "active",
      },
    ]

    setViolations(mockViolations)
    setJunctions(mockJunctions)
  }, [])

  // Filter violations based on search and filters
  const filteredViolations = violations.filter((violation) => {
    const matchesSearch =
      violation.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.violationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || violation.status === statusFilter
    const matchesJunction = selectedJunction === "all" || violation.location.includes(selectedJunction)

    return matchesSearch && matchesStatus && matchesJunction
  })

  // Calculate summary statistics
  const totalViolations = violations.length
  const pendingViolations = violations.filter((v) => v.status === "pending").length
  const paidViolations = violations.filter((v) => v.status === "paid").length
  const totalRevenue = violations.filter((v) => v.status === "paid").reduce((sum, v) => sum + v.fineAmount, 0)
  const activeJunctions = junctions.filter((j) => j.status === "active").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "paid":
        return <Badge className="bg-green-500 text-white">Paid</Badge>
      case "disputed":
        return <Badge variant="destructive">Disputed</Badge>
      case "cancelled":
        return <Badge variant="outline">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const updateViolationStatus = (violationId: string, newStatus: string) => {
    setViolations((prev) => prev.map((v) => (v.id === violationId ? { ...v, status: newStatus as any } : v)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Police E-Challan System</h2>
          <p className="text-muted-foreground">Centralized violation management and enforcement</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Emergency Override
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="junctions">Junctions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Violations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{totalViolations}</div>
                <p className="text-xs text-muted-foreground">Today</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{pendingViolations}</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{paidViolations}</div>
                <p className="text-xs text-muted-foreground">Completed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Today's collection</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Junctions</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{activeJunctions}</div>
                <p className="text-xs text-muted-foreground">Monitoring</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Violations */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Violations</CardTitle>
              <CardDescription>Latest violations detected by AI system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {violations.slice(0, 5).map((violation) => (
                  <div key={violation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                        <Car className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{violation.vehicleNumber}</p>
                        <p className="text-sm text-muted-foreground">{violation.violationType}</p>
                        <p className="text-xs text-muted-foreground">
                          {violation.location} • {violation.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">₹{violation.fineAmount}</p>
                        <p className="text-xs text-muted-foreground">{violation.confidence}% confidence</p>
                      </div>
                      {getStatusBadge(violation.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Violations Tab */}
        <TabsContent value="violations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by vehicle number, violation type, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedJunction} onValueChange={setSelectedJunction}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by junction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Junctions</SelectItem>
                    {junctions.map((junction) => (
                      <SelectItem key={junction.id} value={junction.name}>
                        {junction.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Violations Table */}
          <Card>
            <CardHeader>
              <CardTitle>Violation Records</CardTitle>
              <CardDescription>Manage and track all traffic violations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Challan ID</TableHead>
                    <TableHead>Vehicle Number</TableHead>
                    <TableHead>Violation Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Fine Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredViolations.map((violation) => (
                    <TableRow key={violation.id}>
                      <TableCell className="font-medium">{violation.id}</TableCell>
                      <TableCell>{violation.vehicleNumber}</TableCell>
                      <TableCell>{violation.violationType}</TableCell>
                      <TableCell>{violation.location}</TableCell>
                      <TableCell>{violation.timestamp}</TableCell>
                      <TableCell>₹{violation.fineAmount}</TableCell>
                      <TableCell>{getStatusBadge(violation.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select
                            value={violation.status}
                            onValueChange={(value) => updateViolationStatus(violation.id, value)}
                          >
                            <SelectTrigger className="w-[100px] h-8">
                              <Edit className="h-4 w-4" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="disputed">Disputed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Junctions Tab */}
        <TabsContent value="junctions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {junctions.map((junction) => (
              <Card key={junction.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {junction.name}
                    <Badge variant={junction.status === "active" ? "default" : "secondary"}>{junction.status}</Badge>
                  </CardTitle>
                  <CardDescription>{junction.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Violations</p>
                      <p className="text-2xl font-bold text-orange-500">{junction.activeViolations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Today</p>
                      <p className="text-2xl font-bold text-primary">{junction.totalToday}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Today</p>
                    <p className="text-xl font-bold text-green-600">₹{junction.revenue.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Camera className="h-4 w-4 mr-2" />
                      View Cameras
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Violation Types Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Violation Types Distribution</CardTitle>
                <CardDescription>Most common violations detected</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Red Light Violation</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={45} className="w-24" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overspeeding</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={30} className="w-24" />
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">No Helmet</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={15} className="w-24" />
                      <span className="text-sm font-medium">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Wrong Lane</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={10} className="w-24" />
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Collection</CardTitle>
                <CardDescription>Daily revenue from fines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Today</span>
                    <span className="text-lg font-bold text-green-600">₹{totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Yesterday</span>
                    <span className="text-lg font-bold">₹2,45,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="text-lg font-bold">₹18,75,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="text-lg font-bold">₹75,20,000</span>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Collection Rate</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={78} className="w-24" />
                        <span className="text-sm font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hotspot Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Violation Hotspots</CardTitle>
                <CardDescription>Areas with highest violation rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {junctions
                    .sort((a, b) => b.totalToday - a.totalToday)
                    .slice(0, 5)
                    .map((junction, index) => (
                      <div
                        key={junction.id}
                        className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{junction.name}</p>
                            <p className="text-xs text-muted-foreground">{junction.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{junction.totalToday}</p>
                          <p className="text-xs text-muted-foreground">violations</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>AI detection and processing metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Detection Accuracy</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={94} className="w-24" />
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Processing Speed</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={87} className="w-24" />
                      <span className="text-sm font-medium">87ms avg</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Uptime</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={99} className="w-24" />
                      <span className="text-sm font-medium">99.8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">False Positives</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={6} className="w-24" />
                      <span className="text-sm font-medium">6%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
