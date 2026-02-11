"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Github,
  GitBranch,
  AlertTriangle,
  FileText,
  MessageSquare,
  CheckCircle,
  Settings,
  Plus,
  Activity,
  Database,
  Zap,
  BookOpen,
  ExternalLink,
  BarChart3,
  Shield,
  Code,
  ToggleLeft,
  DollarSign,
  Users,
  Bot,
  Search,
  X,
  Grid3X3,
  List,
  Play,
  Info,
  Server,
  Cloud,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  History,
  Clock,
  XCircle,
  Package,
  Trash2,
} from "lucide-react"
import { getActionsByBackendIntegration, getBackendIntegrationForService, getAvailableOperations } from "@/lib/actions-data"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ExternalServicesProps {
  onQuickAction: (command: string) => void
}

const devToolsServices = [
  // CI/CD & Git (8 tools)
  {
    id: "github",
    name: "GitHub",
    description: "Visualize ownership and repo metadata",
    icon: Github,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "2 minutes ago",
    repositories: 47,
    webhooks: 12,
    config: {
      organization: "company-org",
      token: "ghp_****",
      webhookUrl: "https://api.company.com/webhooks/github",
    },
  },
  {
    id: "gitlab",
    name: "GitLab",
    description: "Track GitLab repos and deployments",
    icon: GitBranch,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "1 minute ago",
    repositories: 23,
    webhooks: 8,
    config: {
      instance: "gitlab.company.com",
      token: "glpat-****",
      webhookUrl: "https://api.company.com/webhooks/gitlab",
    },
  },
  {
    id: "bitbucket",
    name: "Bitbucket",
    description: "Sync Bitbucket repos to software entities",
    icon: GitBranch,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "3 minutes ago",
    repositories: 15,
    webhooks: 5,
    config: {
      workspace: "company-workspace",
      appPassword: "****",
      webhookUrl: "https://api.company.com/webhooks/bitbucket",
    },
  },
  {
    id: "jenkins",
    name: "Jenkins",
    description: "Track build history as cataloged activity",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "30 seconds ago",
    jobs: 89,
    builds: 1247,
    config: {
      url: "https://jenkins.company.com",
      username: "jenkins-user",
      token: "****",
    },
  },
  {
    id: "circleci",
    name: "CircleCI",
    description: "Sync pipelines to track delivery in real-time",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "1 minute ago",
    projects: 34,
    pipelines: 156,
    config: {
      token: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/circleci",
    },
  },
  {
    id: "azure-devops",
    name: "Azure DevOps",
    description: "Ingest repo and project data into the platform",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "2 minutes ago",
    projects: 12,
    repositories: 28,
    config: {
      organization: "company",
      personalAccessToken: "****",
      webhookUrl: "https://api.company.com/webhooks/azure-devops",
    },
  },
  {
    id: "github-workflows",
    name: "GitHub Workflows",
    description: "Trigger your GitHub workflows directly from the platform",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "1 minute ago",
    workflows: 45,
    runs: 234,
    config: {
      token: "ghp_****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/github-workflows",
    },
  },
  {
    id: "gitlab-pipelines",
    name: "GitLab Pipelines",
    description: "Link pipeline runs to catalog entities",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "2 minutes ago",
    pipelines: 67,
    jobs: 189,
    config: {
      token: "glpat-****",
      instance: "gitlab.company.com",
      webhookUrl: "https://api.company.com/webhooks/gitlab-pipelines",
    },
  },

  // Infrastructure as Code (3 tools)
  {
    id: "terraform",
    name: "Terraform",
    description: "Map infrastructure to service ownership",
    icon: Settings,
    category: "INFRASTRUCTURE",
    status: "connected",
    lastSync: "5 minutes ago",
    workspaces: 23,
    runs: 89,
    config: {
      token: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/terraform",
    },
  },
  {
    id: "pulumi",
    name: "Pulumi",
    description: "Sync infra state into service blueprints",
    icon: Settings,
    category: "INFRASTRUCTURE",
    status: "connected",
    lastSync: "3 minutes ago",
    projects: 12,
    stacks: 45,
    config: {
      accessToken: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/pulumi",
    },
  },
  {
    id: "terraform-cloud",
    name: "Terraform Cloud",
    description: "Track Terraform runs across environments",
    icon: Settings,
    category: "INFRASTRUCTURE",
    status: "connected",
    lastSync: "1 minute ago",
    workspaces: 23,
    runs: 89,
    config: {
      token: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/terraform-cloud",
    },
  },

  // Cloud & Containers (6 tools)
  {
    id: "aws",
    name: "AWS",
    description: "View AWS resources in software context",
    icon: Activity,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "30 seconds ago",
    services: 45,
    resources: 234,
    config: {
      accessKeyId: "AKIA****",
      secretAccessKey: "****",
      region: "us-east-1",
    },
  },
  {
    id: "gcp",
    name: "GCP",
    description: "Sync GCP metadata into the software graph",
    icon: Activity,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "1 minute ago",
    projects: 8,
    services: 23,
    config: {
      serviceAccountKey: "****",
      projectId: "company-project",
      webhookUrl: "https://api.company.com/webhooks/gcp",
    },
  },
  {
    id: "azure",
    name: "Azure",
    description: "Map Azure infrastructure to service blueprints",
    icon: Activity,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "2 minutes ago",
    subscriptions: 3,
    resources: 156,
    config: {
      clientId: "****",
      clientSecret: "****",
      tenantId: "****",
      subscriptionId: "****",
    },
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    description: "Bring K8s resource state into the platform",
    icon: Settings,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "30 seconds ago",
    clusters: 5,
    namespaces: 23,
    config: {
      kubeconfig: "****",
      context: "company-cluster",
      webhookUrl: "https://api.company.com/webhooks/kubernetes",
    },
  },
  {
    id: "openshift",
    name: "Red Hat OpenShift",
    description: "Visualize OpenShift workloads as software entities",
    icon: Settings,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "1 minute ago",
    clusters: 2,
    projects: 12,
    config: {
      token: "****",
      server: "https://openshift.company.com",
      webhookUrl: "https://api.company.com/webhooks/openshift",
    },
  },
  {
    id: "argocd",
    name: "ArgoCD",
    description: "Track deployments and rollout status in real time",
    icon: Activity,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "30 seconds ago",
    applications: 34,
    repositories: 12,
    config: {
      token: "****",
      server: "https://argocd.company.com",
      webhookUrl: "https://api.company.com/webhooks/argocd",
    },
  },

  // Observability & Monitoring (7 tools)
  {
    id: "prometheus",
    name: "Prometheus",
    description: "Sync Prometheus alerts with services",
    icon: Activity,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "30 seconds ago",
    targets: 89,
    alerts: 23,
    config: {
      url: "https://prometheus.company.com",
      username: "prometheus-user",
      password: "****",
    },
  },
  {
    id: "grafana",
    name: "Grafana",
    description: "Add Grafana dashboards into the catalog",
    icon: BarChart3,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "1 minute ago",
    dashboards: 67,
    alerts: 45,
    config: {
      url: "https://grafana.company.com",
      apiKey: "****",
      webhookUrl: "https://api.company.com/webhooks/grafana",
    },
  },
  {
    id: "datadog",
    name: "Datadog",
    description: "Add Datadog alerts directly into the catalog",
    icon: Activity,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "1 minute ago",
    dashboards: 23,
    alerts: 156,
    config: {
      apiKey: "dd_****",
      appKey: "app_****",
      site: "datadoghq.com",
    },
  },
  {
    id: "new-relic",
    name: "New Relic",
    description: "Access New Relic views within the platform",
    icon: BarChart3,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "2 minutes ago",
    applications: 34,
    alerts: 78,
    config: {
      apiKey: "****",
      accountId: "****",
      webhookUrl: "https://api.company.com/webhooks/new-relic",
    },
  },
  {
    id: "dynatrace",
    name: "Dynatrace",
    description: "Visualize service health from Dynatrace insights",
    icon: BarChart3,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "1 minute ago",
    services: 56,
    problems: 12,
    config: {
      apiToken: "****",
      environmentId: "****",
      webhookUrl: "https://api.company.com/webhooks/dynatrace",
    },
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Monitor errors and alert thresholds",
    icon: AlertTriangle,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "30 seconds ago",
    projects: 23,
    issues: 89,
    config: {
      authToken: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/sentry",
    },
  },
  {
    id: "statuspage",
    name: "Statuspage",
    description: "Monitor component health alongside incidents",
    icon: Activity,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "1 minute ago",
    pages: 3,
    components: 45,
    config: {
      apiKey: "****",
      pageId: "****",
      webhookUrl: "https://api.company.com/webhooks/statuspage",
    },
  },

  // Incident Management & Alerting (5 tools)
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Visualize on-call and incident ownership",
    icon: AlertTriangle,
    category: "INCIDENT_MANAGEMENT",
    status: "connected",
    lastSync: "30 seconds ago",
    services: 18,
    incidents: 3,
    config: {
      apiToken: "pd_****",
      serviceId: "PXXXXXX",
      escalationPolicy: "EXXXXXX",
    },
  },
  {
    id: "opsgenie",
    name: "OpsGenie",
    description: "Centralize alerts and escalations in the platform",
    icon: AlertTriangle,
    category: "INCIDENT_MANAGEMENT",
    status: "connected",
    lastSync: "1 minute ago",
    teams: 8,
    alerts: 23,
    config: {
      apiKey: "****",
      webhookUrl: "https://api.company.com/webhooks/opsgenie",
    },
  },
  {
    id: "servicenow",
    name: "ServiceNow",
    description: "Sync incidents and groups to the catalog",
    icon: AlertTriangle,
    category: "INCIDENT_MANAGEMENT",
    status: "connected",
    lastSync: "2 minutes ago",
    incidents: 45,
    groups: 12,
    config: {
      username: "****",
      password: "****",
      instance: "company.service-now.com",
    },
  },
  {
    id: "jira",
    name: "Jira",
    description: "Link Jira issues to services in the platform",
    icon: CheckCircle,
    category: "INCIDENT_MANAGEMENT",
    status: "connected",
    lastSync: "5 minutes ago",
    projects: 12,
    issues: 234,
    config: {
      domain: "company.atlassian.net",
      email: "admin@company.com",
      apiToken: "atl_****",
    },
  },
  {
    id: "incident-io",
    name: "incident.io",
    description: "Sync service ownership into incident workflows",
    icon: AlertTriangle,
    category: "INCIDENT_MANAGEMENT",
    status: "connected",
    lastSync: "1 minute ago",
    incidents: 23,
    services: 34,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/incident-io",
    },
  },

  // Security & Compliance (6 tools)
  {
    id: "snyk",
    name: "Snyk",
    description: "Import data from your Snyk account into the platform",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "2 minutes ago",
    projects: 67,
    vulnerabilities: 23,
    config: {
      apiToken: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/snyk",
    },
  },
  {
    id: "trivy",
    name: "Trivy",
    description: "Ingest security alerts from Trivy scans",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "1 minute ago",
    scans: 89,
    findings: 45,
    config: {
      serverUrl: "https://trivy.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/trivy",
    },
  },
  {
    id: "sonarqube",
    name: "SonarQube",
    description: "Track code quality in scorecards",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "3 minutes ago",
    projects: 45,
    qualityGates: 12,
    config: {
      url: "https://sonarqube.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/sonarqube",
    },
  },
  {
    id: "checkmarx",
    name: "Checkmarx",
    description: "Ingest IaC vulnerabilities into scorecards",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "2 minutes ago",
    projects: 34,
    scans: 78,
    config: {
      url: "https://checkmarx.company.com",
      username: "****",
      password: "****",
    },
  },
  {
    id: "stackhawk",
    name: "StackHawk",
    description: "Ingest vulnerability alerts into the catalog",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "1 minute ago",
    applications: 23,
    findings: 56,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/stackhawk",
    },
  },
  {
    id: "wiz",
    name: "Wiz",
    description: "Monitor cloud risk and compliance from the platform",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "2 minutes ago",
    projects: 12,
    issues: 89,
    config: {
      clientId: "****",
      clientSecret: "****",
      webhookUrl: "https://api.company.com/webhooks/wiz",
    },
  },

  // Code Quality & Testing (4 tools)
  {
    id: "codecov",
    name: "Codecov",
    description: "Track test coverage across repos",
    icon: Code,
    category: "CODE_QUALITY",
    status: "connected",
    lastSync: "1 minute ago",
    repositories: 45,
    coverage: "87%",
    config: {
      token: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/codecov",
    },
  },

  {
    id: "jfrog",
    name: "JFrog",
    description: "Monitor artifacts and pipeline builds in the platform",
    icon: Code,
    category: "CODE_QUALITY",
    status: "connected",
    lastSync: "2 minutes ago",
    repositories: 23,
    artifacts: 156,
    config: {
      url: "https://jfrog.company.com",
      username: "****",
      password: "****",
    },
  },
  {
    id: "sbom",
    name: "SBOM",
    description: "Visualize software bill of materials by service",
    icon: Code,
    category: "CODE_QUALITY",
    status: "connected",
    lastSync: "1 minute ago",
    services: 34,
    components: 234,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/sbom",
    },
  },

  // Feature Management (2 tools)
  {
    id: "launchdarkly",
    name: "LaunchDarkly",
    description: "Map toggles to service ownership",
    icon: ToggleLeft,
    category: "FEATURE_MANAGEMENT",
    status: "connected",
    lastSync: "1 minute ago",
    projects: 12,
    flags: 45,
    config: {
      apiKey: "****",
      environment: "production",
      webhookUrl: "https://api.company.com/webhooks/launchdarkly",
    },
  },
  {
    id: "split",
    name: "Split",
    description: "Track feature flag status by service",
    icon: ToggleLeft,
    category: "FEATURE_MANAGEMENT",
    status: "connected",
    lastSync: "2 minutes ago",
    environments: 3,
    flags: 23,
    config: {
      apiKey: "****",
      environment: "production",
      webhookUrl: "https://api.company.com/webhooks/split",
    },
  },

  // Cost Management (3 tools)
  {
    id: "aws-cost",
    name: "AWS Cost",
    description: "Import your AWS Cost report into the platform",
    icon: DollarSign,
    category: "COST_MANAGEMENT",
    status: "connected",
    lastSync: "1 hour ago",
    accounts: 3,
    monthlySpend: "$12,345",
    config: {
      accessKeyId: "AKIA****",
      secretAccessKey: "****",
      region: "us-east-1",
    },
  },
  {
    id: "kubecost",
    name: "KubeCost",
    description: "Allocate Kubernetes spend by service",
    icon: DollarSign,
    category: "COST_MANAGEMENT",
    status: "connected",
    lastSync: "30 minutes ago",
    clusters: 5,
    monthlySpend: "$2,345",
    config: {
      url: "https://kubecost.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/kubecost",
    },
  },
  {
    id: "opencost",
    name: "OpenCost",
    description: "Import cost from your OpenCost instance into the platform",
    icon: DollarSign,
    category: "COST_MANAGEMENT",
    status: "connected",
    lastSync: "1 hour ago",
    clusters: 3,
    monthlySpend: "$1,234",
    config: {
      url: "https://opencost.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/opencost",
    },
  },

  // Identity & Access Management (5 tools)
  {
    id: "azure-ad",
    name: "Azure AD",
    description: "Manage access using Azure group permissions",
    icon: Users,
    category: "IDENTITY_&_ACCESS",
    status: "connected",
    lastSync: "5 minutes ago",
    users: 234,
    groups: 45,
    config: {
      clientId: "****",
      clientSecret: "****",
      tenantId: "****",
    },
  },
  {
    id: "google-workspace",
    name: "Google Workspace",
    description: "Sync identity to manage team permissions",
    icon: Users,
    category: "IDENTITY_&_ACCESS",
    status: "connected",
    lastSync: "3 minutes ago",
    users: 189,
    groups: 34,
    config: {
      serviceAccountKey: "****",
      domain: "company.com",
      webhookUrl: "https://api.company.com/webhooks/google-workspace",
    },
  },
  {
    id: "okta",
    name: "Okta",
    description: "Control access via Okta role mapping",
    icon: Users,
    category: "IDENTITY_&_ACCESS",
    status: "connected",
    lastSync: "2 minutes ago",
    users: 156,
    groups: 28,
    config: {
      apiToken: "****",
      domain: "company.okta.com",
      webhookUrl: "https://api.company.com/webhooks/okta",
    },
  },
  {
    id: "onelogin",
    name: "OneLogin",
    description: "Align OneLogin groups with access controls",
    icon: Users,
    category: "IDENTITY_&_ACCESS",
    status: "connected",
    lastSync: "1 minute ago",
    users: 98,
    groups: 23,
    config: {
      clientId: "****",
      clientSecret: "****",
      region: "us",
      webhookUrl: "https://api.company.com/webhooks/onelogin",
    },
  },
  {
    id: "jumpcloud",
    name: "JumpCloud",
    description: "Bring JumpCloud identity into platform roles",
    icon: Users,
    category: "IDENTITY_&_ACCESS",
    status: "connected",
    lastSync: "2 minutes ago",
    users: 67,
    groups: 19,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/jumpcloud",
    },
  },

  // Collaboration & Communication (3 tools)
  {
    id: "slack",
    name: "Slack",
    description: "Query and act on data from Slack",
    icon: MessageSquare,
    category: "COLLABORATION",
    status: "connected",
    lastSync: "1 minute ago",
    channels: 45,
    users: 127,
    config: {
      botToken: "xoxb-****",
      appToken: "xapp-****",
      signingSecret: "****",
    },
  },
  {
    id: "linear",
    name: "Linear",
    description: "View Linear tasks by team and service",
    icon: MessageSquare,
    category: "COLLABORATION",
    status: "connected",
    lastSync: "2 minutes ago",
    teams: 8,
    issues: 156,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/linear",
    },
  },


  // AI Agents & MCP (2 tools)
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    description: "Ingest Copilot usage metrics into the platform",
    icon: Bot,
    category: "AI_AGENTS_&_MCP",
    status: "connected",
    lastSync: "1 minute ago",
    repositories: 34,
    suggestions: 1234,
    config: {
      token: "ghp_****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/github-copilot",
    },
  },
  {
    id: "mcp-server",
    name: "MCP Server",
    description: "Coordinate AI agents with software context in real time",
    icon: Bot,
    category: "AI_AGENTS_&_MCP",
    status: "connected",
    lastSync: "30 seconds ago",
    agents: 12,
    tools: 45,
    config: {
      endpoint: "mcp://company-mcp-server",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/mcp-server",
    },
  },

  // Additional Missing Integrations (26 tools)
  {
    id: "falco-sidekick",
    name: "Falco Sidekick",
    description: "Security runtime detection and alerting",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "2 minutes ago",
    rules: 45,
    alerts: 12,
    config: {
      endpoint: "https://falco.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/falco",
    },
  },
  {
    id: "cookiecutter",
    name: "Cookiecutter",
    description: "Project template generation and scaffolding",
    icon: Code,
    category: "CODE_QUALITY",
    status: "connected",
    lastSync: "1 minute ago",
    templates: 23,
    projects: 156,
    config: {
      repository: "https://github.com/company/cookiecutter-templates",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/cookiecutter",
    },
  },
  {
    id: "amplication",
    name: "Amplication",
    description: "Low-code backend development platform",
    icon: Code,
    category: "CODE_QUALITY",
    status: "connected",
    lastSync: "3 minutes ago",
    projects: 12,
    services: 45,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/amplication",
    },
  },

  {
    id: "kyverno",
    name: "Kyverno",
    description: "Kubernetes policy management and enforcement",
    icon: Shield,
    category: "SECURITY_&_COMPLIANCE",
    status: "connected",
    lastSync: "2 minutes ago",
    policies: 34,
    violations: 5,
    config: {
      namespace: "kyverno",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/kyverno",
    },
  },
  {
    id: "fluxcd",
    name: "FluxCD",
    description: "GitOps continuous delivery for Kubernetes",
    icon: GitBranch,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "30 seconds ago",
    repositories: 23,
    deployments: 156,
    config: {
      namespace: "flux-system",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/fluxcd",
    },
  },
  {
    id: "humanitec",
    name: "Humanitec",
    description: "Platform engineering and developer experience",
    icon: Users,
    category: "DEVELOPER_PORTALS",
    status: "connected",
    lastSync: "1 minute ago",
    applications: 34,
    environments: 12,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/humanitec",
    },
  },
  {
    id: "kratix",
    name: "Kratix (by Syntasso)",
    description: "Platform-as-a-Product framework for Kubernetes",
    icon: Settings,
    category: "DEVELOPER_PORTALS",
    status: "connected",
    lastSync: "2 minutes ago",
    platforms: 8,
    services: 23,
    config: {
      namespace: "kratix-system",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/kratix",
    },
  },
  {
    id: "port-ocean",
    name: "Ocean",
    description: "Open-source data platform for software catalogs",
    icon: Database,
    category: "DEVELOPER_PORTALS",
    status: "connected",
    lastSync: "1 minute ago",
    integrations: 45,
    entities: 1234,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/port-ocean",
    },
  },
  {
    id: "backstage",
    name: "Backstage",
    description: "Developer portal and service catalog",
    icon: Users,
    category: "DEVELOPER_PORTALS",
    status: "connected",
    lastSync: "3 minutes ago",
    services: 67,
    components: 234,
    config: {
      url: "https://backstage.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/backstage",
    },
  },
  {
    id: "gitops",
    name: "GitOps",
    description: "Git-based continuous deployment",
    icon: GitBranch,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "1 minute ago",
    repositories: 23,
    deployments: 89,
    config: {
      namespace: "gitops-system",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/gitops",
    },
  },
  {
    id: "api",
    name: "API",
    description: "Generic API integration and management",
    icon: Code,
    category: "API_MANAGEMENT",
    status: "connected",
    lastSync: "2 minutes ago",
    endpoints: 45,
    requests: 1234,
    config: {
      baseUrl: "https://api.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/generic-api",
    },
  },
  {
    id: "port-s3",
    name: "S3 Storage",
    description: "S3-based data storage and retrieval",
    icon: Database,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "1 minute ago",
    buckets: 12,
    objects: 5678,
    config: {
      bucket: "company-port-data",
      accessKey: "****",
      secretKey: "****",
    },
  },
  {
    id: "google-cloud-build",
    name: "Google Cloud Build",
    description: "Cloud-native continuous integration",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "30 seconds ago",
    builds: 234,
    triggers: 45,
    config: {
      projectId: "company-project",
      serviceAccount: "****",
      webhookUrl: "https://api.company.com/webhooks/gcb",
    },
  },
  {
    id: "asyncapi",
    name: "AsyncAPI",
    description: "Event-driven API specification and documentation",
    icon: Code,
    category: "API_MANAGEMENT",
    status: "connected",
    lastSync: "2 minutes ago",
    specifications: 23,
    channels: 67,
    config: {
      registry: "https://registry.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/asyncapi",
    },
  },
  {
    id: "swagger",
    name: "Swagger",
    description: "API documentation and testing platform",
    icon: BookOpen,
    category: "API_MANAGEMENT",
    status: "connected",
    lastSync: "1 minute ago",
    apis: 34,
    endpoints: 234,
    config: {
      url: "https://swagger.company.com",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/swagger",
    },
  },
  {
    id: "octopus-deploy",
    name: "Octopus Deploy",
    description: "Automated deployment and release management",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "2 minutes ago",
    projects: 23,
    deployments: 156,
    config: {
      url: "https://octopus.company.com",
      apiKey: "****",
      webhookUrl: "https://api.company.com/webhooks/octopus",
    },
  },
  {
    id: "komodor",
    name: "Komodor",
    description: "Kubernetes troubleshooting and monitoring",
    icon: Activity,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "1 minute ago",
    clusters: 5,
    events: 234,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/komodor",
    },
  },
  {
    id: "kafka",
    name: "Kafka",
    description: "Distributed streaming platform",
    icon: Activity,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "30 seconds ago",
    topics: 45,
    partitions: 234,
    config: {
      brokers: "kafka.company.com:9092",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/kafka",
    },
  },
  {
    id: "firehydrant",
    name: "FireHydrant",
    description: "Incident response and management platform",
    icon: AlertTriangle,
    category: "INCIDENT_MANAGEMENT",
    status: "connected",
    lastSync: "1 minute ago",
    incidents: 12,
    services: 34,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/firehydrant",
    },
  },
  {
    id: "knative",
    name: "Knative",
    description: "Kubernetes-based serverless platform",
    icon: Settings,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "2 minutes ago",
    services: 23,
    revisions: 67,
    config: {
      namespace: "knative-serving",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/knative",
    },
  },
  {
    id: "webhook",
    name: "Webhook",
    description: "Generic webhook integration and management",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "1 minute ago",
    endpoints: 34,
    events: 567,
    config: {
      url: "https://webhooks.company.com",
      secret: "****",
      webhookUrl: "https://api.company.com/webhooks/generic",
    },
  },
  {
    id: "azure-pipelines",
    name: "Azure Pipelines",
    description: "Azure DevOps CI/CD pipeline management",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "30 seconds ago",
    pipelines: 45,
    runs: 234,
    config: {
      organization: "company",
      project: "main-project",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/azure-pipelines",
    },
  },
  {
    id: "istio",
    name: "Istio",
    description: "Service mesh for microservices",
    icon: Settings,
    category: "CLOUD_&_CONTAINERS",
    status: "connected",
    lastSync: "1 minute ago",
    services: 45,
    policies: 23,
    config: {
      namespace: "istio-system",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/istio",
    },
  },
  {
    id: "kubernetes-exporter",
    name: "Kubernetes Exporter",
    description: "Kubernetes metrics and monitoring exporter",
    icon: Activity,
    category: "OBSERVABILITY",
    status: "connected",
    lastSync: "2 minutes ago",
    clusters: 5,
    metrics: 1234,
    config: {
      namespace: "monitoring",
      token: "****",
      webhookUrl: "https://api.company.com/webhooks/k8s-exporter",
    },
  },
  {
    id: "codefresh",
    name: "Codefresh",
    description: "GitOps-native CI/CD platform",
    icon: Activity,
    category: "CI/CD_&_GIT",
    status: "connected",
    lastSync: "1 minute ago",
    pipelines: 34,
    builds: 156,
    config: {
      apiKey: "****",
      organization: "company-org",
      webhookUrl: "https://api.company.com/webhooks/codefresh",
    },
  }
]

const mcpServers = [
  {
    id: "filesystem-mcp",
    name: "Filesystem MCP",
    description: "File system operations and management",
    icon: Database,
    status: "active",
    endpoint: "mcp://filesystem",
    capabilities: ["read", "write", "list", "search"],
    lastActivity: "2 minutes ago",
  },
  {
    id: "git-mcp",
    name: "Git MCP",
    description: "Git repository operations",
    icon: GitBranch,
    status: "active",
    endpoint: "mcp://git",
    capabilities: ["clone", "commit", "push", "pull", "branch"],
    lastActivity: "5 minutes ago",
  },
  {
    id: "docker-mcp",
    name: "Docker MCP",
    description: "Container management and operations",
    icon: Zap,
    status: "active",
    endpoint: "mcp://docker",
    capabilities: ["build", "run", "stop", "logs", "inspect"],
    lastActivity: "1 minute ago",
  },
  {
    id: "kubernetes-mcp",
    name: "Kubernetes MCP",
    description: "Kubernetes cluster management",
    icon: Settings,
    status: "inactive",
    endpoint: "mcp://kubernetes",
    capabilities: ["deploy", "scale", "logs", "describe"],
    lastActivity: "1 hour ago",
  },
  {
    id: "database-mcp",
    name: "Database MCP",
    description: "Database operations and queries",
    icon: Database,
    status: "active",
    endpoint: "mcp://database",
    capabilities: ["query", "migrate", "backup", "restore"],
    lastActivity: "3 minutes ago",
  },
]

export default function ExternalServices({ onQuickAction }: ExternalServicesProps) {
  const [selectedService, setSelectedService] = useState<any>(null)
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["ALL"])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [addMCPServerDialogOpen, setAddMCPServerDialogOpen] = useState(false)
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false)
  const [selectedServiceForActions, setSelectedServiceForActions] = useState<any>(null)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "disconnected":
      case "inactive":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "syncing":
        return <Activity className="h-4 w-4 text-posthog-orange animate-pulse" />
      default:
        return <AlertTriangle className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "CI/CD_&_GIT":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "INFRASTRUCTURE":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "CLOUD_&_CONTAINERS":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "OBSERVABILITY":
        return "bg-green-100 text-green-800 border-green-200"
      case "INCIDENT_MANAGEMENT":
        return "bg-red-100 text-red-800 border-red-200"
      case "SECURITY_&_COMPLIANCE":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "CODE_QUALITY":
        return "bg-teal-100 text-teal-800 border-teal-200"
      case "FEATURE_MANAGEMENT":
        return "bg-pink-100 text-pink-800 border-pink-200"
      case "COST_MANAGEMENT":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "IDENTITY_&_ACCESS":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "COLLABORATION":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "AI_AGENTS_&_MCP":
        return "bg-violet-100 text-violet-800 border-violet-200"
      case "DEVELOPER_PORTALS":
        return "bg-rose-100 text-rose-800 border-rose-200"
      case "API_MANAGEMENT":
        return "bg-sky-100 text-sky-800 border-sky-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryDotColor = (category: string) => {
    switch (category) {
      case "CI/CD_&_GIT":
        return "#3b82f6" // blue-500
      case "INFRASTRUCTURE":
        return "#8b5cf6" // purple-500
      case "CLOUD_&_CONTAINERS":
        return "#6366f1" // indigo-500
      case "OBSERVABILITY":
        return "#10b981" // green-500
      case "INCIDENT_MANAGEMENT":
        return "#ef4444" // red-500
      case "SECURITY_&_COMPLIANCE":
        return "#f97316" // orange-500
      case "CODE_QUALITY":
        return "#14b8a6" // teal-500
      case "FEATURE_MANAGEMENT":
        return "#ec4899" // pink-500
      case "COST_MANAGEMENT":
        return "#059669" // emerald-500
      case "IDENTITY_&_ACCESS":
        return "#06b6d4" // cyan-500
      case "COLLABORATION":
        return "#f59e0b" // amber-500
      case "AI_AGENTS_&_MCP":
        return "#8b5cf6" // violet-500
      case "DEVELOPER_PORTALS":
        return "#f43f5e" // rose-500
      case "API_MANAGEMENT":
        return "#0ea5e9" // sky-500
      default:
        return "#6b7280" // gray-500
    }
  }

  // Get unique categories for filter
  const getUniqueCategories = () => {
    const categories = [...new Set(devToolsServices.map(service => service.category))]
    return ["ALL", ...categories]
  }

  // Filter services based on selected categories and search query
  const getFilteredServices = () => {
    let filtered = devToolsServices

    // Filter by categories
    if (!selectedCategories.includes("ALL")) {
      filtered = filtered.filter(service => selectedCategories.includes(service.category))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  // Get service count for each category
  const getCategoryCount = (category: string) => {
    if (category === "ALL") {
      return devToolsServices.length
    }
    return devToolsServices.filter(service => service.category === category).length
  }

  // Handle category selection for multi-select
  const handleCategoryToggle = (category: string) => {
    if (category === "ALL") {
      setSelectedCategories(["ALL"])
    } else {
      setSelectedCategories(prev => {
        const newCategories = prev.includes(category) 
          ? prev.filter(c => c !== category)
          : [...prev.filter(c => c !== "ALL"), category]
        
        // If no categories selected, default to ALL
        return newCategories.length === 0 ? ["ALL"] : newCategories
      })
    }
  }

  const handleServiceToggle = (serviceId: string, enabled: boolean) => {
    // Simulate service connection/disconnection
    console.log(`${enabled ? "Connecting" : "Disconnecting"} service: ${serviceId}`)
    onQuickAction(`${enabled ? "connect" : "disconnect"} ${serviceId} integration`)
  }

  const handleMCPToggle = (serverId: string, enabled: boolean) => {
    // Simulate MCP server start/stop
    console.log(`${enabled ? "Starting" : "Stopping"} MCP server: ${serverId}`)
    onQuickAction(`${enabled ? "start" : "stop"} ${serverId} MCP server`)
  }

  const handleViewActions = (service: any) => {
    setSelectedServiceForActions(service)
    setActionsDialogOpen(true)
  }

  const getAvailableActions = (service: any) => {
    const backendIntegrations = getBackendIntegrationForService(service.name)
    const allActions: any[] = []
    backendIntegrations.forEach(integration => {
      const actions = getActionsByBackendIntegration(integration)
      allActions.push(...actions)
    })
    // Remove duplicates based on action id
    return Array.from(new Map(allActions.map(action => [action.id, action])).values())
  }

  // Render MCP server item for list view
  const renderMCPServerListItem = (server: any) => (
    <div key={server.id} className="flex items-center justify-between p-4 bg-posthog-cream border border-posthog-cream-dark rounded-lg hover:border-posthog-orange transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <server.icon className="h-5 w-5 text-posthog-orange flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-mono font-medium text-posthog-black truncate">{server.name}</h3>
            <Badge
              variant={server.status === "active" ? "default" : "secondary"}
              className="font-mono text-xs"
            >
              {server.status.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-posthog-gray font-mono truncate">{server.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono">
            <div>
              <span className="text-posthog-gray">ENDPOINT:</span>
              <span className="text-posthog-black ml-1">{server.endpoint}</span>
            </div>
            <div>
              <span className="text-posthog-gray">LAST_ACTIVITY:</span>
              <span className="text-posthog-black ml-1">{server.lastActivity}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          {getStatusIcon(server.status)}
          <Switch
            checked={server.status === "active"}
            onCheckedChange={(checked) => handleMCPToggle(server.id, checked)}
            className="data-[state=checked]:bg-posthog-orange"
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
            onClick={() => onQuickAction(`check ${server.name} health`)}
          >
            <Activity className="h-3 w-3 mr-1" />
            HEALTH_CHECK
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
            onClick={() => onQuickAction(`view ${server.name} logs`)}
          >
            <FileText className="h-3 w-3 mr-1" />
            LOGS
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
            onClick={() => onQuickAction(`restart ${server.name} server`)}
          >
            <Zap className="h-3 w-3 mr-1" />
            RESTART
          </Button>
        </div>
      </div>
    </div>
  )

  // Render service item for list view
  const renderServiceListItem = (service: any) => (
    <div key={service.id} className="flex items-center justify-between p-4 bg-white border border-posthog-cream-dark rounded-lg hover:border-posthog-orange transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <service.icon className="h-6 w-6 text-posthog-orange flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-sm font-mono font-medium text-posthog-black truncate">{service.name}</h3>
            <Badge
              variant="outline"
              className={`text-xs font-mono ${getCategoryColor(service.category)}`}
            >
              {service.category}
            </Badge>
          </div>
          <p className="text-xs text-posthog-gray font-mono truncate">{service.description}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="text-right text-xs font-mono">
          <div className="text-posthog-gray">LAST_SYNC:</div>
          <div className="text-posthog-black">{service.lastSync}</div>
        </div>
        
        <div className="flex items-center gap-2">
          {getStatusIcon(service.status)}
          <Switch
            checked={service.status === "connected"}
            onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
            className="data-[state=checked]:bg-posthog-orange"
          />
        </div>

        <div className="flex gap-2">
          <Dialog 
            open={configDialogOpen && selectedService?.id === service.id} 
            onOpenChange={(open) => {
              if (!open) {
                setConfigDialogOpen(false)
                setSelectedService(null)
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                onClick={() => {
                  setSelectedService(service)
                  setConfigDialogOpen(true)
                }}
              >
                <Settings className="h-3 w-3 mr-1" />
                CONFIG
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white border border-posthog-cream-dark shadow-xl">
              <DialogHeader className="relative">
                <DialogTitle className="font-mono text-posthog-black text-lg">
                  CONFIGURE_{selectedService?.name.toUpperCase()}
                </DialogTitle>
                <DialogDescription className="font-mono text-xs text-posthog-gray mt-2">
                  Update integration settings and credentials
                </DialogDescription>
                <button
                  onClick={() => {
                    setConfigDialogOpen(false)
                    setSelectedService(null)
                  }}
                  className="absolute top-0 right-0 p-2 text-posthog-gray hover:text-posthog-orange transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogHeader>
              {selectedService && (
                <div className="space-y-4">
                  {Object.entries(selectedService.config).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key} className="font-mono text-xs font-medium text-posthog-black">
                        {key.replace(/([A-Z])/g, "_$1").toUpperCase()}
                      </Label>
                      <Input
                        id={key}
                        type={key.includes("token") || key.includes("password") ? "password" : "text"}
                        defaultValue={value as string}
                        className="font-mono text-xs border-posthog-cream-dark focus:border-posthog-orange focus:ring-1 focus:ring-posthog-orange/20 bg-white"
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  ))}
                  <div className="flex gap-3 pt-6 border-t border-posthog-cream-dark">
                    <Button
                      size="sm"
                      className="flex-1 bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs font-medium py-2"
                      onClick={() => {
                        setConfigDialogOpen(false)
                        setSelectedService(null)
                      }}
                    >
                      SAVE_CHANGES
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 font-mono text-xs border-posthog-cream-dark text-posthog-gray hover:border-posthog-orange hover:text-posthog-orange bg-transparent font-medium py-2"
                      onClick={() => {
                        setConfigDialogOpen(false)
                        setSelectedService(null)
                      }}
                    >
                      CANCEL
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant="outline"
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
            onClick={() => handleViewActions(service)}
          >
            <Info className="h-3 w-3 mr-1" />
            ACTIONS
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
            onClick={() => onQuickAction(`test ${service.name} connection`)}
          >
            <Activity className="h-3 w-3 mr-1" />
            TEST
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col px-2">
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0 space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-posthog-black">EXTERNAL_SERVICES</h2>
            {/* <p className="text-posthog-gray font-mono text-sm">78_READY_INTEGRATIONS_ACROSS_12_CATEGORIES</p> */}
            <p className="text-posthog-gray font-mono text-sm">Third-party service integrations, webhooks, and external API connections</p>
        </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setAddMCPServerDialogOpen(true)}
              className="bg-white border border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white font-mono text-xs"
            >
              <Plus className="h-4 w-4 mr-2" />
              ADD_MCP_SERVER
            </Button>
        <Button
          onClick={() => onQuickAction("sync all external services")}
          className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
        >
          <Activity className="h-4 w-4 mr-2" />
          SYNC_ALL
        </Button>
          </div>
        </div>
      </div>

      {/* Category Filter and Search */}
      <div className="flex-shrink-0 space-y-4 pb-6">
        {/* Search and Controls Row */}
        <div className="flex gap-3 items-center">
          {/* Expanded Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-posthog-gray" />
            <Input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 font-mono text-xs border-posthog-cream-dark focus:border-posthog-orange focus:ring-posthog-orange"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-posthog-gray hover:text-posthog-orange"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* View Mode Toggle - Sticky Right */}
          <div className="flex-shrink-0 flex items-center gap-1 bg-white border border-posthog-cream-dark rounded-lg p-1 ml-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-posthog-orange text-white"
                  : "text-posthog-gray hover:text-posthog-orange"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-posthog-orange text-white"
                  : "text-posthog-gray hover:text-posthog-orange"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Multi-Select Categories */}
        <div className="flex flex-wrap gap-1">
            {getUniqueCategories().map((category) => {
              const count = getCategoryCount(category)
              const isSelected = selectedCategories.includes(category)
              const color = getCategoryColor(category)
              
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`flex items-center gap-2 px-2 py-1 rounded-full border font-mono text-xs transition-all ${
                    isSelected
                      ? "bg-posthog-orange text-white border-posthog-orange"
                      : "bg-white text-posthog-gray border-posthog-cream-dark hover:border-posthog-orange hover:text-posthog-orange"
                  }`}
                >
                  <div 
                    className="w-2 h-2 rounded-full flex-shrink-0" 
                    style={{ backgroundColor: isSelected ? "white" : getCategoryDotColor(category) }}
                  />
                  <span className="truncate">{category}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-1 py-0 h-4 flex-shrink-0 ${
                      isSelected 
                        ? "border-white text-white" 
                        : "border-current text-current"
                    }`}
                  >
                    {count}
                  </Badge>
                </button>
              )
            })}
          </div>

        {/* Results Summary */}
        {/* <div className="flex items-center justify-between text-sm font-mono">
          <span className="text-posthog-gray">
            Showing {getFilteredServices().length} of {devToolsServices.length} integrations
            {selectedCategories.length > 1 && (
              <span className="ml-2 text-posthog-orange">
                ({selectedCategories.filter(c => c !== "ALL").join(", ")})
              </span>
            )}
          </span>
          {(!selectedCategories.includes("ALL") || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedCategories(["ALL"])
                setSearchQuery("")
              }}
              className="text-posthog-orange hover:text-posthog-orange-dark underline"
            >
              Clear Filters
            </button>
          )}
        </div> */}
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="services" className="h-full flex flex-col">
          <TabsList className="flex-shrink-0 bg-white border border-posthog-cream-dark">
          <TabsTrigger
            value="services"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            EXTERNAL_SERVICES
          </TabsTrigger>
          <TabsTrigger
            value="mcp"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            <Zap className="h-4 w-4 mr-2" />
            MCP_SERVERS
          </TabsTrigger>
        </TabsList>

                  <TabsContent value="services" className="flex-1 overflow-y-auto space-y-4">
            {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getFilteredServices().map((service) => (
              <Card
                key={service.id}
                className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <service.icon className="h-6 w-6 text-posthog-orange" />
                      <div>
                        <CardTitle className="text-sm font-mono text-posthog-black">{service.name}</CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-xs font-mono mt-1 ${getCategoryColor(service.category)}`}
                        >
                          {service.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      <Switch
                        checked={service.status === "connected"}
                        onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                        className="data-[state=checked]:bg-posthog-orange"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-posthog-gray font-mono">{service.description}</p>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-posthog-gray">LAST_SYNC:</span>
                      <span className="text-posthog-black">{service.lastSync}</span>
                    </div>

                    {service.repositories !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">REPOSITORIES:</span>
                        <span className="text-posthog-black">{service.repositories}</span>
                      </div>
                    )}

                    {service.dashboards !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">DASHBOARDS:</span>
                        <span className="text-posthog-black">{service.dashboards}</span>
                      </div>
                    )}

                    {service.services !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">SERVICES:</span>
                        <span className="text-posthog-black">{service.services}</span>
                      </div>
                    )}

                    {service.projects !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">PROJECTS:</span>
                        <span className="text-posthog-black">{service.projects}</span>
                      </div>
                    )}

                        {('spaces' in service) && (
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">SPACES:</span>
                            <span className="text-posthog-black">{(service as any).spaces}</span>
                      </div>
                    )}

                    {service.channels !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-posthog-gray">CHANNELS:</span>
                        <span className="text-posthog-black">{service.channels}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                        <Dialog 
                          open={configDialogOpen && selectedService?.id === service.id} 
                          onOpenChange={(open) => {
                            if (!open) {
                              setConfigDialogOpen(false)
                              setSelectedService(null)
                            }
                          }}
                        >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                              onClick={() => {
                                setSelectedService(service)
                                setConfigDialogOpen(true)
                              }}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          CONFIG
                        </Button>
                      </DialogTrigger>
                          <DialogContent className="max-w-md bg-white border border-posthog-cream-dark shadow-xl">
                            <DialogHeader className="relative">
                              <DialogTitle className="font-mono text-posthog-black text-lg">
                            CONFIGURE_{selectedService?.name.toUpperCase()}
                          </DialogTitle>
                              <DialogDescription className="font-mono text-xs text-posthog-gray mt-2">
                            Update integration settings and credentials
                          </DialogDescription>
                              <button
                                onClick={() => {
                                  setConfigDialogOpen(false)
                                  setSelectedService(null)
                                }}
                                className="absolute top-0 right-0 p-2 text-posthog-gray hover:text-posthog-orange transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                        </DialogHeader>
                        {selectedService && (
                          <div className="space-y-4">
                            {Object.entries(selectedService.config).map(([key, value]) => (
                              <div key={key} className="space-y-2">
                                    <Label htmlFor={key} className="font-mono text-xs font-medium text-posthog-black">
                                  {key.replace(/([A-Z])/g, "_$1").toUpperCase()}
                                </Label>
                                <Input
                                  id={key}
                                  type={key.includes("token") || key.includes("password") ? "password" : "text"}
                                  defaultValue={value as string}
                                      className="font-mono text-xs border-posthog-cream-dark focus:border-posthog-orange focus:ring-1 focus:ring-posthog-orange/20 bg-white"
                                  placeholder={`Enter ${key}`}
                                />
                              </div>
                            ))}
                                <div className="flex gap-3 pt-6 border-t border-posthog-cream-dark">
                              <Button
                                size="sm"
                                    className="flex-1 bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs font-medium py-2"
                                    onClick={() => {
                                      setConfigDialogOpen(false)
                                      setSelectedService(null)
                                    }}
                                  >
                                    SAVE_CHANGES
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                    className="flex-1 font-mono text-xs border-posthog-cream-dark text-posthog-gray hover:border-posthog-orange hover:text-posthog-orange bg-transparent font-medium py-2"
                                    onClick={() => {
                                      setConfigDialogOpen(false)
                                      setSelectedService(null)
                                    }}
                              >
                                CANCEL
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={() => handleViewActions(service)}
                    >
                      <Info className="h-3 w-3 mr-1" />
                      ACTIONS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={() => onQuickAction(`test ${service.name} connection`)}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      TEST
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
            ) : (
              <div className="space-y-3">
                {getFilteredServices().map((service) => renderServiceListItem(service))}
              </div>
            )}
          
          {/* No Results Message */}
          {getFilteredServices().length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-posthog-cream rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-posthog-gray" />
              </div>
              <h3 className="text-lg font-mono font-medium text-posthog-black mb-2">No integrations found</h3>
              <p className="text-posthog-gray font-mono text-sm mb-4">
                Try adjusting your search or category filters
              </p>
              <Button
                onClick={() => {
                  setSelectedCategories(["ALL"])
                  setSearchQuery("")
                }}
                className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-sm"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="mcp" className="flex-1 overflow-y-auto space-y-4">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="font-mono text-posthog-black">MCP_SERVERS</CardTitle>
              <p className="text-sm text-posthog-gray font-mono">MODEL_CONTEXT_PROTOCOL_SERVERS_FOR_AI_INTEGRATION</p>
            </CardHeader>
            <CardContent>
              {viewMode === "grid" ? (
              <div className="space-y-4">
                {mcpServers.map((server) => (
                  <div key={server.id} className="p-4 bg-posthog-cream rounded border border-posthog-cream-dark">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <server.icon className="h-5 w-5 text-posthog-orange" />
                        <div>
                          <h4 className="font-mono text-sm font-medium text-posthog-black">{server.name}</h4>
                          <p className="text-xs text-posthog-gray font-mono">{server.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(server.status)}
                          <Badge
                            variant={server.status === "active" ? "default" : "secondary"}
                            className="font-mono text-xs"
                          >
                            {server.status.toUpperCase()}
                          </Badge>
                        </div>
                        <Switch
                          checked={server.status === "active"}
                          onCheckedChange={(checked) => handleMCPToggle(server.id, checked)}
                          className="data-[state=checked]:bg-posthog-orange"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-3">
                      <div>
                        <span className="font-medium text-posthog-black">ENDPOINT:</span>
                        <div className="text-posthog-gray mt-1">{server.endpoint}</div>
                      </div>
                      <div>
                        <span className="font-medium text-posthog-black">LAST_ACTIVITY:</span>
                        <div className="text-posthog-gray mt-1">{server.lastActivity}</div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="font-medium text-posthog-black text-xs font-mono">CAPABILITIES:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {server.capabilities.map((capability) => (
                          <Badge
                            key={capability}
                            variant="outline"
                            className="font-mono text-xs border-posthog-orange text-posthog-orange"
                          >
                            {capability.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                        onClick={() => onQuickAction(`check ${server.name} health`)}
                      >
                        <Activity className="h-3 w-3 mr-1" />
                        HEALTH_CHECK
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                        onClick={() => onQuickAction(`view ${server.name} logs`)}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        LOGS
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                        onClick={() => onQuickAction(`restart ${server.name} server`)}
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        RESTART
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="space-y-3">
                  {mcpServers.map((server) => renderMCPServerListItem(server))}
                </div>
              )}
            </CardContent>
          </Card>


        </TabsContent>
      </Tabs>
      </div>

      {/* Available Actions Dialog */}
      <Dialog open={actionsDialogOpen} onOpenChange={setActionsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-white border border-posthog-cream-dark shadow-xl">
          <DialogHeader className="relative">
            <DialogTitle className="font-mono text-posthog-black text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-posthog-orange" />
              {selectedServiceForActions?.name.toUpperCase()}_INTEGRATION
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-posthog-gray mt-2">
              Available actions and operations/APIs for this integration
            </DialogDescription>
            <button
              onClick={() => {
                setActionsDialogOpen(false)
                setSelectedServiceForActions(null)
              }}
              className="absolute top-0 right-0 p-2 text-posthog-gray hover:text-posthog-orange transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          {selectedServiceForActions && (
            <Tabs defaultValue="operations" className="w-full flex flex-col" style={{ height: 'calc(90vh - 200px)' }}>
              <TabsList className="bg-white border border-posthog-cream-dark mb-4 flex-shrink-0">
                <TabsTrigger
                  value="actions"
                  className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  ACTIONS ({getAvailableActions(selectedServiceForActions).length})
                </TabsTrigger>
                <TabsTrigger
                  value="operations"
                  className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  OPERATIONS/APIS ({getAvailableOperations(selectedServiceForActions.name).length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="actions" className="mt-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                {getAvailableActions(selectedServiceForActions).length > 0 ? (
                  getAvailableActions(selectedServiceForActions).map((action) => {
                    const getIconComponent = (iconName: string) => {
                      const iconMap: { [key: string]: any } = {
                        Server, Github, Lock, Settings, Zap, Plus, Search, Play, Clock,
                        CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, RefreshCw, History,
                        BarChart3, Cloud, Database, Code, Users, Shield, Bot, Package, FileText, Trash2,
                        Slack: MessageSquare // Slack icon doesn't exist in lucide-react, use MessageSquare as fallback
                      }
                      return iconMap[iconName] || Zap
                    }
                    const IconComponent = getIconComponent(action.icon)
                    return (
                      <Card key={action.id} className="border-posthog-cream-dark bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <IconComponent className="h-5 w-5 text-posthog-orange mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-mono text-sm font-medium text-posthog-black">{action.title}</h4>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs font-mono ${
                                      action.category === "create"
                                        ? "border-green-500 text-green-700"
                                        : "border-blue-500 text-blue-700"
                                    }`}
                                  >
                                    {action.category.toUpperCase()}
                                  </Badge>
                                  {action.approvalRequired && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs font-mono border-orange-500 text-orange-700"
                                    >
                                      APPROVAL_REQUIRED
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-posthog-gray font-mono mb-2">{action.description}</p>
                                <div className="flex items-center gap-4 text-xs font-mono">
                                  <div>
                                    <span className="text-posthog-gray">BACKEND:</span>
                                    <span className="text-posthog-black ml-1">{action.backendIntegration}</span>
                                  </div>
                                  <div>
                                    <span className="text-posthog-gray">EXECUTIONS:</span>
                                    <span className="text-posthog-black ml-1">{action.executionCount}</span>
                                  </div>
                                  {action.lastExecuted && (
                                    <div>
                                      <span className="text-posthog-gray">LAST_RUN:</span>
                                      <span className="text-posthog-black ml-1">
                                        {new Date(action.lastExecuted).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {action.formFields && action.formFields.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-xs font-mono text-posthog-gray">FORM_FIELDS:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {action.formFields.map((field: any, idx: number) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-xs font-mono border-posthog-orange text-posthog-orange"
                                        >
                                          {field.label}
                                          {field.required && " *"}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto text-posthog-gray mb-4" />
                    <p className="text-posthog-gray font-mono text-sm">
                      No actions available for this integration yet
                    </p>
                  </div>
                )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="operations" className="mt-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                    {getAvailableOperations(selectedServiceForActions.name).length > 0 ? (
                      getAvailableOperations(selectedServiceForActions.name).map((operation, idx) => (
                        <Card key={idx} className="border-posthog-cream-dark bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <Code2 className="h-5 w-5 text-posthog-orange mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-mono text-sm font-medium text-posthog-black">{operation.name}</h4>
                                    {operation.method && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs font-mono border-blue-500 text-blue-700"
                                      >
                                        {operation.method.split(' ')[0]}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-posthog-gray font-mono mb-2">{operation.description}</p>
                                  {operation.method && (
                                    <div className="mt-2 p-2 bg-posthog-cream rounded border border-posthog-cream-dark">
                                      <code className="text-xs font-mono text-posthog-black">{operation.method}</code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Code2 className="h-12 w-12 mx-auto text-posthog-gray mb-4" />
                        <p className="text-posthog-gray font-mono text-sm">
                          No operations/APIs documented for this integration yet
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
          <div className="flex justify-end pt-4 border-t border-posthog-cream-dark">
            <Button
              variant="outline"
              onClick={() => {
                setActionsDialogOpen(false)
                setSelectedServiceForActions(null)
              }}
              className="font-mono text-xs border-posthog-cream-dark text-posthog-gray hover:border-posthog-orange hover:text-posthog-orange bg-transparent"
            >
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add MCP Server Dialog */}
      <Dialog open={addMCPServerDialogOpen} onOpenChange={setAddMCPServerDialogOpen}>
        <DialogContent className="max-w-md bg-white border border-posthog-cream-dark shadow-xl">
          <DialogHeader className="relative">
            <DialogTitle className="font-mono text-posthog-black text-lg">
              ADD_NEW_MCP_SERVER
            </DialogTitle>
            <DialogDescription className="font-mono text-xs text-posthog-gray mt-2">
              Configure a new Model Context Protocol server for AI integration
            </DialogDescription>
            <button
              onClick={() => setAddMCPServerDialogOpen(false)}
              className="absolute top-0 right-0 p-2 text-posthog-gray hover:text-posthog-orange transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="server-name" className="font-mono text-xs font-medium text-posthog-black">
                    SERVER_NAME
                  </Label>
                <Input 
                  id="server-name" 
                  placeholder="my-custom-mcp" 
                  className="font-mono text-xs border-posthog-cream-dark focus:border-posthog-orange focus:ring-1 focus:ring-posthog-orange/20 bg-white"
                />
                </div>
                <div className="space-y-2">
                <Label htmlFor="server-endpoint" className="font-mono text-xs font-medium text-posthog-black">
                    ENDPOINT
                  </Label>
                <Input 
                  id="server-endpoint" 
                  placeholder="mcp://custom-server" 
                  className="font-mono text-xs border-posthog-cream-dark focus:border-posthog-orange focus:ring-1 focus:ring-posthog-orange/20 bg-white"
                />
                </div>
              </div>
              <div className="space-y-2">
              <Label htmlFor="server-description" className="font-mono text-xs font-medium text-posthog-black">
                  DESCRIPTION
                </Label>
                <Input
                  id="server-description"
                  placeholder="Custom MCP server for specific operations"
                className="font-mono text-xs border-posthog-cream-dark focus:border-posthog-orange focus:ring-1 focus:ring-posthog-orange/20 bg-white"
                />
              </div>
            <div className="flex gap-3 pt-6 border-t border-posthog-cream-dark">
              <Button
                className="flex-1 bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs font-medium py-2"
                onClick={() => {
                  onQuickAction("add new MCP server")
                  setAddMCPServerDialogOpen(false)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                ADD_MCP_SERVER
              </Button>
              <Button
                variant="outline"
                className="flex-1 font-mono text-xs border-posthog-cream-dark text-posthog-gray hover:border-posthog-orange hover:text-posthog-orange bg-transparent font-medium py-2"
                onClick={() => setAddMCPServerDialogOpen(false)}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
