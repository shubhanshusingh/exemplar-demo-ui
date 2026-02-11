import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { WorkflowVisualization } from './workflow-visualization'
import { initialActions, getActionsByCategory } from '@/lib/actions-data'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { 
  GitBranch, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  RefreshCw,
  History,
  BarChart3,
  Settings,
  Code,
  Users,
  Bot,
  Github,
  Slack,
  Trash2,
  Package,
  FileText,
  Workflow,
  Zap,
  Target,
  Calendar,
  TrendingUp,
  Shield,
  Plus,
  Grid3X3,
  List,
  Table,
  X,
  ArrowUp,
  ArrowDown,
  Save,
  Search,
  Server,
  Cloud,
  Database,
  Info,
  Circle
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface DeveloperWorkflowsSubtabProps {
  onQuickAction: (command: string) => void
}

interface WorkflowStep {
  id: string
  name: string
  description: string
  type: 'start' | 'process' | 'decision' | 'approval' | 'end'
  icon?: any
  duration?: string
  actions?: any[]
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: string
  complexity: string
  estimatedTime: string
  steps: number
  usage: string
  lastUpdated: string
  icon: any
  tags: string[]
  team: string
  status: string
  workflowSteps?: WorkflowStep[]
}

export const DeveloperWorkflowsSubtab: React.FC<DeveloperWorkflowsSubtabProps> = ({ onQuickAction }) => {
  const [activeTab, setActiveTab] = useState('templates')
  const [viewMode, setViewMode] = useState<"card" | "list" | "table">("table")
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    description: '',
    category: 'git',
    complexity: 'medium',
    team: 'engineering',
    estimatedTime: '',
    steps: [] as any[]
  })
  const [availableActions] = useState(initialActions)

  const workflowTemplates = [
    {
      id: "feature-branch-workflow",
      name: "Feature Branch Workflow",
      description: "Standard Git workflow for feature development with PR reviews",
      category: "git",
      complexity: "medium",
      estimatedTime: "2-3 days",
      steps: 8,
      usage: "89%",
      lastUpdated: "1 week ago",
      icon: GitBranch,
      tags: ["git", "pr", "review", "feature"],
      team: "engineering",
      status: "active",
      workflowSteps: [
        { 
          id: "step-1", 
          name: "CREATE_BRANCH", 
          description: "Create feature branch from main", 
          type: "start", 
          icon: GitBranch, 
          duration: "5 min",
          actions: [
            { id: "action-1", name: "Create Git Branch", type: "integration", integration: "GitHub Workflow", description: "Creates a new feature branch from main", config: { workflow: "create-branch.yml", branch_prefix: "feature/" } }
          ]
        },
        { 
          id: "step-2", 
          name: "DEVELOP", 
          description: "Implement feature changes", 
          type: "process", 
          icon: Code, 
          duration: "1-2 days",
          actions: [
            { id: "action-2", name: "Development Environment Setup", type: "custom", customActionId: "dev-env-setup", description: "Sets up local development environment" }
          ]
        },
        { 
          id: "step-3", 
          name: "COMMIT", 
          description: "Commit changes with descriptive messages", 
          type: "process", 
          icon: GitBranch, 
          duration: "30 min",
          actions: [
            { id: "action-3", name: "Git Commit", type: "integration", integration: "GitHub Workflow", description: "Commits changes with conventional commit messages", config: { enforce_conventional: true } }
          ]
        },
        { 
          id: "step-4", 
          name: "PUSH", 
          description: "Push branch to remote repository", 
          type: "process", 
          icon: Github, 
          duration: "5 min",
          actions: [
            { id: "action-4", name: "Push to Remote", type: "integration", integration: "GitHub Workflow", description: "Pushes branch to GitHub remote", config: { remote: "origin" } }
          ]
        },
        { 
          id: "step-5", 
          name: "CREATE_PR", 
          description: "Create pull request with description", 
          type: "process", 
          icon: FileText, 
          duration: "15 min",
          actions: [
            { id: "action-5", name: "Create Pull Request", type: "integration", integration: "GitHub Workflow", description: "Creates PR with template", config: { template: "feature-pr-template.md", auto_assign: true } }
          ]
        },
        { 
          id: "step-6", 
          name: "CODE_REVIEW", 
          description: "Request and conduct code review", 
          type: "approval", 
          icon: Eye, 
          duration: "2-4 hours",
          actions: [
            { id: "action-6", name: "Request Reviewers", type: "integration", integration: "GitHub Workflow", description: "Automatically requests code reviewers", config: { reviewers: "team-leads", required_approvals: 2 } },
            { id: "action-7", name: "Run Code Quality Checks", type: "custom", customActionId: "code-quality-check", description: "Runs linting and static analysis" }
          ]
        },
        { 
          id: "step-7", 
          name: "APPROVE", 
          description: "Get approval from reviewers", 
          type: "approval", 
          icon: CheckCircle, 
          duration: "1 hour",
          actions: [
            { id: "action-8", name: "Approval Workflow", type: "custom", customActionId: "pr-approval", description: "Manages approval process and notifications" }
          ]
        },
        { 
          id: "step-8", 
          name: "MERGE", 
          description: "Merge PR to main branch", 
          type: "end", 
          icon: GitBranch, 
          duration: "5 min",
          actions: [
            { id: "action-9", name: "Merge Pull Request", type: "integration", integration: "GitHub Workflow", description: "Merges PR using squash merge", config: { merge_method: "squash", delete_branch: true } }
          ]
        }
      ]
    },
    {
      id: "release-pipeline",
      name: "Release Pipeline",
      description: "Automated release process with staging and production deployment",
      category: "deployment",
      complexity: "high",
      estimatedTime: "1-2 weeks",
      steps: 15,
      usage: "76%",
      lastUpdated: "3 days ago",
      icon: Package,
      tags: ["deployment", "staging", "production", "automation"],
      team: "platform",
      status: "active",
      workflowSteps: [
        { 
          id: "step-1", 
          name: "VERSION_BUMP", 
          description: "Bump version in package.json", 
          type: "start", 
          icon: Package, 
          duration: "5 min",
          actions: [
            { id: "action-10", name: "Bump Version", type: "custom", customActionId: "version-bump", description: "Automatically bumps version in package.json" }
          ]
        },
        { 
          id: "step-2", 
          name: "BUILD", 
          description: "Run build process", 
          type: "process", 
          icon: Settings, 
          duration: "30 min",
          actions: [
            { id: "action-11", name: "Build Application", type: "integration", integration: "GitHub Workflow", description: "Runs build pipeline", config: { workflow: "build.yml", build_command: "npm run build" } }
          ]
        },
        { 
          id: "step-3", 
          name: "UNIT_TESTS", 
          description: "Execute unit test suite", 
          type: "process", 
          icon: CheckCircle, 
          duration: "15 min",
          actions: [
            { id: "action-12", name: "Run Unit Tests", type: "integration", integration: "GitHub Workflow", description: "Executes unit test suite", config: { test_command: "npm test" } }
          ]
        },
        { 
          id: "step-4", 
          name: "INTEGRATION_TESTS", 
          description: "Run integration tests", 
          type: "process", 
          icon: Zap, 
          duration: "45 min",
          actions: [
            { id: "action-13", name: "Run Integration Tests", type: "integration", integration: "GitHub Workflow", description: "Runs integration test suite", config: { test_command: "npm run test:integration" } }
          ]
        },
        { 
          id: "step-5", 
          name: "STAGING_DEPLOY", 
          description: "Deploy to staging environment", 
          type: "process", 
          icon: Package, 
          duration: "1 hour",
          actions: [
            { id: "action-14", name: "Deploy to Staging", type: "integration", integration: "ArgoCD", description: "Deploys application to staging", config: { environment: "staging", namespace: "staging" } }
          ]
        },
        { 
          id: "step-6", 
          name: "STAGING_TESTS", 
          description: "Run smoke tests on staging", 
          type: "process", 
          icon: CheckCircle, 
          duration: "30 min",
          actions: [
            { id: "action-15", name: "Smoke Tests", type: "custom", customActionId: "smoke-tests", description: "Runs smoke tests against staging environment" }
          ]
        },
        { 
          id: "step-7", 
          name: "STAGING_APPROVAL", 
          description: "Get approval for production", 
          type: "approval", 
          icon: Users, 
          duration: "2-4 hours",
          actions: [
            { id: "action-16", name: "Request Production Approval", type: "custom", customActionId: "prod-approval", description: "Sends approval request to stakeholders" }
          ]
        },
        { 
          id: "step-8", 
          name: "PROD_DEPLOY", 
          description: "Deploy to production", 
          type: "process", 
          icon: Package, 
          duration: "1 hour",
          actions: [
            { id: "action-17", name: "Deploy to Production", type: "integration", integration: "ArgoCD", description: "Deploys application to production", config: { environment: "production", namespace: "production", strategy: "blue-green" } }
          ]
        },
        { 
          id: "step-9", 
          name: "PROD_VERIFY", 
          description: "Verify production deployment", 
          type: "process", 
          icon: CheckCircle, 
          duration: "30 min",
          actions: [
            { id: "action-18", name: "Verify Deployment", type: "custom", customActionId: "deployment-verify", description: "Verifies production deployment health" }
          ]
        },
        { 
          id: "step-10", 
          name: "MONITOR", 
          description: "Monitor production metrics", 
          type: "process", 
          icon: BarChart3, 
          duration: "2 hours",
          actions: [
            { id: "action-19", name: "Monitor Metrics", type: "integration", integration: "Webhook", description: "Monitors production metrics via webhook", config: { webhook_url: "/api/monitoring", duration: "2h" } }
          ]
        },
        { 
          id: "step-11", 
          name: "RELEASE_NOTES", 
          description: "Update release notes", 
          type: "process", 
          icon: FileText, 
          duration: "15 min",
          actions: [
            { id: "action-20", name: "Generate Release Notes", type: "custom", customActionId: "release-notes", description: "Auto-generates release notes from commits" }
          ]
        },
        { 
          id: "step-12", 
          name: "NOTIFY_TEAM", 
          description: "Notify team of release", 
          type: "process", 
          icon: Slack, 
          duration: "5 min",
          actions: [
            { id: "action-21", name: "Send Slack Notification", type: "integration", integration: "Slack API", description: "Sends release notification to team", config: { channel: "#releases" } }
          ]
        },
        { 
          id: "step-13", 
          name: "TAG_RELEASE", 
          description: "Create git tag for release", 
          type: "process", 
          icon: GitBranch, 
          duration: "5 min",
          actions: [
            { id: "action-22", name: "Create Git Tag", type: "integration", integration: "GitHub Workflow", description: "Creates git tag for release", config: { tag_prefix: "v" } }
          ]
        },
        { 
          id: "step-14", 
          name: "DOCUMENT", 
          description: "Document release changes", 
          type: "process", 
          icon: FileText, 
          duration: "30 min",
          actions: [
            { id: "action-23", name: "Update Documentation", type: "custom", customActionId: "update-docs", description: "Updates project documentation" }
          ]
        },
        { 
          id: "step-15", 
          name: "COMPLETE", 
          description: "Release pipeline complete", 
          type: "end", 
          icon: CheckCircle, 
          duration: "0 min"
        }
      ]
    },
    {
      id: "hotfix-process",
      name: "Hotfix Process",
      description: "Emergency fix workflow for critical production issues",
      category: "emergency",
      complexity: "low",
      estimatedTime: "4-8 hours",
      steps: 5,
      usage: "45%",
      lastUpdated: "2 weeks ago",
      icon: AlertCircle,
      tags: ["emergency", "hotfix", "production", "critical"],
      team: "platform",
      status: "active",
      workflowSteps: [
        { 
          id: "step-1", 
          name: "IDENTIFY_ISSUE", 
          description: "Identify critical production issue", 
          type: "start", 
          icon: AlertCircle, 
          duration: "15 min",
          actions: [
            { id: "action-24", name: "Alert Monitoring", type: "integration", integration: "Webhook", description: "Receives alert from monitoring system", config: { severity: "critical" } }
          ]
        },
        { 
          id: "step-2", 
          name: "CREATE_HOTFIX", 
          description: "Create hotfix branch from main", 
          type: "process", 
          icon: GitBranch, 
          duration: "5 min",
          actions: [
            { id: "action-25", name: "Create Hotfix Branch", type: "integration", integration: "GitHub Workflow", description: "Creates hotfix branch", config: { branch_prefix: "hotfix/" } }
          ]
        },
        { 
          id: "step-3", 
          name: "FIX_AND_TEST", 
          description: "Implement fix and run tests", 
          type: "process", 
          icon: Code, 
          duration: "2-4 hours",
          actions: [
            { id: "action-26", name: "Run Critical Tests", type: "integration", integration: "GitHub Workflow", description: "Runs critical test suite only", config: { test_suite: "critical" } }
          ]
        },
        { 
          id: "step-4", 
          name: "EMERGENCY_DEPLOY", 
          description: "Deploy hotfix to production", 
          type: "process", 
          icon: Package, 
          duration: "30 min",
          actions: [
            { id: "action-27", name: "Emergency Production Deploy", type: "integration", integration: "ArgoCD", description: "Deploys hotfix to production with bypass", config: { environment: "production", bypass_approval: true } }
          ]
        },
        { 
          id: "step-5", 
          name: "VERIFY_FIX", 
          description: "Verify issue is resolved", 
          type: "end", 
          icon: CheckCircle, 
          duration: "30 min",
          actions: [
            { id: "action-28", name: "Verify Fix", type: "custom", customActionId: "hotfix-verify", description: "Verifies that the issue is resolved" }
          ]
        }
      ]
    },
    {
      id: "code-review-workflow",
      name: "Code Review Workflow",
      description: "Structured code review process with automated checks",
      category: "quality",
      complexity: "medium",
      estimatedTime: "1-2 days",
      steps: 6,
      usage: "92%",
      lastUpdated: "5 days ago",
      icon: Eye,
      tags: ["quality", "review", "automation", "standards"],
      team: "engineering",
      status: "active",
      workflowSteps: [
        { id: "step-1", name: "SUBMIT_PR", description: "Submit pull request", type: "start", icon: GitBranch, duration: "10 min" },
        { id: "step-2", name: "AUTO_CHECKS", description: "Run automated CI checks", type: "process", icon: Zap, duration: "20 min" },
        { id: "step-3", name: "REVIEW_REQUEST", description: "Request code review", type: "process", icon: Users, duration: "5 min" },
        { id: "step-4", name: "CODE_REVIEW", description: "Reviewer examines code", type: "approval", icon: Eye, duration: "1-4 hours" },
        { id: "step-5", name: "ADDRESS_FEEDBACK", description: "Address review comments", type: "process", icon: Code, duration: "2-6 hours" },
        { id: "step-6", name: "APPROVE_MERGE", description: "Approve and merge PR", type: "end", icon: CheckCircle, duration: "5 min" }
      ]
    },
    {
      id: "onboarding-checklist",
      name: "Developer Onboarding",
      description: "Step-by-step onboarding process for new team members",
      category: "people",
      complexity: "low",
      estimatedTime: "1 week",
      steps: 12,
      usage: "67%",
      lastUpdated: "1 month ago",
      icon: Users,
      tags: ["onboarding", "people", "training", "setup"],
      team: "hr",
      status: "active",
      workflowSteps: [
        { id: "step-1", name: "WELCOME", description: "Welcome new team member", type: "start", icon: Users, duration: "1 hour" },
        { id: "step-2", name: "ACCOUNT_SETUP", description: "Set up accounts and access", type: "process", icon: Settings, duration: "2 hours" },
        { id: "step-3", name: "DEV_ENV", description: "Configure development environment", type: "process", icon: Code, duration: "4 hours" },
        { id: "step-4", name: "REPO_ACCESS", description: "Grant repository access", type: "process", icon: Github, duration: "30 min" },
        { id: "step-5", name: "DOCUMENTATION", description: "Review documentation", type: "process", icon: FileText, duration: "2 hours" },
        { id: "step-6", name: "TRAINING", description: "Complete training modules", type: "process", icon: Users, duration: "1 day" },
        { id: "step-7", name: "MENTOR_ASSIGN", description: "Assign mentor", type: "process", icon: Users, duration: "30 min" },
        { id: "step-8", name: "FIRST_TASK", description: "Assign first task", type: "process", icon: Code, duration: "1 hour" },
        { id: "step-9", name: "TEAM_INTRO", description: "Introduce to team", type: "process", icon: Users, duration: "1 hour" },
        { id: "step-10", name: "TOOLS_TRAINING", description: "Training on internal tools", type: "process", icon: Settings, duration: "2 hours" },
        { id: "step-11", name: "REVIEW", description: "Review onboarding progress", type: "approval", icon: Eye, duration: "1 hour" },
        { id: "step-12", name: "COMPLETE", description: "Onboarding complete", type: "end", icon: CheckCircle, duration: "0 min" }
      ]
    },
    {
      id: "security-audit",
      name: "Security Audit Workflow",
      description: "Comprehensive security review and vulnerability assessment",
      category: "security",
      complexity: "high",
      estimatedTime: "2-3 weeks",
      steps: 20,
      usage: "34%",
      lastUpdated: "2 weeks ago",
      icon: Shield,
      tags: ["security", "audit", "vulnerability", "compliance"],
      team: "security",
      status: "active",
      workflowSteps: [
        { id: "step-1", name: "INITIATE_AUDIT", description: "Initiate security audit", type: "start", icon: Shield, duration: "1 hour" },
        { id: "step-2", name: "SCOPE_DEFINE", description: "Define audit scope", type: "process", icon: FileText, duration: "2 hours" },
        { id: "step-3", name: "DEPENDENCY_SCAN", description: "Scan dependencies for vulnerabilities", type: "process", icon: Package, duration: "4 hours" },
        { id: "step-4", name: "CODE_ANALYSIS", description: "Static code analysis", type: "process", icon: Code, duration: "1 day" },
        { id: "step-5", name: "PEN_TEST", description: "Penetration testing", type: "process", icon: Shield, duration: "3 days" },
        { id: "step-6", name: "CONFIG_REVIEW", description: "Review security configurations", type: "process", icon: Settings, duration: "1 day" },
        { id: "step-7", name: "ACCESS_REVIEW", description: "Review access controls", type: "process", icon: Users, duration: "1 day" },
        { id: "step-8", name: "COMPLIANCE_CHECK", description: "Check compliance requirements", type: "process", icon: CheckCircle, duration: "1 day" },
        { id: "step-9", name: "VULN_ASSESS", description: "Assess vulnerabilities", type: "process", icon: AlertCircle, duration: "2 days" },
        { id: "step-10", name: "REPORT", description: "Generate audit report", type: "process", icon: FileText, duration: "1 day" },
        { id: "step-11", name: "REVIEW_REPORT", description: "Review audit findings", type: "approval", icon: Eye, duration: "1 day" },
        { id: "step-12", name: "PRIORITIZE", description: "Prioritize remediation", type: "process", icon: Target, duration: "4 hours" },
        { id: "step-13", name: "REMEDIATE", description: "Remediate critical issues", type: "process", icon: Code, duration: "3 days" },
        { id: "step-14", name: "VERIFY_FIXES", description: "Verify fixes", type: "process", icon: CheckCircle, duration: "1 day" },
        { id: "step-15", name: "RETEST", description: "Retest vulnerabilities", type: "process", icon: Shield, duration: "1 day" },
        { id: "step-16", name: "DOCUMENT", description: "Document findings and fixes", type: "process", icon: FileText, duration: "4 hours" },
        { id: "step-17", name: "STAKEHOLDER_REVIEW", description: "Stakeholder review", type: "approval", icon: Users, duration: "1 day" },
        { id: "step-18", name: "FINAL_REPORT", description: "Final audit report", type: "process", icon: FileText, duration: "2 hours" },
        { id: "step-19", name: "ARCHIVE", description: "Archive audit records", type: "process", icon: FileText, duration: "1 hour" },
        { id: "step-20", name: "COMPLETE", description: "Security audit complete", type: "end", icon: CheckCircle, duration: "0 min" }
      ]
    }
  ]

  const recentExecutions = [
    {
      id: "exec-001",
      workflow: "Feature Branch Workflow",
      user: "alice.smith",
      status: "completed",
      startTime: "2 hours ago",
      duration: "45 minutes",
      team: "engineering",
      output: "Feature branch 'user-auth-v2' created successfully"
    },
    {
      id: "exec-002",
      workflow: "Release Pipeline",
      user: "platform-team",
      status: "running",
      startTime: "1 hour ago",
      duration: "ongoing",
      team: "platform",
      output: "Deploying to staging environment..."
    },
    {
      id: "exec-003",
      workflow: "Hotfix Process",
      user: "bob.jones",
      status: "failed",
      startTime: "30 minutes ago",
      duration: "15 minutes",
      team: "platform",
      output: "Deployment failed: insufficient resources"
    },
    {
      id: "exec-004",
      workflow: "Code Review Workflow",
      user: "charlie.brown",
      status: "completed",
      startTime: "4 hours ago",
      duration: "2 hours",
      team: "engineering",
      output: "PR #1234 approved and merged"
    }
  ]

  const workflowMetrics = [
    {
      title: "ACTIVE_WORKFLOWS",
      value: "24",
      change: "+3 this month",
      trend: "up",
      icon: Workflow,
      color: "text-blue-600",
    },
    {
      title: "AVG_EXECUTION_TIME",
      value: "2.3h",
      change: "-15%",
      trend: "down",
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "SUCCESS_RATE",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "TEAM_ADOPTION",
      value: "87%",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-purple-600",
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
    )
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-posthog-gray"
    }
  }

  const renderCardView = (workflows: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {workflows.map((template) => (
        <Card 
          key={template.id} 
          className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors cursor-pointer"
          onClick={() => setSelectedWorkflow(template)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <template.icon className="h-6 w-6 text-posthog-orange mt-1" />
              <div className="flex-1">
                <h4 className="font-mono text-sm font-medium text-posthog-black">{template.name}</h4>
                <p className="text-xs text-posthog-gray font-mono mt-1">{template.description}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-posthog-gray">Complexity:</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs font-mono ${getComplexityColor(template.complexity)} border-current`}
                >
                  {template.complexity.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-posthog-gray">Time:</span>
                <span className="text-posthog-black">{template.estimatedTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-posthog-gray">Steps:</span>
                <span className="text-posthog-black">{template.steps}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                  {template.team}
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-posthog-orange">{template.usage}</div>
                <div className="text-xs font-mono text-posthog-gray">ADOPTION</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  onQuickAction(`execute workflow ${template.name}`)
                }}
              >
                <Play className="h-3 w-3 mr-1" />
                EXECUTE
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedWorkflow(template)
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                VIEW
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = (workflows: any[]) => (
    <div className="space-y-3">
      {workflows.map((template) => (
        <Card key={template.id} className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <template.icon className="h-5 w-5 text-posthog-orange" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="text-sm font-mono font-medium text-posthog-black">{template.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${getComplexityColor(template.complexity)} border-current`}
                    >
                      {template.complexity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-posthog-gray font-mono">{template.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-mono text-posthog-gray">
                <span>{template.estimatedTime}</span>
                <span>{template.steps} steps</span>
                <span>{template.usage} adoption</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                  {template.team}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                  onClick={() => onQuickAction(`execute workflow ${template.name}`)}
                >
                  <Play className="h-3 w-3 mr-1" />
                  EXECUTE
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                  onClick={() => setSelectedWorkflow(template)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  VIEW
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTableView = (workflows: any[]) => (
    <div className="border border-posthog-cream-dark rounded-lg overflow-hidden">
      <div className="bg-posthog-cream px-4 py-3 border-b border-posthog-cream-dark">
        <div className="grid grid-cols-12 gap-4 font-mono text-xs font-medium text-posthog-black">
          <div className="col-span-3">WORKFLOW</div>
          <div className="col-span-3">DESCRIPTION</div>
          <div className="col-span-1">COMPLEXITY</div>
          <div className="col-span-1">TIME</div>
          <div className="col-span-1">STEPS</div>
          <div className="col-span-1">ADOPTION</div>
          <div className="col-span-1">TEAM</div>
          <div className="col-span-1">ACTIONS</div>
        </div>
      </div>
      
      <div className="bg-white">
        {workflows.map((template) => (
          <div key={template.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-posthog-cream-dark hover:bg-posthog-cream transition-colors">
            <div className="col-span-3 flex items-center gap-2">
              <template.icon className="h-4 w-4 text-posthog-orange" />
              <span className="font-mono text-sm font-medium text-posthog-black">{template.name}</span>
            </div>
            <div className="col-span-3">
              <p className="font-mono text-xs text-posthog-gray">{template.description}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
              <Badge 
                variant="outline" 
                className={`text-xs font-mono ${getComplexityColor(template.complexity)} border-current`}
              >
                {template.complexity.toUpperCase()}
              </Badge>
            </div>
            <div className="col-span-1 text-center">
              <span className="font-mono text-xs text-posthog-gray">{template.estimatedTime}</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="font-mono text-xs text-posthog-gray">{template.steps}</span>
            </div>
            <div className="col-span-1 text-center">
              <span className="font-mono text-xs text-posthog-gray">{template.usage}</span>
            </div>
            <div className="col-span-1 text-center">
              <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                {template.team}
              </Badge>
            </div>
            <div className="col-span-1 flex items-center justify-center gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                onClick={() => onQuickAction(`execute workflow ${template.name}`)}
              >
                <Play className="h-4 w-4" />
                </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                onClick={() => setSelectedWorkflow(template)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-posthog-black">DEVELOPER_WORKFLOWS</h1>
          <p className="text-posthog-gray font-mono text-sm">STANDARDIZED_WORKFLOW_TEMPLATES_AND_EXECUTION_TRACKING</p>
        </div>
        <div className="flex gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center border border-posthog-cream-dark rounded-md p-1 bg-white">
            <Button
              variant={viewMode === "card" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 font-mono text-xs ${viewMode === "card" ? "bg-posthog-orange text-white" : "text-posthog-gray hover:text-posthog-black"}`}
              onClick={() => setViewMode("card")}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              CARDS
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 font-mono text-xs ${viewMode === "list" ? "bg-posthog-orange text-white" : "text-posthog-gray hover:text-posthog-black"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4 mr-1" />
              LIST
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              className={`h-8 px-3 font-mono text-xs ${viewMode === "table" ? "bg-posthog-orange text-white" : "text-posthog-gray hover:text-posthog-black"}`}
              onClick={() => setViewMode("table")}
            >
              <Table className="h-4 w-4 mr-1" />
              TABLE
            </Button>
          </div>
          
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
          >
            <Plus className="h-4 w-4 mr-2" />
            CREATE_WORKFLOW
          </Button>
          <Button
            onClick={() => onQuickAction("show workflow analytics")}
            variant="outline"
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            ANALYTICS
          </Button>
        </div>
      </div>

      {/* Workflow Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workflowMetrics.map((metric, index) => (
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

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white border border-posthog-cream-dark">
          <TabsTrigger
            value="templates"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            WORKFLOW_TEMPLATES
          </TabsTrigger>
          <TabsTrigger
            value="executions"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            RECENT_EXECUTIONS
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            WORKFLOW_ANALYTICS
          </TabsTrigger>
        </TabsList>

        {/* Workflow Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {viewMode === "card" && renderCardView(workflowTemplates)}
          {viewMode === "list" && renderListView(workflowTemplates)}
          {viewMode === "table" && renderTableView(workflowTemplates)}
        </TabsContent>

        {/* Recent Executions Tab */}
        <TabsContent value="executions" className="space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="font-mono text-posthog-black">RECENT_EXECUTIONS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExecutions.map((execution) => (
                  <div key={execution.id} className="flex items-center gap-3 p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                    {getStatusIcon(execution.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono font-medium text-posthog-black">{execution.workflow}</span>
                        <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange">
                          {execution.team}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-posthog-gray font-mono">
                        <span>{execution.user}</span>
                        <span>Started {execution.startTime}</span>
                        <span>Duration: {execution.duration}</span>
                      </div>
                      <div className="mt-1 text-xs font-mono text-posthog-black">
                        {execution.output}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => onQuickAction("show all workflow executions")}
                variant="outline"
                size="sm"
                className="w-full mt-4 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange-light"
              >
                VIEW_ALL_EXECUTIONS
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflow Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-posthog-cream-dark bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                  <BarChart3 className="h-5 w-5 text-posthog-orange" />
                  WORKFLOW_PERFORMANCE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-posthog-gray font-mono">
                <p>• Feature Branch workflow has highest adoption (89%)</p>
                <p>• Release Pipeline complexity reduced by 15%</p>
                <p>• Hotfix Process success rate improved to 78%</p>
                <p>• Code Review workflow execution time: 2.1 hours avg</p>
              </CardContent>
            </Card>

            <Card className="border-posthog-cream-dark bg-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 font-mono text-posthog-black">
                  <Target className="h-5 w-5 text-posthog-orange" />
                  OPTIMIZATION_TIPS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-posthog-gray font-mono">
                <p>• Automate repetitive workflow steps</p>
                <p>• Standardize approval processes</p>
                <p>• Implement workflow templates for common tasks</p>
                <p>• Monitor execution metrics regularly</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Workflow Visualization - Fullscreen */}
      {selectedWorkflow && selectedWorkflow.workflowSteps && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="border-b border-posthog-cream-dark bg-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-mono text-lg font-bold text-posthog-black flex items-center gap-2">
                <Workflow className="h-5 w-5 text-posthog-orange" />
                {selectedWorkflow.name}
              </h2>
              <p className="font-mono text-sm text-posthog-gray mt-1">
                {selectedWorkflow.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs border-posthog-orange text-posthog-orange">
                {selectedWorkflow.category}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs border-posthog-orange text-posthog-orange">
                {selectedWorkflow.complexity.toUpperCase()}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedWorkflow(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <WorkflowVisualization 
              workflow={{
                id: selectedWorkflow.id,
                name: selectedWorkflow.name,
                description: selectedWorkflow.description,
                steps: selectedWorkflow.workflowSteps,
                category: selectedWorkflow.category,
                complexity: selectedWorkflow.complexity
              }}
              onClose={() => setSelectedWorkflow(null)}
              fullscreen={true}
            />
          </div>
        </div>
      )}

      {/* Create Workflow Dialog */}
      <CreateWorkflowDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        availableActions={availableActions}
        onSave={(workflow) => {
          // Add the new workflow to the templates list
          // In a real app, this would save to a backend
          toast({
            title: "Workflow Created",
            description: `${workflow.name} has been created successfully`,
            variant: "default"
          })
          setShowCreateDialog(false)
          // Reset form
          setWorkflowForm({
            name: '',
            description: '',
            category: 'git',
            complexity: 'medium',
            team: 'engineering',
            estimatedTime: '',
            steps: []
          })
        }}
      />
    </div>
  )
}

// Create Workflow Dialog Component
interface CreateWorkflowDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableActions: any[]
  onSave: (workflow: any) => void
}

const CreateWorkflowDialog: React.FC<CreateWorkflowDialogProps> = ({ 
  open, 
  onOpenChange, 
  availableActions,
  onSave 
}) => {
  const [workflowData, setWorkflowData] = useState({
    name: '',
    description: '',
    category: 'git',
    complexity: 'medium',
    team: 'engineering',
    estimatedTime: '',
    steps: [] as any[]
  })
  const [actionSearchTerm, setActionSearchTerm] = useState('')
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [showNodeEditDialog, setShowNodeEditDialog] = useState(false)
  const [showActionPanel, setShowActionPanel] = useState(false)
  const [showMetadataDialog, setShowMetadataDialog] = useState(false)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  
  // Convert steps to React Flow nodes and edges - using same structure as visualization
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = []
    const edges: Edge[] = []
    
    const nodeWidth = 240
    const nodeHeight = 140
    const horizontalSpacing = 300
    const startY = 150
    
    workflowData.steps.forEach((step, index) => {
      nodes.push({
        id: step.id,
        type: 'custom',
        position: { 
          x: index * horizontalSpacing + 50, 
          y: startY 
        },
        data: {
          ...step,
          name: step.name || `Step ${index + 1}`,
          onEdit: () => {
            setSelectedNodeId(step.id)
            setShowNodeEditDialog(true)
          },
          onAddAction: () => {
            setSelectedNodeId(step.id)
            setShowActionPanel(true)
          },
          onDelete: () => {
            const stepIndex = workflowData.steps.findIndex(s => s.id === step.id)
            if (stepIndex >= 0) {
              handleRemoveStep(stepIndex)
            }
          }
        },
        style: {
          width: nodeWidth,
          height: nodeHeight,
        },
      })
      
      // Connect to next step
      if (index < workflowData.steps.length - 1) {
        const nextStep = workflowData.steps[index + 1]
        edges.push({
          id: `e${step.id}-${nextStep.id}`,
          source: step.id,
          target: nextStep.id,
          type: 'smoothstep',
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#FF6B35',
          },
          style: {
            stroke: '#FF6B35',
            strokeWidth: 3,
          },
        })
      }
    })
    
    return { nodes, edges }
  }, [workflowData.steps])
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Sync nodes back to steps when nodes change
  useEffect(() => {
    const updatedSteps = nodes.map((node, index) => {
      const existingStep = workflowData.steps.find(s => s.id === node.id)
      return {
        ...existingStep,
        ...node.data,
        id: node.id,
        position: node.position
      }
    })
    if (updatedSteps.length !== workflowData.steps.length || 
        updatedSteps.some((step, i) => step.id !== workflowData.steps[i]?.id)) {
      setWorkflowData(prev => ({ ...prev, steps: updatedSteps }))
    }
  }, [nodes])


  const filteredActions = availableActions.filter(action =>
    action.title.toLowerCase().includes(actionSearchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(actionSearchTerm.toLowerCase())
  )

  const handleAddStep = (position?: { x: number; y: number }) => {
    const newStep = {
      id: `step-${Date.now()}`,
      name: `Step ${workflowData.steps.length + 1}`,
      description: '',
      type: workflowData.steps.length === 0 ? 'start' : 'process',
      icon: 'Zap',
      duration: '',
      actions: []
    }
    
    const newNode: Node = {
      id: newStep.id,
      type: 'custom',
      position: position || { 
        x: workflowData.steps.length * 300 + 50, 
        y: 150 
      },
      data: {
        ...newStep,
        name: newStep.name,
        onEdit: () => {
          setSelectedNodeId(newStep.id)
          setShowNodeEditDialog(true)
        },
        onAddAction: () => {
          setSelectedNodeId(newStep.id)
          setShowActionPanel(true)
        },
        onDelete: () => {
          const stepIndex = workflowData.steps.findIndex(s => s.id === newStep.id)
          if (stepIndex >= 0) {
            handleRemoveStep(stepIndex)
          }
        }
      },
      style: {
        width: 240,
        height: 140,
      },
    }
    
    setNodes((nds) => [...nds, newNode])
    setWorkflowData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
    setSelectedNodeId(newStep.id)
    setShowNodeEditDialog(true)
  }
  
  const onPaneClick = (event: React.MouseEvent) => {
    // Add node on double-click
    if (event.detail === 2) {
      const reactFlowBounds = reactFlowInstance?.getViewport()
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      if (position) {
        handleAddStep(position)
      }
    }
  }
  
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
      // Update step order based on connections
      const sourceStep = workflowData.steps.find(s => s.id === params.source)
      const targetStep = workflowData.steps.find(s => s.id === params.target)
      if (sourceStep && targetStep) {
        // Reorder steps based on connections
        const newSteps = [...workflowData.steps]
        const sourceIndex = newSteps.findIndex(s => s.id === params.source)
        const targetIndex = newSteps.findIndex(s => s.id === params.target)
        if (sourceIndex >= 0 && targetIndex >= 0 && sourceIndex < targetIndex) {
          // Already in correct order
        } else if (sourceIndex >= 0 && targetIndex >= 0) {
          // Move target after source
          const [target] = newSteps.splice(targetIndex, 1)
          newSteps.splice(sourceIndex + 1, 0, target)
          setWorkflowData(prev => ({ ...prev, steps: newSteps }))
        }
      }
    },
    [setEdges, workflowData.steps]
  )
  
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach(node => {
        const stepIndex = workflowData.steps.findIndex(s => s.id === node.id)
        if (stepIndex >= 0) {
          handleRemoveStep(stepIndex)
        }
      })
    },
    [workflowData.steps]
  )

  const handleRemoveStep = (index: number) => {
    const stepToRemove = workflowData.steps[index]
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }))
    // Remove node from React Flow
    setNodes((nds) => nds.filter((node) => node.id !== stepToRemove.id))
    if (selectedNodeId === stepToRemove.id) {
      setSelectedNodeId(null)
      setShowNodeEditDialog(false)
      setShowActionPanel(false)
    }
  }

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === workflowData.steps.length - 1) return

    const newSteps = [...workflowData.steps]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
    
    setWorkflowData(prev => ({ ...prev, steps: newSteps }))
    
    // Update first step to 'start' and last to 'end'
    if (newSteps.length > 0) {
      newSteps[0].type = 'start'
      if (newSteps.length > 1) {
        newSteps[newSteps.length - 1].type = 'end'
        for (let i = 1; i < newSteps.length - 1; i++) {
          if (newSteps[i].type === 'start' || newSteps[i].type === 'end') {
            newSteps[i].type = 'process'
          }
        }
      }
    }
  }

  const handleUpdateStep = (index: number, field: string, value: any) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === index ? { ...step, [field]: value } : step
      )
    }))
  }

  const handleAddActionToStep = (stepIndex: number, action: any) => {
    const workflowAction = {
      id: `action-${Date.now()}`,
      name: action.title,
      type: 'custom' as const,
      customActionId: action.id,
      description: action.description,
      config: {}
    }
    
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === stepIndex 
          ? { ...step, actions: [...(step.actions || []), workflowAction] }
          : step
      )
    }))
  }

  const handleRemoveActionFromStep = (stepIndex: number, actionIndex: number) => {
    setWorkflowData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => 
        i === stepIndex 
          ? { ...step, actions: step.actions?.filter((_: any, ai: number) => ai !== actionIndex) || [] }
          : step
      )
    }))
  }

  const handleSave = () => {
    if (workflowData.steps.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one step is required",
        variant: "destructive"
      })
      return
    }

    // Validate all steps have names
    const invalidSteps = workflowData.steps.filter(step => !step.name.trim())
    if (invalidSteps.length > 0) {
      toast({
        title: "Validation Error",
        description: "All steps must have a name",
        variant: "destructive"
      })
      return
    }

    // Show metadata dialog instead of saving directly
    setShowMetadataDialog(true)
  }

  const handleSaveWithMetadata = (metadata: any) => {
    const newWorkflow = {
      id: `workflow-${Date.now()}`,
      name: metadata.name || `Workflow ${Date.now()}`,
      description: metadata.description || '',
      category: metadata.category || 'git',
      complexity: metadata.complexity || 'medium',
      estimatedTime: metadata.estimatedTime || '',
      steps: workflowData.steps.length,
      usage: "0%",
      lastUpdated: "just now",
      icon: Workflow,
      tags: [metadata.category || 'git'],
      team: metadata.team || 'engineering',
      status: "active",
      workflowSteps: workflowData.steps.map((step, index) => ({
        ...step,
        id: `step-${index + 1}`,
        type: index === 0 ? 'start' : index === workflowData.steps.length - 1 ? 'end' : step.type,
        // Keep icon as string - will be converted to component when rendering
        icon: typeof step.icon === 'string' ? step.icon : 'Zap'
      }))
    }

    onSave(newWorkflow)
    setShowMetadataDialog(false)
    onOpenChange(false)
    // Reset form
    setWorkflowData({
      name: '',
      description: '',
      category: 'git',
      complexity: 'medium',
      team: 'engineering',
      estimatedTime: '',
      steps: []
    })
    setActionSearchTerm('')
    setSelectedNodeId(null)
    setShowNodeEditDialog(false)
    setShowActionPanel(false)
    setNodes([])
    setEdges([])
  }

  const categories = ['git', 'deployment', 'quality', 'security', 'people', 'emergency']
  const complexities = ['low', 'medium', 'high']
  const teams = ['engineering', 'platform', 'security', 'hr', 'devops']
  const stepTypes = ['start', 'process', 'approval', 'decision', 'end']

  if (!open) return null

  // Create CustomNode component similar to workflow-visualization
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Server, Github, Slack, Lock, Settings, Zap, Code, Users, Shield, Bot,
      Package, FileText, BarChart3, History, Play, Cloud, Database, CheckCircle,
      AlertCircle, Eye, GitBranch, Workflow, Circle
    }
    return iconMap[iconName] || Circle
  }

  const getActionIcon = (action: any) => {
    if (action.type === 'integration') {
      switch (action.integration) {
        case 'GitHub Workflow':
          return Github
        case 'Webhook':
          return Server
        default:
          return Settings
      }
    }
    return Zap
  }

  // Custom Node Component matching workflow-visualization
  const CustomNode = ({ data, selected }: any) => {
    const [showActions, setShowActions] = useState(false)

    const getIcon = () => {
      if (data.icon) {
        if (typeof data.icon === 'string') {
          const IconComponent = getIconComponent(data.icon)
          return <IconComponent className="h-5 w-5" />
        } else if (typeof data.icon === 'function') {
          const IconComponent = data.icon
          return <IconComponent className="h-5 w-5" />
        }
      }
      // Default icon based on type
      const iconMap: { [key: string]: any } = {
        start: CheckCircle,
        end: XCircle,
        approval: Shield,
        decision: AlertCircle,
        process: Zap
      }
      const IconComponent = iconMap[data.type] || Circle
      return <IconComponent className="h-5 w-5" />
    }

    const getNodeColor = () => {
      switch (data.type) {
        case 'start':
          return 'bg-green-500 border-green-600'
        case 'end':
          return 'bg-red-500 border-red-600'
        case 'decision':
          return 'bg-yellow-500 border-yellow-600'
        case 'approval':
          return 'bg-blue-500 border-blue-600'
        default:
          return 'bg-posthog-orange border-posthog-orange-dark'
      }
    }

    return (
      <>
        <Handle type="target" position={Position.Top} style={{ background: '#FF6B35' }} />
        <div className={`px-4 py-3 rounded-lg border-2 ${getNodeColor()} shadow-lg min-w-[200px] relative ${selected ? 'ring-2 ring-posthog-orange' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-white">{getIcon()}</div>
            <div className="text-white font-mono text-xs font-bold flex-1">{data.name || 'Unnamed Step'}</div>
            {data.actions && data.actions.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowActions(true)
                }}
                title="View Actions"
              >
                <Info className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                data.onEdit()
              }}
              title="Edit Step"
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                data.onAddAction()
              }}
              title="Add Action"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                data.onDelete()
              }}
              title="Delete Step"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          {data.description && (
            <div className="text-white/90 font-mono text-xs mt-1">{data.description}</div>
          )}
          {data.duration && (
            <div className="text-white/80 font-mono text-xs mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {data.duration}
            </div>
          )}
          {data.actions && data.actions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="text-white/80 font-mono text-xs flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {data.actions.length} {data.actions.length === 1 ? 'Action' : 'Actions'}
              </div>
            </div>
          )}
        </div>
        <Handle type="source" position={Position.Bottom} style={{ background: '#FF6B35' }} />

        {/* Actions Dialog */}
        <Dialog open={showActions} onOpenChange={setShowActions}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-mono text-posthog-black">
                NODE_ACTIONS: {data.name}
              </DialogTitle>
              <DialogDescription className="font-mono text-posthog-gray">
                {data.description}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {data.actions?.map((action: any) => {
                const ActionIcon = getActionIcon(action)
                return (
                  <Card key={action.id} className="border-posthog-cream-dark bg-white">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-posthog-orange/10 rounded-lg">
                          <ActionIcon className="h-5 w-5 text-posthog-orange" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-sm font-medium text-posthog-black">
                              {action.name}
                            </span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs font-mono ${
                                action.type === 'integration' 
                                  ? 'border-blue-500 text-blue-600' 
                                  : 'border-posthog-orange text-posthog-orange'
                              }`}
                            >
                              {action.type === 'integration' ? 'INTEGRATION' : 'CUSTOM'}
                            </Badge>
                          </div>
                          {action.integration && (
                            <div className="text-xs font-mono text-posthog-gray mb-1">
                              Integration: {action.integration}
                            </div>
                          )}
                          {action.customActionId && (
                            <div className="text-xs font-mono text-posthog-gray mb-1">
                              Action ID: {action.customActionId}
                            </div>
                          )}
                          {action.description && (
                            <p className="text-xs font-mono text-posthog-gray mt-1">
                              {action.description}
                            </p>
                          )}
                          {action.config && Object.keys(action.config).length > 0 && (
                            <div className="mt-2 p-2 bg-posthog-cream rounded border border-posthog-cream-dark">
                              <div className="text-xs font-mono font-bold text-posthog-black mb-1">
                                CONFIGURATION:
                              </div>
                              <div className="space-y-1">
                                {Object.entries(action.config).map(([key, value]) => (
                                  <div key={key} className="text-xs font-mono text-posthog-gray">
                                    <span className="font-medium">{key}:</span> {String(value)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  const nodeTypes: NodeTypes = {
    custom: CustomNode,
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-posthog-cream-dark bg-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-mono text-lg font-bold text-posthog-black flex items-center gap-2">
            <Plus className="h-5 w-5 text-posthog-orange" />
            CREATE_NEW_WORKFLOW
          </h2>
          <p className="font-mono text-sm text-posthog-gray mt-1">
            Build a workflow by adding steps and selecting actions. Double-click canvas to add steps.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => handleAddStep()}
            size="sm"
            className="font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            ADD_STEP
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content - Only React Flow Editor */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full border border-posthog-cream-dark overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodesDelete={onNodesDelete}
            onPaneClick={onPaneClick}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
            className="bg-posthog-cream"
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            connectionLineStyle={{ stroke: '#FF6B35', strokeWidth: 3 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#FF6B35', strokeWidth: 3 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#FF6B35',
              },
            }}
          >
            <Background color="#E5E5E5" gap={16} />
            <Controls className="bg-white border border-posthog-cream-dark rounded-md" />
            <MiniMap 
              className="bg-white border border-posthog-cream-dark rounded-md"
              nodeColor={(node) => {
                switch (node.data?.type) {
                  case 'start': return '#10B981'
                  case 'end': return '#EF4444'
                  case 'decision': return '#F59E0B'
                  case 'approval': return '#3B82F6'
                  default: return '#FF6B35'
                }
              }}
              pannable
              zoomable
            />
          </ReactFlow>
          
          {workflowData.steps.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center py-8 text-posthog-gray font-mono text-sm bg-white/80 p-4 rounded-lg border border-posthog-cream-dark">
                <p className="mb-2">Double-click on canvas or click "ADD_STEP" to add a step</p>
                <p className="text-xs">Drag from one step to another to connect them</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-posthog-cream-dark bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono text-posthog-gray">
              {workflowData.steps.length} {workflowData.steps.length === 1 ? 'step' : 'steps'} added
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                className="font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
                disabled={workflowData.steps.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                SAVE_WORKFLOW
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false)
                  setWorkflowData({
                    name: '',
                    description: '',
                    category: 'git',
                    complexity: 'medium',
                    team: 'engineering',
                    estimatedTime: '',
                    steps: []
                  })
                  setActionSearchTerm('')
                  setSelectedNodeId(null)
                  setShowNodeEditDialog(false)
                  setShowActionPanel(false)
                  setShowMetadataDialog(false)
                  setNodes([])
                  setEdges([])
                }}
                className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
        
        {/* Node Edit Dialog */}
        {showNodeEditDialog && selectedNodeId && (
          <NodeEditDialog
            nodeId={selectedNodeId || ''}
            step={workflowData.steps.find(s => s.id === selectedNodeId)}
            onSave={(updatedStep) => {
              const stepIndex = workflowData.steps.findIndex(s => s.id === selectedNodeId)
              if (stepIndex >= 0) {
                handleUpdateStep(stepIndex, 'name', updatedStep.name)
                handleUpdateStep(stepIndex, 'description', updatedStep.description)
                handleUpdateStep(stepIndex, 'type', updatedStep.type)
                handleUpdateStep(stepIndex, 'duration', updatedStep.duration)
              }
              setShowNodeEditDialog(false)
              setSelectedNodeId(null)
            }}
            onClose={() => {
              setShowNodeEditDialog(false)
              setSelectedNodeId(null)
            }}
            stepTypes={stepTypes}
          />
        )}
        
        {/* Action Panel */}
        {showActionPanel && selectedNodeId && (
          <ActionPanel
            nodeId={selectedNodeId || ''}
            step={workflowData.steps.find(s => s.id === selectedNodeId)}
            availableActions={availableActions}
            filteredActions={filteredActions}
            actionSearchTerm={actionSearchTerm}
            onSearchChange={setActionSearchTerm}
            onAddAction={(action) => {
              const stepIndex = workflowData.steps.findIndex(s => s.id === selectedNodeId)
              if (stepIndex >= 0) {
                handleAddActionToStep(stepIndex, action)
              }
            }}
            onRemoveAction={(actionIndex) => {
              const stepIndex = workflowData.steps.findIndex(s => s.id === selectedNodeId)
              if (stepIndex >= 0) {
                handleRemoveActionFromStep(stepIndex, actionIndex)
              }
            }}
            onClose={() => {
              setShowActionPanel(false)
              setSelectedNodeId(null)
            }}
          />
        )}

        {/* Metadata Dialog - Shown after clicking SAVE */}
        {showMetadataDialog && (
          <MetadataDialog
            workflowData={workflowData}
            onSave={handleSaveWithMetadata}
            onCancel={() => setShowMetadataDialog(false)}
            categories={categories}
            complexities={complexities}
            teams={teams}
          />
        )}
      </div>
    </div>
  )
}

// Metadata Dialog Component - Shown at the end
interface MetadataDialogProps {
  workflowData: any
  onSave: (metadata: any) => void
  onCancel: () => void
  categories: string[]
  complexities: string[]
  teams: string[]
}

const MetadataDialog: React.FC<MetadataDialogProps> = ({
  workflowData,
  onSave,
  onCancel,
  categories,
  complexities,
  teams
}) => {
  const [metadata, setMetadata] = useState({
    name: '',
    description: '',
    category: 'git',
    complexity: 'medium',
    team: 'engineering',
    estimatedTime: ''
  })

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-posthog-black flex items-center gap-2">
            <Save className="h-5 w-5 text-posthog-orange" />
            WORKFLOW_METADATA
          </DialogTitle>
          <DialogDescription className="font-mono text-posthog-gray">
            Add metadata for your workflow ({workflowData.steps.length} steps)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className="font-mono text-xs text-posthog-black">WORKFLOW_NAME *</Label>
            <Input
              value={metadata.name}
              onChange={(e) => setMetadata(prev => ({ ...prev, name: e.target.value }))}
              className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange"
              placeholder="Enter workflow name"
            />
          </div>
          <div>
            <Label className="font-mono text-xs text-posthog-black">DESCRIPTION</Label>
            <Textarea
              value={metadata.description}
              onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
              className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange"
              placeholder="Describe the workflow"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="font-mono text-xs text-posthog-black">CATEGORY</Label>
              <Select
                value={metadata.category}
                onValueChange={(value) => setMetadata(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="font-mono text-xs">
                      {cat.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-mono text-xs text-posthog-black">COMPLEXITY</Label>
              <Select
                value={metadata.complexity}
                onValueChange={(value) => setMetadata(prev => ({ ...prev, complexity: value }))}
              >
                <SelectTrigger className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complexities.map((comp) => (
                    <SelectItem key={comp} value={comp} className="font-mono text-xs">
                      {comp.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-mono text-xs text-posthog-black">TEAM</Label>
              <Select
                value={metadata.team}
                onValueChange={(value) => setMetadata(prev => ({ ...prev, team: value }))}
              >
                <SelectTrigger className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team} className="font-mono text-xs">
                      {team.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="font-mono text-xs text-posthog-black">ESTIMATED_TIME</Label>
            <Input
              value={metadata.estimatedTime}
              onChange={(e) => setMetadata(prev => ({ ...prev, estimatedTime: e.target.value }))}
              className="font-mono text-sm border-posthog-cream-dark focus:border-posthog-orange"
              placeholder="e.g., 2-3 days"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onSave(metadata)}
              disabled={!metadata.name.trim()}
              className="flex-1 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              CREATE_WORKFLOW
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
            >
              CANCEL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Node Edit Dialog Component
interface NodeEditDialogProps {
  nodeId: string
  step: any
  onSave: (step: any) => void
  onClose: () => void
  stepTypes: string[]
}

const NodeEditDialog: React.FC<NodeEditDialogProps> = ({ nodeId, step, onSave, onClose, stepTypes }) => {
  const [editedStep, setEditedStep] = useState(step || {
    name: '',
    description: '',
    type: 'process',
    duration: ''
  })
  
  if (!step) return null
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono text-posthog-black">EDIT_STEP</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className="font-mono text-xs text-posthog-black">STEP_NAME *</Label>
            <Input
              value={editedStep.name}
              onChange={(e) => setEditedStep((prev: any) => ({ ...prev, name: e.target.value }))}
              className="font-mono text-sm border-posthog-cream-dark"
              placeholder="e.g., CREATE_BRANCH"
            />
          </div>
          <div>
            <Label className="font-mono text-xs text-posthog-black">STEP_TYPE</Label>
            <Select
              value={editedStep.type}
              onValueChange={(value) => setEditedStep((prev: any) => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="font-mono text-sm border-posthog-cream-dark">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stepTypes.map((type) => (
                  <SelectItem key={type} value={type} className="font-mono text-xs">
                    {type.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-mono text-xs text-posthog-black">DESCRIPTION</Label>
            <Textarea
              value={editedStep.description}
              onChange={(e) => setEditedStep((prev: any) => ({ ...prev, description: e.target.value }))}
              className="font-mono text-sm border-posthog-cream-dark"
              placeholder="Step description"
              rows={2}
            />
          </div>
          <div>
            <Label className="font-mono text-xs text-posthog-black">DURATION</Label>
            <Input
              value={editedStep.duration}
              onChange={(e) => setEditedStep((prev: any) => ({ ...prev, duration: e.target.value }))}
              className="font-mono text-sm border-posthog-cream-dark"
              placeholder="e.g., 5 min"
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => onSave(editedStep)}
              className="flex-1 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              SAVE
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
            >
              CANCEL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Action Panel Component
interface ActionPanelProps {
  nodeId: string
  step: any
  availableActions: any[]
  filteredActions: any[]
  actionSearchTerm: string
  onSearchChange: (term: string) => void
  onAddAction: (action: any) => void
  onRemoveAction: (actionIndex: number) => void
  onClose: () => void
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  nodeId,
  step,
  availableActions,
  filteredActions,
  actionSearchTerm,
  onSearchChange,
  onAddAction,
  onRemoveAction,
  onClose
}) => {
  if (!step) return null
  
  return (
    <div className="fixed right-6 top-20 w-80 bg-white border border-posthog-cream-dark rounded-lg shadow-lg z-[60] max-h-[calc(100vh-120px)] flex flex-col">
      <div className="p-3 border-b border-posthog-cream-dark flex items-center justify-between">
        <h4 className="font-mono text-sm font-bold text-posthog-black">ADD_ACTIONS</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-3 border-b border-posthog-cream-dark">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-posthog-gray h-4 w-4" />
          <Input
            placeholder="Search actions..."
            value={actionSearchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-mono text-sm border-posthog-cream-dark"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredActions.map((action) => {
            const isAdded = step.actions?.some((a: any) => a.customActionId === action.id)
            return (
              <div
                key={action.id}
                className="flex items-center justify-between p-2 bg-posthog-cream rounded border border-posthog-cream-dark hover:border-posthog-orange transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-medium text-posthog-black truncate">
                    {action.title}
                  </div>
                  <div className="font-mono text-xs text-posthog-gray truncate">
                    {action.description}
                  </div>
                  <Badge variant="outline" className="text-xs font-mono border-posthog-orange text-posthog-orange mt-1">
                    {action.backendIntegration}
                  </Badge>
                </div>
                <Button
                  variant={isAdded ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (isAdded) {
                      const actionIndex = step.actions?.findIndex((a: any) => a.customActionId === action.id)
                      if (actionIndex !== undefined && actionIndex >= 0) {
                        onRemoveAction(actionIndex)
                      }
                    } else {
                      onAddAction(action)
                    }
                  }}
                  className={`font-mono text-xs ml-2 ${
                    isAdded 
                      ? "bg-posthog-orange hover:bg-posthog-orange-dark text-white" 
                      : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ADDED
                    </>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 mr-1" />
                      ADD
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </ScrollArea>
      {step.actions && step.actions.length > 0 && (
        <div className="p-3 border-t border-posthog-cream-dark">
          <div className="font-mono text-xs font-bold text-posthog-black mb-2">ADDED_ACTIONS</div>
          <div className="space-y-2">
            {step.actions.map((action: any, actionIndex: number) => {
              const actionData = availableActions.find(a => a.id === action.customActionId)
              return (
                <div
                  key={action.id}
                  className="flex items-center justify-between p-2 bg-posthog-cream rounded border border-posthog-cream-dark"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs font-medium text-posthog-black truncate">
                      {action.name}
                    </div>
                    {action.description && (
                      <div className="font-mono text-xs text-posthog-gray truncate">
                        {action.description}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAction(actionIndex)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
} 