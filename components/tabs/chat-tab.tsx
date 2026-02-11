"use client"

import React, { useEffect, useState, useRef } from 'react'
import { useChat } from "@ai-sdk/react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Bot, User, Send, Terminal, ChevronUp, ChevronDown, ChevronRight, Zap, Database, Cloud, Shield, Activity, Settings, Workflow, BarChart3, Server, Search, Users, BookOpen, DollarSign, TrendingUp, Plus, X, Globe, ExternalLink, RefreshCw, CheckCircle, History, FileText, Download } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { BaseTab } from './base-tab'
import ContextualSuggestions from '@/components/ai/contextual-suggestions'
import { getActionsByCategory, getActionsByEntityType } from '@/lib/actions-data'

export const ChatTab: React.FC = () => {
  // Router for navigation
  const router = useRouter()
  
  // Mock mode state - default to true for mock responses
  const [useMockAPI, setUseMockAPI] = useState(true)
  
  // Chat functionality - now managed directly in ChatTab
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    maxSteps: 5,
  })

  // Chat-specific state
  const [commandTicker, setCommandTicker] = useState(0)
  const [showCommandHelper, setShowCommandHelper] = useState(false)
  
  // Ref for the textarea to handle auto-resize
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Mock messages state for demo mode
  const [mockMessages, setMockMessages] = useState<any[]>([])
  const [mockInput, setMockInput] = useState("")
  const [mockIsLoading, setMockIsLoading] = useState(false)
  
  // MCP Tools visibility state
  const [showMCPTools, setShowMCPTools] = useState(false)

  // Get actions from actions-data.ts
  const createActions = getActionsByCategory("create")
  const day2Actions = getActionsByCategory("day2")
  
  // Quick commands data - enhanced with actions from actions-data.ts
  const allQuickCommands = [
    // Service Health & Monitoring
    { label: "check health of payment-service and show recent deployments", icon: Activity, category: "HEALTH", mcp: undefined },
    { label: "scale user-auth service to 5 replicas and show cost impact", icon: Zap, category: "SCALE", mcp: undefined },
    { label: "create Kafka topic 'order-events' with 6 partitions", icon: Database, category: "INFRA", mcp: undefined },
    { label: "check service health and uptime metrics", icon: Activity, category: "MONITOR", mcp: undefined },
    
    // Actions from actions-data.ts - Create Actions
    { label: `scaffold new ${createActions[0]?.title.toLowerCase()} with standard configuration`, icon: Server, category: "CREATE", mcp: undefined },
    { label: `create ${createActions[1]?.title.toLowerCase()} for repository secrets`, icon: Cloud, category: "CREATE", mcp: undefined },
    { label: `provision new ${createActions[3]?.title.toLowerCase()} instance`, icon: Database, category: "CREATE", mcp: undefined },
    { label: `set up ${createActions[4]?.title.toLowerCase()} for service monitoring`, icon: BarChart3, category: "CREATE", mcp: undefined },
    
    // Actions from actions-data.ts - Day-2 Operations
    { label: `${day2Actions[1]?.title.toLowerCase()} for user-service to production`, icon: Server, category: "DEPLOY", mcp: undefined },
    { label: `${day2Actions[2]?.title.toLowerCase()} to prevent deployments`, icon: Shield, category: "LOCK", mcp: undefined },
    { label: `${day2Actions[5]?.title.toLowerCase()} user-auth service to 3 replicas`, icon: BarChart3, category: "SCALE", mcp: undefined },
    { label: `${day2Actions[6]?.title.toLowerCase()} payment-service deployment`, icon: RefreshCw, category: "RESTART", mcp: undefined },
    { label: `${day2Actions[9]?.title.toLowerCase()} for database backup`, icon: Database, category: "BACKUP", mcp: undefined },
    { label: `${day2Actions[10]?.title.toLowerCase()} on order-service`, icon: CheckCircle, category: "HEALTH", mcp: undefined },
    { label: `${day2Actions[11]?.title.toLowerCase()} to previous stable version`, icon: History, category: "ROLLBACK", mcp: undefined },
    { label: `${day2Actions[15]?.title.toLowerCase()} for service performance`, icon: FileText, category: "REPORT", mcp: undefined },
    
    // Infrastructure & Deployment
    { label: "deploy frontend-service to production", icon: Server, category: "DEPLOY", mcp: undefined },
    { label: "scale backend to 3 instances", icon: Zap, category: "SCALE", mcp: undefined },
    { label: "check deployment status and logs", icon: Terminal, category: "LOGS", mcp: undefined },
    
    // Cost & Security
    { label: "analyze cloud costs and optimization", icon: DollarSign, category: "COST", mcp: undefined },
    { label: "run security scan and show vulnerabilities", icon: Shield, category: "SECURITY", mcp: undefined },
    { label: "check compliance and governance", icon: BookOpen, category: "GOVERNANCE", mcp: undefined },
    
    // Workflows & Automation
    { label: "show workflow automation stats", icon: Workflow, category: "AUTOMATION", mcp: undefined },
    { label: "create new CI/CD pipeline", icon: Zap, category: "PIPELINE", mcp: undefined }
  ]

  // Enhanced fallback commands with MCP tools
  const fallbackCommands = [
    { label: "check service health", icon: Activity, category: "MONITOR", mcp: "service-health" },
    { label: "scale deployment", icon: Zap, category: "DEPLOY", mcp: "kubernetes" },
    { label: "analyze costs", icon: Database, category: "COST", mcp: "cost-analyzer" },
    { label: "security scan", icon: Shield, category: "SECURITY", mcp: "security-scanner" },
    { label: "workflow automation", icon: Workflow, category: "AUTOMATION", mcp: "workflow-engine" },
    { label: "cloud resources", icon: Cloud, category: "CLOUD", mcp: "aws-connector" }
  ]
  
  const commands = allQuickCommands.length > 0 ? allQuickCommands : fallbackCommands
  const currentCommand = commands[commandTicker % commands.length] || commands[0]

  // Mock MCP tools registry
  const mcpTools = [
    { name: "service-health", description: "Monitor service health and metrics", status: "active" },
    { name: "kubernetes", description: "Manage K8s deployments and scaling", status: "active" },
    { name: "cost-analyzer", description: "Analyze cloud costs and optimization", status: "active" },
    { name: "security-scanner", description: "Security vulnerability scanning", status: "active" },
    { name: "workflow-engine", description: "Automate developer workflows", status: "active" },
    { name: "aws-connector", description: "AWS resource management", status: "active" },
    { name: "database-manager", description: "Database operations and monitoring", status: "connecting" },
    { name: "logging-aggregator", description: "Centralized logging and analysis", status: "connecting" }
  ]

  // Command ticker effect - moved from Page.tsx
  useEffect(() => {
    if (allQuickCommands.length === 0) return

    const interval = setInterval(() => {
      setCommandTicker((prev) => {
        const next = (prev + 1) % allQuickCommands.length
        return next >= 0 ? next : 0
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [allQuickCommands.length])

  // Auto-resize textarea effect
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto'
      // Set height to scrollHeight, with min/max constraints
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 40), 120)
      textarea.style.height = `${newHeight}px`
    }
  }, [useMockAPI ? mockInput : input])

  // Handle quick command - moved from Page.tsx
  const handleQuickCommand = (command: string) => {
    if (useMockAPI) {
      setMockInput(command)
    } else {
      handleInputChange({ target: { value: command } } as any)
    }
  }
  
  // Generate mock response based on user input
  const generateMockResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase()
    
    // Define mock response types with keywords
    const mockResponseTypes = [
      {
        type: "service-health",
        keywords: ["health", "service", "status", "uptime", "payment-service"],
        content: "I'll check the payment-service health and recent deployments for you.",
        data: {
          "Service Status": "HEALTHY",
          "Last Deploy": "1 day ago",
          "SLA": "99.95%",
          "Version": "v1.8.2",
          "Uptime": "99.99%",
          "Response Time": "120ms"
        },
        status: "success",
        actions: [
          { label: "View Details", action: "view_details", icon: Activity },
          { label: "Show Logs", action: "show_logs", icon: Terminal }
        ]
      },
      {
        type: "scaling",
        keywords: ["scale", "replicas", "user-auth", "auth service"],
        content: "I'll scale the user-auth service and analyze the cost impact for you.",
        data: {
          "Scaling": "3 → 5 replicas",
          "Performance": "+40% capacity",
          "Estimated Cost": "+$45/month",
          "Status": "In Progress",
          "Estimated Time": "2-3 minutes"
        },
        status: "progress",
        actions: [
          { label: "Monitor Progress", action: "monitor_progress", icon: Activity },
          { label: "View Costs", action: "view_costs", icon: Database }
        ]
      },
      {
        type: "kafka-topic",
        keywords: ["kafka", "topic", "order-events", "partitions"],
        content: "I'll create the Kafka topic 'order-events' with 6 partitions for you.",
        data: {
          "Topic": "order-events",
          "Replication": "3",
          "Partitions": "6",
          "Status": "Created",
          "Created At": "Just now"
        },
        status: "success",
        actions: [
          { label: "View Topic", action: "view_topic", icon: Database },
          { label: "Configure ACLs", action: "configure_acls", icon: Settings }
        ]
      },
      {
        type: "deployment-status",
        keywords: ["deploy", "deployment", "metrics", "kubernetes"],
        content: "Checking deployment status for you...",
        data: {
          "Service": "frontend-service",
          "Status": "DEPLOYED",
          "Version": "v1.8.2",
          "Environment": "production",
          "Last Update": "2 hours ago"
        },
        status: "success",
        actions: [
          { label: "View Deployment Logs", action: "view_deployment_logs", icon: Activity },
          { label: "Rollback Deployment", action: "rollback_deployment", icon: Server }
        ]
      },
      {
        type: "error-logs",
        keywords: ["log", "logs", "error logs", "view logs"],
        content: "Retrieving error logs for you. Here are the latest critical entries.",
        data: {
          "Service": "auth-service",
          "Level": "CRITICAL",
          "Timestamp": "2023-10-27T10:30:00Z",
          "Message": "Authentication failed for user 'x'. Invalid credentials."
        },
        status: "error",
        actions: [
          { label: "Filter Logs", action: "filter_logs", icon: Search },
          { label: "Download Logs", action: "download_logs", icon: Terminal }
        ]
      },
      {
        type: "api-documentation",
        keywords: ["api", "docs", "documentation", "generate docs"],
        content: "Generating API documentation. This might take a moment.",
        data: {
          "Service": "user-management-api",
          "Version": "v2.1.0",
          "Last Update": "2023-10-26",
          "Format": "OpenAPI 3.0"
        },
        status: "success",
        actions: [
          { label: "View Docs", action: "view_docs", icon: BookOpen },
          { label: "Download OpenAPI Spec", action: "download_openapi_spec", icon: Terminal }
        ]
      },
      {
        type: "cost-analysis",
        keywords: ["cost", "money", "spend", "budget"],
        content: "Here's a quick cost overview.",
        data: {
          "Month": "July",
          "Total Spend": "$12,345",
          "Trend": "UP 5%",
          "Top Spender": "AWS EC2"
        },
        status: "warning",
        actions: [
          { label: "View Cost Report", action: "view_cost_report", icon: Database },
          { label: "Optimize Resources", action: "optimize_resources", icon: Zap }
        ]
      },
      {
        type: "security-scan",
        keywords: ["security", "scan", "vulnerability", "audit"],
        content: "Initiating a security scan...",
        data: {
          "Last Scan": "1 hour ago",
          "Vulnerabilities": "2 CRITICAL, 5 HIGH",
          "Status": "SCANNING",
          "Risk Score": "HIGH"
        },
        status: "warning",
        actions: [
          { label: "View Scan Report", action: "view_scan_report", icon: Shield },
          { label: "Fix Vulnerabilities", action: "fix_vulnerabilities", icon: Settings }
        ]
      },
      {
        type: "workflow-automation",
        keywords: ["workflow", "automation", "pipeline", "ci/cd"],
        content: "Here are the latest workflow automation stats.",
        data: {
          "Total Workflows": "50",
          "Active Workflows": "45",
          "Failed Runs": "3",
          "Last Run": "10 minutes ago"
        },
        status: "success",
        actions: [
          { label: "View Workflows", action: "view_workflows", icon: Workflow },
          { label: "Create New Workflow", action: "create_new_workflow", icon: Zap }
        ]
      },
      {
        type: "scaffold-service",
        keywords: ["scaffold", "service", "create service", "new service"],
        content: "I'll scaffold a new service with standard configuration for you.",
        data: {
          "Service Name": "user-management-api",
          "Framework": "Node.js",
          "Database": "PostgreSQL",
          "Status": "Created",
          "Repository": "github.com/company/user-management-api"
        },
        status: "success",
        actions: [
          { label: "View Repository", action: "view_repository", icon: ExternalLink },
          { label: "Deploy Service", action: "deploy_service", icon: Server }
        ]
      },
      {
        type: "promote-production",
        keywords: ["promote", "production", "deploy to prod"],
        content: "I'll promote the service to production environment.",
        data: {
          "Service": "user-auth-service",
          "Version": "v2.1.0",
          "Strategy": "Blue-Green",
          "Status": "In Progress",
          "Estimated Time": "5-7 minutes"
        },
        status: "progress",
        actions: [
          { label: "Monitor Progress", action: "monitor_progress", icon: Activity },
          { label: "View Deployment Logs", action: "view_logs", icon: Terminal }
        ]
      },
      {
        type: "scale-service",
        keywords: ["scale", "replicas", "scale service"],
        content: "I'll scale the service replicas for you.",
        data: {
          "Service": "payment-service",
          "Current Replicas": "2",
          "Target Replicas": "5",
          "Status": "Scaling",
          "Estimated Time": "2-3 minutes"
        },
        status: "progress",
        actions: [
          { label: "Monitor Scaling", action: "monitor_scaling", icon: BarChart3 },
          { label: "View Metrics", action: "view_metrics", icon: Activity }
        ]
      },
      {
        type: "health-check",
        keywords: ["health check", "health", "check health"],
        content: "Running comprehensive health check on the service.",
        data: {
          "Service": "order-processing-service",
          "Check Type": "Comprehensive",
          "Status": "Running",
          "Progress": "75%",
          "Issues Found": "0"
        },
        status: "progress",
        actions: [
          { label: "View Detailed Results", action: "view_results", icon: CheckCircle },
          { label: "Download Report", action: "download_report", icon: FileText }
        ]
      },
      {
        type: "generate-report",
        keywords: ["generate report", "report", "performance report"],
        content: "Generating service performance report for you.",
        data: {
          "Service": "api-gateway",
          "Report Type": "Performance",
          "Time Range": "Last 7 days",
          "Format": "PDF",
          "Status": "Generating"
        },
        status: "progress",
        actions: [
          { label: "View Report", action: "view_report", icon: FileText },
          { label: "Download PDF", action: "download_pdf", icon: Download }
        ]
      },
      {
        type: "database-operation",
        keywords: ["database", "db", "sql", "query", "table"],
        content: "Database operation completed successfully.",
        data: {
          "Operation": "QUERY_EXECUTED",
          "Rows Affected": "1,247",
          "Execution Time": "45ms",
          "Database": "user_db"
        },
        status: "success",
        actions: [
          { label: "View Results", action: "view_results", icon: Database },
          { label: "Export Data", action: "export_data", icon: Terminal }
        ]
      },
      {
        type: "monitoring-alert",
        keywords: ["monitor", "alert", "threshold", "cpu", "memory"],
        content: "Monitoring alert resolved. System performance is back to normal.",
        data: {
          "Alert": "RESOLVED",
          "Metric": "CPU Usage",
          "Current Value": "45%",
          "Threshold": "80%"
        },
        status: "success",
        actions: [
          { label: "View Metrics", action: "view_metrics", icon: Activity },
          { label: "Configure Alerts", action: "configure_alerts", icon: Settings }
        ]
      }
    ]

    // Find a matching response type
    for (const responseType of mockResponseTypes) {
      if (responseType.keywords.some(keyword => lowerInput.includes(keyword))) {
        return {
          content: responseType.content,
          data: responseType.data,
          actions: responseType.actions,
          status: responseType.status
        }
      }
    }

    // Default fallback response
    return {
      content: "I'm sorry, I can only provide mock responses for service health, deployments, logs, API documentation, costs, security, and workflows at the moment. Please try a different query!",
      data: null,
      actions: [],
      status: "info"
    }
  }
  
  // Handle mock form submission
  const handleMockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mockInput.trim()) return
    
    console.log("Mock submit triggered with:", mockInput)
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: mockInput
    }
    console.log("Adding user message:", userMessage)
    setMockMessages(prev => {
      const newMessages = [...prev, userMessage]
      console.log("Updated mock messages:", newMessages)
      return newMessages
    })
    
    // Simulate loading
    setMockIsLoading(true)
    
    // Generate mock response after delay
    setTimeout(() => {
      const mockResponse = generateMockResponse(mockInput)
      console.log("Generated mock response:", mockResponse)
      
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponse.content,
        mockData: mockResponse.data,
        mockActions: mockResponse.actions,
        mockStatus: mockResponse.status
      }
      console.log("Adding assistant message:", assistantMessage)
      
      setMockMessages(prev => {
        const newMessages = [...prev, assistantMessage]
        console.log("Final mock messages:", newMessages)
        return newMessages
      })
      setMockIsLoading(false)
      setMockInput("")
    }, 1000)
  }

  const renderToolResult = (toolInvocation: any) => {
    const { toolName, result } = toolInvocation

    switch (toolName) {
      case "serviceCatalog":
        return (
          <Card className="mt-2 border-posthog-cream-dark bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 font-mono">
                <Terminal className="h-4 w-4 text-brand-orange" />
                SERVICE_CATALOG_RESULTS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 font-mono text-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-posthog-black">FOUND {result.totalCount} SERVICES</span>
                {result.query && (
                  <Badge variant="outline" className="font-mono text-xs border-brand-orange text-brand-orange">
                    QUERY: {result.query}
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {result.services.map((service: any, i: number) => (
                  <div key={i} className="p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-posthog-black">{service.name.toUpperCase()}</span>
                      <div className="flex gap-1">
                        <Badge
                          variant="outline"
                          className="font-mono text-xs border-brand-orange text-brand-orange"
                        >
                          {service.team.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {service.technology.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-posthog-gray mb-2">{service.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-posthog-black">OWNER:</span> {service.owner}
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">SLA:</span> {service.sla}
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">ON-CALL:</span> {service.oncall}
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">DEPENDENCIES:</span>{" "}
                        {service.dependencies.length}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card className="mt-2 border-posthog-cream-dark bg-white">
            <CardContent className="pt-4">
              <pre className="text-xs bg-posthog-cream p-2 rounded overflow-auto font-mono border">
                {JSON.stringify(result, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )
    }
  }
  
  // Render mock response with data and actions
  const renderMockResponse = (message: any) => {
    if (!message.mockData || !message.mockActions) return null
    
    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'success':
          return <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        case 'progress':
          return <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          </div>
        case 'warning':
          return <div className="w-3 h-3 rounded-full bg-yellow-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        case 'error':
          return <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        default:
          return <div className="w-3 h-3 rounded-full bg-gray-500 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'success':
          return 'text-green-600'
        case 'progress':
          return 'text-blue-600'
        case 'warning':
          return 'text-yellow-600'
        case 'error':
          return 'text-red-600'
        default:
          return 'text-gray-600'
      }
    }
    
    return (
      <div className="mt-2">
        <Card className="border border-posthog-cream-dark bg-white shadow-sm">
          <CardContent className="p-3">
            {/* Compact Status Header */}
            <div className="flex items-center gap-2 mb-3">
              {getStatusIcon(message.mockStatus)}
              <div className="flex-1">
                <h4 className="font-medium text-posthog-black text-xs font-mono">OPERATION_COMPLETED</h4>
                <p className="text-xs text-posthog-gray font-mono">Status: {message.mockStatus?.toUpperCase()}</p>
              </div>
            </div>
            
            {/* Compact Data Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Object.entries(message.mockData).map(([key, value], index) => (
                <TooltipProvider key={key}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col p-2 bg-posthog-cream rounded border border-posthog-cream-dark hover:bg-posthog-cream-dark transition-colors cursor-help">
                        <span className="text-xs font-medium text-posthog-gray uppercase tracking-wide mb-1 font-mono">
                          {key}
                        </span>
                        <span className={`text-xs font-semibold ${index === 0 ? getStatusColor(message.mockStatus) : 'text-posthog-black'} font-mono`}>
                          {String(value)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="font-mono text-xs">
                      <p>{key}: {String(value)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
            
            {/* Compact Action Buttons */}
            <div className="flex gap-2">
              {message.mockActions.map((action: any, index: number) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 font-mono text-xs border border-posthog-cream-dark bg-white text-posthog-black hover:bg-posthog-cream-dark hover:text-white transition-all duration-200 h-7"
                        onClick={() => {
                          console.log(`Mock Action: ${action.action}`)
                          // Here you can add actual functionality for each action
                          // For now, just log to console
                        }}
                      >
                        <action.icon className="h-3 w-3 mr-1" />
                        {action.label}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="font-mono text-xs">
                      <p>Click to {action.label.toLowerCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const CommandTicker = () => {
    // Safety check for currentCommand
    if (!currentCommand) {
      return (
        <div className="bg-gradient-to-r from-muted to-background border-b border-border p-3">
          <div className="flex items-center justify-center">
            <div className="text-sm text-posthog-gray font-mono">Loading commands...</div>
          </div>
        </div>
      )
    }

    return (
      <Collapsible open={showCommandHelper} onOpenChange={setShowCommandHelper}>
        <div className="bg-gradient-to-r from-muted to-background border-b border-border">
          {/* Header - Always Visible */}
          <div className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center gap-2 text-sm text-posthog-black font-mono">
                  <Terminal className="h-4 w-4 text-brand-orange" />
                  <span className="font-medium">TRY:</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleQuickCommand(currentCommand.label)
                  }}
                  className="flex items-center gap-2 px-3 py-1 bg-card rounded border border-border hover:bg-accent transition-all text-sm font-mono text-foreground shadow-sm hover:shadow-md"
                >
                  <currentCommand.icon className="h-3 w-3" />
                  {currentCommand.label}
                  <Badge variant="outline" className="text-xs font-mono border-brand-orange text-brand-orange">
                    {currentCommand.category}
                  </Badge>
                  {currentCommand.mcp && (
                    <Badge variant="outline" className="text-xs font-mono border-green-500 text-green-600">
                      MCP
                    </Badge>
                  )}
                </button>
              </div>
              <CollapsibleTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-posthog-gray hover:text-posthog-black"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCommandHelper ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          {/* Expandable Content */}
          <CollapsibleContent className="overflow-hidden">
            <div className="px-3 pb-3 space-y-3">
              {/* Quick Commands Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {commands.slice(0, 8).map((command, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickCommand(command.label)}
                    className="flex items-center gap-2 p-2 text-xs bg-card rounded border border-border hover:border-primary hover:bg-accent transition-all text-left font-mono"
                  >
                    <command.icon className="h-3 w-3 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-foreground">{command.label}</div>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs font-mono border-brand-orange text-brand-orange">
                          {command.category}
                        </Badge>
                        {command.mcp && (
                          <Badge variant="outline" className="text-xs font-mono border-green-500 text-green-600">
                            MCP
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Additional Commands Section */}
              <div className="border-t border-border pt-3">
                <div className="text-xs font-mono text-posthog-gray mb-2">MORE_COMMANDS</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {commands.slice(8, 12).map((command, index) => (
                    <button
                      key={index + 8}
                      onClick={() => handleQuickCommand(command.label)}
                      className="flex items-center gap-2 p-2 text-xs bg-card rounded border border-border hover:border-primary hover:bg-accent transition-all text-left font-mono"
                    >
                      <command.icon className="h-3 w-3 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-foreground">{command.label}</div>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="outline" className="text-xs font-mono border-brand-orange text-brand-orange">
                            {command.category}
                          </Badge>
                          {command.mcp && (
                            <Badge variant="outline" className="text-xs font-mono border-green-500 text-green-600">
                              MCP
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    )
  }

  // Debug logging
  console.log("ChatTab render state:", { 
    useMockAPI, 
    mockMessages: mockMessages.length, 
    messages: messages.length,
    mockInput,
    input 
  })

  return (
    <BaseTab value="chat">
      <Card className="h-full flex flex-col border-posthog-cream-dark bg-white overflow-hidden">
        <CardHeader className="pb-2 border-b border-posthog-cream-dark flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                <Bot className="h-5 w-5 text-brand-orange" />
                AI_CO_PILOT
              </CardTitle>
              <div className="text-sm text-posthog-gray font-mono">
                Ready to help with day2 operations, infrastructure management, and automation
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-posthog-gray">REAL_API</span>
              <Switch
                checked={useMockAPI}
                onCheckedChange={setUseMockAPI}
                className="data-[state=checked]:bg-posthog-orange"
              />
              <span className="text-xs font-mono text-posthog-gray">MOCK_MODE</span>
            </div> */}
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 min-h-0">
          <CommandTicker />
          <div className="flex-1 flex flex-col p-4 min-h-0">
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {(useMockAPI ? mockMessages.length === 0 : messages.length === 0) && (
                    <div className="text-center text-posthog-gray py-8">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-brand-orange" />
                      <p className="text-lg font-medium mb-2 font-mono text-posthog-black">
                        WELCOME_TO_AI_CO_PILOT!
                      </p>
                      <p className="text-sm mb-4 font-mono">
                        YOUR_UNIFIED_AI-POWERED_INTERNAL_DEVELOPER_PLATFORM_ASSISTANT 
                      </p>
                      
                      {/* MCP Tools Overview */}
                      <button
                        onClick={() => setShowMCPTools(true)}
                        className="bg-posthog-cream p-4 rounded border border-posthog-cream-dark mb-4 max-w-md mx-auto hover:bg-posthog-cream-dark hover:border-posthog-cream transition-colors cursor-pointer w-full"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-brand-orange" />
                          <span className="text-sm font-medium text-posthog-black">MCP_TOOLS_READY</span>
                        </div>
                        <div className="text-xs text-posthog-gray font-mono">
                          {mcpTools.filter(t => t.status === 'active').length} tools active • 
                          {mcpTools.filter(t => t.status === 'connecting').length} connecting
                        </div>
                        <div className="text-xs text-brand-orange font-mono mt-2">
                          Click to manage integrations →
                        </div>
                      </button>

                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {commands.slice(0, 4).map((command, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickCommand(command.label)}
                            className="flex items-center gap-1 px-3 py-1 text-xs bg-muted text-brand-orange border border-brand-orange rounded hover:bg-primary hover:text-primary-foreground transition-colors font-mono"
                          >
                            <command.icon className="h-3 w-3" />
                            {command.label}
                            {command.mcp && (
                              <Badge variant="outline" className="text-xs font-mono border-green-500 text-green-600 ml-1">
                                MCP
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                                  {(useMockAPI ? mockMessages : messages).map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${
                        message.role === "user" ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 font-mono text-xs ${
                          message.role === "user"
                            ? "bg-posthog-cream-dark text-posthog-black"
                            : "bg-muted text-foreground border border-border"
                        }`}
                      >
                        {message.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                      </div>
                      <div
                        className={`rounded p-2 font-mono text-xs ${
                          message.role === "user"
                            ? "bg-posthog-cream-dark text-posthog-black border border-posthog-cream"
                            : "bg-card border border-border text-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        {useMockAPI && message.mockData && renderMockResponse(message)}
                        {!useMockAPI && message.toolInvocations?.map((toolInvocation: any, index: number) => (
                          <div key={index}>
                            {toolInvocation.state === "result" && renderToolResult(toolInvocation)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                  {(useMockAPI ? mockIsLoading : isLoading) && (
                    <div className="flex gap-2 justify-start">
                      <div className="w-6 h-6 rounded bg-muted border border-border flex items-center justify-center">
                        <Bot className="h-3 w-3 text-posthog-black" />
                      </div>
                      <div className="bg-white border border-posthog-cream-dark rounded p-2">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                          <span className="text-xs text-posthog-gray font-mono">THINKING...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <ContextualSuggestions
                onSuggestionClick={handleQuickCommand}
                lastMessage={messages[messages.length - 1]?.content || ""}
                isVisible={true}
                onClose={() => {}}
              />
            </div>

            <form onSubmit={useMockAPI ? handleMockSubmit : handleSubmit} className="flex gap-2 mt-4 flex-shrink-0">
              <div className="flex gap-2 flex-1">
                {/* <Button
                  size="sm"
                  variant="outline"
                  className="px-3 border-posthog-cream-dark hover:bg-posthog-cream-dark hover:text-white transition-colors"
                  onClick={() => {
                    console.log("Add integration clicked")
                    // Here you can add functionality to add new integrations
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button> */}
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3 border-posthog-cream-dark hover:bg-posthog-cream-dark hover:text-white transition-colors"
                  onClick={() => setShowMCPTools(!showMCPTools)}
                >
                  <Zap className="h-4 w-4" />
                </Button>
                <Textarea
                  ref={textareaRef}
                  value={useMockAPI ? mockInput : input}
                  onChange={useMockAPI ? (e) => setMockInput(e.target.value) : handleInputChange}
                  placeholder="ask_about_service_health,_deployments,_costs,_security..."
                  className="flex-1 font-mono text-sm border-border focus:ring-primary bg-card resize-none overflow-hidden min-h-[40px] max-h-[120px]"
                  disabled={useMockAPI ? mockIsLoading : isLoading}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      if (useMockAPI) {
                        handleMockSubmit(e)
                      } else {
                        handleSubmit(e)
                      }
                    }
                  }}
                />
              </div>
              <Button
                type="submit"
                disabled={useMockAPI ? mockIsLoading : isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
            
                        {/* MCP Tools and Integrations Dialog */}
            <Dialog open={showMCPTools} onOpenChange={setShowMCPTools}>
              <DialogContent className="max-w-3xl max-h-[85vh] p-0">
                <div className="p-6 border-b border-posthog-cream-dark">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-mono text-posthog-black flex items-center gap-2">
                      <Zap className="h-5 w-5 text-brand-orange" />
                      INTEGRATIONS_&_MCP_TOOLS
                    </DialogTitle>
                  </DialogHeader>
                  
                  {/* Search Bar */}
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-posthog-gray" />
                    <input
                      type="text"
                      placeholder="Search integrations..."
                      className="w-full pl-10 pr-4 py-3 border border-posthog-cream-dark rounded-md text-sm font-mono focus:ring-2 focus:ring-brand-orange focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Scrollable Content */}
                <ScrollArea className="max-h-[60vh] p-6">
                  {/* MCP Tools Status */}
                  <div className="space-y-4 mb-6">
                    <div className="bg-posthog-cream p-4 rounded-lg border border-posthog-cream-dark">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-4 w-4 text-brand-orange" />
                        <span className="text-sm font-mono font-medium text-posthog-black">MCP_TOOLS_AVAILABLE</span>
                      </div>
                      <div className="space-y-2">
                        {mcpTools.slice(0, 6).map((tool, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-posthog-cream-dark">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${
                                tool.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                              <span className="font-mono text-posthog-black text-sm">{tool.name}</span>
                            </div>
                            <Switch
                              checked={tool.status === 'active'}
                              onCheckedChange={() => {
                                console.log(`Toggle MCP tool: ${tool.name}`)
                                // Here you can add functionality to enable/disable MCP tools
                              }}
                              className="data-[state=checked]:bg-brand-orange"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  
                    {/* Integrations List */}
                    <div className="space-y-3">
                      {/* Web Search */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                            <Globe className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">Web Search</div>
                            <div className="text-xs text-posthog-gray">Search the web for real-time information</div>
                          </div>
                        </div>
                        <Switch
                          checked={true}
                          onCheckedChange={() => {}}
                          className="data-[state=checked]:bg-brand-orange"
                        />
                      </div>
                      
                      {/* GitHub */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">G</span>
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">GitHub</div>
                            <div className="text-xs text-posthog-gray">Repository management and code review</div>
                          </div>
                        </div>
                        <Switch
                          checked={true}
                          onCheckedChange={() => {}}
                          className="data-[state=checked]:bg-brand-orange"
                        />
                      </div>
                      
                      {/* Slack */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">Slack</div>
                            <div className="text-xs text-posthog-gray">Team communication and notifications</div>
                          </div>
                        </div>
                        <Switch
                          checked={false}
                          onCheckedChange={() => {}}
                          className="data-[state=checked]:bg-brand-orange"
                        />
                      </div>
                      
                      {/* Jira */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">J</span>
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">Jira</div>
                            <div className="text-xs text-posthog-gray">Project management and issue tracking</div>
                          </div>
                        </div>
                        <Switch
                          checked={true}
                          onCheckedChange={() => {}}
                          className="data-[state=checked]:bg-brand-orange"
                        />
                      </div>
                      
                      {/* Docker */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">D</span>
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">Docker</div>
                            <div className="text-xs text-posthog-gray">Container management and deployment</div>
                          </div>
                        </div>
                        <Switch
                          checked={false}
                          onCheckedChange={() => {}}
                          className="data-[state=checked]:bg-brand-orange"
                        />
                      </div>
                      
                      {/* PostgreSQL */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">P</span>
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">PostgreSQL</div>
                            <div className="text-xs text-posthog-gray">Database operations and queries</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={false}
                            onCheckedChange={() => {}}
                            className="data-[state=checked]:bg-brand-orange"
                          />
                          <ChevronRight className="h-4 w-4 text-posthog-gray" />
                        </div>
                      </div>
                      
                      {/* AWS */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">AWS</div>
                            <div className="text-xs text-posthog-gray">Cloud infrastructure and services</div>
                          </div>
                        </div>
                        <Switch
                          checked={true}
                          onCheckedChange={() => {}}
                          className="data-[state=checked]:bg-brand-orange"
                        />
                      </div>
                      
                      {/* Kubernetes */}
                      <div className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">K</span>
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">Kubernetes</div>
                            <div className="text-xs text-posthog-gray">Container orchestration and scaling</div>
                          </div>
                        </div>
                        <Switch
                          checked={true}
                          onCheckedChange={() => {}}
                          className="data-[state=checked]:bg-brand-orange"
                        />
                      </div>
                      
                      {/* Add Integrations */}
                      <button
                        onClick={() => {
                          setShowMCPTools(false)
                          router.push('/integrations?subtab=cloud')
                        }}
                        className="w-full flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark hover:bg-posthog-cream-dark hover:border-posthog-cream transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-brand-orange rounded flex items-center justify-center">
                            <Plus className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">Add Integration</div>
                            <div className="text-xs text-posthog-gray">Integrate with developer tools</div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-posthog-gray" />
                      </button>
                      
                      {/* Manage Integrations */}
                      <button
                        onClick={() => {
                          setShowMCPTools(false)
                          router.push('/integrations?subtab=cloud')
                        }}
                        className="w-full flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark hover:bg-posthog-cream-dark hover:border-posthog-cream transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center">
                            <Settings className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-posthog-black text-sm">Manage Integrations</div>
                            <div className="text-xs text-posthog-gray">Configure and manage all integrations</div>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-posthog-gray" />
                      </button>
                    </div>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </BaseTab>
  )
}

export default ChatTab 