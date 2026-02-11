"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  FileText,
  Settings,
  BarChart3,
  Zap,
  Server,
  Key,
} from "lucide-react"

interface ApprovalRequest {
  id: string
  title: string
  type: "deployment" | "infrastructure" | "access" | "configuration" | "budget"
  description: string
  requestedBy: string
  requestedAt: string
  status: "pending" | "approved" | "rejected" | "in_review"
  priority: "low" | "medium" | "high" | "critical"
  approvers: Approver[]
  comments: Comment[]
  estimatedCost?: string
  environment?: string
  service?: string
  deadline?: string
}

interface Approver {
  id: string
  name: string
  email: string
  role: string
  status: "pending" | "approved" | "rejected"
  approvedAt?: string
  comment?: string
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  type: "comment" | "approval" | "rejection"
}

interface ApprovalTemplate {
  id: string
  name: string
  type: string
  description: string
  approvers: string[]
  autoApprovalRules?: string[]
  requiredFields: string[]
}

const approvalRequests: ApprovalRequest[] = [
  {
    id: "req-1",
    title: "Deploy payment-service v2.1.0 to production",
    type: "deployment",
    description: "Deploy new version of payment service with enhanced security features and bug fixes",
    requestedBy: "dev@company.com",
    requestedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    priority: "high",
    environment: "production",
    service: "payment-service",
    deadline: "2024-01-16T18:00:00Z",
    approvers: [
      {
        id: "approver-1",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: "Tech Lead",
        status: "approved",
        approvedAt: "2024-01-15T11:15:00Z",
        comment: "Code review passed, security scan clean",
      },
      {
        id: "approver-2",
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "DevOps Engineer",
        status: "pending",
      },
      {
        id: "approver-3",
        name: "Lisa Wang",
        email: "lisa.wang@company.com",
        role: "Security Lead",
        status: "pending",
      },
    ],
    comments: [
      {
        id: "comment-1",
        author: "dev@company.com",
        content: "This deployment includes critical security patches that need to go out ASAP",
        timestamp: "2024-01-15T10:35:00Z",
        type: "comment",
      },
      {
        id: "comment-2",
        author: "sarah.chen@company.com",
        content: "Approved after thorough code review. All tests passing.",
        timestamp: "2024-01-15T11:15:00Z",
        type: "approval",
      },
    ],
  },
  {
    id: "req-2",
    title: "Provision new Kubernetes cluster for staging",
    type: "infrastructure",
    description: "Create new staging environment cluster with 5 nodes for load testing",
    requestedBy: "ops@company.com",
    requestedAt: "2024-01-14T14:20:00Z",
    status: "approved",
    priority: "medium",
    estimatedCost: "$450/month",
    environment: "staging",
    approvers: [
      {
        id: "approver-4",
        name: "David Kim",
        email: "david.kim@company.com",
        role: "Platform Engineer",
        status: "approved",
        approvedAt: "2024-01-14T15:30:00Z",
      },
      {
        id: "approver-5",
        name: "Emma Davis",
        email: "emma.davis@company.com",
        role: "Finance Manager",
        status: "approved",
        approvedAt: "2024-01-14T16:45:00Z",
      },
    ],
    comments: [
      {
        id: "comment-3",
        author: "david.kim@company.com",
        content: "Infrastructure requirements look good. Approved for staging environment.",
        timestamp: "2024-01-14T15:30:00Z",
        type: "approval",
      },
    ],
  },
  {
    id: "req-3",
    title: "Grant database admin access to new team member",
    type: "access",
    description: "Provide production database read-only access for new data analyst",
    requestedBy: "hr@company.com",
    requestedAt: "2024-01-13T09:15:00Z",
    status: "in_review",
    priority: "low",
    service: "postgresql-prod",
    approvers: [
      {
        id: "approver-6",
        name: "Alex Rodriguez",
        email: "alex.rodriguez@company.com",
        role: "DBA",
        status: "approved",
        approvedAt: "2024-01-13T10:00:00Z",
      },
      {
        id: "approver-7",
        name: "Lisa Wang",
        email: "lisa.wang@company.com",
        role: "Security Lead",
        status: "pending",
      },
    ],
    comments: [],
  },
  {
    id: "req-4",
    title: "Update API rate limits for premium tier",
    type: "configuration",
    description: "Increase rate limits from 1000 to 5000 requests per minute for premium customers",
    requestedBy: "product@company.com",
    requestedAt: "2024-01-12T16:45:00Z",
    status: "rejected",
    priority: "medium",
    service: "api-gateway",
    approvers: [
      {
        id: "approver-8",
        name: "Tom Wilson",
        email: "tom.wilson@company.com",
        role: "API Lead",
        status: "rejected",
        approvedAt: "2024-01-12T17:30:00Z",
        comment: "Need performance impact analysis before approval",
      },
    ],
    comments: [
      {
        id: "comment-4",
        author: "tom.wilson@company.com",
        content: "Please provide load testing results for the increased rate limits",
        timestamp: "2024-01-12T17:30:00Z",
        type: "rejection",
      },
    ],
  },
]

const approvalTemplates: ApprovalTemplate[] = [
  {
    id: "template-1",
    name: "Production Deployment",
    type: "deployment",
    description: "Standard approval workflow for production deployments",
    approvers: ["Tech Lead", "DevOps Engineer", "Security Lead"],
    autoApprovalRules: ["Non-production environments", "Hotfix deployments with security approval"],
    requiredFields: ["service", "version", "environment", "rollback_plan"],
  },
  {
    id: "template-2",
    name: "Infrastructure Provisioning",
    type: "infrastructure",
    description: "Approval workflow for new infrastructure resources",
    approvers: ["Platform Engineer", "Finance Manager"],
    autoApprovalRules: ["Cost under $100/month", "Development environment"],
    requiredFields: ["resource_type", "estimated_cost", "environment", "justification"],
  },
  {
    id: "template-3",
    name: "Access Request",
    type: "access",
    description: "Workflow for granting system access",
    approvers: ["Resource Owner", "Security Lead"],
    requiredFields: ["user", "resource", "access_level", "justification", "duration"],
  },
  {
    id: "template-4",
    name: "Configuration Change",
    type: "configuration",
    description: "Approval for system configuration changes",
    approvers: ["Service Owner", "Platform Engineer"],
    autoApprovalRules: ["Non-production changes", "Rollback operations"],
    requiredFields: ["service", "change_description", "impact_assessment"],
  },
]

interface ApprovalWorkflowProps {
  onQuickAction: (command: string) => void
}

export default function ApprovalWorkflow({ onQuickAction }: ApprovalWorkflowProps) {
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null)
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "in_review":
        return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default",
      rejected: "destructive",
      pending: "secondary",
      in_review: "outline",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="font-mono text-xs">
        {status.toUpperCase()}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      critical: "destructive",
      high: "destructive",
      medium: "secondary",
      low: "outline",
    } as const

    return (
      <Badge variant={variants[priority as keyof typeof variants] || "outline"} className="font-mono text-xs">
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deployment":
        return <Zap className="h-4 w-4" />
      case "infrastructure":
        return <Server className="h-4 w-4" />
      case "access":
        return <Key className="h-4 w-4" />
      case "configuration":
        return <Settings className="h-4 w-4" />
      case "budget":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredRequests = approvalRequests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "all" || request.status === selectedStatus
    const matchesType = selectedType === "all" || request.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  const statusCounts = {
    all: approvalRequests.length,
    pending: approvalRequests.filter((r) => r.status === "pending").length,
    approved: approvalRequests.filter((r) => r.status === "approved").length,
    rejected: approvalRequests.filter((r) => r.status === "rejected").length,
    in_review: approvalRequests.filter((r) => r.status === "in_review").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-foreground">APPROVAL_WORKFLOW</h2>
          <p className="text-muted-foreground font-mono text-sm">
            MANAGE_APPROVAL_REQUESTS_AND_WORKFLOWS ({statusCounts.pending} PENDING, {statusCounts.approved} APPROVED)
          </p>
        </div>
        <Dialog open={isCreatingRequest} onOpenChange={setIsCreatingRequest}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono">
              <Plus className="h-4 w-4 mr-2" />
              CREATE_REQUEST
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background border-primary max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono text-foreground">CREATE_APPROVAL_REQUEST</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="request-title" className="font-mono text-foreground">
                  REQUEST_TITLE
                </Label>
                <Input
                  id="request-title"
                  placeholder="Deploy service to production"
                  className="border-primary font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="request-type" className="font-mono text-foreground">
                    TYPE
                  </Label>
                  <Select>
                    <SelectTrigger className="border-primary font-mono">
                      <SelectValue placeholder="SELECT_TYPE" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deployment">DEPLOYMENT</SelectItem>
                      <SelectItem value="infrastructure">INFRASTRUCTURE</SelectItem>
                      <SelectItem value="access">ACCESS</SelectItem>
                      <SelectItem value="configuration">CONFIGURATION</SelectItem>
                      <SelectItem value="budget">BUDGET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority" className="font-mono text-foreground">
                    PRIORITY
                  </Label>
                  <Select>
                    <SelectTrigger className="border-primary font-mono">
                      <SelectValue placeholder="SELECT_PRIORITY" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">LOW</SelectItem>
                      <SelectItem value="medium">MEDIUM</SelectItem>
                      <SelectItem value="high">HIGH</SelectItem>
                      <SelectItem value="critical">CRITICAL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="font-mono text-foreground">
                  DESCRIPTION
                </Label>
                <Textarea
                  id="description"
                  placeholder="DETAILED_DESCRIPTION_OF_THE_REQUEST"
                  className="border-primary font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="service" className="font-mono text-foreground">
                    SERVICE_(OPTIONAL)
                  </Label>
                  <Input id="service" placeholder="payment-service" className="border-primary font-mono" />
                </div>
                <div>
                  <Label htmlFor="environment" className="font-mono text-foreground">
                    ENVIRONMENT_(OPTIONAL)
                  </Label>
                  <Select>
                    <SelectTrigger className="border-primary font-mono">
                      <SelectValue placeholder="SELECT_ENVIRONMENT" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="production">PRODUCTION</SelectItem>
                      <SelectItem value="staging">STAGING</SelectItem>
                      <SelectItem value="development">DEVELOPMENT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono">
                CREATE_REQUEST
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger
            value="requests"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            REQUESTS
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            TEMPLATES
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            ANALYTICS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="SEARCH_REQUESTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-primary font-mono bg-background"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32 border-primary font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL_STATUS</SelectItem>
                  <SelectItem value="pending">PENDING</SelectItem>
                  <SelectItem value="approved">APPROVED</SelectItem>
                  <SelectItem value="rejected">REJECTED</SelectItem>
                  <SelectItem value="in_review">IN_REVIEW</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 border-primary font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ALL_TYPES</SelectItem>
                  <SelectItem value="deployment">DEPLOYMENT</SelectItem>
                  <SelectItem value="infrastructure">INFRASTRUCTURE</SelectItem>
                  <SelectItem value="access">ACCESS</SelectItem>
                  <SelectItem value="configuration">CONFIGURATION</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requests List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredRequests.map((request) => (
                <Card
                  key={request.id}
                  className={`cursor-pointer transition-all hover:shadow-md border-border bg-card ${
                    selectedRequest?.id === request.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(request.type)}
                        <span className="font-medium font-mono text-foreground text-sm">{request.title}</span>
                      </div>
                      <div className="flex gap-1">
                        {getStatusIcon(request.status)}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mb-2">{request.description}</p>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">BY: {request.requestedBy}</span>
                        {getPriorityBadge(request.priority)}
                      </div>
                      <span className="text-muted-foreground">{new Date(request.requestedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        {request.approvers.map((approver, index) => (
                          <Avatar key={index} className="h-6 w-6">
                            <AvatarFallback className="text-xs font-mono bg-muted text-foreground">
                              {approver.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {request.approvers.filter((a) => a.status === "approved").length}/{request.approvers.length}{" "}
                        APPROVED
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Request Details */}
            <div className="lg:col-span-1">
              {selectedRequest ? (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 font-mono text-foreground">
                      {getTypeIcon(selectedRequest.type)}
                      REQUEST_DETAILS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-mono text-foreground">TITLE:</Label>
                      <p className="text-sm font-mono text-foreground mt-1">{selectedRequest.title}</p>
                    </div>
                    <div>
                      <Label className="font-mono text-foreground">DESCRIPTION:</Label>
                      <p className="text-sm text-muted-foreground font-mono mt-1">{selectedRequest.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                      <div>
                        <Label className="font-mono text-foreground">STATUS:</Label>
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                      <div>
                        <Label className="font-mono text-foreground">PRIORITY:</Label>
                        {getPriorityBadge(selectedRequest.priority)}
                      </div>
                      <div>
                        <Label className="font-mono text-foreground">TYPE:</Label>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs border-primary text-primary"
                        >
                          {selectedRequest.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <Label className="font-mono text-foreground">REQUESTED_BY:</Label>
                        <p className="text-foreground">{selectedRequest.requestedBy}</p>
                      </div>
                    </div>
                    {selectedRequest.service && (
                      <div>
                        <Label className="font-mono text-foreground">SERVICE:</Label>
                        <p className="text-sm font-mono text-foreground">{selectedRequest.service}</p>
                      </div>
                    )}
                    {selectedRequest.environment && (
                      <div>
                        <Label className="font-mono text-foreground">ENVIRONMENT:</Label>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs border-primary text-primary"
                        >
                          {selectedRequest.environment.toUpperCase()}
                        </Badge>
                      </div>
                    )}
                    <div>
                      <Label className="font-mono text-foreground">APPROVERS:</Label>
                      <div className="space-y-2 mt-2">
                        {selectedRequest.approvers.map((approver) => (
                          <div
                            key={approver.id}
                            className="flex items-center justify-between p-2 bg-muted rounded"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs font-mono bg-background text-foreground">
                                  {approver.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-mono text-foreground">{approver.name}</p>
                                <p className="text-xs text-muted-foreground font-mono">{approver.role}</p>
                              </div>
                            </div>
                            {getStatusBadge(approver.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-green-500 text-green-500 hover:bg-green-500 hover:text-white bg-transparent"
                        onClick={() => {
                          onQuickAction(`Approve request ${selectedRequest.title}`)
                        }}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        APPROVE
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        REJECT
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-96 flex items-center justify-center border-border bg-card">
                  <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-mono">SELECT_A_REQUEST_TO_VIEW_DETAILS</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {approvalTemplates.map((template) => (
              <Card key={template.id} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 font-mono text-foreground">
                    {getTypeIcon(template.type)}
                    {template.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground font-mono">{template.description}</p>
                  <div>
                    <Label className="font-mono text-foreground">APPROVERS:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.approvers.map((approver, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="font-mono text-xs border-primary text-primary"
                        >
                          {approver.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {template.autoApprovalRules && (
                    <div>
                      <Label className="font-mono text-foreground">AUTO_APPROVAL_RULES:</Label>
                      <ul className="text-xs text-muted-foreground font-mono mt-1 space-y-1">
                        {template.autoApprovalRules.map((rule, index) => (
                          <li key={index}>• {rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                      onClick={() => {
                        onQuickAction(`Use template ${template.name} for new request`)
                      }}
                    >
                      USE_TEMPLATE
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      EDIT
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-border bg-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-brand-orange font-mono">{statusCounts.pending}</div>
                <div className="text-sm text-muted-foreground font-mono">PENDING</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 font-mono">{statusCounts.approved}</div>
                <div className="text-sm text-muted-foreground font-mono">APPROVED</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600 font-mono">{statusCounts.rejected}</div>
                <div className="text-sm text-muted-foreground font-mono">REJECTED</div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 font-mono">2.3h</div>
                <div className="text-sm text-muted-foreground font-mono">AVG_APPROVAL_TIME</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-foreground">APPROVAL_TRENDS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-foreground">THIS_WEEK:</span>
                    <span className="text-brand-orange">+23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">DEPLOYMENT_REQUESTS:</span>
                    <span className="text-brand-orange">45%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">INFRASTRUCTURE_REQUESTS:</span>
                    <span className="text-brand-orange">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">ACCESS_REQUESTS:</span>
                    <span className="text-brand-orange">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm font-mono text-foreground">TOP_APPROVERS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-foreground">SARAH_CHEN:</span>
                    <span className="text-brand-orange">23_APPROVALS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">MIKE_JOHNSON:</span>
                    <span className="text-brand-orange">19_APPROVALS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">LISA_WANG:</span>
                    <span className="text-brand-orange">17_APPROVALS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">DAVID_KIM:</span>
                    <span className="text-brand-orange">15_APPROVALS</span>
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
