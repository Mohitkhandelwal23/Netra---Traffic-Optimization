"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Settings,
  Database,
  Shield,
  Activity,
  Bell,
  Monitor,
  HardDrive,
  Wifi,
  AlertTriangle,
} from "lucide-react"

export function AdminPanel() {
  const [systemStatus, setSystemStatus] = useState({
    aiEngine: "online",
    database: "online",
    cameras: "online",
    signals: "online",
    network: "online",
  })

  const users = [
    { id: 1, name: "John Smith", role: "Admin", status: "active", lastLogin: "2 hours ago" },
    { id: 2, name: "Sarah Johnson", role: "Operator", status: "active", lastLogin: "1 hour ago" },
    { id: 3, name: "Mike Chen", role: "Analyst", status: "inactive", lastLogin: "2 days ago" },
    { id: 4, name: "Lisa Brown", role: "Operator", status: "active", lastLogin: "30 min ago" },
  ]

  const systemLogs = [
    { time: "15:23:45", level: "INFO", message: "Signal optimization completed for Main St corridor" },
    { time: "15:20:12", level: "WARN", message: "Camera CAM-003 experiencing intermittent connection" },
    { time: "15:18:33", level: "INFO", message: "Emergency vehicle cleared intersection INT-002" },
    { time: "15:15:07", level: "ERROR", message: "Failed to connect to signal controller SIG-007" },
    { time: "15:12:28", level: "INFO", message: "AI model updated with new training data" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-accent"
      case "offline":
        return "text-destructive"
      case "warning":
        return "text-chart-2"
      default:
        return "text-muted-foreground"
    }
  }

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "text-destructive"
      case "WARN":
        return "text-chart-2"
      case "INFO":
        return "text-primary"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                System Administration
              </CardTitle>
              <CardDescription>Manage users, system settings, and monitor performance</CardDescription>
            </div>
            <Badge variant="outline" className="text-accent">
              All Systems Operational
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Engine</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${getStatusColor(systemStatus.aiEngine)}`}>
                  {systemStatus.aiEngine.toUpperCase()}
                </div>
                <p className="text-xs text-muted-foreground">Processing 1.2k/sec</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${getStatusColor(systemStatus.database)}`}>
                  {systemStatus.database.toUpperCase()}
                </div>
                <p className="text-xs text-muted-foreground">98.7% uptime</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cameras</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${getStatusColor(systemStatus.cameras)}`}>
                  {systemStatus.cameras.toUpperCase()}
                </div>
                <p className="text-xs text-muted-foreground">24/26 active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Signals</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${getStatusColor(systemStatus.signals)}`}>
                  {systemStatus.signals.toUpperCase()}
                </div>
                <p className="text-xs text-muted-foreground">26/26 connected</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Network</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-lg font-bold ${getStatusColor(systemStatus.network)}`}>
                  {systemStatus.network.toUpperCase()}
                </div>
                <p className="text-xs text-muted-foreground">Low latency</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Backup System Data
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Run System Diagnostics
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Update AI Models
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Send System Alert
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemLogs.slice(0, 4).map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 text-sm">
                      <span className="text-muted-foreground font-mono">{log.time}</span>
                      <span className={`font-medium ${getLogLevelColor(log.level)}`}>{log.level}</span>
                      <span className="flex-1">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{user.lastLogin}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>CPU Usage</span>
                  <span className="font-medium">23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Memory Usage</span>
                  <span className="font-medium">67%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage</span>
                  <span className="font-medium">45% (2.1TB free)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Network I/O</span>
                  <span className="font-medium">1.2 Gbps</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Database Cleanup
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Restart Services
                </Button>
                <Button className="w-full justify-start" variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  System Reboot
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-optimization">Auto Optimization</Label>
                  <Switch id="auto-optimization" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="predictive-mode">Predictive Mode</Label>
                  <Switch id="predictive-mode" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency-override">Emergency Override</Label>
                  <Switch id="emergency-override" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confidence-threshold">Confidence Threshold</Label>
                  <Input id="confidence-threshold" type="number" defaultValue="85" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts">Email Alerts</Label>
                  <Switch id="email-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-alerts">SMS Alerts</Label>
                  <Switch id="sms-alerts" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-notifications">System Notifications</Label>
                  <Switch id="system-notifications" defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-email">Alert Email</Label>
                  <Input id="alert-email" type="email" defaultValue="admin@netra-ai.com" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Logs</CardTitle>
                <Button variant="outline" size="sm">
                  Export Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {systemLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-4 p-2 hover:bg-muted/50 rounded">
                    <span className="text-muted-foreground">{log.time}</span>
                    <span className={`font-medium min-w-[50px] ${getLogLevelColor(log.level)}`}>{log.level}</span>
                    <span className="flex-1">{log.message}</span>
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
