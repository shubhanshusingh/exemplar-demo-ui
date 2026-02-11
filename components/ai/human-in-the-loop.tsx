"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Search,
  BarChart3,
  User,
  Bot,
  Settings,
} from "lucide-react"

interface HumanInTheLoopProps {
  onQuickAction: (command: string) => void
}

const reviewStatuses = [
  { id: "all", name: "All Reviews", count: 47, icon: Users },
  { id: "pending", name: "Pending", count: 12, icon: Clock },
  { id: "approved", name: "Approved", count: 28, icon: CheckCircle },
  { id: "rejected", name: "Rejected", count: 5, icon: XCircle },
  { id: "escalated", name: "Escalated", count: 2, icon: AlertTriangle },
]

const reviewRequests = [
  {
    id: "1",
    title: "Database Schema Change Approval",
    description: "AI suggested adding new indexes to improve query performance on user_activities table",
    type: "schema_change",
    priority: "high",
    status: "pending",
    requestedBy: "ai-assistant",
    assignedTo: "john.doe",
    createdAt: "2024-01-15T10:30:00Z",
    aiConfidence: 0.85,
    context: {
      affectedTables: ["user_activities", "user_sessions"],
      estimatedImpact: "15% performance improvement",
      riskLevel: "medium",
      rollbackPlan: "Available",
    },
    aiReasoning:
      "Analysis of query patterns shows frequent filtering on created_at and user_id columns. Adding composite index will significantly improve performance for dashboard queries.",
    humanFeedback: null,
    reviewTime: null,
  },
  {
    id: "2",
    title: "Security Policy Exception",
    description: "AI detected potential security vulnerability but requests human review for false positive assessment",
    type: "security_review",
    priority: "high",
    status: "pending",
    requestedBy: "security-scanner",
    assignedTo: "jane.smith",
    createdAt: "2024-01-15T09:15:00Z",
    aiConfidence: 0.72,
    context: {
      vulnerability: "Potential SQL injection in user input",
      codeLocation: "/src/api/users.ts:45",
      severity: "medium",
      falsePositiveRate: "23%",
    },
    aiReasoning:
      "Detected dynamic SQL construction with user input. However, input appears to be sanitized through parameterized queries. Human review needed to confirm safety.",
    humanFeedback: null,
    reviewTime: null,
  },
  {
    id: "3",
    title: "Code Deployment Approval",
    description: "AI recommends deploying hotfix but requires human approval due to production impact",
    type: "deployment",
    priority: "critical",
    status: "approved",
    requestedBy: "deployment-bot",
    assignedTo: "mike.wilson",
    createdAt: "2024-01-15T08:45:00Z",
    aiConfidence: 0.91,
    context: {
      environment: "production",
      affectedServices: ["payment-service", "notification-service"],
      deploymentWindow: "2024-01-15T12:00:00Z",
      rollbackTime: "< 5 minutes",
    },
    aiReasoning:
      "Critical bug fix for payment processing. All tests pass, staging deployment successful. Low risk deployment with quick rollback capability.",
    humanFeedback: "Approved. Monitoring payment metrics closely during deployment.",
    reviewTime: "2024-01-15T11:30:00Z",
    reviewer: "mike.wilson",
  },
  {
    id: "4",
    title: "Resource Scaling Decision",
    description: "AI suggests scaling down non-production environments to optimize costs",
    type: "resource_management",
    priority: "medium",
    status: "rejected",
    requestedBy: "cost-optimizer",
    assignedTo: "sarah.chen",
    createdAt: "2024-01-14T16:20:00Z",
    aiConfidence: 0.78,
    context: {
      environment: "staging",
      currentCost: "$450/month",
      projectedSavings: "$180/month",
      affectedTeams: ["qa-team", "dev-team"],
    },
    aiReasoning:
      "Staging environment shows low utilization (avg 15%) during off-hours. Scaling down during nights and weekends could save 40% on compute costs.",
    humanFeedback:
      "Rejected. QA team runs automated tests during off-hours. Need to coordinate with QA schedule first.",
    reviewTime: "2024-01-14T17:45:00Z",
    reviewer: "sarah.chen",
  },
]

const reviewers = [
  {
    id: "john.doe",
    name: "John Doe",
    email: "john.doe@company.com",
    specialties: ["database", "performance"],
    activeReviews: 3,
  },
  {
    id: "jane.smith",
    name: "Jane Smith",
    email: "jane.smith@company.com",
    specialties: ["security", "compliance"],
    activeReviews: 2,
  },
  {
    id: "mike.wilson",
    name: "Mike Wilson",
    email: "mike.wilson@company.com",
    specialties: ["deployment", "infrastructure"],
    activeReviews: 1,
  },
  {
    id: "sarah.chen",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    specialties: ["cost-optimization", "architecture"],
    activeReviews: 4,
  },
]

const reviewStats = {
  totalReviews: 47,
  pendingReviews: 12,
  avgReviewTime: "2.3 hours",
  approvalRate: "78%",
  escalationRate: "4%",
  recentActivity: [
    { action: "Approved", request: "Database Schema Change", reviewer: "john.doe", time: "1 hour ago" },
    { action: "Rejected", request: "Resource Scaling Decision", reviewer: "sarah.chen", time: "2 hours ago" },
    { action: "Escalated", request: "Security Policy Exception", reviewer: "jane.smith", time: "3 hours ago" },
  ],
}

export default function HumanInTheLoop({ onQuickAction }: HumanInTheLoopProps) {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<any>(null)

  const filteredRequests = reviewRequests.filter((request) => {
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 border-red-600 bg-red-50"
      case "high":
        return "text-orange-600 border-orange-600 bg-orange-50"
      case "medium":
        return "text-yellow-600 border-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 border-green-600 bg-green-50"
      default:
        return "text-muted-foreground border-muted-foreground bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "escalated":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "schema_change":
        return "🗄️"
      case "security_review":
        return "🔒"
      case "deployment":
        return "🚀"
      case "resource_management":
        return "⚡"
      default:
        return "📋"
    }
  }

  const handleApprove = (requestId: string) => {
    onQuickAction(`approve review request: ${requestId}`)
  }

  const handleReject = (requestId: string) => {
    onQuickAction(`reject review request: ${requestId}`)
  }

  const handleEscalate = (requestId: string) => {
    onQuickAction(`escalate review request: ${requestId}`)
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-foreground">HUMAN_IN_THE_LOOP</h2>
          <p className="text-muted-foreground font-mono text-xs sm:text-sm">HUMAN_OVERSIGHT_FOR_AI_DECISIONS_AND_ACTIONS</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => onQuickAction("show review analytics")}
            variant="outline"
            className="font-mono text-xs border-border text-foreground hover:bg-accent w-full sm:w-auto"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            ANALYTICS
          </Button>
          <Button
            onClick={() => onQuickAction("configure review settings")}
            variant="outline"
            className="font-mono text-xs border-border text-foreground hover:bg-accent w-full sm:w-auto"
          >
            <Settings className="h-4 w-4 mr-2" />
            SETTINGS
          </Button>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="space-y-4 min-h-[600px]">
        <TabsList className="bg-card border border-border w-full sm:w-auto">
          <TabsTrigger
            value="reviews"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">REVIEWS</span>
            <span className="sm:hidden">REV</span>
          </TabsTrigger>
          <TabsTrigger
            value="reviewers"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">REVIEWERS</span>
            <span className="sm:hidden">TEAM</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">ANALYTICS</span>
            <span className="sm:hidden">STATS</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4 min-h-[500px]">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="SEARCH_REVIEWS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-mono text-sm"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48 font-mono text-sm">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reviewStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id} className="font-mono text-sm">
                    {status.name} ({status.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Review Status Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {reviewStatuses.map((status) => (
              <Card
                key={status.id}
                className={`border-border bg-card hover:border-primary transition-colors cursor-pointer h-20 ${
                  selectedStatus === status.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedStatus(status.id)}
              >
                <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                  <status.icon className="h-5 w-5 mx-auto mb-1 text-brand-orange" />
                  <div className="text-lg font-bold font-mono text-foreground">{status.count}</div>
                  <div className="text-xs font-mono text-muted-foreground truncate">{status.name.toUpperCase()}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Review Requests List */}
          <div className="space-y-4 min-h-[300px]">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="border-border bg-card hover:border-primary transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="text-2xl flex-shrink-0">{getTypeIcon(request.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                        <div className="min-w-0">
                          <h4 className="font-mono text-sm font-medium text-foreground truncate">{request.title}</h4>
                          <p className="text-xs text-muted-foreground font-mono mt-1 line-clamp-2">{request.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusIcon(request.status)}
                          <Badge
                            variant="outline"
                            className={`font-mono text-xs ${getPriorityColor(request.priority)}`}
                          >
                            {request.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3 text-xs font-mono">
                        <div>
                          <span className="font-medium text-foreground">REQUESTED_BY:</span>
                          <div className="flex items-center gap-1 mt-1">
                            <Bot className="h-3 w-3 text-brand-orange" />
                            <span className="truncate">{request.requestedBy}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">ASSIGNED_TO:</span>
                          <div className="flex items-center gap-1 mt-1">
                            <User className="h-3 w-3 text-brand-orange" />
                            <span className="truncate">{request.assignedTo}</span>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">AI_CONFIDENCE:</span>
                          <div className="mt-1">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs border-primary text-primary"
                            >
                              {(request.aiConfidence * 100).toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">CREATED:</span>
                          <div className="text-muted-foreground mt-1 truncate">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs font-mono text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {request.status === "pending"
                            ? "Waiting for review"
                            : request.reviewTime
                              ? `Reviewed ${new Date(request.reviewTime).toLocaleDateString()}`
                              : "No review time"}
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                VIEW
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                              <DialogHeader>
                                <DialogTitle className="font-mono text-foreground flex items-center gap-2">
                                  <span className="text-xl">{getTypeIcon(request.type)}</span>
                                  <span className="truncate">{request.title}</span>
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                                  <div>
                                    <span className="font-medium text-foreground">TYPE:</span> {request.type}
                                  </div>
                                  <div>
                                    <span className="font-medium text-foreground">PRIORITY:</span> {request.priority}
                                  </div>
                                  <div>
                                    <span className="font-medium text-foreground">STATUS:</span> {request.status}
                                  </div>
                                  <div>
                                    <span className="font-medium text-foreground">AI_CONFIDENCE:</span>{" "}
                                    {(request.aiConfidence * 100).toFixed(0)}%
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-mono text-sm font-medium text-foreground mb-2">
                                    AI_REASONING:
                                  </h4>
                                  <div className="p-3 bg-muted rounded border border-border">
                                    <p className="font-mono text-sm text-foreground">{request.aiReasoning}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-mono text-sm font-medium text-foreground mb-2">CONTEXT:</h4>
                                  <div className="p-3 bg-muted rounded border border-border">
                                    <pre className="font-mono text-xs text-foreground overflow-auto">
                                      {JSON.stringify(request.context, null, 2)}
                                    </pre>
                                  </div>
                                </div>

                                {request.humanFeedback && (
                                  <div>
                                    <h4 className="font-mono text-sm font-medium text-foreground mb-2">
                                      HUMAN_FEEDBACK:
                                    </h4>
                                    <div className="p-3 bg-green-50 rounded border border-green-200">
                                      <p className="font-mono text-sm text-foreground">{request.humanFeedback}</p>
                                      <p className="text-xs text-muted-foreground font-mono mt-2">
                                        Reviewed by {request.reviewer} on{" "}
                                        {request.reviewTime ? new Date(request.reviewTime).toLocaleDateString() : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {request.status === "pending" && (
                                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                                    <Button
                                      onClick={() => handleApprove(request.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white font-mono text-xs"
                                    >
                                      <ThumbsUp className="h-4 w-4 mr-2" />
                                      APPROVE
                                    </Button>
                                    <Button
                                      onClick={() => handleReject(request.id)}
                                      className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs"
                                    >
                                      <ThumbsDown className="h-4 w-4 mr-2" />
                                      REJECT
                                    </Button>
                                    <Button
                                      onClick={() => handleEscalate(request.id)}
                                      variant="outline"
                                      className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                                    >
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                      ESCALATE
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          {request.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                                className="bg-green-600 hover:bg-green-700 text-white font-mono text-xs"
                              >
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">APPROVE</span>
                                <span className="sm:hidden">✓</span>
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReject(request.id)}
                                className="bg-red-600 hover:bg-red-700 text-white font-mono text-xs"
                              >
                                <ThumbsDown className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">REJECT</span>
                                <span className="sm:hidden">✗</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviewers" className="space-y-4 min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reviewers.map((reviewer) => (
              <Card key={reviewer.id} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-mono text-xs">
                        {reviewer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-mono text-sm font-medium text-foreground truncate">{reviewer.name}</h4>
                      <p className="text-xs text-muted-foreground font-mono truncate">{reviewer.email}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {reviewer.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="font-mono text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-xs font-mono text-muted-foreground">
                          <MessageSquare className="h-3 w-3 inline mr-1" />
                          {reviewer.activeReviews} active reviews
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onQuickAction(`assign review to ${reviewer.id}`)}
                          className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                          ASSIGN
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 min-h-[500px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-muted-foreground">TOTAL_REVIEWS</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  {reviewStats.totalReviews}
                </div>
                <div className="text-xs font-mono text-green-600">+8 this week</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-muted-foreground">PENDING_REVIEWS</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-yellow-600">
                  {reviewStats.pendingReviews}
                </div>
                <div className="text-xs font-mono text-muted-foreground">Needs attention</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-muted-foreground">APPROVAL_RATE</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-green-600">{reviewStats.approvalRate}</div>
                <div className="text-xs font-mono text-green-600">+5% this month</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-muted-foreground">AVG_REVIEW_TIME</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-foreground">
                  {reviewStats.avgReviewTime}
                </div>
                <div className="text-xs font-mono text-green-600">-0.5h improvement</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-mono text-foreground">RECENT_ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reviewStats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded border border-border"
                  >
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                        activity.action === "Approved"
                          ? "bg-green-100"
                          : activity.action === "Rejected"
                            ? "bg-red-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {activity.action === "Approved" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : activity.action === "Rejected" ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-foreground">
                        <span className="font-medium">{activity.reviewer}</span> {activity.action.toLowerCase()}
                        <span className="font-medium"> "{activity.request}"</span>
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">{activity.time}</p>
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
