import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Target,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  Shield,
  Code,
  Server,
  Database,
  GitBranch,
  Activity,
  Users,
  Zap,
  BarChart3,
  Settings,
  Edit3,
  Play,
  Bot,
  ArrowRight,
  Filter,
  Search
} from "lucide-react"
import { Input } from '@/components/ui/input'

interface ScorecardSubtabProps {
  onQuickAction: (command: string) => void
}

type ScorecardLevel = 'bronze' | 'silver' | 'gold' | 'platinum'
type ScorecardStatus = 'passing' | 'degraded' | 'failing' | 'pending'

interface Scorecard {
  id: string
  name: string
  description: string
  category: 'quality' | 'security' | 'compliance' | 'velocity' | 'reliability'
  currentLevel: ScorecardLevel
  targetLevel: ScorecardLevel
  targetDate: string
  progress: number
  status: ScorecardStatus
  score: number
  totalChecks: number
  passingChecks: number
  failingChecks: number
  pendingChecks: number
  checks: Array<{
    id: string
    name: string
    description: string
    status: 'pass' | 'fail' | 'pending'
    lastChecked: string
    autoFixable: boolean
  }>
  trend: 'up' | 'down' | 'stable'
  trendValue: string
  lastUpdated: string
  owner: string
  selfHealing: boolean
}

export const ScorecardSubtab: React.FC<ScorecardSubtabProps> = ({ onQuickAction }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const scorecards: Scorecard[] = [
    {
      id: "service-quality",
      name: "Service Quality Standards",
      description: "Ensures all services meet quality benchmarks for reliability, performance, and maintainability",
      category: "quality",
      currentLevel: "silver",
      targetLevel: "gold",
      targetDate: "2024-03-15",
      progress: 75,
      status: "passing",
      score: 85,
      totalChecks: 12,
      passingChecks: 10,
      failingChecks: 1,
      pendingChecks: 1,
      checks: [
        { id: "1", name: "Uptime > 99.9%", description: "Service maintains 99.9% uptime", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "2", name: "Response Time < 200ms", description: "P95 response time under 200ms", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "3", name: "Error Rate < 0.1%", description: "Error rate below 0.1%", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "4", name: "Test Coverage > 80%", description: "Code coverage above 80%", status: "fail", lastChecked: "2024-01-20", autoFixable: false },
        { id: "5", name: "Documentation Complete", description: "API and service documentation up to date", status: "pending", lastChecked: "2024-01-19", autoFixable: false },
      ],
      trend: "up",
      trendValue: "+5%",
      lastUpdated: "2 hours ago",
      owner: "Platform Team",
      selfHealing: true
    },
    {
      id: "security-compliance",
      name: "Security & Compliance",
      description: "Validates security best practices and compliance with industry standards",
      category: "security",
      currentLevel: "gold",
      targetLevel: "platinum",
      targetDate: "2024-04-01",
      progress: 90,
      status: "passing",
      score: 92,
      totalChecks: 15,
      passingChecks: 14,
      failingChecks: 0,
      pendingChecks: 1,
      checks: [
        { id: "1", name: "Vulnerability Scanning", description: "No critical vulnerabilities", status: "pass", lastChecked: "2024-01-20", autoFixable: true },
        { id: "2", name: "Dependency Updates", description: "All dependencies up to date", status: "pass", lastChecked: "2024-01-20", autoFixable: true },
        { id: "3", name: "Secrets Management", description: "No hardcoded secrets", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "4", name: "Encryption at Rest", description: "Data encrypted at rest", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "5", name: "SOC2 Compliance", description: "SOC2 Type II certified", status: "pending", lastChecked: "2024-01-19", autoFixable: false },
      ],
      trend: "stable",
      trendValue: "0%",
      lastUpdated: "1 hour ago",
      owner: "Security Team",
      selfHealing: true
    },
    {
      id: "deployment-velocity",
      name: "Deployment Velocity",
      description: "Measures deployment frequency, lead time, and change failure rate",
      category: "velocity",
      currentLevel: "bronze",
      targetLevel: "silver",
      targetDate: "2024-02-28",
      progress: 60,
      status: "degraded",
      score: 68,
      totalChecks: 8,
      passingChecks: 5,
      failingChecks: 2,
      pendingChecks: 1,
      checks: [
        { id: "1", name: "Deployment Frequency > 1/day", description: "At least one deployment per day", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "2", name: "Lead Time < 2 hours", description: "Time from commit to deploy under 2 hours", status: "fail", lastChecked: "2024-01-20", autoFixable: false },
        { id: "3", name: "Change Failure Rate < 5%", description: "Deployment failure rate below 5%", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "4", name: "Automated Testing", description: "All tests automated in CI/CD", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "5", name: "Rollback Capability", description: "Automated rollback available", status: "fail", lastChecked: "2024-01-20", autoFixable: true },
      ],
      trend: "down",
      trendValue: "-3%",
      lastUpdated: "3 hours ago",
      owner: "DevOps Team",
      selfHealing: false
    },
    {
      id: "reliability-standards",
      name: "Reliability Standards",
      description: "Ensures services meet reliability and resilience requirements",
      category: "reliability",
      currentLevel: "silver",
      targetLevel: "gold",
      targetDate: "2024-03-20",
      progress: 70,
      status: "passing",
      score: 78,
      totalChecks: 10,
      passingChecks: 8,
      failingChecks: 1,
      pendingChecks: 1,
      checks: [
        { id: "1", name: "Health Checks Configured", description: "Health endpoints implemented", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "2", name: "Circuit Breakers", description: "Circuit breakers implemented", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "3", name: "Retry Logic", description: "Retry mechanisms in place", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "4", name: "Graceful Degradation", description: "Fallback mechanisms available", status: "fail", lastChecked: "2024-01-20", autoFixable: false },
        { id: "5", name: "Monitoring & Alerting", description: "Comprehensive monitoring setup", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
      ],
      trend: "up",
      trendValue: "+2%",
      lastUpdated: "4 hours ago",
      owner: "SRE Team",
      selfHealing: true
    },
    {
      id: "code-quality",
      name: "Code Quality Standards",
      description: "Validates code quality, maintainability, and best practices",
      category: "quality",
      currentLevel: "bronze",
      targetLevel: "silver",
      targetDate: "2024-02-15",
      progress: 55,
      status: "degraded",
      score: 62,
      totalChecks: 9,
      passingChecks: 5,
      failingChecks: 3,
      pendingChecks: 1,
      checks: [
        { id: "1", name: "Code Review Required", description: "All PRs require code review", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "2", name: "Linting Passes", description: "No linting errors", status: "pass", lastChecked: "2024-01-20", autoFixable: true },
        { id: "3", name: "Type Safety", description: "TypeScript strict mode enabled", status: "fail", lastChecked: "2024-01-20", autoFixable: false },
        { id: "4", name: "Code Complexity", description: "Cyclomatic complexity < 10", status: "fail", lastChecked: "2024-01-20", autoFixable: false },
        { id: "5", name: "Documentation", description: "README and inline docs present", status: "pending", lastChecked: "2024-01-19", autoFixable: false },
      ],
      trend: "up",
      trendValue: "+4%",
      lastUpdated: "5 hours ago",
      owner: "Engineering Team",
      selfHealing: false
    },
    {
      id: "data-compliance",
      name: "Data Compliance",
      description: "Ensures compliance with data protection regulations (GDPR, CCPA)",
      category: "compliance",
      currentLevel: "gold",
      targetLevel: "platinum",
      targetDate: "2024-05-01",
      progress: 88,
      status: "passing",
      score: 90,
      totalChecks: 12,
      passingChecks: 11,
      failingChecks: 0,
      pendingChecks: 1,
      checks: [
        { id: "1", name: "Data Encryption", description: "All sensitive data encrypted", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "2", name: "Access Controls", description: "RBAC properly configured", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "3", name: "Audit Logging", description: "All data access logged", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "4", name: "Data Retention Policy", description: "Retention policies enforced", status: "pass", lastChecked: "2024-01-20", autoFixable: false },
        { id: "5", name: "GDPR Compliance", description: "GDPR requirements met", status: "pending", lastChecked: "2024-01-19", autoFixable: false },
      ],
      trend: "stable",
      trendValue: "0%",
      lastUpdated: "1 hour ago",
      owner: "Compliance Team",
      selfHealing: false
    }
  ]

  const getLevelColor = (level: ScorecardLevel) => {
    switch (level) {
      case 'platinum': return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'bronze': return 'bg-orange-100 text-orange-800 border-orange-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getStatusColor = (status: ScorecardStatus) => {
    switch (status) {
      case 'passing': return 'text-green-600'
      case 'degraded': return 'text-yellow-600'
      case 'failing': return 'text-red-600'
      case 'pending': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: ScorecardStatus) => {
    switch (status) {
      case 'passing': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'failing': return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending': return <Clock className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'quality': return <Code className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'compliance': return <CheckCircle className="h-4 w-4" />
      case 'velocity': return <Zap className="h-4 w-4" />
      case 'reliability': return <Activity className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const filteredScorecards = scorecards.filter(scorecard => {
    const matchesSearch = scorecard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scorecard.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || scorecard.category === selectedCategory
    const matchesLevel = selectedLevel === "all" || scorecard.currentLevel === selectedLevel
    const matchesStatus = selectedStatus === "all" || scorecard.status === selectedStatus
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus
  })

  const categories = ["all", "quality", "security", "compliance", "velocity", "reliability"]
  const levels: ScorecardLevel[] = ["bronze", "silver", "gold", "platinum"]
  const statuses: ScorecardStatus[] = ["passing", "degraded", "failing", "pending"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-posthog-black font-mono">SCORECARDS</h1>
          <p className="text-sm text-posthog-gray font-mono">DEFINE_SOFTWARE_STANDARDS_AND_TRACK_COMPLIANCE</p>
        </div>
        <Button
          onClick={() => onQuickAction("create scorecard")}
          className="bg-posthog-orange hover:bg-posthog-orange/90 text-white font-mono text-xs"
        >
          <Target className="h-4 w-4 mr-2" />
          CREATE_SCORECARD
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-posthog-cream-dark bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-posthog-gray" />
              <Input
                placeholder="SEARCH_SCORECARDS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-posthog-cream-dark font-mono text-sm"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-posthog-cream-dark rounded px-3 py-2 font-mono text-sm bg-white"
            >
              <option value="all">ALL_CATEGORIES</option>
              {categories.filter(c => c !== "all").map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border border-posthog-cream-dark rounded px-3 py-2 font-mono text-sm bg-white"
            >
              <option value="all">ALL_LEVELS</option>
              {levels.map(level => (
                <option key={level} value={level}>{level.toUpperCase()}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-posthog-cream-dark rounded px-3 py-2 font-mono text-sm bg-white"
            >
              <option value="all">ALL_STATUS</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScorecards.map((scorecard) => (
          <Card key={scorecard.id} className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(scorecard.category)}
                  <CardTitle className="font-mono text-sm text-posthog-black">
                    {scorecard.name}
                  </CardTitle>
                </div>
                {getStatusIcon(scorecard.status)}
              </div>
              <p className="text-xs text-posthog-gray font-mono line-clamp-2">
                {scorecard.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Level Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={`font-mono text-xs border ${getLevelColor(scorecard.currentLevel)}`}>
                    {scorecard.currentLevel.toUpperCase()}
                  </Badge>
                  <ArrowRight className="h-3 w-3 text-posthog-gray" />
                  <Badge className={`font-mono text-xs border ${getLevelColor(scorecard.targetLevel)}`}>
                    {scorecard.targetLevel.toUpperCase()}
                  </Badge>
                </div>
                {scorecard.selfHealing && (
                  <Badge variant="outline" className="font-mono text-xs border-green-600 text-green-600">
                    <Bot className="h-3 w-3 mr-1" />
                    AUTO-HEAL
                  </Badge>
                )}
              </div>

              {/* Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-posthog-gray">SCORE</span>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${getStatusColor(scorecard.status)}`}>
                      {scorecard.score}/100
                    </span>
                    {scorecard.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : scorecard.trend === "down" ? (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    ) : null}
                    <span className={`text-xs ${scorecard.trend === "up" ? "text-green-600" : scorecard.trend === "down" ? "text-red-600" : "text-posthog-gray"}`}>
                      {scorecard.trendValue}
                    </span>
                  </div>
                </div>
                <Progress value={scorecard.progress} className="h-2" />
              </div>

              {/* Checks Summary */}
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2 bg-green-50 rounded text-center">
                  <div className="text-green-600 font-bold">{scorecard.passingChecks}</div>
                  <div className="text-green-700">PASS</div>
                </div>
                <div className="p-2 bg-red-50 rounded text-center">
                  <div className="text-red-600 font-bold">{scorecard.failingChecks}</div>
                  <div className="text-red-700">FAIL</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded text-center">
                  <div className="text-yellow-600 font-bold">{scorecard.pendingChecks}</div>
                  <div className="text-yellow-700">PENDING</div>
                </div>
              </div>

              {/* Target Date */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1 text-posthog-gray">
                  <Calendar className="h-3 w-3" />
                  <span>TARGET:</span>
                </div>
                <span className="text-posthog-black">{scorecard.targetDate}</span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-posthog-cream-dark">
                <div className="text-xs font-mono text-posthog-gray">
                  {scorecard.owner}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onQuickAction(`view scorecard ${scorecard.id}`)}
                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                >
                  VIEW_DETAILS
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-posthog-cream-dark bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-posthog-gray mb-1">TOTAL_SCORECARDS</div>
                <div className="text-2xl font-bold font-mono text-posthog-black">
                  {scorecards.length}
                </div>
              </div>
              <Target className="h-8 w-8 text-posthog-orange" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-posthog-cream-dark bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-posthog-gray mb-1">PASSING</div>
                <div className="text-2xl font-bold font-mono text-green-600">
                  {scorecards.filter(s => s.status === 'passing').length}
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-posthog-cream-dark bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-posthog-gray mb-1">AVG_SCORE</div>
                <div className="text-2xl font-bold font-mono text-posthog-black">
                  {Math.round(scorecards.reduce((sum, s) => sum + s.score, 0) / scorecards.length)}
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-posthog-orange" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-posthog-cream-dark bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-posthog-gray mb-1">AUTO-HEALING</div>
                <div className="text-2xl font-bold font-mono text-posthog-black">
                  {scorecards.filter(s => s.selfHealing).length}
                </div>
              </div>
              <Bot className="h-8 w-8 text-posthog-orange" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

