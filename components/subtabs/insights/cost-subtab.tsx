import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, DollarSign, Target, Server, Activity, BarChart3, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, AreaChart, Area } from 'recharts'

interface CostSubtabProps {
  onQuickAction: (command: string) => void
}

export const CostSubtab: React.FC<CostSubtabProps> = ({ onQuickAction }) => {
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

  const costAlerts = [
    {
      service: "staging-cluster",
      type: "high",
      message: "Resource usage 85% above threshold",
      cost: "$2,340",
      time: "1 hour ago",
    },
    {
      service: "analytics-pipeline",
      type: "medium",
      message: "Unused resources detected",
      cost: "$890",
      time: "3 hours ago",
    },
    {
      service: "backup-storage",
      type: "low",
      message: "Storage costs increased 12%",
      cost: "$456",
      time: "6 hours ago",
    },
  ]

  const serviceCosts = [
    {
      service: "compute-cluster",
      team: "platform",
      monthlyCost: "$8,234",
      change: "+12%",
      utilization: "78%",
      status: "optimized",
    },
    {
      service: "database-instances",
      team: "data",
      monthlyCost: "$5,678",
      change: "-8%",
      utilization: "92%",
      status: "efficient",
    },
    {
      service: "storage-buckets",
      team: "infrastructure",
      monthlyCost: "$3,456",
      change: "+5%",
      utilization: "65%",
      status: "warning",
    },
    {
      service: "monitoring-stack",
      team: "platform",
      monthlyCost: "$2,123",
      change: "+2%",
      utilization: "88%",
      status: "optimized",
    },
  ]

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "low":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimized":
        return "text-green-600"
      case "efficient":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      default:
        return "text-posthog-gray"
    }
  }

  // Trend data for charts
  const monthlySpendData = [
    { date: 'Jan', value: 22000 },
    { date: 'Feb', value: 22800 },
    { date: 'Mar', value: 23200 },
    { date: 'Apr', value: 23800 },
    { date: 'May', value: 24200 },
    { date: 'Jun', value: 24567 },
  ]

  const costPerDeployData = [
    { date: 'Week 1', value: 14.5 },
    { date: 'Week 2', value: 13.8 },
    { date: 'Week 3', value: 13.2 },
    { date: 'Week 4', value: 12.9 },
    { date: 'Week 5', value: 12.6 },
    { date: 'Week 6', value: 12.34 },
  ]

  const resourceUtilizationData = [
    { date: 'Week 1', value: 68 },
    { date: 'Week 2', value: 70 },
    { date: 'Week 3', value: 71 },
    { date: 'Week 4', value: 72 },
    { date: 'Week 5', value: 72.5 },
    { date: 'Week 6', value: 73 },
  ]

  const wasteReductionData = [
    { date: 'Jan', value: 0 },
    { date: 'Feb', value: 1200 },
    { date: 'Mar', value: 2100 },
    { date: 'Apr', value: 2800 },
    { date: 'May', value: 3200 },
    { date: 'Jun', value: 3421 },
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
          <h1 className="text-2xl font-bold text-posthog-black font-mono">COST_ANALYSIS</h1>
          <p className="text-sm text-posthog-gray font-mono">PLATFORM_COST_OPTIMIZATION_AND_RESOURCE_MANAGEMENT</p>
        </div>
      </div>

      {/* Cost Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {costMetrics.map((metric, index) => (
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
        {/* Monthly Spend Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <DollarSign className="h-5 w-5 text-posthog-orange" />
              MONTHLY_SPEND_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <AreaChart data={monthlySpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spend']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  fill="#ef4444"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cost Per Deploy Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <Target className="h-5 w-5 text-posthog-orange" />
              COST_PER_DEPLOY_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={costPerDeployData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                  tickFormatter={(value) => `$${value.toFixed(1)}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                />
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

        {/* Resource Utilization Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <Server className="h-5 w-5 text-posthog-orange" />
              RESOURCE_UTILIZATION_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <AreaChart data={resourceUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`${value}%`, 'Utilization']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Waste Reduction Trend */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <TrendingDown className="h-5 w-5 text-posthog-orange" />
              WASTE_REDUCTION_TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <AreaChart data={wasteReductionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                />
                <YAxis 
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickLine={{ stroke: '#ddd' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Saved']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Alerts */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <AlertTriangle className="h-5 w-5 text-posthog-orange" />
              COST_ALERTS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {costAlerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                {getAlertIcon(alert.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-medium text-posthog-black">{alert.service}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${alert.type === 'high' ? 'border-red-600 text-red-600' : alert.type === 'medium' ? 'border-yellow-600 text-yellow-600' : 'border-blue-600 text-blue-600'}`}
                    >
                      {alert.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                    <span className="truncate">{alert.message}</span>
                    <span>{alert.cost}</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show cost optimization recommendations")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_OPTIMIZATION_TIPS
            </Button>
          </CardContent>
        </Card>

        {/* Service Costs */}
        <Card className="border-posthog-cream-dark bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
              <BarChart3 className="h-5 w-5 text-posthog-orange" />
              SERVICE_COSTS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {serviceCosts.map((service, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-posthog-cream rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-medium text-posthog-black">{service.service}</span>
                    <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                      {service.team}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                    <span>{service.monthlyCost}</span>
                    <span className={service.change.startsWith('+') ? 'text-red-600' : 'text-green-600'}>
                      {service.change}
                    </span>
                    <span>{service.utilization} util</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${getStatusColor(service.status)} border-current`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => onQuickAction("show detailed cost breakdown")}
              variant="outline"
              size="sm"
              className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
            >
              VIEW_COST_BREAKDOWN
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 