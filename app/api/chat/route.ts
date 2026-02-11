import { openai } from "@ai-sdk/openai"
import { streamText, tool } from "ai"
import { z } from "zod"

export const maxDuration = 60

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system: `You are DevAssist, an AI-powered internal developer platform and platform engineering assistant. You help with:
    - Service catalog and discovery
    - Developer onboarding and self-service
    - Platform standards and governance
    - Infrastructure provisioning and management
    - Developer productivity metrics
    - Compliance and security automation
    - Cost optimization and resource management
    - Documentation and knowledge sharing

    Be helpful, technical, and provide actionable solutions for platform engineering teams.`,
    tools: {
      deployService: tool({
        description: "Deploy a service to production or staging environment",
        parameters: z.object({
          serviceName: z.string().describe("Name of the service to deploy"),
          environment: z.enum(["production", "staging", "development"]).describe("Target environment"),
          branch: z.string().optional().describe("Git branch to deploy from"),
        }),
        execute: async ({ serviceName, environment, branch = "main" }) => {
          const deploymentId = `deploy-${Date.now()}`
          const status = Math.random() > 0.1 ? "success" : "failed"

          return {
            deploymentId,
            serviceName,
            environment,
            branch,
            status,
            url: status === "success" ? `https://${serviceName}-${environment}.company.dev` : null,
            logs:
              status === "success"
                ? ["✓ Building application...", "✓ Running tests...", "✓ Deployment successful"]
                : ["✓ Building application...", "✗ Tests failed", "✗ Deployment failed"],
          }
        },
      }),

      checkServiceHealth: tool({
        description: "Check the health and status of deployed services",
        parameters: z.object({
          serviceName: z.string().describe("Name of the service to check"),
        }),
        execute: async ({ serviceName }) => {
          const uptime = Math.floor(Math.random() * 100)
          const responseTime = Math.floor(Math.random() * 500) + 50
          const status = uptime > 95 ? "healthy" : uptime > 80 ? "degraded" : "unhealthy"

          return {
            serviceName,
            status,
            uptime: `${uptime}%`,
            responseTime: `${responseTime}ms`,
            lastDeployment: "2 hours ago",
            activeInstances: Math.floor(Math.random() * 5) + 1,
            memoryUsage: `${Math.floor(Math.random() * 80) + 20}%`,
            cpuUsage: `${Math.floor(Math.random() * 60) + 10}%`,
          }
        },
      }),

      serviceCatalog: tool({
        description: "Browse and search the internal service catalog",
        parameters: z.object({
          query: z.string().optional().describe("Search query for services"),
          team: z.string().optional().describe("Filter by team"),
          technology: z.string().optional().describe("Filter by technology stack"),
        }),
        execute: async ({ query, team, technology }) => {
          const services = [
            {
              name: "user-authentication",
              team: "platform",
              technology: "node.js",
              description: "Centralized authentication service",
              owner: "platform-team@company.com",
              documentation: "https://docs.company.dev/auth",
              apiEndpoint: "https://auth.company.dev",
              dependencies: ["user-database", "redis-cache"],
              sla: "99.9%",
              oncall: "platform-oncall",
            },
            {
              name: "payment-processor",
              team: "payments",
              technology: "java",
              description: "Payment processing and billing",
              owner: "payments-team@company.com",
              documentation: "https://docs.company.dev/payments",
              apiEndpoint: "https://payments.company.dev",
              dependencies: ["stripe-api", "fraud-detection"],
              sla: "99.95%",
              oncall: "payments-oncall",
            },
            {
              name: "notification-service",
              team: "growth",
              technology: "python",
              description: "Multi-channel notification delivery",
              owner: "growth-team@company.com",
              documentation: "https://docs.company.dev/notifications",
              apiEndpoint: "https://notifications.company.dev",
              dependencies: ["email-service", "push-service"],
              sla: "99.5%",
              oncall: "growth-oncall",
            },
          ]

          let filteredServices = services
          if (query) {
            filteredServices = services.filter(
              (s) => s.name.includes(query.toLowerCase()) || s.description.toLowerCase().includes(query.toLowerCase()),
            )
          }
          if (team) {
            filteredServices = filteredServices.filter((s) => s.team === team.toLowerCase())
          }
          if (technology) {
            filteredServices = filteredServices.filter((s) => s.technology.includes(technology.toLowerCase()))
          }

          return {
            query,
            team,
            technology,
            services: filteredServices,
            totalCount: filteredServices.length,
          }
        },
      }),

      platformMetrics: tool({
        description: "Get platform engineering metrics and KPIs",
        parameters: z.object({
          metric: z
            .enum([
              "developer_productivity",
              "deployment_frequency",
              "lead_time",
              "mttr",
              "platform_adoption",
              "cost_optimization",
            ])
            .describe("Type of metric to retrieve"),
          timeframe: z.enum(["7d", "30d", "90d"]).optional().describe("Time period"),
        }),
        execute: async ({ metric, timeframe = "30d" }) => {
          const metrics = {
            developer_productivity: {
              deployments_per_developer: Math.floor(Math.random() * 20) + 10,
              avg_pr_cycle_time: `${Math.floor(Math.random() * 24) + 6} hours`,
              self_service_adoption: `${Math.floor(Math.random() * 30) + 70}%`,
              developer_satisfaction: `${Math.floor(Math.random() * 20) + 80}/100`,
              onboarding_time: `${Math.floor(Math.random() * 5) + 2} days`,
            },
            deployment_frequency: {
              total_deployments: Math.floor(Math.random() * 500) + 200,
              daily_average: Math.floor(Math.random() * 20) + 10,
              success_rate: `${Math.floor(Math.random() * 10) + 90}%`,
              rollback_rate: `${Math.floor(Math.random() * 5) + 2}%`,
            },
            lead_time: {
              commit_to_production: `${Math.floor(Math.random() * 48) + 12} hours`,
              code_review_time: `${Math.floor(Math.random() * 12) + 4} hours`,
              ci_cd_time: `${Math.floor(Math.random() * 30) + 10} minutes`,
              deployment_time: `${Math.floor(Math.random() * 10) + 5} minutes`,
            },
            mttr: {
              mean_time_to_recovery: `${Math.floor(Math.random() * 60) + 30} minutes`,
              incident_count: Math.floor(Math.random() * 10) + 5,
              p1_incidents: Math.floor(Math.random() * 3) + 1,
              automated_recovery: `${Math.floor(Math.random() * 40) + 60}%`,
            },
            platform_adoption: {
              services_using_platform: Math.floor(Math.random() * 50) + 80,
              teams_onboarded: Math.floor(Math.random() * 10) + 15,
              golden_path_usage: `${Math.floor(Math.random() * 30) + 70}%`,
              self_service_requests: Math.floor(Math.random() * 200) + 300,
            },
            cost_optimization: {
              monthly_savings: `$${Math.floor(Math.random() * 50000) + 25000}`,
              resource_utilization: `${Math.floor(Math.random() * 20) + 75}%`,
              idle_resources_eliminated: Math.floor(Math.random() * 100) + 50,
              cost_per_developer: `$${Math.floor(Math.random() * 500) + 200}`,
            },
          }

          return {
            metric,
            timeframe,
            data: metrics[metric],
            trend: Math.random() > 0.5 ? "improving" : "stable",
          }
        },
      }),

      provisionInfrastructure: tool({
        description: "Provision infrastructure using platform templates",
        parameters: z.object({
          template: z
            .enum(["microservice", "database", "cache", "queue", "cdn", "monitoring"])
            .describe("Infrastructure template type"),
          environment: z.enum(["development", "staging", "production"]).describe("Target environment"),
          team: z.string().describe("Team requesting the infrastructure"),
          specifications: z
            .object({
              size: z.enum(["small", "medium", "large"]).optional(),
              region: z.string().optional(),
              backup: z.boolean().optional(),
            })
            .optional(),
        }),
        execute: async ({ template, environment, team, specifications = {} }) => {
          const provisioningId = `infra-${Date.now()}`
          const estimatedTime = Math.floor(Math.random() * 15) + 5

          const resources = {
            microservice: ["Load Balancer", "Auto Scaling Group", "Security Groups", "IAM Roles"],
            database: ["RDS Instance", "Subnet Group", "Parameter Group", "Backup Schedule"],
            cache: ["ElastiCache Cluster", "Subnet Group", "Security Groups"],
            queue: ["SQS Queue", "Dead Letter Queue", "IAM Policies"],
            cdn: ["CloudFront Distribution", "S3 Bucket", "SSL Certificate"],
            monitoring: ["CloudWatch Dashboards", "Alarms", "Log Groups", "SNS Topics"],
          }

          return {
            provisioningId,
            template,
            environment,
            team,
            specifications,
            status: "provisioning",
            estimatedTime: `${estimatedTime} minutes`,
            resources: resources[template],
            cost: `$${Math.floor(Math.random() * 500) + 100}/month`,
          }
        },
      }),

      complianceCheck: tool({
        description: "Run compliance and security checks on services",
        parameters: z.object({
          serviceName: z.string().describe("Service to check"),
          checkType: z
            .enum(["security", "compliance", "performance", "cost", "reliability"])
            .describe("Type of check to run"),
        }),
        execute: async ({ serviceName, checkType }) => {
          const checks = {
            security: [
              { name: "SSL/TLS Configuration", status: "pass", severity: "high" },
              { name: "Authentication Required", status: "pass", severity: "high" },
              { name: "Input Validation", status: "warning", severity: "medium" },
              { name: "Secrets Management", status: "fail", severity: "high" },
              { name: "OWASP Top 10", status: "pass", severity: "high" },
            ],
            compliance: [
              { name: "SOC 2 Type II", status: "pass", severity: "high" },
              { name: "GDPR Compliance", status: "pass", severity: "high" },
              { name: "Data Retention Policy", status: "warning", severity: "medium" },
              { name: "Audit Logging", status: "pass", severity: "medium" },
            ],
            performance: [
              { name: "Response Time SLA", status: "pass", severity: "medium" },
              { name: "Throughput Requirements", status: "warning", severity: "medium" },
              { name: "Resource Utilization", status: "pass", severity: "low" },
              { name: "Caching Strategy", status: "fail", severity: "medium" },
            ],
            cost: [
              { name: "Resource Right-sizing", status: "warning", severity: "medium" },
              { name: "Reserved Instance Usage", status: "fail", severity: "low" },
              { name: "Idle Resource Detection", status: "pass", severity: "medium" },
              { name: "Cost Budget Alerts", status: "pass", severity: "low" },
            ],
            reliability: [
              { name: "Health Check Endpoint", status: "pass", severity: "high" },
              { name: "Circuit Breaker Pattern", status: "warning", severity: "medium" },
              { name: "Retry Logic", status: "pass", severity: "medium" },
              { name: "Graceful Degradation", status: "fail", severity: "medium" },
            ],
          }

          const results = checks[checkType]
          const passCount = results.filter((r) => r.status === "pass").length
          const warningCount = results.filter((r) => r.status === "warning").length
          const failCount = results.filter((r) => r.status === "fail").length

          return {
            serviceName,
            checkType,
            results,
            summary: {
              total: results.length,
              passed: passCount,
              warnings: warningCount,
              failed: failCount,
              score: Math.round((passCount / results.length) * 100),
            },
          }
        },
      }),

      developerOnboarding: tool({
        description: "Manage developer onboarding process and track progress",
        parameters: z.object({
          action: z.enum(["create", "status", "complete_step"]).describe("Onboarding action"),
          developerId: z.string().describe("Developer identifier"),
          step: z.string().optional().describe("Onboarding step to complete"),
        }),
        execute: async ({ action, developerId, step }) => {
          const onboardingSteps = [
            { id: "account_setup", name: "Account Setup", status: "completed", duration: "30 minutes" },
            { id: "dev_environment", name: "Development Environment", status: "completed", duration: "2 hours" },
            { id: "first_deployment", name: "First Deployment", status: "in_progress", duration: "1 hour" },
            { id: "code_review", name: "Code Review Process", status: "pending", duration: "45 minutes" },
            { id: "monitoring_setup", name: "Monitoring & Alerts", status: "pending", duration: "30 minutes" },
            { id: "security_training", name: "Security Training", status: "pending", duration: "1 hour" },
          ]

          const completedSteps = onboardingSteps.filter((s) => s.status === "completed").length
          const progress = Math.round((completedSteps / onboardingSteps.length) * 100)

          return {
            action,
            developerId,
            progress: `${progress}%`,
            currentStep: onboardingSteps.find((s) => s.status === "in_progress")?.name || "Account Setup",
            steps: onboardingSteps,
            estimatedCompletion: "2.5 hours remaining",
            mentor: "senior-dev@company.com",
            resources: [
              "Developer Handbook",
              "Architecture Decision Records",
              "API Documentation",
              "Deployment Runbooks",
            ],
          }
        },
      }),

      platformGovernance: tool({
        description: "Manage platform governance, standards, and policies",
        parameters: z.object({
          action: z.enum(["list_policies", "check_compliance", "create_standard"]).describe("Governance action"),
          scope: z.enum(["security", "architecture", "deployment", "monitoring"]).optional(),
        }),
        execute: async ({ action, scope }) => {
          const policies = {
            security: [
              { name: "Authentication Required", compliance: "95%", violations: 3 },
              { name: "Secrets in Vault", compliance: "87%", violations: 8 },
              { name: "HTTPS Only", compliance: "99%", violations: 1 },
            ],
            architecture: [
              { name: "API First Design", compliance: "78%", violations: 12 },
              { name: "Microservice Patterns", compliance: "85%", violations: 7 },
              { name: "Event-Driven Architecture", compliance: "72%", violations: 15 },
            ],
            deployment: [
              { name: "Blue-Green Deployment", compliance: "90%", violations: 5 },
              { name: "Automated Testing", compliance: "93%", violations: 4 },
              { name: "Rollback Strategy", compliance: "88%", violations: 6 },
            ],
            monitoring: [
              { name: "Health Checks", compliance: "96%", violations: 2 },
              { name: "Structured Logging", compliance: "82%", violations: 9 },
              { name: "SLA Definition", compliance: "75%", violations: 13 },
            ],
          }

          return {
            action,
            scope,
            policies: scope ? policies[scope] : Object.values(policies).flat(),
            overallCompliance: "87%",
            totalViolations: 85,
            trendsImproving: ["security", "deployment"],
            trendsDecreasing: ["architecture"],
          }
        },
      }),

      costOptimization: tool({
        description: "Analyze and optimize platform costs",
        parameters: z.object({
          analysis: z
            .enum(["resource_utilization", "cost_breakdown", "savings_opportunities", "budget_alerts"])
            .describe("Type of cost analysis"),
          timeframe: z.enum(["7d", "30d", "90d"]).optional(),
        }),
        execute: async ({ analysis, timeframe = "30d" }) => {
          const costData = {
            resource_utilization: {
              compute: { utilization: "68%", waste: "$12,450/month", recommendation: "Right-size instances" },
              storage: { utilization: "82%", waste: "$3,200/month", recommendation: "Archive old data" },
              network: { utilization: "45%", waste: "$8,900/month", recommendation: "Optimize data transfer" },
            },
            cost_breakdown: {
              compute: { amount: "$45,600", percentage: "52%" },
              storage: { amount: "$18,200", percentage: "21%" },
              network: { amount: "$12,800", percentage: "15%" },
              monitoring: { amount: "$6,400", percentage: "7%" },
              other: { amount: "$4,200", percentage: "5%" },
            },
            savings_opportunities: [
              { opportunity: "Reserved Instances", potential: "$18,000/year", effort: "low" },
              { opportunity: "Spot Instances", potential: "$24,000/year", effort: "medium" },
              { opportunity: "Storage Optimization", potential: "$15,000/year", effort: "low" },
              { opportunity: "Auto-scaling", potential: "$32,000/year", effort: "high" },
            ],
            budget_alerts: [
              { service: "data-pipeline", budget: "$5,000", actual: "$6,200", variance: "+24%" },
              { service: "api-gateway", budget: "$3,000", actual: "$2,800", variance: "-7%" },
              { service: "monitoring", budget: "$2,000", actual: "$2,450", variance: "+23%" },
            ],
          }

          return {
            analysis,
            timeframe,
            data: costData[analysis],
            totalMonthlyCost: "$87,200",
            projectedSavings: "$89,000/year",
          }
        },
      }),

      techRadar: tool({
        description: "Browse and search the technology radar for tools, techniques, platforms, and frameworks",
        parameters: z.object({
          category: z
            .enum(["tools", "techniques", "platforms", "languages_frameworks"])
            .optional()
            .describe("Technology category"),
          ring: z.enum(["adopt", "trial", "assess", "hold"]).optional().describe("Adoption ring"),
          query: z.string().optional().describe("Search query for technologies"),
        }),
        execute: async ({ category, ring, query }) => {
          const techRadarData = {
            tools: [
              {
                name: "Docker",
                ring: "adopt",
                description: "Containerization platform",
                team: "platform",
                lastUpdated: "2024-01-15",
              },
              {
                name: "Kubernetes",
                ring: "adopt",
                description: "Container orchestration",
                team: "platform",
                lastUpdated: "2024-01-10",
              },
              {
                name: "Terraform",
                ring: "adopt",
                description: "Infrastructure as Code",
                team: "platform",
                lastUpdated: "2024-01-20",
              },
              {
                name: "Pulumi",
                ring: "trial",
                description: "Modern Infrastructure as Code",
                team: "platform",
                lastUpdated: "2024-01-12",
              },
              {
                name: "Ansible",
                ring: "assess",
                description: "Configuration management",
                team: "platform",
                lastUpdated: "2024-01-08",
              },
              {
                name: "Chef",
                ring: "hold",
                description: "Legacy configuration management",
                team: "platform",
                lastUpdated: "2023-12-15",
              },
            ],
            techniques: [
              {
                name: "Microservices",
                ring: "adopt",
                description: "Distributed system architecture",
                team: "architecture",
                lastUpdated: "2024-01-18",
              },
              {
                name: "Event Sourcing",
                ring: "trial",
                description: "Event-driven data persistence",
                team: "architecture",
                lastUpdated: "2024-01-14",
              },
              {
                name: "CQRS",
                ring: "assess",
                description: "Command Query Responsibility Segregation",
                team: "architecture",
                lastUpdated: "2024-01-10",
              },
              {
                name: "Monolithic Architecture",
                ring: "hold",
                description: "Single deployable unit",
                team: "architecture",
                lastUpdated: "2023-11-20",
              },
            ],
            platforms: [
              {
                name: "AWS",
                ring: "adopt",
                description: "Primary cloud platform",
                team: "platform",
                lastUpdated: "2024-01-22",
              },
              {
                name: "Vercel",
                ring: "adopt",
                description: "Frontend deployment platform",
                team: "frontend",
                lastUpdated: "2024-01-19",
              },
              {
                name: "Google Cloud",
                ring: "trial",
                description: "Secondary cloud platform",
                team: "platform",
                lastUpdated: "2024-01-16",
              },
              {
                name: "Azure",
                ring: "assess",
                description: "Enterprise cloud platform",
                team: "platform",
                lastUpdated: "2024-01-11",
              },
              {
                name: "Heroku",
                ring: "hold",
                description: "Legacy PaaS platform",
                team: "platform",
                lastUpdated: "2023-10-15",
              },
            ],
            languages_frameworks: [
              {
                name: "TypeScript",
                ring: "adopt",
                description: "Typed JavaScript superset",
                team: "frontend",
                lastUpdated: "2024-01-21",
              },
              {
                name: "React",
                ring: "adopt",
                description: "Frontend UI library",
                team: "frontend",
                lastUpdated: "2024-01-20",
              },
              {
                name: "Node.js",
                ring: "adopt",
                description: "JavaScript runtime",
                team: "backend",
                lastUpdated: "2024-01-18",
              },
              {
                name: "Next.js",
                ring: "adopt",
                description: "React framework",
                team: "frontend",
                lastUpdated: "2024-01-17",
              },
              {
                name: "Svelte",
                ring: "trial",
                description: "Compile-time UI framework",
                team: "frontend",
                lastUpdated: "2024-01-13",
              },
              {
                name: "Vue.js",
                ring: "assess",
                description: "Progressive UI framework",
                team: "frontend",
                lastUpdated: "2024-01-09",
              },
              {
                name: "Angular",
                ring: "hold",
                description: "Enterprise UI framework",
                team: "frontend",
                lastUpdated: "2023-12-01",
              },
            ],
          }

          let results = category ? techRadarData[category] : Object.values(techRadarData).flat()

          if (ring) {
            results = results.filter((tech: any) => tech.ring === ring)
          }

          if (query) {
            results = results.filter(
              (tech: any) =>
                tech.name.toLowerCase().includes(query.toLowerCase()) ||
                tech.description.toLowerCase().includes(query.toLowerCase()),
            )
          }

          return {
            category,
            ring,
            query,
            technologies: results,
            totalCount: results.length,
            summary: {
              adopt: results.filter((t: any) => t.ring === "adopt").length,
              trial: results.filter((t: any) => t.ring === "trial").length,
              assess: results.filter((t: any) => t.ring === "assess").length,
              hold: results.filter((t: any) => t.ring === "hold").length,
            },
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
