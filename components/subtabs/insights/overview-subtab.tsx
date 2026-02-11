import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Server,
  Zap,
  Clock,
  Activity,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Shield,
  Code,
  Database,
  GitBranch,
  Target,
  Brain,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Eye,
  FileText,
  Settings,
  Bot,
} from "lucide-react"

interface OverviewSubtabProps {
  onQuickAction: (command: string) => void
}

export const OverviewSubtab: React.FC<OverviewSubtabProps> = ({ onQuickAction }) => {
  // Key Performance Indicators
  const kpiMetrics = [
    {
      title: "Active Services",
      value: "24",
      subtitle: "99.2% Healthy",
      change: "↑ 2 new this week",
      trend: "up",
      icon: Server,
      color: "text-posthog-orange",
      bgColor: "bg-posthog-cream",
    },
    {
      title: "Actions Executed",
      value: "156",
      subtitle: "This Month",
      change: "↑ 23% vs last month",
      trend: "up",
      icon: Zap,
      color: "text-posthog-orange",
      bgColor: "bg-posthog-cream",
    },
    {
      title: "Infrastructure Cost",
      value: "$8.2K",
      subtitle: "15% ↓ vs Last Month",
      change: "AI saved $1.4K this month",
      trend: "down",
      icon: DollarSign,
      color: "text-posthog-orange",
      bgColor: "bg-posthog-cream",
    },
    {
      title: "Teams Active",
      value: "12",
      subtitle: "3 New This Week",
      change: "Platform adoption growing",
      trend: "up",
      icon: Users,
      color: "text-posthog-orange",
      bgColor: "bg-posthog-cream",
    },
  ]

  // AI Co-Pilot Insights
  const aiInsights = [
    "COST OPTIMIZATION: Reduce VM sizes for 15% cost savings",
    "PERFORMANCE: Scale user-auth service to 5 replicas",
    "SECURITY: Update payment-service to v2.1.1",
  ]

  // Engineering Insights Metrics
  const engineeringMetrics = [
    {
      category: "TEAM VELOCITY",
      metric: "Story Points",
      value: "47",
      trend: "↑ 12% vs last sprint",
      trendDirection: "up",
    },
    {
      category: "CODE QUALITY",
      metric: "Test Coverage",
      value: "87%",
      target: "Target: 90%",
      trendDirection: "neutral",
    },
    {
      category: "DEPLOYMENT",
      metric: "Lead Time",
      value: "2.3h",
      trend: "↓ 18% improvement",
      trendDirection: "down",
    },
    {
      category: "INCIDENT",
      metric: "MTTR",
      value: "15m",
      trend: "↓ 25% vs last month",
      trendDirection: "down",
    },
  ]

  // Service Health Overview
  const serviceHealth = [
    { name: "User Auth Service", health: "99.9%", status: "healthy" },
    { name: "Payment Service", health: "99.95%", status: "healthy" },
    { name: "Order Service", health: "95.2%", status: "warning" },
    { name: "Inventory Service", health: "87.1%", status: "critical" },
  ]

  // AI Co-Pilot Activity
  const aiActivity = [
    {
      type: "LATEST",
      action: "Scale user-auth to 5 replicas",
      time: "Executed 2 min ago",
      status: "SUCCESS",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      type: "COMPLETED",
      action: "Check payment-service health",
      time: "Completed 5 min ago",
      status: "INFO",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      type: "RECOMMENDATION",
      action: "Optimize database connection pool",
      time: "Based on performance data",
      status: "AI SUGGESTION",
      statusColor: "bg-posthog-cream text-posthog-orange",
    },
  ]

  // Recent Actions
  const recentActions = [
    { action: "Scaffold order-service", status: "COMPLETED 2 min ago", progress: null },
    { action: "Create PostgreSQL DB", status: "IN PROGRESS 75%", progress: 75 },
    { action: "Security Scan", status: "BLOCKED 2 issues", progress: null },
    { action: "Deploy to staging", status: "COMPLETED 1 hour ago", progress: null },
  ]

  // Recent Deployments
  const recentDeployments = [
    {
      service: "order-service v3.2.0",
      description: "Enhanced error handling",
      time: "2 hours ago",
      status: "✓ Production",
      statusColor: "text-green-600",
    },
    {
      service: "user-auth v2.1.5",
      description: "Security patches",
      time: "1 day ago",
      status: "✓ Production",
      statusColor: "text-green-600",
    },
    {
      service: "payment-service v2.1.0",
      description: "Health check timeout",
      time: "Failed",
      status: "Auto-rollback",
      statusColor: "text-red-600",
    },
  ]

  // Tech Radar
  const techRadar = [
    { tech: "Kafka Streams", status: "ADOPT", trend: "up" },
    { tech: "XML-RPC", status: "HOLD", trend: "down" },
    { tech: "GraphQL", status: "TRIAL", trend: "neutral" },
    { tech: "gRPC", status: "ADOPT", trend: "up" },
    { tech: "REST APIs", status: "ADOPT", trend: "neutral" },
  ]

  // Cost Insights
  const costInsights = [
    { category: "VM Instances", cost: "$4.2K", change: "↑ 8%", barWidth: 70 },
    { category: "Databases", cost: "$2.1K", change: "↓ 12%", barWidth: 35 },
    { category: "Storage", cost: "$1.9K", change: "→ 0%", barWidth: 32 },
  ]

  // Quick Actions
  const quickActions = [
    { name: "Scaffold New Service", icon: Code },
    { name: "Provision Database", icon: Database },
    { name: "Run Security Scan", icon: Shield },
    { name: "AI Copilot", icon: Bot },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      case "warning":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />
      case "critical":
        return <div className="w-2 h-2 bg-red-500 rounded-full" />
      default:
        return <div className="w-2 h-2 bg-posthog-gray rounded-full" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-3 w-3 text-green-600" />
      case "down":
        return <ArrowDown className="h-3 w-3 text-red-600" />
      default:
        return <Minus className="h-3 w-3 text-posthog-gray" />
    }
  }

  return (
    <div className="space-y-6 p-4">
      {/* Top Row - Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiMetrics.map((metric, index) => (
          <Card key={index} className="border-posthog-cream-dark bg-white relative overflow-hidden">
            <div className="absolute top-3 right-3">
              <div className={`w-3 h-3 rounded-full ${metric.bgColor}`} />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                <div>
                  <h3 className="text-sm font-mono text-posthog-gray">{metric.title}</h3>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-posthog-black font-mono">{metric.value}</div>
                <div className="text-sm text-posthog-gray font-mono">{metric.subtitle}</div>
                <div className="text-xs text-posthog-gray font-mono">{metric.change}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Co-Pilot Insights */}
      <Card className="border-posthog-cream-dark bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono text-posthog-black">AI Co-Pilot Insights</CardTitle>
              <p className="text-sm text-posthog-gray font-mono mt-1">Based on your platform activity, here are today's recommendations</p>
            </div>
            <Badge className="bg-posthog-orange text-white font-mono text-xs">3 Active Recommendations</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-posthog-cream rounded-lg">
                <Lightbulb className="h-4 w-4 text-posthog-orange mt-0.5 flex-shrink-0" />
                <span className="text-sm font-mono text-posthog-black">{insight}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engineering Insights */}
      <Card className="border-posthog-cream-dark bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-mono text-posthog-black">Engineering Insights</CardTitle>
              <p className="text-sm text-posthog-gray font-mono mt-1">Data-driven intelligence for engineering excellence and team productivity</p>
            </div>
            <Badge className="bg-posthog-orange text-white font-mono text-xs">12 Key Metrics</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {engineeringMetrics.map((metric, index) => (
              <div key={index} className="p-4 bg-posthog-cream rounded-lg">
                <div className="text-xs font-mono text-posthog-gray mb-1">{metric.category}</div>
                <div className="text-sm font-mono text-posthog-black mb-1">{metric.metric}</div>
                <div className="text-2xl font-bold text-posthog-black font-mono mb-1">{metric.value}</div>
                {metric.target && (
                  <div className="text-xs font-mono text-posthog-gray mb-1">{metric.target}</div>
                )}
                {metric.trend && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trendDirection)}
                    <span className="text-xs font-mono text-posthog-gray">{metric.trend}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Golden Path Adoption & Tech Debt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-posthog-cream rounded-lg">
              <div className="text-sm font-mono text-posthog-black mb-2">GOLDEN PATH ADOPTION</div>
              <div className="text-xs font-mono text-posthog-gray mb-2">78% of new services follow established patterns</div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="p-4 bg-posthog-cream rounded-lg">
              <div className="text-sm font-mono text-posthog-black mb-2">TECH DEBT</div>
              <div className="text-xs font-mono text-posthog-gray mb-2">Reduced by 23% through automated refactoring</div>
              <Progress value={77} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section - Three Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Service Health & AI Activity */}
        <div className="space-y-6">
          {/* Service Health Overview */}
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-posthog-black">Service Health Overview</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-mono text-posthog-gray">LIVE</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {serviceHealth.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <span className="text-sm font-mono text-posthog-black">{service.name}</span>
                  </div>
                  <span className="text-sm font-mono text-posthog-gray">{service.health}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-posthog-cream-dark">
                <div className="text-sm font-mono text-posthog-black">Overall Health Score: <span className="font-bold">95.5%</span></div>
              </div>
            </CardContent>
          </Card>

          {/* AI Co-Pilot Activity */}
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-posthog-black">AI Co-Pilot Activity</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-posthog-orange rounded-full" />
                  <span className="text-xs font-mono text-posthog-gray">ACTIVE</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {aiActivity.map((activity, index) => (
                <div key={index} className="p-3 bg-posthog-cream rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-posthog-gray">{activity.type}</span>
                    <Badge className={`text-xs font-mono ${activity.statusColor}`}>{activity.status}</Badge>
                  </div>
                  <div className="text-sm font-mono text-posthog-black mb-1">{activity.action}</div>
                  <div className="text-xs font-mono text-posthog-gray">{activity.time}</div>
                </div>
              ))}
              <div className="pt-3 border-t border-posthog-cream-dark">
                <div className="text-sm font-mono text-posthog-black">Commands Today: <span className="font-bold">23</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Column - Recent Actions & Deployments */}
        <div className="space-y-6">
          {/* Recent Actions */}
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-posthog-black">Recent Actions</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs font-mono text-posthog-gray">5 TODAY</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActions.map((action, index) => (
                <div key={index} className="p-3 bg-posthog-cream rounded-lg">
                  <div className="text-sm font-mono text-posthog-black mb-1">{action.action}</div>
                  <div className="text-xs font-mono text-posthog-gray">{action.status}</div>
                  {action.progress && (
                    <div className="mt-2">
                      <Progress value={action.progress} className="h-1" />
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-3 border-t border-posthog-cream-dark">
                <div className="text-sm font-mono text-posthog-black">Success Rate: <span className="font-bold">80%</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Deployments */}
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-posthog-black">Recent Deployments</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-mono text-posthog-gray">3 SUCCESS</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentDeployments.map((deployment, index) => (
                <div key={index} className="p-3 bg-posthog-cream rounded-lg">
                  <div className="text-sm font-mono text-posthog-black mb-1">{deployment.service}</div>
                  <div className="text-xs font-mono text-posthog-gray mb-1">{deployment.description}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-posthog-gray">{deployment.time}</span>
                    <span className={`text-xs font-mono ${deployment.statusColor}`}>{deployment.status}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-posthog-cream-dark">
                <div className="text-sm font-mono text-posthog-black">Deployment Success Rate: <span className="font-bold">85.7%</span></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tech Radar, Cost Insights & Quick Actions */}
        <div className="space-y-6">
          {/* Tech Radar */}
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-posthog-black">Tech Radar</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-posthog-orange rounded-full" />
                  <span className="text-xs font-mono text-posthog-gray">UPDATED</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {techRadar.map((tech, index) => (
                <div key={index} className="flex items-center justify-between p-2">
                  <span className="text-sm font-mono text-posthog-black">{tech.tech}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-posthog-gray">{tech.status}</span>
                    {getTrendIcon(tech.trend)}
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-posthog-cream-dark">
                <div className="text-sm font-mono text-posthog-black">Technologies Evaluated: <span className="font-bold">24</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Insights */}
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-mono text-posthog-black">Cost Insights</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs font-mono text-posthog-gray">OPTIMIZED</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {costInsights.map((cost, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-posthog-black">{cost.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-posthog-black">{cost.cost}</span>
                      <span className="text-xs font-mono text-posthog-gray">{cost.change}</span>
                    </div>
                  </div>
                  <div className="w-full bg-posthog-cream rounded-full h-2">
                    <div 
                      className="bg-posthog-orange h-2 rounded-full" 
                      style={{ width: `${cost.barWidth}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="p-3 bg-posthog-cream rounded-lg">
                <div className="text-xs font-mono text-posthog-gray mb-1">AI RECOMMENDATION</div>
                <div className="text-sm font-mono text-posthog-black">Optimize VM sizing for 15% cost reduction. Consider reserved instances for predictable workloads.</div>
              </div>
              <div className="pt-3 border-t border-posthog-cream-dark">
                <div className="text-sm font-mono text-posthog-black">Monthly Savings Potential: <span className="font-bold">$1.2K</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-mono text-posthog-black">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                  onClick={() => onQuickAction(action.name.toLowerCase())}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.name}
                </Button>
              ))}
              <div className="pt-3 border-t border-posthog-cream-dark">
                <div className="text-xs font-mono text-posthog-gray">Pro tip: Use AI Copilot for complex workflows</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 