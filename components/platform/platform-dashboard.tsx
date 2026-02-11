"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Server,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  Shield,
  GitBranch,
  RefreshCw,
  Target,
} from "lucide-react"

interface PlatformDashboardProps {
  onQuickAction: (action: string) => void
}

export default function PlatformDashboard({ onQuickAction }: PlatformDashboardProps) {
  const [activeMetricTab, setActiveMetricTab] = useState("overview")

  const overviewMetrics = [
    {
      title: "TOTAL_SERVICES",
      value: "47",
      change: "+3 this week",
      trend: "up",
      icon: Server,
      color: "text-blue-600",
    },
    {
      title: "ACTIVE_TEAMS",
      value: "12",
      change: "+1 this month",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "DEPLOYMENTS_TODAY",
      value: "23",
      change: "+15%",
      trend: "up",
      icon: Zap,
      color: "text-posthog-orange",
    },
    {
      title: "PLATFORM_ADOPTION",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "DEV_SATISFACTION",
      value: "4.2/5",
      change: "+0.3",
      trend: "up",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "MTTR",
      value: "18 minutes",
      change: "-12%",
      trend: "down",
      icon: Clock,
      color: "text-red-600",
    },
  ]

  const productivityMetrics = [
    {
      title: "DEPLOYMENT_FREQUENCY",
      value: "4.2/day",
      change: "+23%",
      trend: "up",
      icon: GitBranch,
      color: "text-blue-600",
    },
    {
      title: "LEAD_TIME",
      value: "2.1 hours",
      change: "-15%",
      trend: "down",
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "CHANGE_FAILURE_RATE",
      value: "2.3%",
      change: "-0.8%",
      trend: "down",
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      title: "RECOVERY_TIME",
      value: "18 min",
      change: "-12%",
      trend: "down",
      icon: RefreshCw,
      color: "text-green-600",
    },
  ]

  const costMetrics = [
    {
      title: "MONTHLY_SPEND",
      value: "$24,567",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "text-red-600",
    },
    {
      title: "COST_PER_DEPLOY",
      value: "$12.34",
      change: "-15%",
      trend: "down",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "RESOURCE_UTILIZATION",
      value: "73%",
      change: "+5%",
      trend: "up",
      icon: Server,
      color: "text-blue-600",
    },
    {
      title: "WASTE_REDUCTION",
      value: "$3,421",
      change: "saved",
      trend: "up",
      icon: TrendingDown,
      color: "text-green-600",
    },
  ]

  const complianceMetrics = [
    {
      title: "SECURITY_SCORE",
      value: "94%",
      change: "+2%",
      trend: "up",
      icon: Shield,
      color: "text-green-600",
    },
    {
      title: "POLICY_VIOLATIONS",
      value: "3",
      change: "-7",
      trend: "down",
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      title: "COMPLIANCE_RATE",
      value: "98.2%",
      change: "+0.5%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "AUDIT_READINESS",
      value: "Ready",
      change: "100%",
      trend: "up",
      icon: Shield,
      color: "text-green-600",
    },
  ]

  const recentActivity = [
    {
      action: "payment-service deployed to production",
      user: "alice.smith",
      time: "2 minutes ago",
      status: "success",
    },
    {
      action: "infrastructure scaling completed",
      user: "platform-team",
      time: "5 minutes ago",
      status: "success",
    },
    {
      action: "security scan failed for auth-service",
      user: "security-bot",
      time: "12 minutes ago",
      status: "failed",
    },
    {
      action: "new service onboarded: notification-service",
      user: "bob.jones",
      time: "1 hour ago",
      status: "success",
    },
    {
      action: "cost optimization applied to staging",
      user: "platform-team",
      time: "2 hours ago",
      status: "success",
    },
  ]

  const topServices = [
    {
      name: "payment-service",
      team: "payments",
      health: "healthy",
      deployments: 23,
      lastDeploy: "2 min ago",
    },
    {
      name: "user-auth",
      team: "identity",
      health: "healthy",
      deployments: 18,
      lastDeploy: "1 hour ago",
    },
    {
      name: "notification-service",
      team: "messaging",
      health: "degraded",
      deployments: 12,
      lastDeploy: "3 hours ago",
    },
    {
      name: "api-gateway",
      team: "platform",
      health: "healthy",
      deployments: 8,
      lastDeploy: "6 hours ago",
    },
    {
      name: "data-pipeline",
      team: "analytics",
      health: "healthy",
      deployments: 15,
      lastDeploy: "12 hours ago",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    )
  }

  const getCurrentMetrics = () => {
    switch (activeMetricTab) {
      case "productivity":
        return productivityMetrics
      case "costs":
        return costMetrics
      case "compliance":
        return complianceMetrics
      default:
        return overviewMetrics
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-posthog-black font-mono">ENGINEERING_INSIGHTS</h1>
          <p className="text-sm text-posthog-gray font-mono">PLATFORM_ENGINEERING_METRICS_AND_INSIGHTS</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onQuickAction("refresh platform metrics")}
            variant="outline"
            size="sm"
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            REFRESH_METRICS
          </Button>
          <Button
            onClick={() => onQuickAction("optimize platform costs")}
            size="sm"
            className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
          >
            <Target className="h-4 w-4 mr-2" />
            OPTIMIZE_COSTS
          </Button>
        </div>
      </div>

      {/* Metrics Tabs */}
      <Tabs value={activeMetricTab} onValueChange={setActiveMetricTab} className="space-y-4">
        <TabsList className="bg-white border border-posthog-cream-dark">
          <TabsTrigger
            value="overview"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            OVERVIEW
          </TabsTrigger>
          <TabsTrigger
            value="productivity"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            PRODUCTIVITY
          </TabsTrigger>
          <TabsTrigger
            value="costs"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            COSTS
          </TabsTrigger>
          <TabsTrigger
            value="compliance"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            <Shield className="h-4 w-4 mr-2" />
            COMPLIANCE
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeMetricTab} className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getCurrentMetrics().map((metric, index) => (
              <Card key={index} className="border-posthog-cream-dark bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <metric.icon className={`h-4 w-4 ${metric.color}`} />
                      <span className="text-xs font-mono text-posthog-gray">{metric.title}</span>
                    </div>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-posthog-black font-mono">{metric.value}</span>
                    <span className="text-xs text-posthog-gray font-mono">{metric.change}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <Activity className="h-5 w-5 text-posthog-orange" />
              RECENT_ACTIVITY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono text-posthog-black truncate">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-posthog-gray font-mono">{activity.user}</span>
                    <span className="text-xs text-posthog-gray font-mono">•</span>
                    <span className="text-xs text-posthog-gray font-mono">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show all platform activity")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_ALL_ACTIVITY
            </Button>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <Server className="h-5 w-5 text-posthog-orange" />
              TOP_SERVICES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topServices.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                {getStatusIcon(service.health)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-medium text-posthog-black">{service.name}</span>
                    <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                      {service.team}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                    <span>{service.deployments} deploys</span>
                    <span>last: {service.lastDeploy}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show service catalog")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_SERVICE_CATALOG
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
