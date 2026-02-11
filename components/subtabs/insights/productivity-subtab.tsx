import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, GitBranch, Clock, AlertCircle, RefreshCw, Activity, Users, Target, BarChart3, CheckCircle } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts'

interface ProductivitySubtabProps {
  onQuickAction: (command: string) => void
}

export const ProductivitySubtab: React.FC<ProductivitySubtabProps> = ({ onQuickAction }) => {
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

  const recentDeployments = [
    {
      service: "payment-service",
      team: "payments",
      status: "success",
      time: "2 minutes ago",
      duration: "3.2 min",
      changes: 12,
    },
    {
      service: "user-auth",
      team: "identity",
      status: "success",
      time: "15 minutes ago",
      duration: "2.8 min",
      changes: 8,
    },
    {
      service: "notification-service",
      team: "messaging",
      status: "failed",
      time: "1 hour ago",
      duration: "1.5 min",
      changes: 15,
    },
    {
      service: "api-gateway",
      team: "platform",
      status: "success",
      time: "2 hours ago",
      duration: "4.1 min",
      changes: 6,
    },
  ]

  const teamPerformance = [
    {
      team: "payments",
      velocity: "high",
      deployments: 23,
      avgLeadTime: "1.8h",
      failureRate: "1.2%",
    },
    {
      team: "identity",
      velocity: "medium",
      deployments: 18,
      avgLeadTime: "2.4h",
      failureRate: "2.1%",
    },
    {
      team: "messaging",
      velocity: "low",
      deployments: 12,
      avgLeadTime: "3.2h",
      failureRate: "4.3%",
    },
    {
      team: "platform",
      velocity: "high",
      deployments: 31,
      avgLeadTime: "1.5h",
      failureRate: "0.8%",
    },
  ]

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getVelocityColor = (velocity: string) => {
    switch (velocity) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-posthog-gray"
    }
  }

  // Trend data for charts
  const deploymentFrequencyData = [
    { date: 'Week 1', value: 3.2 },
    { date: 'Week 2', value: 3.5 },
    { date: 'Week 3', value: 3.8 },
    { date: 'Week 4', value: 4.0 },
    { date: 'Week 5', value: 4.1 },
    { date: 'Week 6', value: 4.2 },
  ]

  const leadTimeData = [
    { date: 'Week 1', value: 2.8 },
    { date: 'Week 2', value: 2.6 },
    { date: 'Week 3', value: 2.4 },
    { date: 'Week 4', value: 2.3 },
    { date: 'Week 5', value: 2.2 },
    { date: 'Week 6', value: 2.1 },
  ]

  const changeFailureRateData = [
    { date: 'Week 1', value: 3.5 },
    { date: 'Week 2', value: 3.2 },
    { date: 'Week 3', value: 2.9 },
    { date: 'Week 4', value: 2.7 },
    { date: 'Week 5', value: 2.5 },
    { date: 'Week 6', value: 2.3 },
  ]

  const recoveryTimeData = [
    { date: 'Week 1', value: 25 },
    { date: 'Week 2', value: 23 },
    { date: 'Week 3', value: 21 },
    { date: 'Week 4', value: 20 },
    { date: 'Week 5', value: 19 },
    { date: 'Week 6', value: 18 },
  ]

  const chartConfig = {
    value: {
      label: 'Value',
      color: '#f97316', // posthog-orange
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-posthog-black font-mono">PRODUCTIVITY_METRICS</h1>
          <p className="text-sm text-posthog-gray font-mono">DEVELOPER_PRODUCTIVITY_AND_WORKFLOW_EFFICIENCY</p>
        </div>
      </div>

      {/* Productivity Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productivityMetrics.map((metric, index) => (
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

      {/* Trend Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deployment Frequency Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <GitBranch className="h-5 w-5 text-posthog-orange" />
              DEPLOYMENT_FREQUENCY_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={deploymentFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: '#f97316', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Lead Time Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <Clock className="h-5 w-5 text-posthog-orange" />
              LEAD_TIME_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={leadTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Change Failure Rate Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <AlertCircle className="h-5 w-5 text-posthog-orange" />
              CHANGE_FAILURE_RATE_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={changeFailureRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#eab308" 
                  strokeWidth={2}
                  dot={{ fill: '#eab308', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recovery Time Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <RefreshCw className="h-5 w-5 text-posthog-orange" />
              RECOVERY_TIME_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={recoveryTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deployments */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <Activity className="h-5 w-5 text-posthog-orange" />
              RECENT_DEPLOYMENTS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDeployments.map((deployment, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                {getStatusIcon(deployment.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-medium text-posthog-black">{deployment.service}</span>
                    <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                      {deployment.team}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                    <span>{deployment.duration}</span>
                    <span>{deployment.changes} changes</span>
                    <span>{deployment.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show deployment history")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_DEPLOYMENT_HISTORY
            </Button>
          </CardContent>
        </Card>

        {/* Team Performance */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <Users className="h-5 w-5 text-posthog-orange" />
              TEAM_PERFORMANCE
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamPerformance.map((team, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-medium text-posthog-black">{team.team}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${getVelocityColor(team.velocity)} border-current`}
                    >
                      {team.velocity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                    <span>{team.deployments} deploys</span>
                    <span>avg: {team.avgLeadTime}</span>
                    <span>fail: {team.failureRate}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show team productivity report")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_TEAM_REPORT
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 