"use client"

import { useState, useEffect, useMemo } from "react"
import { getActionsByEntityType } from "@/lib/actions-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Server,
  Database,
  Zap,
  Shield,
  Activity,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Plus,
  Filter,
  ArrowUpDown,
  Settings,
  Globe,
  Code,
  Grid3X3,
  List,
  Table as TableIcon,
  Clock,
  Users,
  FileText,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Mail,
  Smartphone,
  Cloud,
  Lock,
  GitBranch,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Loader,
  DollarSign,
  Brain,
  ArrowUp,
  ArrowDown,
  X,
  Send,
  Download,
  Play,
  Eye,
  Upload,
  Edit,
  Share,
  Package,
  Pause,
  RotateCcw,
  Tag,
  Bot,
  User,
  Loader2,
  Workflow,
  MessageCircle,
  Edit3,
  Save,
  MoreHorizontal,
  ChevronDown,
  Copy,
  Archive,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Star,
  Gauge
} from "lucide-react"

interface EntityCatalogProps {
  onQuickAction: (command: string) => void
}

type EntityType = 
  | "Service" 
  | "Microservice" 
  | "API" 
  | "Database" 
  | "VM" 
  | "ML Model" 
  | "Serverless Function" 
  | "Website"
  | "Web App"
  | "SPA"
  | "PWA"
  | "UI Component"
  | "Microfrontend" 
  | "Kafka Topic" 
  | "Documentation" 
  | "Runbook" 
  | "Release Notes" 
  | "Implementation Plan"
  | "Dataset"
  | "Data Lake"
  | "LLM" 
  | "Security" 
  | "SDK" 
  | "Library" 
  | "Image" 
  | "Infrastructure" 
  | "Cache" 
  | "Prompt" 
  | "Experiment" 
  | "Policy" 
  | "Feature Flag" 
  | "CDN" 
  | "Network" 
  | "Mobile App"
  | "Workflow"
  | "Worker"
  | "Background Job"
  | "CRON Job"
  | "Job"
  | "Code Repository"

const entities = [
  // Services & Microservices
  {
    id: "user-authentication",
    name: "User Authentication Service",
    entityType: "Service" as EntityType,
    teams: ["platform", "security"],
    technologies: ["Node.js", "TypeScript"],
    description: "Centralized authentication and authorization service with OAuth2 and JWT support",
    documentation: "https://docs.company.dev/auth",
    apiEndpoint: "https://auth.company.dev",
    dependencies: ["user-database", "redis-cache", "email-service"],
    dependents: ["frontend-app", "mobile-app", "admin-dashboard"],
    sla: "99.9%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v2.1.4",
    lastDeployment: "2 hours ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { provider: "GCP", regions: ["us-central1", "europe-west1"] },
      { provider: "Azure", regions: ["eastus"] }
    ],
    tags: ["authentication", "security", "oauth", "jwt"],
    metrics: {
      uptime: "99.95%",
      responseTime: "45ms",
      requestsPerSecond: "1.2k",
      errorRate: "0.02%",
    },
  },
  {
    id: "payment-processor",
    name: "Payment Processing Microservice",
    entityType: "Microservice" as EntityType,
    teams: ["payments", "finance"],
    technologies: ["Java", "Spring Boot"],
    description: "Secure payment processing with support for multiple payment providers and fraud detection",
    documentation: "https://docs.company.dev/payments",
    apiEndpoint: "https://payments.company.dev",
    dependencies: ["stripe-api", "fraud-detection", "audit-log"],
    dependents: ["checkout-service", "subscription-service"],
    sla: "99.95%",
    oncall: "payments-oncall",
    status: "healthy",
    version: "v1.8.2",
    lastDeployment: "1 day ago",
    cloudProviders: [
      { provider: "GCP", regions: ["us-central1", "europe-west1", "asia-southeast1"] },
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "Azure", regions: ["eastus", "westeurope"] }
    ],
    tags: ["payments", "stripe", "fraud-detection", "pci-compliant"],
    metrics: {
      uptime: "99.98%",
      responseTime: "120ms",
      requestsPerSecond: "850",
      errorRate: "0.01%",
    },
  },
  // APIs
  {
    id: "api-gateway",
    name: "VENDOR API Gateway",
    entityType: "API" as EntityType,
    teams: ["platform", "infrastructure"],
    technologies: ["Go", "Docker"],
    description: "Central API gateway with rate limiting, authentication, and request routing",
    documentation: "https://docs.company.dev/gateway",
    apiEndpoint: "https://api.company.dev",
    dependencies: ["auth-service", "rate-limiter", "load-balancer"],
    dependents: ["all-client-applications"],
    sla: "99.99%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.5.3",
    lastDeployment: "4 hours ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"] },
      { provider: "Azure", regions: ["eastus", "westeurope"] },
      { provider: "GCP", regions: ["us-central1", "europe-west1"] }
    ],
    tags: ["gateway", "rate-limiting", "routing", "authentication"],
    metrics: {
      uptime: "99.99%",
      responseTime: "25ms",
      requestsPerSecond: "15.8k",
      errorRate: "0.001%",
    },
  },
  // Databases
  {
    id: "user-database",
    name: "User Database",
    entityType: "Database" as EntityType,
    teams: ["platform", "data"],
    technologies: ["PostgreSQL", "Redis"],
    description: "Primary user data storage with encryption and backup",
    documentation: "https://docs.company.dev/database",
    apiEndpoint: "postgresql://db.company.dev:5432/users",
    dependencies: ["backup-service", "monitoring-service"],
    dependents: ["auth-service", "user-management"],
    sla: "99.9%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v13.4",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "GCP", regions: ["us-central1"] },
      { provider: "Vercel", regions: ["global"] }
    ],
    tags: ["database", "postgresql", "users", "encryption"],
    metrics: {
      uptime: "99.95%",
      responseTime: "5ms",
      requestsPerSecond: "2.5k",
      errorRate: "0.01%",
    },
  },
  // ML Models
  {
    id: "recommendation-model",
    name: "Product Recommendation Model",
    entityType: "ML Model" as EntityType,
    teams: ["data", "ai"],
    technologies: ["Python", "TensorFlow", "Pandas"],
    description: "ML-powered recommendation system for products and content",
    documentation: "https://docs.company.dev/ml-models",
    apiEndpoint: "https://ml.company.dev/recommendations",
    dependencies: ["ml-pipeline", "user-behavior-data", "product-catalog"],
    dependents: ["frontend-app", "mobile-app", "search-service"],
    sla: "99.2%",
    oncall: "data-oncall",
    status: "healthy",
    version: "v2.4.1",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "GCP", regions: ["us-central1"] },
      { provider: "Vercel", regions: ["global"] }
    ],
    tags: ["ml", "recommendations", "personalization", "ai"],
    metrics: {
      uptime: "99.25%",
      responseTime: "400ms",
      requestsPerSecond: "900",
      errorRate: "0.75%",
    },
  },
  // Serverless Functions
  {
    id: "image-processor",
    name: "Image Processing Function",
    entityType: "Serverless Function" as EntityType,
    teams: ["platform", "media"],
    technologies: ["Python", "AWS Lambda"],
    description: "AWS Lambda function for image resizing and optimization",
    documentation: "https://docs.company.dev/lambda",
    apiEndpoint: "https://lambda.company.dev/image-processor",
    dependencies: ["s3-storage", "cloudfront"],
    dependents: ["file-storage", "content-service"],
    sla: "99.5%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.2.0",
    lastDeployment: "3 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2", "eu-west-1"] }
    ],
    tags: ["lambda", "serverless", "image-processing", "optimization"],
    metrics: {
      uptime: "99.6%",
      responseTime: "800ms",
      requestsPerSecond: "500",
      errorRate: "0.4%",
    },
  },
  // Websites & Web Apps
  {
    id: "company-website",
    name: "Company Website",
    entityType: "Website" as EntityType,
    teams: ["marketing", "design"],
    technologies: ["Next.js", "React", "Tailwind CSS"],
    description: "Corporate website with CMS and blog functionality",
    documentation: "https://docs.company.dev/website",
    apiEndpoint: "https://company.com",
    dependencies: ["cms-service", "cdn", "analytics"],
    dependents: ["seo-tools", "analytics-dashboard"],
    sla: "99.8%",
    oncall: "marketing-oncall",
    status: "healthy",
    version: "v3.1.2",
    lastDeployment: "2 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "eu-west-1"] },
      { provider: "Azure", regions: ["eastus"] }
    ],
    tags: ["website", "nextjs", "cms", "marketing"],
    metrics: {
      uptime: "99.85%",
      responseTime: "200ms",
      requestsPerSecond: "1.2k",
      errorRate: "0.15%",
    },
  },
  {
    id: "admin-dashboard",
    name: "Admin Dashboard",
    entityType: "Web App" as EntityType,
    teams: ["platform", "admin"],
    technologies: ["React", "TypeScript", "Material-UI"],
    description: "Administrative dashboard for system management",
    documentation: "https://docs.company.dev/admin",
    apiEndpoint: "https://admin.company.dev",
    dependencies: ["auth-service", "api-gateway", "monitoring-service"],
    dependents: ["admin-users"],
    sla: "99.7%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v2.8.1",
    lastDeployment: "1 day ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "GCP", regions: ["us-central1"] },
      { provider: "Vercel", regions: ["global"] }
    ],
    tags: ["webapp", "react", "admin", "dashboard"],
    metrics: {
      uptime: "99.75%",
      responseTime: "150ms",
      requestsPerSecond: "300",
      errorRate: "0.25%",
    },
  },
  // SPAs & PWAs
  {
    id: "customer-portal",
    name: "Customer Portal SPA",
    entityType: "SPA" as EntityType,
    teams: ["product", "frontend"],
    technologies: ["Vue.js", "Vuex", "Vue Router"],
    description: "Single-page application for customer self-service",
    documentation: "https://docs.company.dev/portal",
    apiEndpoint: "https://portal.company.dev",
    dependencies: ["api-gateway", "auth-service", "customer-api"],
    dependents: ["customer-support"],
    sla: "99.6%",
    oncall: "product-oncall",
    status: "healthy",
    version: "v4.2.0",
    lastDeployment: "3 days ago",
    cloudProviders: [
      { provider: "GCP", regions: ["us-central1", "europe-west1"] },
      { provider: "AWS", regions: ["us-east-1"] }
    ],
    tags: ["spa", "vue", "customer", "self-service"],
    metrics: {
      uptime: "99.65%",
      responseTime: "180ms",
      requestsPerSecond: "800",
      errorRate: "0.35%",
    },
  },
  {
    id: "mobile-web-app",
    name: "Mobile Web App PWA",
    entityType: "PWA" as EntityType,
    teams: ["product", "mobile"],
    technologies: ["React", "PWA", "Service Workers"],
    description: "Progressive web app for mobile users with offline capabilities",
    documentation: "https://docs.company.dev/pwa",
    apiEndpoint: "https://m.company.dev",
    dependencies: ["service-worker", "push-notifications", "offline-storage"],
    dependents: ["mobile-users"],
    sla: "99.5%",
    oncall: "product-oncall",
    status: "healthy",
    version: "v1.8.3",
    lastDeployment: "5 days ago",
    cloudProviders: [
      { provider: "Azure", regions: ["eastus", "westeurope"] },
      { provider: "AWS", regions: ["us-west-2"] }
    ],
    tags: ["pwa", "mobile", "offline", "react"],
    metrics: {
      uptime: "99.55%",
      responseTime: "220ms",
      requestsPerSecond: "600",
      errorRate: "0.45%",
    },
  },
  // UI Components
  {
    id: "design-system",
    name: "Design System Components",
    entityType: "UI Component" as EntityType,
    teams: ["design", "frontend"],
    technologies: ["React", "Storybook", "Styled Components"],
    description: "Reusable UI component library for consistent design",
    documentation: "https://design.company.dev",
    apiEndpoint: "https://npm.company.dev/design-system",
    dependencies: ["storybook", "chromatic"],
    dependents: ["all-frontend-apps"],
    sla: "99.9%",
    oncall: "design-oncall",
    status: "healthy",
    version: "v5.1.0",
    lastDeployment: "1 week ago",
    cloudProviders: [],
    tags: ["ui", "components", "design-system", "react"],
    metrics: {
      uptime: "99.95%",
      responseTime: "N/A",
      requestsPerSecond: "N/A",
      errorRate: "0.05%",
    },
  },
  // Microfrontends
  {
    id: "checkout-microfrontend",
    name: "Checkout Microfrontend",
    entityType: "Microfrontend" as EntityType,
    teams: ["commerce", "frontend"],
    technologies: ["React", "Module Federation", "Webpack"],
    description: "Independent checkout module deployed as microfrontend",
    documentation: "https://docs.company.dev/checkout",
    apiEndpoint: "https://checkout.company.dev",
    dependencies: ["payment-service", "inventory-service", "user-service"],
    dependents: ["ecommerce-app"],
    sla: "99.8%",
    oncall: "commerce-oncall",
    status: "healthy",
    version: "v2.3.1",
    lastDeployment: "2 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "Azure", regions: ["eastus"] }
    ],
    tags: ["microfrontend", "checkout", "commerce", "react"],
    metrics: {
      uptime: "99.85%",
      responseTime: "120ms",
      requestsPerSecond: "1.5k",
      errorRate: "0.15%",
    },
  },
  // Kafka Topics
  {
    id: "user-events-topic",
    name: "User Events Kafka Topic",
    entityType: "Kafka Topic" as EntityType,
    teams: ["data", "analytics"],
    technologies: ["Apache Kafka", "Avro", "Schema Registry"],
    description: "Event streaming topic for user behavior analytics",
    documentation: "https://docs.company.dev/kafka",
    apiEndpoint: "kafka://kafka.company.dev:9092/user-events",
    dependencies: ["kafka-cluster", "schema-registry"],
    dependents: ["analytics-pipeline", "ml-pipeline"],
    sla: "99.9%",
    oncall: "data-oncall",
    status: "healthy",
    version: "v2.8.0",
    lastDeployment: "2 weeks ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "Azure", regions: ["eastus", "westeurope"] }
    ],
    tags: ["kafka", "streaming", "events", "analytics"],
    metrics: {
      uptime: "99.95%",
      responseTime: "10ms",
      requestsPerSecond: "50k",
      errorRate: "0.05%",
    },
  },
  // Documentation
  {
    id: "api-documentation",
    name: "ORDER API Documentation",
    entityType: "Documentation" as EntityType,
    teams: ["platform", "developer-experience"],
    technologies: ["OpenAPI", "Swagger", "Redoc"],
    description: "Interactive API documentation with testing capabilities",
    documentation: "https://docs-api.company.dev",
    apiEndpoint: "https://docs-api.company.dev",
    dependencies: ["swagger-parser", "auth-service", "rate-limiter"],
    dependents: ["developer-portal", "api-gateway", "all-services"],
    sla: "99.7%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v2.2.1",
    lastDeployment: "1 week ago",
    cloudProviders: [],
    tags: ["documentation", "api", "swagger", "developer-tools"],
    metrics: {
      uptime: "99.75%",
      responseTime: "80ms",
      requestsPerSecond: "500",
      errorRate: "0.25%",
    },
  },
  // Datasets
  {
    id: "user-behavior-dataset",
    name: "User Behavior Dataset",
    entityType: "Dataset" as EntityType,
    teams: ["data", "analytics"],
    technologies: ["Parquet", "Apache Spark", "Pandas"],
    description: "Large-scale dataset of user interactions for ML training",
    documentation: "https://docs.company.dev/datasets",
    apiEndpoint: "s3://data-lake.company.dev/user-behavior/",
    dependencies: ["data-pipeline", "kafka-topic"],
    dependents: ["ml-models", "analytics-dashboard"],
    sla: "99.5%",
    oncall: "data-oncall",
    status: "healthy",
    version: "v1.0.0",
    lastDeployment: "1 day ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "GCP", regions: ["us-central1"] }
    ],
    tags: ["dataset", "parquet", "ml", "analytics"],
    metrics: {
      uptime: "99.6%",
      responseTime: "N/A",
      requestsPerSecond: "N/A",
      errorRate: "0.4%",
    },
  },
  // LLMs
  {
    id: "customer-support-llm",
    name: "Customer Support LLM",
    entityType: "LLM" as EntityType,
    teams: ["ai", "customer-support"],
    technologies: ["llama", "Transformers", "PyTorch"],
    description: "Large language model for automated customer support responses",
    documentation: "https://docs.company.dev/llm",
    apiEndpoint: "https://llm.company.dev/support",
    dependencies: ["vector-database", "knowledge-base"],
    dependents: ["chat-service", "support-dashboard"],
    sla: "99.0%",
    oncall: "ai-oncall",
    status: "healthy",
    version: "v1.2.0",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "GCP", regions: ["us-central1"] },
      { provider: "Vercel", regions: ["global"] }
    ],
    tags: ["llm", "ai", "gpt", "customer-support"],
    metrics: {
      uptime: "99.1%",
      responseTime: "2.5s",
      requestsPerSecond: "100",
      errorRate: "0.9%",
    },
  },
  // Mobile Apps
  {
    id: "ios-app",
    name: "EcommerceiOS Mobile App",
    entityType: "Mobile App" as EntityType,
    teams: ["mobile", "ios"],
    technologies: ["Swift", "SwiftUI", "Combine"],
    description: "Native iOS application for customer engagement",
    documentation: "https://docs.company.dev/ios",
    apiEndpoint: "https://api.company.dev/mobile",
    dependencies: ["api-gateway", "push-service", "analytics"],
    dependents: ["mobile-users"],
    sla: "99.5%",
    oncall: "mobile-oncall",
    status: "healthy",
    version: "v3.4.2",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "App Store", regions: ["Global"] }
    ],
    tags: ["ios", "mobile", "swift", "native"],
    metrics: {
      uptime: "99.6%",
      responseTime: "300ms",
      requestsPerSecond: "400",
      errorRate: "0.4%",
    },
  },
  // Feature Flags
  {
    id: "feature-flags",
    name: "Feature Flag Service",
    entityType: "Feature Flag" as EntityType,
    teams: ["platform", "product"],
    technologies: ["Go", "Redis", "PostgreSQL"],
    description: "Dynamic feature toggles and A/B testing configuration",
    documentation: "https://docs.company.dev/feature-flags",
    apiEndpoint: "https://flags.company.dev",
    dependencies: ["redis-cache", "analytics-service", "user-service"],
    dependents: ["all-services", "frontend-app", "mobile-app"],
    sla: "99.8%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.4.3",
    lastDeployment: "5 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] }
    ],
    tags: ["feature-flags", "ab-testing", "configuration", "experiments"],
    metrics: {
      uptime: "99.85%",
      responseTime: "25ms",
      requestsPerSecond: "6.5k",
      errorRate: "0.15%",
    },
  },
  // Infrastructure
  {
    id: "kubernetes-cluster",
    name: "Kubernetes Cluster",
    entityType: "Infrastructure" as EntityType,
    teams: ["platform", "infrastructure"],
    technologies: ["Kubernetes", "Docker", "Helm"],
    description: "Container orchestration platform for microservices",
    documentation: "https://docs.company.dev/k8s",
    apiEndpoint: "https://k8s.company.dev",
    dependencies: ["etcd", "calico", "ingress-controller"],
    dependents: ["all-microservices"],
    sla: "99.9%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.28.0",
    lastDeployment: "2 weeks ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "GCP", regions: ["us-central1", "europe-west1"] }
    ],
    tags: ["kubernetes", "containers", "orchestration", "infrastructure"],
    metrics: {
      uptime: "99.95%",
      responseTime: "50ms",
      requestsPerSecond: "10k",
      errorRate: "0.05%",
    },
  },
  // CDN
  {
    id: "global-cdn",
    name: "Images CDN",
    entityType: "CDN" as EntityType,
    teams: ["platform", "infrastructure"],
    technologies: ["CloudFront", "AWS", "S3"],
    description: "Content delivery network for global performance",
    documentation: "https://docs.company.dev/cdn",
    apiEndpoint: "https://cdn.company.dev",
    dependencies: ["s3-storage", "origin-servers"],
    dependents: ["website", "web-apps", "mobile-apps"],
    sla: "99.9%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v2023.1.0",
    lastDeployment: "1 month ago",
    cloudProviders: [
      { provider: "AWS", regions: ["global"] },
      { provider: "Cloudflare", regions: ["global"] },
      { provider: "Fastly", regions: ["global"] }
    ],
    tags: ["cdn", "cloudfront", "performance", "global"],
    metrics: {
      uptime: "99.95%",
      responseTime: "100ms",
      requestsPerSecond: "100k",
      errorRate: "0.05%",
    },
  },
  // Workflows
  {
    id: "deployment-workflow",
    name: "Deployment Workflow",
    entityType: "Workflow" as EntityType,
    teams: ["platform", "devops"],
    technologies: ["GitHub Actions", "Docker", "Kubernetes"],
    description: "Automated CI/CD pipeline for deploying applications to production",
    documentation: "https://docs.company.dev/deployment",
    apiEndpoint: "https://github.com/company/repo/actions",
    dependencies: ["docker-registry", "kubernetes-cluster", "monitoring-service"],
    dependents: ["all-services"],
    sla: "99.5%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.2.0",
    lastDeployment: "1 day ago",
    cloudProviders: [
      { provider: "GitHub", regions: ["us-east-1", "eu-west-1"] }
    ],
    tags: ["ci-cd", "deployment", "automation", "github-actions"],
    metrics: {
      uptime: "99.6%",
      responseTime: "2.5m",
      requestsPerSecond: "N/A",
      errorRate: "0.4%",
    },
  },
  {
    id: "data-pipeline-workflow",
    name: "Data Pipeline Workflow",
    entityType: "Workflow" as EntityType,
    teams: ["data", "ml"],
    technologies: ["Apache Airflow", "Python", "Pandas"],
    description: "ETL pipeline for processing and transforming data from multiple sources",
    documentation: "https://docs.company.dev/data-pipeline",
    apiEndpoint: "https://airflow.company.dev",
    dependencies: ["kafka-cluster", "data-warehouse", "ml-pipeline"],
    dependents: ["analytics-dashboard", "ml-models"],
    sla: "99.0%",
    oncall: "data-oncall",
    status: "healthy",
    version: "v2.1.3",
    lastDeployment: "3 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "GCP", regions: ["us-central1"] }
    ],
    tags: ["etl", "data-pipeline", "airflow", "analytics"],
    metrics: {
      uptime: "99.1%",
      responseTime: "15m",
      requestsPerSecond: "N/A",
      errorRate: "0.9%",
    },
  },
  // Workers
  {
    id: "email-worker",
    name: "Email Processing Worker",
    entityType: "Worker" as EntityType,
    teams: ["platform", "notifications"],
    technologies: ["Celery", "Redis", "Python"],
    description: "Background worker for processing email notifications and campaigns",
    documentation: "https://docs.company.dev/email-worker",
    apiEndpoint: "https://workers.company.dev/email",
    dependencies: ["redis-queue", "email-service", "user-database"],
    dependents: ["notification-service", "marketing-service"],
    sla: "99.8%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.5.2",
    lastDeployment: "2 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "Azure", regions: ["eastus"] }
    ],
    tags: ["worker", "email", "celery", "background-jobs"],
    metrics: {
      uptime: "99.85%",
      responseTime: "500ms",
      requestsPerSecond: "2.1k",
      errorRate: "0.15%",
    },
  },
  {
    id: "image-processing-worker",
    name: "Image Processing Worker",
    entityType: "Worker" as EntityType,
    teams: ["platform", "media"],
    technologies: ["Kubernetes Jobs", "Python", "OpenCV"],
    description: "Distributed worker for processing and optimizing images",
    documentation: "https://docs.company.dev/image-worker",
    apiEndpoint: "https://workers.company.dev/images",
    dependencies: ["s3-storage", "kubernetes-cluster", "redis-queue"],
    dependents: ["file-storage", "content-service"],
    sla: "99.7%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v2.0.1",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "GCP", regions: ["us-central1"] },
      { provider: "Vercel", regions: ["global"] }
    ],
    tags: ["worker", "image-processing", "kubernetes", "batch-processing"],
    metrics: {
      uptime: "99.75%",
      responseTime: "3.2s",
      requestsPerSecond: "800",
      errorRate: "0.25%",
    },
  },
  // Background Jobs
  {
    id: "email-notification-job",
    name: "Email Notification Job",
    entityType: "Background Job" as EntityType,
    teams: ["platform", "notifications"],
    technologies: ["Redis Queue", "Python", "Celery"],
    description: "Background job for sending email notifications to users",
    documentation: "https://docs.company.dev/email-job",
    apiEndpoint: "https://jobs.company.dev/email",
    dependencies: ["redis-queue", "email-service", "user-database"],
    dependents: ["notification-service"],
    sla: "99.9%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.3.1",
    lastDeployment: "2 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "GCP", regions: ["us-central1"] }
    ],
    tags: ["background-job", "email", "notifications", "redis"],
    metrics: {
      uptime: "99.95%",
      responseTime: "200ms",
      requestsPerSecond: "500",
      errorRate: "0.05%",
    },
  },
  {
    id: "data-sync-job",
    name: "User Data Sync Job",
    entityType: "Background Job" as EntityType,
    teams: ["data", "platform"],
    technologies: ["Bull Queue", "Node.js", "MongoDB"],
    description: "Synchronizes data between different systems and databases",
    documentation: "https://docs.company.dev/data-sync",
    apiEndpoint: "https://jobs.company.dev/sync",
    dependencies: ["postgresql", "mongodb", "kafka-cluster"],
    dependents: ["analytics-service", "reporting-service"],
    sla: "99.5%",
    oncall: "data-oncall",
    status: "healthy",
    version: "v2.0.4",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1", "us-west-2"] },
      { provider: "GCP", regions: ["us-central1"] },
      { provider: "Vercel", regions: ["global"] }
    ],
    tags: ["background-job", "data-sync", "etl", "bull-queue"],
    metrics: {
      uptime: "99.6%",
      responseTime: "5.2s",
      requestsPerSecond: "100",
      errorRate: "0.4%",
    },
  },
  // CRON Jobs
  {
    id: "daily-backup-cron",
    name: "Transactions: Daily Backup CRON",
    entityType: "CRON Job" as EntityType,
    teams: ["platform", "devops"],
    technologies: ["Kubernetes CronJob", "Bash", "AWS S3"],
    description: "Scheduled daily backup of critical databases and files",
    documentation: "https://docs.company.dev/backup-cron",
    apiEndpoint: "https://cron.company.dev/backup",
    dependencies: ["postgresql", "mongodb", "s3-storage"],
    dependents: ["disaster-recovery"],
    sla: "99.8%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.1.0",
    lastDeployment: "1 month ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "GCP", regions: ["us-central1"] }
    ],
    tags: ["cron-job", "backup", "kubernetes", "scheduled"],
    metrics: {
      uptime: "99.85%",
      responseTime: "45m",
      requestsPerSecond: "N/A",
      errorRate: "0.15%",
    },
  },
  {
    id: "metrics-cleanup-cron",
    name: "Metrics Cleanup CRON",
    entityType: "CRON Job" as EntityType,
    teams: ["platform", "monitoring"],
    technologies: ["AWS EventBridge", "Lambda", "CloudWatch"],
    description: "Weekly cleanup of old metrics and logs to save storage",
    documentation: "https://docs.company.dev/cleanup-cron",
    apiEndpoint: "https://cron.company.dev/cleanup",
    dependencies: ["influxdb", "elasticsearch", "s3-storage"],
    dependents: ["monitoring-service"],
    sla: "99.0%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.0.2",
    lastDeployment: "2 weeks ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "GCP", regions: ["us-central1"] }
    ],
    tags: ["cron-job", "cleanup", "metrics", "aws-eventbridge"],
    metrics: {
      uptime: "99.1%",
      responseTime: "2h",
      requestsPerSecond: "N/A",
      errorRate: "0.9%",
    },
  },
  // Jobs
  {
    id: "ml-model-training-job",
    name: "ML Model Training Job",
    entityType: "Job" as EntityType,
    teams: ["ai", "ml"],
    technologies: ["AWS Batch", "Python", "TensorFlow"],
    description: "One-time job for training machine learning models",
    documentation: "https://docs.company.dev/ml-training",
    apiEndpoint: "https://jobs.company.dev/ml-training",
    dependencies: ["s3-storage", "gpu-cluster", "training-data"],
    dependents: ["ml-inference-service"],
    sla: "95.0%",
    oncall: "ai-oncall",
    status: "healthy",
    version: "v3.2.1",
    lastDeployment: "3 days ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "GCP", regions: ["us-central1"] }
    ],
    tags: ["job", "ml", "training", "aws-batch", "gpu"],
    metrics: {
      uptime: "95.5%",
      responseTime: "4h",
      requestsPerSecond: "N/A",
      errorRate: "4.5%",
    },
  },
  {
    id: "report-generation-job",
    name: "Report Generation Job",
    entityType: "Job" as EntityType,
    teams: ["data", "business-intelligence"],
    technologies: ["Kubernetes Jobs", "Python", "Pandas"],
    description: "Batch job for generating monthly business reports",
    documentation: "https://docs.company.dev/report-generation",
    apiEndpoint: "https://jobs.company.dev/reports",
    dependencies: ["data-warehouse", "s3-storage", "email-service"],
    dependents: ["business-intelligence"],
    sla: "98.0%",
    oncall: "data-oncall",
    status: "healthy",
    version: "v2.1.3",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "AWS", regions: ["us-east-1"] },
      { provider: "GCP", regions: ["us-central1"] }
    ],
    tags: ["job", "reports", "batch-processing", "kubernetes"],
    metrics: {
      uptime: "98.2%",
      responseTime: "1.5h",
      requestsPerSecond: "N/A",
      errorRate: "1.8%",
    },
  },
  // Code Repositories
  {
    id: "user-service-repo",
    name: "User Service Repository",
    entityType: "Code Repository" as EntityType,
    teams: ["platform", "backend"],
    technologies: ["TypeScript", "Node.js", "Express"],
    description: "Microservice for user authentication and profile management",
    documentation: "https://github.com/company/user-service",
    apiEndpoint: "https://github.com/company/user-service",
    dependencies: ["postgresql", "redis", "jwt-service"],
    dependents: ["api-gateway", "notification-service"],
    sla: "99.9%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v2.1.4",
    lastDeployment: "1 day ago",
    cloudProviders: [
      { provider: "GitHub", regions: ["us-east-1", "eu-west-1"] }
    ],
    tags: ["microservice", "typescript", "nodejs", "authentication"],
    metrics: {
      uptime: "99.95%",
      responseTime: "150ms",
      requestsPerSecond: "5k",
      errorRate: "0.05%",
    },
  },
  {
    id: "frontend-app-repo",
    name: "Frontend Application Repository",
    entityType: "Code Repository" as EntityType,
    teams: ["product", "frontend"],
    technologies: ["React", "Next.js", "TypeScript"],
    description: "Main customer-facing web application built with React and Next.js",
    documentation: "https://github.com/company/frontend-app",
    apiEndpoint: "https://github.com/company/frontend-app",
    dependencies: ["api-gateway", "cdn", "analytics-service"],
    dependents: ["deployment-pipeline", "monitoring-service"],
    sla: "99.8%",
    oncall: "product-oncall",
    status: "healthy",
    version: "v1.8.2",
    lastDeployment: "2 days ago",
    cloudProviders: [
      { provider: "GitHub", regions: ["us-east-1", "us-west-2", "eu-west-1"] },
      { provider: "GitLab", regions: ["us-east-1"] }
    ],
    tags: ["frontend", "react", "nextjs", "web-app"],
    metrics: {
      uptime: "99.85%",
      responseTime: "200ms",
      requestsPerSecond: "10k",
      errorRate: "0.15%",
    },
  },
  {
    id: "infrastructure-repo",
    name: "Infrastructure Repository",
    entityType: "Code Repository" as EntityType,
    teams: ["platform", "devops"],
    technologies: ["Terraform", "AWS", "Kubernetes"],
    description: "Infrastructure as Code repository for AWS and Kubernetes resources",
    documentation: "https://github.com/company/infrastructure",
    apiEndpoint: "https://github.com/company/infrastructure",
    dependencies: ["aws-account", "kubernetes-cluster", "terraform-state"],
    dependents: ["all-services", "monitoring-stack"],
    sla: "99.5%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v3.0.1",
    lastDeployment: "1 week ago",
    cloudProviders: [
      { provider: "GitHub", regions: ["us-east-1", "us-west-2"] },
      { provider: "Bitbucket", regions: ["us-east-1"] }
    ],
    tags: ["infrastructure", "terraform", "kubernetes", "aws"],
    metrics: {
      uptime: "99.6%",
      responseTime: "N/A",
      requestsPerSecond: "N/A",
      errorRate: "0.4%",
    },
  },
  {
    id: "shared-lib-repo",
    name: "Shared Library Repository",
    entityType: "Code Repository" as EntityType,
    teams: ["platform", "shared-services"],
    technologies: ["TypeScript", "NPM", "Jest"],
    description: "Shared utility library used across multiple services",
    documentation: "https://github.com/company/shared-lib",
    apiEndpoint: "https://github.com/company/shared-lib",
    dependencies: ["npm-registry", "ci-cd-pipeline"],
    dependents: ["user-service", "payment-service", "notification-service"],
    sla: "99.9%",
    oncall: "platform-oncall",
    status: "healthy",
    version: "v1.5.3",
    lastDeployment: "3 days ago",
    cloudProviders: [
      { provider: "GitHub", regions: ["us-east-1"] },
      { provider: "GitLab", regions: ["us-east-1"] }
    ],
    tags: ["library", "typescript", "utilities", "shared"],
    metrics: {
      uptime: "99.95%",
      responseTime: "N/A",
      requestsPerSecond: "N/A",
      errorRate: "0.05%",
    },
  },
]

// Helper functions
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "unhealthy":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-posthog-gray" />
    }
  }

const getEntityIcon = (entity: any) => {
  const entityType = entity.entityType
  const name = entity.name.toLowerCase()
  const tags = entity.tags.join(' ').toLowerCase()
  
  switch (entityType) {
    case "Service":
    case "Microservice":
      return <Server className="h-5 w-5 text-posthog-orange" />
    case "API":
      return <Network className="h-5 w-5 text-posthog-orange" />
    case "Database":
      return <Database className="h-5 w-5 text-posthog-orange" />
    case "VM":
      return <Cpu className="h-5 w-5 text-posthog-orange" />
    case "ML Model":
      return <Brain className="h-5 w-5 text-posthog-orange" />
    case "Serverless Function":
      return <Zap className="h-5 w-5 text-posthog-orange" />
    case "Website":
    case "Web App":
      return <Globe className="h-5 w-5 text-posthog-orange" />
    case "SPA":
    case "PWA":
      return <Smartphone className="h-5 w-5 text-posthog-orange" />
    case "UI Component":
    case "Microfrontend":
      return <Code className="h-5 w-5 text-posthog-orange" />
    case "Kafka Topic":
      return <MessageSquare className="h-5 w-5 text-posthog-orange" />
    case "Documentation":
    case "Runbook":
    case "Release Notes":
    case "Implementation Plan":
      return <BookOpen className="h-5 w-5 text-posthog-orange" />
    case "Dataset":
    case "Data Lake":
      return <BarChart3 className="h-5 w-5 text-posthog-orange" />
    case "LLM":
      return <Brain className="h-5 w-5 text-posthog-orange" />
    case "Security":
      return <Shield className="h-5 w-5 text-posthog-orange" />
    case "SDK":
    case "Library":
      return <Code className="h-5 w-5 text-posthog-orange" />
    case "Image":
      return <FileText className="h-5 w-5 text-posthog-orange" />
    case "Infrastructure":
      return <HardDrive className="h-5 w-5 text-posthog-orange" />
    case "Cache":
      return <Activity className="h-5 w-5 text-posthog-orange" />
    case "Prompt":
      return <MessageSquare className="h-5 w-5 text-posthog-orange" />
    case "Experiment":
      return <Settings className="h-5 w-5 text-posthog-orange" />
    case "Policy":
      return <Shield className="h-5 w-5 text-posthog-orange" />
    case "Feature Flag":
      return <Settings className="h-5 w-5 text-posthog-orange" />
    case "CDN":
      return <Cloud className="h-5 w-5 text-posthog-orange" />
    case "Network":
      return <Network className="h-5 w-5 text-posthog-orange" />
    case "Mobile App":
      return <Smartphone className="h-5 w-5 text-posthog-orange" />
    case "Workflow":
      return <GitBranch className="h-5 w-5 text-posthog-orange" />
    case "Worker":
      return <Cpu className="h-5 w-5 text-posthog-orange" />
    case "Background Job":
      return <Clock className="h-5 w-5 text-posthog-orange" />
    case "CRON Job":
      return <Clock className="h-5 w-5 text-posthog-orange" />
    case "Job":
      return <Activity className="h-5 w-5 text-posthog-orange" />
    case "Code Repository":
      return <GitBranch className="h-5 w-5 text-posthog-orange" />
      default:
      return <Server className="h-5 w-5 text-posthog-orange" />
  }
}

const getQuickActions = (entityType: EntityType) => {
  switch (entityType) {
    case "Service":
    case "Microservice":
      return [
        { label: "DEPLOY", icon: Zap, action: "deploy" },
        { label: "SCALE", icon: ArrowUpDown, action: "scale" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
      ]
    case "API":
      return [
        { label: "TEST_API", icon: Network, action: "test-api" },
        { label: "VIEW_SCHEMA", icon: BookOpen, action: "view-schema" },
        { label: "RATE_LIMIT", icon: Shield, action: "rate-limit" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "Database":
      return [
        { label: "BACKUP", icon: HardDrive, action: "backup" },
        { label: "QUERY", icon: Database, action: "query" },
        { label: "MIGRATE", icon: ArrowUpDown, action: "migrate" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "ML Model":
      return [
        { label: "TRAIN", icon: Brain, action: "train" },
        { label: "EVALUATE", icon: BarChart3, action: "evaluate" },
        { label: "DEPLOY", icon: Zap, action: "deploy" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "Serverless Function":
      return [
        { label: "DEPLOY", icon: Zap, action: "deploy" },
        { label: "INVOKE", icon: Play, action: "invoke" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
      ]
    case "Website":
    case "Web App":
      return [
        { label: "DEPLOY", icon: Zap, action: "deploy" },
        { label: "PREVIEW", icon: Eye, action: "preview" },
        { label: "ANALYZE", icon: BarChart3, action: "analyze" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "SPA":
    case "PWA":
      return [
        { label: "BUILD", icon: Code, action: "build" },
        { label: "DEPLOY", icon: Zap, action: "deploy" },
        { label: "TEST", icon: CheckCircle, action: "test" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "UI Component":
    case "Microfrontend":
      return [
        { label: "BUILD", icon: Code, action: "build" },
        { label: "TEST", icon: CheckCircle, action: "test" },
        { label: "PUBLISH", icon: Upload, action: "publish" },
        { label: "DOCS", icon: BookOpen, action: "docs" },
      ]
    case "Kafka Topic":
      return [
        { label: "SEND_MESSAGE", icon: Send, action: "send-message" },
        { label: "CONSUME", icon: Download, action: "consume" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
      ]
    case "Documentation":
    case "Runbook":
    case "Release Notes":
    case "Implementation Plan":
      return [
        { label: "EDIT", icon: Edit, action: "edit" },
        { label: "REVIEW", icon: Eye, action: "review" },
        { label: "PUBLISH", icon: Upload, action: "publish" },
        { label: "SHARE", icon: Share, action: "share" },
      ]
    case "Dataset":
    case "Data Lake":
      return [
        { label: "DOWNLOAD", icon: Download, action: "download" },
        { label: "ANALYZE", icon: BarChart3, action: "analyze" },
        { label: "TRANSFORM", icon: ArrowUpDown, action: "transform" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "LLM":
      return [
        { label: "TRAIN", icon: Brain, action: "train" },
        { label: "INFER", icon: MessageSquare, action: "infer" },
        { label: "EVALUATE", icon: BarChart3, action: "evaluate" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "Security":
      return [
        { label: "SCAN", icon: Shield, action: "scan" },
        { label: "AUDIT", icon: CheckCircle, action: "audit" },
        { label: "COMPLIANCE", icon: Lock, action: "compliance" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "SDK":
    case "Library":
      return [
        { label: "BUILD", icon: Code, action: "build" },
        { label: "TEST", icon: CheckCircle, action: "test" },
        { label: "PUBLISH", icon: Upload, action: "publish" },
        { label: "DOCS", icon: BookOpen, action: "docs" },
      ]
    case "Infrastructure":
      return [
        { label: "PROVISION", icon: HardDrive, action: "provision" },
        { label: "SCALE", icon: ArrowUpDown, action: "scale" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
      ]
    case "Cache":
      return [
        { label: "CLEAR", icon: X, action: "clear" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
        { label: "ANALYZE", icon: BarChart3, action: "analyze" },
      ]
    case "Feature Flag":
      return [
        { label: "TOGGLE", icon: Settings, action: "toggle" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "ANALYZE", icon: BarChart3, action: "analyze" },
      ]
    case "CDN":
      return [
        { label: "PURGE", icon: X, action: "purge" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
        { label: "ANALYZE", icon: BarChart3, action: "analyze" },
      ]
    case "Mobile App":
      return [
        { label: "BUILD", icon: Code, action: "build" },
        { label: "TEST", icon: CheckCircle, action: "test" },
        { label: "DEPLOY", icon: Zap, action: "deploy" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "Workflow":
      return [
        { label: "EXECUTE", icon: Play, action: "execute" },
        { label: "SCHEDULE", icon: Clock, action: "schedule" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
      ]
    case "Worker":
      return [
        { label: "START", icon: Play, action: "start" },
        { label: "STOP", icon: Pause, action: "stop" },
        { label: "RESTART", icon: RotateCcw, action: "restart" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "Background Job":
      return [
        { label: "QUEUE", icon: Upload, action: "queue" },
        { label: "EXECUTE", icon: Play, action: "execute" },
        { label: "CANCEL", icon: X, action: "cancel" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "CRON Job":
      return [
        { label: "SCHEDULE", icon: Clock, action: "schedule" },
        { label: "EXECUTE", icon: Play, action: "execute" },
        { label: "DISABLE", icon: Pause, action: "disable" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "Job":
      return [
        { label: "RUN", icon: Play, action: "run" },
        { label: "RETRY", icon: RotateCcw, action: "retry" },
        { label: "CANCEL", icon: X, action: "cancel" },
        { label: "MONITOR", icon: Activity, action: "monitor" },
      ]
    case "Code Repository":
      return [
        { label: "CLONE", icon: Download, action: "clone" },
        { label: "PULL", icon: ArrowDown, action: "pull" },
        { label: "PUSH", icon: ArrowUp, action: "push" },
        { label: "BRANCH", icon: GitBranch, action: "branch" },
      ]
    default:
      return [
        { label: "MONITOR", icon: Activity, action: "monitor" },
        { label: "CONFIGURE", icon: Settings, action: "configure" },
        { label: "DOCS", icon: BookOpen, action: "docs" },
        { label: "HEALTH", icon: CheckCircle, action: "health" },
      ]
  }
}

export default function EntityCatalog({ onQuickAction }: EntityCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedTechnology, setSelectedTechnology] = useState("all")
  const [selectedEntityType, setSelectedEntityType] = useState("all")
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("table")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<{action: string, label: string, entity: any} | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createMode, setCreateMode] = useState<"manual" | "automated" | "copilot">("manual")
  const [selectedCreateEntityType, setSelectedCreateEntityType] = useState<EntityType>("Service")
  const [createFormData, setCreateFormData] = useState<any>({})
  const [chatMessages, setChatMessages] = useState<Array<{id: string, type: 'user' | 'copilot', content: string, timestamp: Date}>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [editingCard, setEditingCard] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<any>({})
  const [showQuickActionsMenu, setShowQuickActionsMenu] = useState(false)
  const [editingSLA, setEditingSLA] = useState(false)
  const [editingVersion, setEditingVersion] = useState(false)
  const [editingOncallTeams, setEditingOncallTeams] = useState(false)
  const [newVersion, setNewVersion] = useState("")
  const [selectedOncallTeams, setSelectedOncallTeams] = useState<string[]>([])
  const [incidents, setIncidents] = useState<Array<{id: string, title: string, severity: string, status: string, createdAt: string, resolvedAt?: string}>>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [actionsSearchQuery, setActionsSearchQuery] = useState("")

  // Close quick actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showQuickActionsMenu) {
        setShowQuickActionsMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showQuickActionsMenu])

  // Helper functions for immersive editing
  const getSLAOptions = () => [
    { value: "99.9%", label: "99.9% (3.6 hours/month)" },
    { value: "99.95%", label: "99.95% (1.8 hours/month)" },
    { value: "99.99%", label: "99.99% (0.4 hours/month)" },
    { value: "99.999%", label: "99.999% (0.04 hours/month)" },
    { value: "Custom", label: "Custom SLA" }
  ]

  const getAvailableTeams = () => [
    "Platform Engineering",
    "Backend Services", 
    "Frontend Team",
    "DevOps",
    "Data Engineering",
    "Security Team",
    "SRE Team",
    "Mobile Team"
  ]

  const getIncidentHistory = (entityId: string) => [
    {
      id: "INC-001",
      title: "High CPU usage causing slow response times",
      severity: "High",
      status: "Resolved",
      createdAt: "2024-01-15T10:30:00Z",
      resolvedAt: "2024-01-15T14:45:00Z"
    },
    {
      id: "INC-002", 
      title: "Database connection pool exhaustion",
      severity: "Critical",
      status: "Resolved",
      createdAt: "2024-01-10T08:15:00Z",
      resolvedAt: "2024-01-10T12:30:00Z"
    },
    {
      id: "INC-003",
      title: "Memory leak in background processing",
      severity: "Medium", 
      status: "Investigating",
      createdAt: "2024-01-20T16:20:00Z"
    }
  ]

  // Calculate approximate cost for Service and Database entities
  const calculateEntityCost = (entity: any) => {
    if (entity.entityType !== "Service" && entity.entityType !== "Database") {
      return null
    }

    // Base cost calculation based on metrics and entity type
    let baseCost = 0
    let costBreakdown: { category: string; amount: number; percentage: number }[] = []
    let rps = 0

    if (entity.entityType === "Service") {
      // Estimate based on requests per second, response time, and uptime
      rps = parseFloat(entity.metrics.requestsPerSecond.replace(/[^\d.]/g, '')) || 0
      const monthlyRequests = rps * 60 * 60 * 24 * 30 // Approximate monthly requests
      
      // Compute cost (based on CPU/memory usage)
      const computeCost = Math.max(200, rps * 15) // Base $200 + $15 per 1k RPS
      // Storage cost (logs, metrics)
      const storageCost = Math.max(50, rps * 2) // Base $50 + $2 per 1k RPS
      // Network cost (data transfer)
      const networkCost = Math.max(30, rps * 1.5) // Base $30 + $1.5 per 1k RPS
      // Monitoring cost
      const monitoringCost = Math.max(20, rps * 0.5) // Base $20 + $0.5 per 1k RPS
      
      baseCost = computeCost + storageCost + networkCost + monitoringCost
      
      costBreakdown = [
        { category: "Compute", amount: computeCost, percentage: Math.round((computeCost / baseCost) * 100) },
        { category: "Storage", amount: storageCost, percentage: Math.round((storageCost / baseCost) * 100) },
        { category: "Network", amount: networkCost, percentage: Math.round((networkCost / baseCost) * 100) },
        { category: "Monitoring", amount: monitoringCost, percentage: Math.round((monitoringCost / baseCost) * 100) },
      ]
    } else if (entity.entityType === "Database") {
      // Estimate based on database size, connections, and operations
      rps = parseFloat(entity.metrics.requestsPerSecond.replace(/[^\d.]/g, '')) || 0
      
      // Compute cost (instance size)
      const computeCost = Math.max(300, rps * 20) // Base $300 for DB instance
      // Storage cost (data storage)
      const storageCost = Math.max(150, rps * 5) // Base $150 + $5 per 1k RPS
      // Backup cost
      const backupCost = Math.max(80, storageCost * 0.3) // 30% of storage cost
      // Network cost (data transfer)
      const networkCost = Math.max(40, rps * 2) // Base $40 + $2 per 1k RPS
      // Monitoring cost
      const monitoringCost = Math.max(30, rps * 0.8) // Base $30 + $0.8 per 1k RPS
      
      baseCost = computeCost + storageCost + backupCost + networkCost + monitoringCost
      
      costBreakdown = [
        { category: "Compute", amount: computeCost, percentage: Math.round((computeCost / baseCost) * 100) },
        { category: "Storage", amount: storageCost, percentage: Math.round((storageCost / baseCost) * 100) },
        { category: "Backup", amount: backupCost, percentage: Math.round((backupCost / baseCost) * 100) },
        { category: "Network", amount: networkCost, percentage: Math.round((networkCost / baseCost) * 100) },
        { category: "Monitoring", amount: monitoringCost, percentage: Math.round((monitoringCost / baseCost) * 100) },
      ]
    }

    // Add some variance based on cloud providers (multi-region costs more)
    const regionMultiplier = entity.cloudProviders?.length > 1 ? 1.3 : 1.0
    baseCost = baseCost * regionMultiplier

    // Calculate per-request cost for services
    const monthlyRequests = rps * 60 * 60 * 24 * 30
    const perRequest = entity.entityType === "Service" && monthlyRequests > 0 
      ? (baseCost / monthlyRequests).toFixed(4) 
      : null

    return {
      monthly: Math.round(baseCost),
      breakdown: costBreakdown,
      perRequest: perRequest,
      trend: Math.random() > 0.5 ? "up" : "down",
      change: `${Math.random() > 0.5 ? "+" : "-"}${Math.floor(Math.random() * 15) + 1}%`
    }
  }

  const getRepositoryLink = (entityType: EntityType, entityName: string) => {
    const repoMappings: { [key in EntityType]?: string } = {
      "Service": `https://github.com/company/${entityName.toLowerCase().replace(/\s+/g, '-')}`,
      "API": `https://github.com/company/api-${entityName.toLowerCase().replace(/\s+/g, '-')}`,
      "Database": `https://github.com/company/db-${entityName.toLowerCase().replace(/\s+/g, '-')}`,
      "ML Model": `https://github.com/company/ml-${entityName.toLowerCase().replace(/\s+/g, '-')}`
    }
    return repoMappings[entityType]
  }

  const teams = ["all", ...Array.from(new Set(entities.flatMap((e) => e.teams)))]
  const technologies = ["all", ...Array.from(new Set(entities.flatMap((e) => e.technologies)))]
  const entityTypes = ["all", ...Array.from(new Set(entities.map((e) => e.entityType)))]

  // Apply additional filters
  const filteredEntities = useMemo(() => {
    let filtered = entities

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter((entity) => {
        const searchValue = searchQuery.toLowerCase()
        return (
          entity.name.toLowerCase().includes(searchValue) ||
          entity.description.toLowerCase().includes(searchValue) ||
          entity.tags.some((tag) => tag.toLowerCase().includes(searchValue))
        )
      })
    }

    // Apply team filter
    if (selectedTeam !== "all") {
      filtered = filtered.filter((entity) => entity.teams.includes(selectedTeam))
    }

    // Apply technology filter
    if (selectedTechnology !== "all") {
      filtered = filtered.filter((entity) => entity.technologies.includes(selectedTechnology))
    }

    // Apply entity type filter
    if (selectedEntityType !== "all") {
      filtered = filtered.filter((entity) => entity.entityType === selectedEntityType)
    }

    return filtered
  }, [entities, searchQuery, selectedTeam, selectedTechnology, selectedEntityType])

  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity)
    setIsDialogOpen(true)
  }

  const handleActionClick = (action: string, label: string, entity: any) => {
    setSelectedAction({ action, label, entity })
    setIsActionModalOpen(true)
  }

  const executeAction = () => {
    if (selectedAction) {
      onQuickAction(`${selectedAction.action} ${selectedAction.entity.name}`)
      setIsActionModalOpen(false)
      setSelectedAction(null)
    }
  }

  const handleCreateEntity = () => {
    setIsCreateModalOpen(true)
    setCreateFormData({})
    setChatMessages([])
    setChatInput("")
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return

    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: chatInput.trim(),
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    // Simulate CoPilot response
    setTimeout(() => {
      const copilotResponse = generateCopilotResponse(chatInput.trim(), selectedCreateEntityType)
      const copilotMessage = {
        id: (Date.now() + 1).toString(),
        type: 'copilot' as const,
        content: copilotResponse,
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, copilotMessage])
      setIsChatLoading(false)
    }, 1500)
  }

  const handleEditCard = (cardType: string, data: any) => {
    setEditingCard(cardType)
    setEditingData({ ...data })
  }

  const handleSaveCard = (cardType: string) => {
    // Here you would typically save to your backend
    console.log(`Saving ${cardType}:`, editingData)
    setEditingCard(null)
    setEditingData({})
  }

  const handleCancelEdit = () => {
    setEditingCard(null)
    setEditingData({})
  }

  // New handler functions for immersive editing
  const handleSaveSLA = (newSLA: string) => {
    if (selectedEntity) {
      const updatedEntity = { ...selectedEntity, sla: newSLA }
      setSelectedEntity(updatedEntity)
      setEditingSLA(false)
    }
  }

  const handleSaveVersion = () => {
    if (selectedEntity && newVersion.trim()) {
      const updatedEntity = { ...selectedEntity, version: newVersion.trim() }
      setSelectedEntity(updatedEntity)
      setNewVersion("")
      setEditingVersion(false)
    }
  }

  const handleSaveOncallTeams = () => {
    if (selectedEntity) {
      const updatedEntity = { ...selectedEntity, oncall: selectedOncallTeams.join(", ") }
      setSelectedEntity(updatedEntity)
      setEditingOncallTeams(false)
    }
  }

  const handleTeamToggle = (team: string) => {
    setSelectedOncallTeams(prev => 
      prev.includes(team) 
        ? prev.filter(t => t !== team)
        : [...prev, team]
    )
  }

  const getAllQuickActions = () => {
    // Original available actions
    const originalActions = [
      { action: "deploy", label: "DEPLOY", icon: Play },
      { action: "scale", label: "SCALE", icon: ArrowUpDown },
      { action: "monitor", label: "MONITOR", icon: Activity },
      { action: "logs", label: "VIEW_LOGS", icon: FileText },
      { action: "metrics", label: "METRICS", icon: BarChart3 },
      { action: "alerts", label: "ALERTS", icon: AlertTriangle },
      { action: "backup", label: "BACKUP", icon: HardDrive },
      { action: "restore", label: "RESTORE", icon: RotateCcw },
      { action: "update", label: "UPDATE", icon: Upload },
      { action: "rollback", label: "ROLLBACK", icon: ArrowDown },
      { action: "restart", label: "RESTART", icon: RotateCcw },
      { action: "stop", label: "STOP", icon: Pause },
      { action: "start", label: "START", icon: Play },
      { action: "delete", label: "DELETE", icon: X },
      { action: "duplicate", label: "DUPLICATE", icon: Copy },
      { action: "export", label: "EXPORT", icon: Download },
      { action: "import", label: "IMPORT", icon: Upload },
      { action: "share", label: "SHARE", icon: Share },
      { action: "archive", label: "ARCHIVE", icon: Archive },
      { action: "unarchive", label: "UNARCHIVE", icon: Archive }
    ]

    // Get self-service actions based on the selected entity type
    const entityActions = getActionsByEntityType(selectedEntity?.entityType || "Service")
    
    // Map the self-service actions to the expected format
    const selfServiceActions = entityActions.map(action => ({
      action: action.id,
      label: action.title.toUpperCase().replace(/\s+/g, '_'),
      icon: getIconComponent(action.icon)
    }))

    // Combine both action types
    return [...originalActions, ...selfServiceActions]
  }

  const getFilteredActions = () => {
    const allActions = getAllQuickActions()
    if (!actionsSearchQuery.trim()) {
      return allActions
    }
    
    return allActions.filter(action => 
      action.label.toLowerCase().includes(actionsSearchQuery.toLowerCase()) ||
      action.action.toLowerCase().includes(actionsSearchQuery.toLowerCase())
    )
  }

  const generateCopilotResponse = (userInput: string, entityType: EntityType): string => {
    const responses: { [key in EntityType]?: string[] } = {
      "Service": [
        "I'll help you create a service! What technology stack are you planning to use? (e.g., Node.js, Python, Go)",
        "Great! For a service, I recommend setting up proper monitoring, logging, and health checks. What's the main functionality?",
        "Let's configure the dependencies and API endpoints. Do you need authentication?",
        "Perfect! I can help you set up the service with proper error handling and rate limiting."
      ],
      "API": [
        "Let's create an API! What kind of data will it handle? REST or GraphQL?",
        "I'll help you design the API endpoints. What's the main resource you're exposing?",
        "For API security, I recommend implementing proper authentication and rate limiting. What's your preferred method?",
        "Great! Let's set up the API documentation and versioning strategy."
      ],
      "Database": [
        "I'll help you set up a database! What type of data are you storing? (relational, document, key-value)",
        "Let's configure the database with proper indexing and backup strategies. What's your data volume?",
        "I recommend setting up monitoring and connection pooling. What's your expected load?",
        "Perfect! Let's configure the database with proper security and access controls."
      ],
      "ML Model": [
        "Let's create an ML model! What type of problem are you solving? (classification, regression, NLP)",
        "I'll help you set up the training pipeline. What's your data source?",
        "For model deployment, I recommend containerization and A/B testing. What's your accuracy target?",
        "Great! Let's configure the model with proper monitoring and retraining strategies."
      ],
      "Microservice": [
        "Let's create a microservice! What's the main functionality you need?",
        "I'll help you design the microservice architecture. What's the data flow?",
        "For microservice communication, I recommend implementing proper service mesh. What's your preferred protocol?",
        "Great! Let's set up the microservice with proper logging and monitoring."
      ]
    }

    const entityResponses = responses[entityType] || responses["Service"] || ["I'll help you create this entity! What do you need?"]
    return entityResponses[Math.floor(Math.random() * entityResponses.length)]
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      "FileText": FileText,
      "MessageSquare": MessageSquare,
      "Users": Users,
      "Code": Code,
      "BookOpen": BookOpen,
      "Globe": Globe,
      "Shield": Shield,
      "GitBranch": GitBranch,
      "Network": Network,
      "Activity": Activity,
      "Lock": Lock,
      "Database": Database,
      "HardDrive": HardDrive,
      "Brain": Brain,
      "BarChart3": BarChart3,
      "Cpu": Cpu,
      "Clock": Clock,
      "Settings": Settings,
      "Smartphone": Smartphone,
      "ExternalLink": ExternalLink,
      "Tag": Tag,
      "Server": Server,
      "Grid3X3": Grid3X3,
      "Zap": Zap,
      "ArrowUp": ArrowUp,
      "RotateCcw": RotateCcw,
      "CheckCircle": CheckCircle,
      "Package": Package,
      "Eye": Eye
    }
    return iconMap[iconName] || FileText
  }

  const getEntityFormFields = (entityType: EntityType) => {
    const baseFields = [
      { name: "name", label: "ENTITY_NAME", type: "text", required: true, icon: "FileText" },
      { name: "description", label: "DESCRIPTION", type: "textarea", required: false, icon: "MessageSquare" },
      { name: "teams", label: "TEAMS", type: "multiselect", required: false, icon: "Users", options: ["platform", "data", "payments", "marketing", "product", "commerce", "design", "mobile", "ai", "security", "infrastructure", "devops", "frontend", "backend", "ml", "analytics", "notifications", "media", "admin", "ios", "android", "customer-support", "business-intelligence", "shared-services", "developer-experience"] },
      { name: "technologies", label: "TECHNOLOGIES", type: "multiselect", required: false, icon: "Code", options: ["Node.js", "Java", "Go", "Python", "React", "Vue.js", "Swift", "Kotlin", "PostgreSQL", "MongoDB", "Kubernetes", "Docker", "TypeScript", "Spring Boot", "Express", "Next.js", "Tailwind CSS", "Material-UI", "Vuex", "Vue Router", "PWA", "Service Workers", "Storybook", "Styled Components", "Module Federation", "Webpack", "Apache Kafka", "Avro", "Schema Registry", "OpenAPI", "Swagger", "Redoc", "Parquet", "Apache Spark", "Pandas", "llama", "Transformers", "PyTorch", "SwiftUI", "Combine", "Redis", "Helm", "AWS", "S3", "GitHub Actions", "Terraform", "Jest", "NPM", "TensorFlow", "Celery", "OpenCV", "Bull Queue", "Bash", "CloudWatch", "Lambda", "InfluxDB", "Elasticsearch", "AWS Batch", "AWS EventBridge", "CloudFront"] },
      { name: "documentation", label: "DOCUMENTATION_URL", type: "url", required: false, icon: "BookOpen" },
      { name: "apiEndpoint", label: "API_ENDPOINT", type: "url", required: false, icon: "Globe" },
      { name: "sla", label: "SLA", type: "text", required: false, placeholder: "99.9%", icon: "Shield" },
      { name: "oncall", label: "ONCALL_TEAM", type: "text", required: false, icon: "Users" },
    ]

    const entitySpecificFields: { [key in EntityType]?: any[] } = {
      "Service": [
        { name: "dependencies", label: "DEPENDENCIES", type: "tags", required: false, icon: "GitBranch" },
        { name: "dependents", label: "DEPENDENTS", type: "tags", required: false, icon: "Network" },
      ],
      "API": [
        { name: "rateLimit", label: "RATE_LIMIT", type: "text", required: false, placeholder: "1000/hour", icon: "Activity" },
        { name: "authentication", label: "AUTHENTICATION", type: "select", required: false, icon: "Lock", options: ["None", "API Key", "OAuth2", "JWT", "Basic Auth"] },
      ],
      "Database": [
        { name: "databaseType", label: "DATABASE_TYPE", type: "select", required: false, icon: "Database", options: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"] },
        { name: "backupFrequency", label: "BACKUP_FREQUENCY", type: "select", required: false, icon: "HardDrive", options: ["Daily", "Weekly", "Monthly", "On-demand"] },
      ],
      "ML Model": [
        { name: "modelType", label: "MODEL_TYPE", type: "select", required: false, icon: "Brain", options: ["Classification", "Regression", "Clustering", "NLP", "Computer Vision"] },
        { name: "trainingData", label: "TRAINING_DATA_SOURCE", type: "text", required: false, icon: "Database" },
        { name: "accuracy", label: "MODEL_ACCURACY", type: "text", required: false, placeholder: "95.2%", icon: "BarChart3" },
      ],
      "Serverless Function": [
        { name: "runtime", label: "RUNTIME", type: "select", required: false, icon: "Code", options: ["Node.js", "Python", "Go", "Java", "C#"] },
        { name: "memory", label: "MEMORY_MB", type: "number", required: false, placeholder: "512", icon: "Cpu" },
        { name: "timeout", label: "TIMEOUT_SECONDS", type: "number", required: false, placeholder: "30", icon: "Clock" },
      ],
      "Website": [
        { name: "domain", label: "DOMAIN", type: "text", required: false, icon: "Globe" },
        { name: "cms", label: "CMS", type: "select", required: false, icon: "Settings", options: ["WordPress", "Contentful", "Strapi", "Custom", "None"] },
        { name: "ssl", label: "SSL_CERTIFICATE", type: "checkbox", required: false, icon: "Shield" },
      ],
      "Mobile App": [
        { name: "platform", label: "PLATFORM", type: "select", required: false, icon: "Smartphone", options: ["iOS", "Android", "Cross-platform"] },
        { name: "appStore", label: "APP_STORE_URL", type: "url", required: false, icon: "ExternalLink" },
        { name: "version", label: "APP_VERSION", type: "text", required: false, placeholder: "1.0.0", icon: "Tag" },
      ],
      "Infrastructure": [
        { name: "infrastructureType", label: "INFRASTRUCTURE_TYPE", type: "select", required: false, icon: "Server", options: ["Kubernetes", "Docker Swarm", "VM", "Serverless", "Bare Metal"] },
        { name: "nodes", label: "NUMBER_OF_NODES", type: "number", required: false, placeholder: "3", icon: "Grid3X3" },
        { name: "region", label: "PRIMARY_REGION", type: "text", required: false, placeholder: "us-east-1", icon: "Globe" },
      ],
      "Workflow": [
        { name: "workflowType", label: "WORKFLOW_TYPE", type: "select", required: false, icon: "Activity", options: ["CI/CD", "Data Pipeline", "Business Process", "Scheduled Task", "Event-driven"] },
        { name: "trigger", label: "TRIGGER", type: "select", required: false, icon: "Zap", options: ["Manual", "Schedule", "Webhook", "Event", "API Call"] },
        { name: "frequency", label: "EXECUTION_FREQUENCY", type: "text", required: false, placeholder: "Daily at 2 AM", icon: "Clock" },
      ],
      "Worker": [
        { name: "workerType", label: "WORKER_TYPE", type: "select", required: false, icon: "Cpu", options: ["Background Job", "Queue Processor", "Scheduled Task", "Event Handler", "Data Processor"] },
        { name: "concurrency", label: "CONCURRENCY", type: "number", required: false, placeholder: "5", icon: "Activity" },
        { name: "timeout", label: "TIMEOUT_MINUTES", type: "number", required: false, placeholder: "30", icon: "Clock" },
      ],
      "Background Job": [
        { name: "jobType", label: "JOB_TYPE", type: "select", required: false, icon: "Activity", options: ["Email Processing", "Data Sync", "File Processing", "Notification", "Cleanup"] },
        { name: "priority", label: "PRIORITY", type: "select", required: false, icon: "ArrowUp", options: ["Low", "Normal", "High", "Critical"] },
        { name: "retryCount", label: "RETRY_COUNT", type: "number", required: false, placeholder: "3", icon: "RotateCcw" },
        { name: "delay", label: "DELAY_SECONDS", type: "number", required: false, placeholder: "0", icon: "Clock" },
      ],
      "CRON Job": [
        { name: "schedule", label: "CRON_SCHEDULE", type: "text", required: false, placeholder: "0 2 * * *", icon: "Clock" },
        { name: "timezone", label: "TIMEZONE", type: "text", required: false, placeholder: "UTC", icon: "Globe" },
        { name: "enabled", label: "ENABLED", type: "checkbox", required: false, icon: "CheckCircle" },
        { name: "maxExecutionTime", label: "MAX_EXECUTION_TIME_MINUTES", type: "number", required: false, placeholder: "60", icon: "Clock" },
      ],
      "Job": [
        { name: "jobType", label: "JOB_TYPE", type: "select", required: false, icon: "Activity", options: ["One-time", "Batch", "Recurring", "On-demand", "Scheduled"] },
        { name: "priority", label: "PRIORITY", type: "select", required: false, icon: "ArrowUp", options: ["Low", "Normal", "High", "Critical"] },
        { name: "timeout", label: "TIMEOUT_MINUTES", type: "number", required: false, placeholder: "30", icon: "Clock" },
        { name: "retryPolicy", label: "RETRY_POLICY", type: "select", required: false, icon: "RotateCcw", options: ["None", "Exponential Backoff", "Fixed Interval", "Custom"] },
      ],
      "Code Repository": [
        { name: "repositoryType", label: "REPOSITORY_TYPE", type: "select", required: false, icon: "GitBranch", options: ["Application", "Library", "Infrastructure", "Documentation", "Configuration"] },
        { name: "mainBranch", label: "MAIN_BRANCH", type: "text", required: false, placeholder: "main", icon: "GitBranch" },
        { name: "language", label: "PRIMARY_LANGUAGE", type: "select", required: false, icon: "Code", options: ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin"] },
        { name: "framework", label: "FRAMEWORK", type: "text", required: false, placeholder: "React, Next.js, Express", icon: "Package" },
        { name: "license", label: "LICENSE", type: "select", required: false, icon: "FileText", options: ["MIT", "Apache 2.0", "GPL v3", "BSD 3-Clause", "ISC", "Proprietary"] },
        { name: "visibility", label: "VISIBILITY", type: "select", required: false, icon: "Eye", options: ["Public", "Private", "Internal"] },
      ],
    }

    return [...baseFields, ...(entitySpecificFields[entityType] || [])]
  }

  const getIntegrationOptions = (entityType: EntityType) => {
    const integrations: { [key in EntityType]?: any[] } = {
      "Service": [
        { name: "AWS ECS", description: "Deploy containerized services on AWS", icon: "Cloud" },
        { name: "Kubernetes", description: "Deploy to Kubernetes cluster", icon: "Server" },
        { name: "Docker Hub", description: "Pull from Docker registry", icon: "Package" },
      ],
      "API": [
        { name: "AWS API Gateway", description: "Create API with AWS Gateway", icon: "Network" },
        { name: "Kong", description: "API management platform", icon: "Shield" },
        { name: "Postman", description: "API testing and documentation", icon: "BookOpen" },
      ],
      "Database": [
        { name: "AWS RDS", description: "Managed database service", icon: "Database" },
        { name: "MongoDB Atlas", description: "Cloud database service", icon: "Database" },
        { name: "Redis Cloud", description: "Managed Redis service", icon: "Activity" },
      ],
      "ML Model": [
        { name: "AWS SageMaker", description: "ML model training and deployment", icon: "Brain" },
        { name: "Google AI Platform", description: "ML model management", icon: "Brain" },
        { name: "Hugging Face", description: "Pre-trained model repository", icon: "Brain" },
      ],
      "Website": [
        { name: "Vercel", description: "Deploy static sites and web apps", icon: "Globe" },
        { name: "Netlify", description: "Web hosting and CI/CD", icon: "Globe" },
        { name: "AWS S3", description: "Static website hosting", icon: "Cloud" },
      ],
      "Mobile App": [
        { name: "App Store Connect", description: "iOS app distribution", icon: "Smartphone" },
        { name: "Google Play Console", description: "Android app distribution", icon: "Smartphone" },
        { name: "Firebase", description: "Mobile app development platform", icon: "Zap" },
      ],
      "Workflow": [
        { name: "GitHub Actions", description: "CI/CD workflows and automation", icon: "GitBranch" },
        { name: "AWS Step Functions", description: "Serverless workflow orchestration", icon: "Cloud" },
        { name: "Apache Airflow", description: "Data pipeline orchestration", icon: "Activity" },
        { name: "Temporal", description: "Durable workflow engine", icon: "Clock" },
      ],
      "Worker": [
        { name: "AWS Lambda", description: "Serverless function execution", icon: "Zap" },
        { name: "Kubernetes Jobs", description: "Containerized batch processing", icon: "Server" },
        { name: "Celery", description: "Distributed task queue", icon: "Activity" },
        { name: "Sidekiq", description: "Background job processing", icon: "Cpu" },
      ],
      "Background Job": [
        { name: "Redis Queue", description: "In-memory job queue", icon: "Activity" },
        { name: "RabbitMQ", description: "Message broker for job queues", icon: "Network" },
        { name: "AWS SQS", description: "Managed message queue service", icon: "Cloud" },
        { name: "Bull Queue", description: "Redis-based job queue for Node.js", icon: "Activity" },
      ],
      "CRON Job": [
        { name: "Kubernetes CronJob", description: "Scheduled jobs in Kubernetes", icon: "Server" },
        { name: "AWS EventBridge", description: "Serverless event scheduling", icon: "Cloud" },
        { name: "Jenkins", description: "CI/CD with scheduled builds", icon: "Settings" },
        { name: "GitHub Actions", description: "Scheduled workflows", icon: "GitBranch" },
      ],
      "Job": [
        { name: "AWS Batch", description: "Managed batch computing", icon: "Cloud" },
        { name: "Kubernetes Jobs", description: "One-time batch processing", icon: "Server" },
        { name: "Apache Spark", description: "Large-scale data processing", icon: "Activity" },
        { name: "Docker", description: "Containerized job execution", icon: "Package" },
      ],
      "Code Repository": [
        { name: "GitHub", description: "Git repository hosting and collaboration", icon: "GitBranch" },
        { name: "GitLab", description: "DevOps platform with Git repository", icon: "GitBranch" },
        { name: "Bitbucket", description: "Git repository management by Atlassian", icon: "GitBranch" },
        { name: "AWS CodeCommit", description: "Managed Git repository service", icon: "Cloud" },
        { name: "Azure DevOps", description: "Microsoft's DevOps platform", icon: "Cloud" },
      ],
    }

    return integrations[entityType] || []
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTeam("all")
    setSelectedTechnology("all")
    setSelectedEntityType("all")
  }

  const hasActiveFilters = searchQuery || selectedTeam !== "all" || selectedTechnology !== "all" || selectedEntityType !== "all"

  const getActionData = (action: string, entity: any) => {
    const actionData: { [key: string]: { title: string, description: string, details: any[], warning?: string } } = {
      "deploy": {
        title: "Deploy Entity",
        description: `Deploy ${entity.name} to the production environment`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Version", value: entity.version },
          { label: "Cloud Provider", value: entity.cloudProvider || "N/A" },
          { label: "Regions", value: entity.deploymentRegions?.join(", ") || "N/A" },
        ],
        warning: "This action will deploy the entity to production. Ensure all tests have passed."
      },
      "scale": {
        title: "Scale Entity",
        description: `Scale ${entity.name} based on current load`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Current RPS", value: entity.metrics.requestsPerSecond },
          { label: "Response Time", value: entity.metrics.responseTime },
          { label: "Uptime", value: entity.metrics.uptime },
        ],
        warning: "Scaling will affect resource allocation and costs."
      },
      "monitor": {
        title: "Monitor Entity",
        description: `Set up monitoring and alerts for ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Current Status", value: entity.status },
          { label: "SLA", value: entity.sla },
          { label: "Oncall", value: entity.oncall },
        ]
      },
      "configure": {
        title: "Configure Entity",
        description: `Modify configuration settings for ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Team", value: entity.team },
          { label: "Owner", value: entity.owner },
        ]
      },
      "test-api": {
        title: "Test API",
        description: `Run API tests for ${entity.name}`,
        details: [
          { label: "API Endpoint", value: entity.apiEndpoint },
          { label: "Technology", value: entity.technology },
          { label: "Current Status", value: entity.status },
        ]
      },
      "backup": {
        title: "Backup Database",
        description: `Create a backup of ${entity.name}`,
        details: [
          { label: "Database", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Version", value: entity.version },
        ],
        warning: "Backup process may impact performance temporarily."
      },
      "train": {
        title: "Train ML Model",
        description: `Retrain ${entity.name} with latest data`,
        details: [
          { label: "Model", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Current Version", value: entity.version },
        ],
        warning: "Training may take several hours and consume significant resources."
      },
      "invoke": {
        title: "Invoke Function",
        description: `Execute ${entity.name} with test parameters`,
        details: [
          { label: "Function", value: entity.name },
          { label: "Endpoint", value: entity.apiEndpoint },
          { label: "Technology", value: entity.technology },
        ]
      },
      "build": {
        title: "Build Entity",
        description: `Build ${entity.name} for deployment`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Version", value: entity.version },
        ]
      },
      "test": {
        title: "Run Tests",
        description: `Execute test suite for ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Current Status", value: entity.status },
        ]
      },
      "publish": {
        title: "Publish Entity",
        description: `Publish ${entity.name} to registry`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Version", value: entity.version },
          { label: "Technology", value: entity.technology },
        ]
      },
      "docs": {
        title: "View Documentation",
        description: `Open documentation for ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Documentation URL", value: entity.documentation },
          { label: "Technology", value: entity.technology },
        ]
      },
      "send-message": {
        title: "Send Message",
        description: `Send a test message to ${entity.name}`,
        details: [
          { label: "Topic", value: entity.name },
          { label: "Endpoint", value: entity.apiEndpoint },
          { label: "Technology", value: entity.technology },
        ]
      },
      "consume": {
        title: "Consume Messages",
        description: `Consume messages from ${entity.name}`,
        details: [
          { label: "Topic", value: entity.name },
          { label: "Endpoint", value: entity.apiEndpoint },
          { label: "Technology", value: entity.technology },
        ]
      },
      "edit": {
        title: "Edit Documentation",
        description: `Edit documentation for ${entity.name}`,
        details: [
          { label: "Document", value: entity.name },
          { label: "URL", value: entity.documentation },
          { label: "Technology", value: entity.technology },
        ]
      },
      "download": {
        title: "Download Dataset",
        description: `Download ${entity.name} dataset`,
        details: [
          { label: "Dataset", value: entity.name },
          { label: "Endpoint", value: entity.apiEndpoint },
          { label: "Technology", value: entity.technology },
        ],
        warning: "Large datasets may take time to download."
      },
      "analyze": {
        title: "Analyze Data",
        description: `Run analysis on ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Current Status", value: entity.status },
        ]
      },
      "scan": {
        title: "Security Scan",
        description: `Run security scan on ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Current Status", value: entity.status },
        ]
      },
      "audit": {
        title: "Audit Entity",
        description: `Run compliance audit on ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "SLA", value: entity.sla },
          { label: "Owner", value: entity.owner },
        ]
      },
      "compliance": {
        title: "Check Compliance",
        description: `Verify compliance status for ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "SLA", value: entity.sla },
          { label: "Status", value: entity.status },
        ]
      },
      "provision": {
        title: "Provision Infrastructure",
        description: `Provision infrastructure for ${entity.name}`,
        details: [
          { label: "Infrastructure", value: entity.name },
          { label: "Cloud Provider", value: entity.cloudProvider || "N/A" },
          { label: "Regions", value: entity.deploymentRegions?.join(", ") || "N/A" },
        ],
        warning: "This will create new infrastructure resources and may incur costs."
      },
      "clear": {
        title: "Clear Cache",
        description: `Clear cache for ${entity.name}`,
        details: [
          { label: "Cache", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Current Status", value: entity.status },
        ],
        warning: "This will clear all cached data and may temporarily impact performance."
      },
      "toggle": {
        title: "Toggle Feature Flag",
        description: `Toggle feature flag for ${entity.name}`,
        details: [
          { label: "Feature Flag", value: entity.name },
          { label: "Technology", value: entity.technology },
          { label: "Current Status", value: entity.status },
        ],
        warning: "This will immediately affect all users of this feature."
      },
      "purge": {
        title: "Purge CDN",
        description: `Purge CDN cache for ${entity.name}`,
        details: [
          { label: "CDN", value: entity.name },
          { label: "Cloud Provider", value: entity.cloudProvider || "N/A" },
          { label: "Regions", value: entity.deploymentRegions?.join(", ") || "N/A" },
        ],
        warning: "This will clear CDN cache globally and may temporarily impact performance."
      },
      "health": {
        title: "Check Health",
        description: `Check health status of ${entity.name}`,
        details: [
          { label: "Entity", value: entity.name },
          { label: "Current Status", value: entity.status },
          { label: "Uptime", value: entity.metrics.uptime },
          { label: "Response Time", value: entity.metrics.responseTime },
        ]
      },
      "execute": {
        title: "Execute Workflow",
        description: `Execute ${entity.name} workflow`,
        details: [
          { label: "Workflow", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ]
      },
      "schedule": {
        title: "Schedule Workflow",
        description: `Schedule ${entity.name} workflow execution`,
        details: [
          { label: "Workflow", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ]
      },
      "start": {
        title: "Start Worker",
        description: `Start ${entity.name} worker process`,
        details: [
          { label: "Worker", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ]
      },
      "stop": {
        title: "Stop Worker",
        description: `Stop ${entity.name} worker process`,
        details: [
          { label: "Worker", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ],
        warning: "This will stop the worker process and may interrupt running tasks."
      },
      "restart": {
        title: "Restart Worker",
        description: `Restart ${entity.name} worker process`,
        details: [
          { label: "Worker", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ],
        warning: "This will restart the worker process and may briefly interrupt service."
      },
      "queue": {
        title: "Queue Background Job",
        description: `Add ${entity.name} to the job queue`,
        details: [
          { label: "Job", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ]
      },
      "cancel": {
        title: "Cancel Job",
        description: `Cancel ${entity.name} job execution`,
        details: [
          { label: "Job", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ],
        warning: "This will cancel the job and any running tasks may be interrupted."
      },
      "disable": {
        title: "Disable CRON Job",
        description: `Disable ${entity.name} scheduled execution`,
        details: [
          { label: "CRON Job", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ],
        warning: "This will disable the scheduled job and it will not run automatically."
      },
      "run": {
        title: "Run Job",
        description: `Execute ${entity.name} job immediately`,
        details: [
          { label: "Job", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ]
      },
      "retry": {
        title: "Retry Job",
        description: `Retry ${entity.name} job execution`,
        details: [
          { label: "Job", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
        ],
        warning: "This will retry the job with the configured retry policy."
      },
      "clone": {
        title: "Clone Repository",
        description: `Clone ${entity.name} repository to local machine`,
        details: [
          { label: "Repository", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
          { label: "Main Branch", value: "main" },
        ]
      },
      "pull": {
        title: "Pull Latest Changes",
        description: `Pull latest changes from ${entity.name} repository`,
        details: [
          { label: "Repository", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
          { label: "Main Branch", value: "main" },
        ]
      },
      "push": {
        title: "Push Changes",
        description: `Push local changes to ${entity.name} repository`,
        details: [
          { label: "Repository", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
          { label: "Main Branch", value: "main" },
        ],
        warning: "This will push your local changes to the remote repository. Ensure all tests pass before pushing."
      },
      "branch": {
        title: "Create Branch",
        description: `Create a new branch in ${entity.name} repository`,
        details: [
          { label: "Repository", value: entity.name },
          { label: "Type", value: entity.entityType },
          { label: "Current Status", value: entity.status },
          { label: "Main Branch", value: "main" },
        ]
      }
    }
    
    return actionData[action] || {
      title: "Execute Action",
      description: `Execute ${action} on ${entity.name}`,
      details: [
        { label: "Entity", value: entity.name },
        { label: "Action", value: action },
        { label: "Type", value: entity.entityType },
      ]
    }
  }

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredEntities.map((entity) => (
        <Card
          key={entity.id}
          className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors cursor-pointer"
          onClick={() => handleEntityClick(entity)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getEntityIcon(entity)}
                <div>
                  <CardTitle className="font-mono text-posthog-black text-sm">
                    {entity.name.toUpperCase()}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange"
                    >
                      {entity.entityType.toUpperCase()}
                    </Badge>
                    {entity.teams.slice(0, 2).map((team, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="font-mono text-xs border-blue-500 text-blue-600"
                      >
                        {team.toUpperCase()}
                      </Badge>
                    ))}
                    {entity.teams.length > 2 && (
                      <Badge variant="outline" className="font-mono text-xs">
                        +{entity.teams.length - 2}
                      </Badge>
                    )}
                    {entity.technologies.slice(0, 2).map((tech, index) => (
                      <Badge key={index} variant="outline" className="font-mono text-xs">
                        {tech.toUpperCase()}
                      </Badge>
                    ))}
                    {entity.technologies.length > 2 && (
                      <Badge variant="outline" className="font-mono text-xs">
                        +{entity.technologies.length - 2}
                      </Badge>
                    )}
                    {entity.cloudProviders && entity.cloudProviders.length > 0 && (
                      <>
                        {entity.cloudProviders.slice(0, 2).map((cloud, index) => (
                          <Badge key={index} variant="outline" className="font-mono text-xs border-green-500 text-green-600">
                            {cloud.provider}
                          </Badge>
                        ))}
                        {entity.cloudProviders.length > 2 && (
                          <Badge variant="outline" className="font-mono text-xs">
                            +{entity.cloudProviders.length - 2}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(entity.status)}
                <Badge
                  variant={
                    entity.status === "healthy"
                      ? "default"
                      : entity.status === "degraded"
                        ? "secondary"
                        : "destructive"
                  }
                  className="font-mono text-xs"
                >
                  {entity.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-posthog-gray font-mono mb-3 line-clamp-2">{entity.description}</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="font-medium text-posthog-black">SLA:</span>
                <p className="text-posthog-gray">{entity.sla}</p>
              </div>
              <div>
                <span className="font-medium text-posthog-black">VERSION:</span>
                <p className="text-posthog-gray">{entity.version}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-3">
              {entity.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="font-mono text-xs">
                  {tag.toUpperCase()}
                </Badge>
              ))}
              {entity.tags.length > 3 && (
                <Badge variant="outline" className="font-mono text-xs">
                  +{entity.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderListView = () => (
    <div className="space-y-3">
      {filteredEntities.map((entity) => (
        <div
          key={entity.id}
          className="flex items-center justify-between p-4 bg-white border border-posthog-cream-dark rounded-lg hover:border-posthog-orange transition-colors cursor-pointer"
          onClick={() => handleEntityClick(entity)}
        >
          <div className="flex items-center gap-4 flex-1">
            {getEntityIcon(entity)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-sm font-mono font-medium text-posthog-black truncate">{entity.name}</h3>
                <Badge
                  variant="outline"
                  className="font-mono text-xs border-posthog-orange text-posthog-orange"
                >
                  {entity.entityType.toUpperCase()}
                </Badge>
                {entity.teams.slice(0, 2).map((team, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="font-mono text-xs border-blue-500 text-blue-600"
                  >
                    {team.toUpperCase()}
                  </Badge>
                ))}
                {entity.teams.length > 2 && (
                  <Badge variant="outline" className="font-mono text-xs">
                    +{entity.teams.length - 2}
                  </Badge>
                )}
                {entity.technologies.slice(0, 2).map((tech, index) => (
                  <Badge key={index} variant="outline" className="font-mono text-xs">
                    {tech.toUpperCase()}
                  </Badge>
                ))}
                {entity.technologies.length > 2 && (
                  <Badge variant="outline" className="font-mono text-xs">
                    +{entity.technologies.length - 2}
                  </Badge>
                )}
                {entity.cloudProviders && entity.cloudProviders.length > 0 && (
                  <>
                    {entity.cloudProviders.slice(0, 2).map((cloud, index) => (
                      <Badge key={index} variant="outline" className="font-mono text-xs border-green-500 text-green-600">
                        {cloud.provider}
                      </Badge>
                    ))}
                    {entity.cloudProviders.length > 2 && (
                      <Badge variant="outline" className="font-mono text-xs">
                        +{entity.cloudProviders.length - 2}
                      </Badge>
                    )}
                  </>
                )}
                <Badge
                  variant={
                    entity.status === "healthy"
                      ? "default"
                      : entity.status === "degraded"
                        ? "secondary"
                        : "destructive"
                  }
                  className="font-mono text-xs"
                >
                  {entity.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-posthog-gray font-mono truncate">{entity.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs font-mono">
                <div>
                  <span className="text-posthog-gray">SLA:</span>
                  <span className="text-posthog-black ml-1">{entity.sla}</span>
                </div>
                <div>
                  <span className="text-posthog-gray">VERSION:</span>
                  <span className="text-posthog-black ml-1">{entity.version}</span>
                </div>
                <div>
                  <span className="text-posthog-gray">LAST_DEPLOY:</span>
                  <span className="text-posthog-black ml-1">{entity.lastDeployment}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {getStatusIcon(entity.status)}
            <div className="flex gap-2">
              {getQuickActions(entity.entityType).slice(0, 2).map((action, index) => {
                const IconComponent = action.icon
                return (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleActionClick(action.action, action.label, entity)
                    }}
                    title={action.label}
                  >
                    <IconComponent className="h-3 w-3 mr-1" />
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTableView = () => (
    <div className="w-full">
      <div className="flex items-center justify-end py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-posthog-gray">
            {filteredEntities.length} entities
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
            >
              <X className="h-3 w-3 mr-1" />
              CLEAR_FILTERS
            </Button>
          )}
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-posthog-cream-dark">
        <Table>
          <TableHeader>
            <TableRow className="border-posthog-cream-dark">
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">ENTITY</div>
                  <Input
                    placeholder="Search entities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 text-xs font-mono"
                  />
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">TYPE</div>
                  <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                    <SelectTrigger className="h-8 text-xs font-mono">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">ACTIONS</div>
                  <div className="h-8 flex items-center text-xs text-posthog-gray">
                    Quick actions
                  </div>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">TEAM</div>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger className="h-8 text-xs font-mono">
                      <SelectValue placeholder="All teams" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team} value={team}>
                          {team.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">TECH</div>
                  <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
                    <SelectTrigger className="h-8 text-xs font-mono">
                      <SelectValue placeholder="All tech" />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies.map((tech) => (
                        <SelectItem key={tech} value={tech}>
                          {tech.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">CLOUD</div>
                  <div className="h-8 flex items-center text-xs text-posthog-gray">
                    Auto-detected
                  </div>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">STATUS</div>
                  <div className="h-8 flex items-center text-xs text-posthog-gray">
                    Live status
                  </div>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">SLA</div>
                  <div className="h-8 flex items-center text-xs text-posthog-gray">
                    Contractual
                  </div>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">VERSION</div>
                  <div className="h-8 flex items-center text-xs text-posthog-gray">
                    Current
                  </div>
                </div>
              </TableHead>
              <TableHead className="font-mono text-xs text-posthog-gray p-3">
                <div className="space-y-2">
                  <div className="font-medium">LAST_DEPLOY</div>
                  <div className="h-8 flex items-center text-xs text-posthog-gray">
                    Recent
                  </div>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntities.length ? (
              filteredEntities.map((entity) => (
                <TableRow
                  key={entity.id}
                  className="border-posthog-cream hover:bg-posthog-cream cursor-pointer"
                  onClick={() => handleEntityClick(entity)}
                >
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      {getEntityIcon(entity)}
                      <div>
                        <div className="font-mono text-sm text-posthog-black">{entity.name}</div>
                        <div className="font-mono text-xs text-posthog-gray truncate max-w-xs">{entity.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <Badge
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange"
                    >
                      {entity.entityType.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex gap-1">
                      {getQuickActions(entity.entityType).slice(0, 3).map((action, index) => {
                        const IconComponent = action.icon
                        return (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActionClick(action.action, action.label, entity)
                            }}
                            title={action.label}
                          >
                            <IconComponent className="h-3 w-3" />
                          </Button>
                        )
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {entity.teams.slice(0, 2).map((team, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="font-mono text-xs border-blue-500 text-blue-600"
                        >
                          {team.toUpperCase()}
                        </Badge>
                      ))}
                      {entity.teams.length > 2 && (
                        <Badge variant="outline" className="font-mono text-xs">
                          +{entity.teams.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {entity.technologies.slice(0, 2).map((tech, index) => (
                        <Badge key={index} variant="outline" className="font-mono text-xs">
                          {tech.toUpperCase()}
                        </Badge>
                      ))}
                      {entity.technologies.length > 2 && (
                        <Badge variant="outline" className="font-mono text-xs">
                          +{entity.technologies.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    {entity.cloudProviders && entity.cloudProviders.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {entity.cloudProviders.slice(0, 2).map((cloud, index) => (
                          <Badge key={index} variant="outline" className="font-mono text-xs border-green-500 text-green-600">
                            {cloud.provider}
                          </Badge>
                        ))}
                        {entity.cloudProviders.length > 2 && (
                          <Badge variant="outline" className="font-mono text-xs">
                            +{entity.cloudProviders.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-posthog-gray font-mono">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="p-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(entity.status)}
                      <Badge
                        variant={
                          entity.status === "healthy"
                            ? "default"
                            : entity.status === "degraded"
                              ? "secondary"
                              : "destructive"
                        }
                        className="font-mono text-xs"
                      >
                        {entity.status.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="p-3 font-mono text-sm text-posthog-black">{entity.sla}</TableCell>
                  <TableCell className="p-3 font-mono text-sm text-posthog-black">{entity.version}</TableCell>
                  <TableCell className="p-3 font-mono text-sm text-posthog-gray">{entity.lastDeployment}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center font-mono text-posthog-gray">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-posthog-black">ENTITY_CATALOG</h2>
          <p className="text-posthog-gray font-mono text-sm">DISCOVER_AND_EXPLORE_SOFTWARE_ENTITIES</p>
        </div>
        <Button
          onClick={handleCreateEntity}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
        >
          <Plus className="h-4 w-4 mr-2" />
          CREATE_ENTITY
        </Button>
      </div>

      {/* Filters */}
      {/* <Card className="border-posthog-cream-dark bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-posthog-gray" />
              <Input
                placeholder="SEARCH_ENTITIES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border font-mono text-sm"
              />
            </div>
            <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
              <SelectTrigger className="border-posthog-orange font-mono">
                <SelectValue placeholder="FILTER_BY_TYPE" />
              </SelectTrigger>
              <SelectContent>
                {entityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="border-posthog-orange font-mono">
                <SelectValue placeholder="FILTER_BY_TEAM" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTechnology} onValueChange={setSelectedTechnology}>
              <SelectTrigger className="border-posthog-orange font-mono">
                <SelectValue placeholder="FILTER_BY_TECH" />
              </SelectTrigger>
              <SelectContent>
                {technologies.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm font-mono text-posthog-gray">
              <span>{filteredEntities.length} ENTITIES</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`font-mono text-xs ${viewMode === "grid" ? "bg-posthog-orange text-white" : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`font-mono text-xs ${viewMode === "list" ? "bg-posthog-orange text-white" : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"}`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={`font-mono text-xs ${viewMode === "table" ? "bg-posthog-orange text-white" : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"}`}
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Entity List */}
                    <div>
        {viewMode === "grid" && renderGridView()}
        {viewMode === "list" && renderListView()}
        {viewMode === "table" && renderTableView()}
      </div>

      {/* Entity Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl min-h-[70vh] max-h-[95vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="font-mono text-posthog-black text-lg">
              {selectedEntity?.name?.toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntity && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col w-full">
                <div className="px-6 py-4 border-b border-posthog-cream-dark">
                  <TabsList className="inline-flex w-auto bg-posthog-cream p-1">
                    <TabsTrigger value="overview" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
                      <FileText className="h-3 w-3 mr-1" />
                      OVERVIEW
                    </TabsTrigger>
                    <TabsTrigger value="metrics" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      MONITORING
                    </TabsTrigger>
                    <TabsTrigger value="infrastructure" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
                      <Cloud className="h-3 w-3 mr-1" />
                      INFRASTRUCTURE
                    </TabsTrigger>
                    <TabsTrigger value="dependencies" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
                      <GitBranch className="h-3 w-3 mr-1" />
                      DEPENDENCIES MODEL
                    </TabsTrigger>
                    <TabsTrigger value="compliance" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      COMPLIANCE
                    </TabsTrigger>
                    <TabsTrigger value="scorecard" className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white">
                      <Target className="h-3 w-3 mr-1" />
                      SCORECARD
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto px-6">
                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-6 mt-6">
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-posthog-orange" />
                        ENTITY_INFO
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('entity_info', selectedEntity)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getEntityIcon(selectedEntity)}
                        <div>
                          <div className="font-mono text-sm text-posthog-black">{selectedEntity.name}</div>
                          <div className="font-mono text-xs text-posthog-gray">{selectedEntity.description}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntity.teams.map((team: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="font-mono text-xs border-blue-500 text-blue-600"
                          >
                            {team.toUpperCase()}
                          </Badge>
                        ))}
                        {selectedEntity.technologies.map((tech: string, index: number) => (
                          <Badge key={index} variant="outline" className="font-mono text-xs">
                            {tech.toUpperCase()}
                          </Badge>
                        ))}
                        {selectedEntity.cloudProviders && selectedEntity.cloudProviders.length > 0 && (
                          <>
                            {selectedEntity.cloudProviders.map((cloud: any, index: number) => (
                              <Badge key={index} variant="outline" className="font-mono text-xs border-green-500 text-green-600">
                                {cloud.provider}
                              </Badge>
                            ))}
                          </>
                        )}
                        <Badge
                          variant={
                              selectedEntity.status === "healthy"
                              ? "default"
                                : selectedEntity.status === "degraded"
                                ? "secondary"
                                : "destructive"
                          }
                          className="font-mono text-xs"
                        >
                            {selectedEntity.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        {/* SLA Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-posthog-black flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              SLA:
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingSLA(!editingSLA)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                          {editingSLA ? (
                            <div className="space-y-2">
                              <Select value={selectedEntity.sla} onValueChange={handleSaveSLA}>
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {getSLAOptions().map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <p className="text-posthog-gray">{selectedEntity.sla}</p>
                          )}
                        </div>

                        {/* VERSION Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-posthog-black flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              VERSION:
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingVersion(!editingVersion)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit3 className="h-3 w-3" />
                              </Button>
                              {getRepositoryLink(selectedEntity.entityType, selectedEntity.name) && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(getRepositoryLink(selectedEntity.entityType, selectedEntity.name), '_blank')}
                                  className="h-6 w-6 p-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {editingVersion ? (
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={newVersion}
                                  onChange={(e) => setNewVersion(e.target.value)}
                                  placeholder="Enter new version"
                                  className="h-8 text-xs"
                                />
                                <Button
                                  size="sm"
                                  onClick={handleSaveVersion}
                                  className="h-8 px-3 text-xs"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-posthog-gray">{selectedEntity.version}</p>
                          )}
                        </div>

                        {/* ONCALL Section */}
                        <div className="space-y-2 col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-posthog-black flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              ONCALL TEAMS:
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingOncallTeams(!editingOncallTeams)
                                if (!editingOncallTeams) {
                                  setSelectedOncallTeams(selectedEntity.oncall.split(", ").filter(Boolean))
                                }
                              }}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                          {editingOncallTeams ? (
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-2">
                                {getAvailableTeams().map((team) => (
                                  <div key={team} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={team}
                                      checked={selectedOncallTeams.includes(team)}
                                      onCheckedChange={() => handleTeamToggle(team)}
                                    />
                                    <Label htmlFor={team} className="text-xs font-mono">
                                      {team}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleSaveOncallTeams}
                                  className="h-8 px-3 text-xs"
                                >
                                  <Save className="h-3 w-3 mr-1" />
                                  SAVE
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingOncallTeams(false)}
                                  className="h-8 px-3 text-xs"
                                >
                                  CANCEL
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-posthog-gray">{selectedEntity.oncall}</p>
                              {/* Incident History */}
                              <div className="mt-3">
                                <div className="font-medium text-posthog-black mb-2 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  RECENT INCIDENTS:
                                </div>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {getIncidentHistory(selectedEntity.id).map((incident) => (
                                    <div key={incident.id} className="flex items-center justify-between p-2 bg-posthog-cream rounded text-xs">
                                      <div className="flex items-center gap-2">
                                        <Badge 
                                          variant={incident.severity === "Critical" ? "destructive" : incident.severity === "High" ? "secondary" : "outline"}
                                          className="text-xs"
                                        >
                                          {incident.severity}
                                        </Badge>
                                        <span className="font-mono">{incident.title}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Badge 
                                          variant={incident.status === "Resolved" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {incident.status}
                                        </Badge>
                                        <span className="text-posthog-gray">
                                          {new Date(incident.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Information Card - Only for Service and Database */}
                  {selectedEntity && (selectedEntity.entityType === "Service" || selectedEntity.entityType === "Database") && (
                    <Card className="border-posthog-cream-dark bg-white">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-posthog-orange" />
                          APPROXIMATE_COST
                        </CardTitle>
                        <Badge variant="outline" className="font-mono text-xs border-posthog-orange text-posthog-orange">
                          ESTIMATED
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[400px] px-6 py-4">
                          {(() => {
                            const costData = calculateEntityCost(selectedEntity)
                            if (!costData) return null

                            return (
                              <div className="space-y-4">
                                {/* Monthly Cost Summary */}
                                <div className="p-4 bg-posthog-cream rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="font-mono text-xs text-posthog-gray">MONTHLY_COST</div>
                                    <div className="flex items-center gap-2">
                                      {costData.trend === "up" ? (
                                        <TrendingUp className="h-3 w-3 text-red-600" />
                                      ) : (
                                        <TrendingDown className="h-3 w-3 text-green-600" />
                                      )}
                                      <span className={`text-xs font-mono ${costData.trend === "up" ? "text-red-600" : "text-green-600"}`}>
                                        {costData.change}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold font-mono text-posthog-black">
                                    ${costData.monthly.toLocaleString()}
                                  </div>
                                  {costData.perRequest && (
                                    <div className="text-xs font-mono text-posthog-gray mt-1">
                                      ${costData.perRequest} per request
                                    </div>
                                  )}
                                </div>

                                {/* Cost Breakdown */}
                                <div className="space-y-2">
                                  <div className="font-mono text-xs font-medium text-posthog-black mb-2">COST_BREAKDOWN</div>
                                  {costData.breakdown.map((item, index) => (
                                    <div key={index} className="space-y-1">
                                      <div className="flex items-center justify-between text-xs font-mono">
                                        <span className="text-posthog-gray">{item.category}</span>
                                        <div className="flex items-center gap-2">
                                          <span className="text-posthog-black">${item.amount.toLocaleString()}</span>
                                          <span className="text-posthog-gray">({item.percentage}%)</span>
                                        </div>
                                      </div>
                                      <div className="w-full bg-posthog-cream rounded-full h-1.5">
                                        <div
                                          className="bg-posthog-orange h-1.5 rounded-full"
                                          style={{ width: `${item.percentage}%` }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Cost Notes */}
                                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="h-3 w-3 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="font-mono text-xs text-blue-700">
                                      Cost estimates are based on current metrics and resource utilization. Actual costs may vary based on cloud provider pricing, usage patterns, and discounts.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })()}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Monitoring Tab */}
                <TabsContent value="metrics" className="space-y-6 mt-6">
                  {/* Telemetry Section */}
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <Activity className="h-4 w-4 text-posthog-orange" />
                        TELEMETRY
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('telemetry', selectedEntity.metrics)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              UPTIME
                            </div>
                            <div className="text-posthog-gray">{selectedEntity.metrics.uptime}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('uptime', { value: selectedEntity.metrics.uptime })}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              RESPONSE_TIME
                            </div>
                            <div className="text-posthog-gray">{selectedEntity.metrics.responseTime}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('response_time', { value: selectedEntity.metrics.responseTime })}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              REQUESTS_PER_SECOND
                            </div>
                            <div className="text-posthog-gray">{selectedEntity.metrics.requestsPerSecond}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('rps', { value: selectedEntity.metrics.requestsPerSecond })}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              ERROR_RATE
                            </div>
                            <div className="text-posthog-gray">{selectedEntity.metrics.errorRate}</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('error_rate', { value: selectedEntity.metrics.errorRate })}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Observability Section */}
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-posthog-orange" />
                        OBSERVABILITY
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('observability', {})}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              LOGS
                            </div>
                            <div className="text-posthog-gray">Structured logging enabled</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('logs', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              METRICS
                            </div>
                            <div className="text-posthog-gray">Prometheus metrics</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('metrics_config', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              TRACES
                            </div>
                            <div className="text-posthog-gray">Distributed tracing</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('traces', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              ALERTS
                            </div>
                            <div className="text-posthog-gray">Alert rules configured</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('alerts', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Infrastructure Tab */}
                <TabsContent value="infrastructure" className="space-y-6 mt-6 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cloud Infrastructure Card - Left */}
                    <Card className="border-posthog-cream-dark bg-white">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                          <Cloud className="h-4 w-4 text-posthog-orange" />
                          CLOUD_INFRASTRUCTURE
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCard('cloud_infrastructure', selectedEntity.cloudProviders)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        {selectedEntity.cloudProviders && selectedEntity.cloudProviders.length > 0 ? (
                          <div className="space-y-4">
                            {selectedEntity.cloudProviders.map((cloud: any, index: number) => (
                              <div key={index} className="p-4 bg-posthog-cream rounded">
                                <div className="font-medium text-posthog-black text-sm mb-2 flex items-center gap-2">
                                  <Cloud className="h-4 w-4" />
                                  {cloud.provider}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {cloud.regions.map((region: string, regionIndex: number) => (
                                    <Badge key={regionIndex} variant="outline" className="font-mono text-xs">
                                      {region}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 bg-posthog-cream rounded text-center">
                            <div className="text-posthog-gray text-sm font-mono">No cloud infrastructure configured</div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Services Deployment Count Card - Right */}
                    <Card className="border-posthog-cream-dark bg-white">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                          <Server className="h-4 w-4 text-posthog-orange" />
                          SERVICES_DEPLOYMENT
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCard('services_deployment', {})}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                          <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium text-posthog-black flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                TOTAL_SERVICES
                              </div>
                              <div className="text-posthog-gray">{entities.filter(e => e.entityType === 'Service').length}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCard('total_services', {})}
                              className="h-4 w-4 p-0"
                            >
                              <Edit3 className="h-2 w-2" />
                            </Button>
                          </div>
                          <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium text-posthog-black flex items-center gap-1">
                                <Activity className="h-3 w-3 text-green-600" />
                                HEALTHY
                              </div>
                              <div className="text-posthog-gray">{entities.filter(e => e.entityType === 'Service' && e.status === 'healthy').length}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCard('healthy_services', {})}
                              className="h-4 w-4 p-0"
                            >
                              <Edit3 className="h-2 w-2" />
                            </Button>
                          </div>
                          <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium text-posthog-black flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                                DEGRADED
                              </div>
                              <div className="text-posthog-gray">{entities.filter(e => e.entityType === 'Service' && e.status === 'degraded').length}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCard('degraded_services', {})}
                              className="h-4 w-4 p-0"
                            >
                              <Edit3 className="h-2 w-2" />
                            </Button>
                          </div>
                          <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                            <div>
                              <div className="font-medium text-posthog-black flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3 text-red-600" />
                                UNHEALTHY
                              </div>
                              <div className="text-posthog-gray">{entities.filter(e => e.entityType === 'Service' && e.status === 'unhealthy').length}</div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCard('unhealthy_services', {})}
                              className="h-4 w-4 p-0"
                            >
                              <Edit3 className="h-2 w-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Dependencies Tab */}
                <TabsContent value="dependencies" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-posthog-cream-dark bg-white">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-posthog-orange" />
                          DEPENDENCIES
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCard('dependencies', selectedEntity.dependencies)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedEntity.dependencies.map((dep: string) => (
                            <div key={dep} className="text-sm font-mono text-posthog-gray p-2 bg-posthog-cream rounded flex items-center gap-2">
                              <GitBranch className="h-3 w-3" />
                              {dep}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-posthog-cream-dark bg-white">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                          <Network className="h-4 w-4 text-posthog-orange" />
                          DEPENDENTS
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCard('dependents', selectedEntity.dependents)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedEntity.dependents.slice(0, 10).map((dep: string) => (
                            <div key={dep} className="text-sm font-mono text-posthog-gray p-2 bg-posthog-cream rounded flex items-center gap-2">
                              <Network className="h-3 w-3" />
                              {dep}
                            </div>
                          ))}
                          {selectedEntity.dependents.length > 10 && (
                            <div className="text-sm font-mono text-posthog-gray p-2 bg-posthog-cream rounded text-center">
                              +{selectedEntity.dependents.length - 10} more dependents
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* C4 Architecture Model Card */}
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-posthog-orange" />
                        C4_ARCHITECTURE_MODEL
                      </CardTitle>
                      <Badge variant="outline" className="font-mono text-xs border-posthog-orange text-posthog-orange">
                        COMING_SOON
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="text-sm font-mono text-posthog-gray mb-2">
                          C4 Architecture Model visualization will be available soon
                        </div>
                        <div className="text-xs font-mono text-posthog-gray">
                          Interactive system context, container, component, and code diagrams
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Compliance Tab */}
                <TabsContent value="compliance" className="space-y-6 mt-6">
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <Shield className="h-4 w-4 text-posthog-orange" />
                        SECURITY_COMPLIANCE
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('security_compliance', {})}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              GDPR
                            </div>
                            <div className="text-posthog-gray">Compliant</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('gdpr', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              SOC2
                            </div>
                            <div className="text-posthog-gray">Type II Certified</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('soc2', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              ISO27001
                            </div>
                            <div className="text-posthog-gray">Certified</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('iso27001', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded flex items-center justify-between">
                          <div>
                            <div className="font-medium text-posthog-black flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              HIPAA
                            </div>
                            <div className="text-posthog-gray">Not Applicable</div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditCard('hipaa', {})}
                            className="h-4 w-4 p-0"
                          >
                            <Edit3 className="h-2 w-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-posthog-orange" />
                        AUDIT_TRAIL
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('audit_trail', {})}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm font-mono text-posthog-gray p-2 bg-posthog-cream rounded flex items-center justify-between">
                          <span>Last security scan: 2024-01-15</span>
                          <Badge variant="default" className="text-xs">PASSED</Badge>
                        </div>
                        <div className="text-sm font-mono text-posthog-gray p-2 bg-posthog-cream rounded flex items-center justify-between">
                          <span>Vulnerability assessment: 2024-01-10</span>
                          <Badge variant="secondary" className="text-xs">2 MINOR</Badge>
                        </div>
                        <div className="text-sm font-mono text-posthog-gray p-2 bg-posthog-cream rounded flex items-center justify-between">
                          <span>Compliance review: 2024-01-05</span>
                          <Badge variant="default" className="text-xs">COMPLIANT</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Scorecard Tab */}
                <TabsContent value="scorecard" className="space-y-6 mt-6">
                  {/* Overall Score */}
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-posthog-orange" />
                        OVERALL_SCORE
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('overall_score', {})}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        // Calculate overall score based on various factors
                        const uptimeScore = parseFloat(selectedEntity.metrics.uptime.replace('%', '')) || 0
                        const errorRate = parseFloat(selectedEntity.metrics.errorRate.replace('%', '')) || 0
                        const errorScore = Math.max(0, 100 - (errorRate * 10))
                        const statusScore = selectedEntity.status === 'healthy' ? 100 : selectedEntity.status === 'degraded' ? 70 : 40
                        const slaScore = parseFloat(selectedEntity.sla.replace('%', '')) || 0
                        
                        const overallScore = Math.round((uptimeScore * 0.3 + errorScore * 0.2 + statusScore * 0.3 + slaScore * 0.2))
                        const scoreColor = overallScore >= 90 ? 'text-green-600' : overallScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                        const scoreBadge = overallScore >= 90 ? 'EXCELLENT' : overallScore >= 70 ? 'GOOD' : overallScore >= 50 ? 'FAIR' : 'POOR'
                        const scoreBadgeColor = overallScore >= 90 ? 'bg-green-100 text-green-800 border-green-300' : overallScore >= 70 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : overallScore >= 50 ? 'bg-orange-100 text-orange-800 border-orange-300' : 'bg-red-100 text-red-800 border-red-300'

                        return (
                          <div className="space-y-4">
                            <div className="flex items-center justify-center">
                              <div className="relative w-32 h-32">
                                <svg className="transform -rotate-90 w-32 h-32">
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="#f0f0f0"
                                    strokeWidth="8"
                                    fill="none"
                                  />
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke={overallScore >= 90 ? '#10b981' : overallScore >= 70 ? '#eab308' : overallScore >= 50 ? '#f97316' : '#ef4444'}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${(overallScore / 100) * 351.86} 351.86`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className={`text-3xl font-bold font-mono ${scoreColor}`}>
                                      {overallScore}
                                    </div>
                                    <div className="text-xs font-mono text-posthog-gray">/ 100</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-center">
                              <Badge className={`font-mono text-xs border ${scoreBadgeColor}`}>
                                {scoreBadge}
                              </Badge>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Performance Scores */}
                    <Card className="border-posthog-cream-dark bg-white">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                          <Activity className="h-4 w-4 text-posthog-orange" />
                          PERFORMANCE_SCORES
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCard('performance_scores', {})}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(() => {
                          const uptimeScore = parseFloat(selectedEntity.metrics.uptime.replace('%', '')) || 0
                          const responseTime = parseFloat(selectedEntity.metrics.responseTime.replace(/[^\d.]/g, '')) || 0
                          const responseTimeScore = responseTime > 0 ? Math.max(0, 100 - (responseTime / 10)) : 0
                          const errorRate = parseFloat(selectedEntity.metrics.errorRate.replace('%', '')) || 0
                          const errorScore = Math.max(0, 100 - (errorRate * 10))

                          return (
                            <>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-posthog-gray">UPTIME</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-posthog-black font-medium">{uptimeScore.toFixed(1)}%</span>
                                    <span className="text-posthog-gray">({Math.round(uptimeScore)}/100)</span>
                                  </div>
                                </div>
                                <div className="w-full bg-posthog-cream rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${uptimeScore >= 99 ? 'bg-green-600' : uptimeScore >= 95 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                    style={{ width: `${Math.min(100, uptimeScore)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-posthog-gray">RESPONSE_TIME</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-posthog-black font-medium">{responseTimeScore.toFixed(1)}</span>
                                    <span className="text-posthog-gray">/100</span>
                                  </div>
                                </div>
                                <div className="w-full bg-posthog-cream rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${responseTimeScore >= 80 ? 'bg-green-600' : responseTimeScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                    style={{ width: `${Math.min(100, responseTimeScore)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-posthog-gray">ERROR_RATE</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-posthog-black font-medium">{errorScore.toFixed(1)}</span>
                                    <span className="text-posthog-gray">/100</span>
                                  </div>
                                </div>
                                <div className="w-full bg-posthog-cream rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${errorScore >= 90 ? 'bg-green-600' : errorScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                    style={{ width: `${Math.min(100, errorScore)}%` }}
                                  />
                                </div>
                              </div>
                            </>
                          )
                        })()}
                      </CardContent>
                    </Card>

                    {/* Reliability Scores */}
                    <Card className="border-posthog-cream-dark bg-white">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                          <Shield className="h-4 w-4 text-posthog-orange" />
                          RELIABILITY_SCORES
                        </CardTitle>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCard('reliability_scores', {})}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {(() => {
                          const slaScore = parseFloat(selectedEntity.sla.replace('%', '')) || 0
                          const statusScore = selectedEntity.status === 'healthy' ? 100 : selectedEntity.status === 'degraded' ? 70 : 40
                          const incidents = getIncidentHistory(selectedEntity.id)
                          const recentIncidents = incidents.filter(i => {
                            const incidentDate = new Date(i.createdAt)
                            const thirtyDaysAgo = new Date()
                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                            return incidentDate > thirtyDaysAgo
                          })
                          const incidentScore = Math.max(0, 100 - (recentIncidents.length * 15))

                          return (
                            <>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-posthog-gray">SLA_COMPLIANCE</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-posthog-black font-medium">{slaScore.toFixed(1)}%</span>
                                    <span className="text-posthog-gray">({Math.round(slaScore)}/100)</span>
                                  </div>
                                </div>
                                <div className="w-full bg-posthog-cream rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${slaScore >= 99 ? 'bg-green-600' : slaScore >= 95 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                    style={{ width: `${Math.min(100, slaScore)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-posthog-gray">HEALTH_STATUS</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-posthog-black font-medium">{statusScore}</span>
                                    <span className="text-posthog-gray">/100</span>
                                  </div>
                                </div>
                                <div className="w-full bg-posthog-cream rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${statusScore >= 90 ? 'bg-green-600' : statusScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                    style={{ width: `${Math.min(100, statusScore)}%` }}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs font-mono">
                                  <span className="text-posthog-gray">INCIDENT_FREE</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-posthog-black font-medium">{incidentScore.toFixed(1)}</span>
                                    <span className="text-posthog-gray">/100</span>
                                    <span className="text-xs text-posthog-gray">({recentIncidents.length} incidents)</span>
                                  </div>
                                </div>
                                <div className="w-full bg-posthog-cream rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${incidentScore >= 85 ? 'bg-green-600' : incidentScore >= 70 ? 'bg-yellow-600' : 'bg-red-600'}`}
                                    style={{ width: `${Math.min(100, incidentScore)}%` }}
                                  />
                                </div>
                              </div>
                            </>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Metrics */}
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-posthog-orange" />
                        ADDITIONAL_METRICS
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('additional_metrics', {})}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                        <div className="p-3 bg-posthog-cream rounded">
                          <div className="font-medium text-posthog-black flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3" />
                            DEPLOYMENT_FREQ
                          </div>
                          <div className="text-posthog-gray">{selectedEntity.lastDeployment}</div>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded">
                          <div className="font-medium text-posthog-black flex items-center gap-1 mb-1">
                            <Tag className="h-3 w-3" />
                            VERSION
                          </div>
                          <div className="text-posthog-gray">{selectedEntity.version}</div>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded">
                          <div className="font-medium text-posthog-black flex items-center gap-1 mb-1">
                            <Users className="h-3 w-3" />
                            TEAMS
                          </div>
                          <div className="text-posthog-gray">{selectedEntity.teams.length}</div>
                        </div>
                        <div className="p-3 bg-posthog-cream rounded">
                          <div className="font-medium text-posthog-black flex items-center gap-1 mb-1">
                            <Code className="h-3 w-3" />
                            TECH_STACK
                          </div>
                          <div className="text-posthog-gray">{selectedEntity.technologies.length}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommendations */}
                  <Card className="border-posthog-cream-dark bg-white">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="font-mono text-posthog-black text-sm flex items-center gap-2">
                        <Award className="h-4 w-4 text-posthog-orange" />
                        RECOMMENDATIONS
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditCard('recommendations', {})}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const recommendations: { type: string; message: string; priority: 'high' | 'medium' | 'low' }[] = []
                        const uptimeScore = parseFloat(selectedEntity.metrics.uptime.replace('%', '')) || 0
                        const errorRate = parseFloat(selectedEntity.metrics.errorRate.replace('%', '')) || 0
                        const responseTime = parseFloat(selectedEntity.metrics.responseTime.replace(/[^\d.]/g, '')) || 0

                        if (uptimeScore < 99) {
                          recommendations.push({
                            type: 'uptime',
                            message: 'Improve uptime to meet SLA targets',
                            priority: 'high'
                          })
                        }
                        if (errorRate > 1) {
                          recommendations.push({
                            type: 'errors',
                            message: 'Reduce error rate to improve reliability',
                            priority: 'high'
                          })
                        }
                        if (responseTime > 200) {
                          recommendations.push({
                            type: 'performance',
                            message: 'Optimize response time for better user experience',
                            priority: 'medium'
                          })
                        }
                        if (selectedEntity.cloudProviders && selectedEntity.cloudProviders.length > 2) {
                          recommendations.push({
                            type: 'cost',
                            message: 'Consider consolidating cloud providers to reduce costs',
                            priority: 'low'
                          })
                        }
                        if (selectedEntity.dependencies.length > 5) {
                          recommendations.push({
                            type: 'dependencies',
                            message: 'Review dependencies to reduce complexity',
                            priority: 'medium'
                          })
                        }

                        return (
                          <div className="space-y-2">
                            {recommendations.length > 0 ? (
                              recommendations.map((rec, index) => (
                                <div key={index} className={`p-3 rounded border-l-4 ${
                                  rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                                  rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                                  'bg-blue-50 border-blue-400'
                                }`}>
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                                      rec.priority === 'high' ? 'text-red-600' :
                                      rec.priority === 'medium' ? 'text-yellow-600' :
                                      'text-blue-600'
                                    }`} />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-mono text-xs font-medium ${
                                          rec.priority === 'high' ? 'text-red-800' :
                                          rec.priority === 'medium' ? 'text-yellow-800' :
                                          'text-blue-800'
                                        }`}>
                                          {rec.priority.toUpperCase()}
                                        </span>
                                        <Badge variant="outline" className={`text-xs font-mono ${
                                          rec.priority === 'high' ? 'border-red-600 text-red-600' :
                                          rec.priority === 'medium' ? 'border-yellow-600 text-yellow-600' :
                                          'border-blue-600 text-blue-600'
                                        }`}>
                                          {rec.type.toUpperCase()}
                                        </Badge>
                                      </div>
                                      <div className={`font-mono text-xs ${
                                        rec.priority === 'high' ? 'text-red-700' :
                                        rec.priority === 'medium' ? 'text-yellow-700' :
                                        'text-blue-700'
                                      }`}>
                                        {rec.message}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-2" />
                                <div className="font-mono text-sm text-green-800">No recommendations at this time</div>
                                <div className="font-mono text-xs text-green-700 mt-1">Entity is performing well</div>
                              </div>
                            )}
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </TabsContent>

                </div>
              </Tabs>
            </div>
          )}

          {/* Sticky Quick Actions at Bottom */}
          {selectedEntity && (
            <div className="border-t border-posthog-cream-dark bg-white px-6 py-5 mt-6 rounded-t-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-sm font-medium text-posthog-black flex items-center gap-2">
                  <Zap className="h-4 w-4 text-posthog-orange" />
                  QUICK_ACTIONS
                </div>
                <div className="relative">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowQuickActionsMenu(!showQuickActionsMenu)}
                    className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                  >
                    <MoreHorizontal className="h-3 w-3 mr-1" />
                    CUSTOMIZE
                    <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showQuickActionsMenu ? 'rotate-180' : ''}`} />
                  </Button>
                  {showQuickActionsMenu && (
                    <div className="absolute right-0 bottom-full mb-2 w-96 bg-white border border-posthog-cream-dark rounded-lg shadow-xl z-10 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-mono text-sm font-semibold text-posthog-black">Available Actions</div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowQuickActionsMenu(false)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Search Input */}
                      <div className="mb-4">
                        <Input
                          placeholder="Search actions..."
                          value={actionsSearchQuery}
                          onChange={(e) => setActionsSearchQuery(e.target.value)}
                          className="font-mono text-sm h-8"
                        />
                      </div>
                      
                      {/* Actions Grid */}
                      <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                        {getFilteredActions().length > 0 ? (
                          getFilteredActions().map((action, index) => {
                            const IconComponent = action.icon
                            return (
                              <Button
                                key={index}
                                size="sm"
                                variant="ghost"
                                className="font-mono text-sm justify-start h-10 hover:bg-posthog-cream transition-colors"
                                onClick={() => {
                                  onQuickAction(action.action)
                                  setShowQuickActionsMenu(false)
                                  setActionsSearchQuery("")
                                }}
                              >
                                <IconComponent className="h-4 w-4 mr-3 text-posthog-orange" />
                                <span className="truncate">{action.label}</span>
                              </Button>
                            )
                          })
                        ) : (
                          <div className="text-center py-8 text-posthog-gray font-mono text-sm">
                            No actions found matching "{actionsSearchQuery}"
                          </div>
                        )}
                      </div>
                      
                      {/* Action Count */}
                      <div className="mt-3 pt-3 border-t border-posthog-cream-dark">
                        <div className="font-mono text-xs text-posthog-gray text-center">
                          {getFilteredActions().length} of {getAllQuickActions().length} actions
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getQuickActions(selectedEntity.entityType).map((action, index) => {
                  const IconComponent = action.icon
                  return (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent h-10"
                      onClick={() => handleActionClick(action.action, action.label, selectedEntity)}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-xs">{action.label}</span>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Execution Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono text-posthog-black text-lg">
              {selectedAction ? getActionData(selectedAction.action, selectedAction.entity).title : "Execute Action"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedAction && (
            <div className="space-y-6">
              {/* Action Description */}
              <div className="p-4 bg-posthog-cream rounded-lg">
                <p className="font-mono text-sm text-posthog-black">
                  {getActionData(selectedAction.action, selectedAction.entity).description}
                </p>
              </div>

              {/* Action Details */}
              <div className="space-y-4">
                <h3 className="font-mono text-sm font-medium text-posthog-black">ACTION_DETAILS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getActionData(selectedAction.action, selectedAction.entity).details.map((detail, index) => (
                    <div key={index} className="p-3 bg-white border border-posthog-cream-dark rounded">
                      <div className="font-mono text-xs text-posthog-gray">{detail.label}</div>
                      <div className="font-mono text-sm text-posthog-black mt-1">{detail.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning (if applicable) */}
              {getActionData(selectedAction.action, selectedAction.entity).warning && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-mono text-sm font-medium text-yellow-800">WARNING</div>
                      <div className="font-mono text-xs text-yellow-700 mt-1">
                        {getActionData(selectedAction.action, selectedAction.entity).warning}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-posthog-cream-dark">
                  <Button
                    variant="outline"
                  onClick={() => setIsActionModalOpen(false)}
                  className="font-mono text-xs"
                  >
                  CANCEL
                  </Button>
                  <Button
                  onClick={executeAction}
                  className="font-mono text-xs bg-posthog-orange hover:bg-posthog-orange/90 text-white"
                >
                  EXECUTE_ACTION
                  </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Entity Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b border-posthog-cream-dark">
            <DialogTitle className="font-mono text-posthog-black text-lg">
              CREATE_NEW_ENTITY
            </DialogTitle>
          </DialogHeader>
          
          {/* Sticky Mode Selection */}
          <div className="px-6 py-4 border-b border-posthog-cream-dark bg-white">
            <div className="flex justify-center gap-4 p-4 bg-posthog-cream rounded-lg">
                  <Button
                variant={createMode === "manual" ? "default" : "outline"}
                onClick={() => setCreateMode("manual")}
                className={`font-mono text-xs ${createMode === "manual" ? "bg-posthog-orange text-white" : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"}`}
              >
                <Settings className="h-4 w-4 mr-2" />
                MANUAL_SETUP
                  </Button>
                  <Button
                variant={createMode === "automated" ? "default" : "outline"}
                onClick={() => setCreateMode("automated")}
                className={`font-mono text-xs ${createMode === "automated" ? "bg-posthog-orange text-white" : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"}`}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                AUTOMATED_SETUP
                  </Button>
                  <Button
                variant={createMode === "copilot" ? "default" : "outline"}
                onClick={() => setCreateMode("copilot")}
                className={`font-mono text-xs ${createMode === "copilot" ? "bg-posthog-orange text-white" : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"}`}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                ASK_COPILOT
                  </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
            {/* Entity Type Selection */}
            <div className="space-y-4">
              <Label className="font-mono text-sm font-medium text-posthog-black">ENTITY_TYPE</Label>
              <Select value={selectedCreateEntityType} onValueChange={(value: EntityType) => setSelectedCreateEntityType(value)}>
                <SelectTrigger className="border-posthog-orange font-mono">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.filter(type => type !== "all").map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {createMode === "manual" ? (
              /* Manual Form */
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Settings className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-mono text-sm font-medium text-blue-800 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        MANUAL_SETUP
                      </div>
                      <div className="font-mono text-xs text-blue-700 mt-1">
                        Fill out the form below to manually create a new {selectedCreateEntityType.toLowerCase()}.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getEntityFormFields(selectedCreateEntityType).map((field) => {
                    const IconComponent = getIconComponent(field.icon)
                    return (
                      <div key={field.name} className="space-y-2">
                        <Label className="font-mono text-sm text-posthog-black flex items-center gap-2">
                          <IconComponent className="h-4 w-4 text-posthog-orange" />
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                      
                      {field.type === "text" && (
                        <Input
                          placeholder={field.placeholder || ""}
                          value={createFormData[field.name] || ""}
                          onChange={(e) => setCreateFormData({...createFormData, [field.name]: e.target.value})}
                          className="font-mono text-sm"
                        />
                      )}
                      
                      {field.type === "email" && (
                        <Input
                          type="email"
                          placeholder={field.placeholder || ""}
                          value={createFormData[field.name] || ""}
                          onChange={(e) => setCreateFormData({...createFormData, [field.name]: e.target.value})}
                          className="font-mono text-sm"
                        />
                      )}
                      
                      {field.type === "url" && (
                        <Input
                          type="url"
                          placeholder={field.placeholder || ""}
                          value={createFormData[field.name] || ""}
                          onChange={(e) => setCreateFormData({...createFormData, [field.name]: e.target.value})}
                          className="font-mono text-sm"
                        />
                      )}
                      
                      {field.type === "number" && (
                        <Input
                          type="number"
                          placeholder={field.placeholder || ""}
                          value={createFormData[field.name] || ""}
                          onChange={(e) => setCreateFormData({...createFormData, [field.name]: e.target.value})}
                          className="font-mono text-sm"
                        />
                      )}
                      
                      {field.type === "textarea" && (
                        <Textarea
                          placeholder={field.placeholder || ""}
                          value={createFormData[field.name] || ""}
                          onChange={(e) => setCreateFormData({...createFormData, [field.name]: e.target.value})}
                          className="font-mono text-sm"
                          rows={3}
                        />
                      )}
                      
                      {field.type === "select" && (
                        <Select value={createFormData[field.name] || ""} onValueChange={(value) => setCreateFormData({...createFormData, [field.name]: value})}>
                          <SelectTrigger className="font-mono text-sm">
                            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      
                      {field.type === "checkbox" && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={field.name}
                            checked={createFormData[field.name] || false}
                            onCheckedChange={(checked) => setCreateFormData({...createFormData, [field.name]: checked})}
                          />
                          <Label htmlFor={field.name} className="font-mono text-sm">
                            {field.label}
                          </Label>
                        </div>
                      )}
                      
                      {field.type === "tags" && (
                        <div className="space-y-2">
                          <Input
                            placeholder="Enter tags separated by commas"
                            value={createFormData[field.name] || ""}
                            onChange={(e) => setCreateFormData({...createFormData, [field.name]: e.target.value})}
                            className="font-mono text-sm"
                          />
                          <div className="text-xs font-mono text-posthog-gray">
                            Example: service-a, service-b, service-c
                          </div>
                        </div>
                      )}
                      
                      {field.type === "multiselect" && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            {(createFormData[field.name] || []).map((item: string, index: number) => (
                              <Badge key={index} variant="outline" className="font-mono text-xs">
                                {item}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newItems = (createFormData[field.name] || []).filter((_: any, i: number) => i !== index)
                                    setCreateFormData({...createFormData, [field.name]: newItems})
                                  }}
                                  className="ml-1 text-posthog-gray hover:text-posthog-black"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <Select onValueChange={(value) => {
                            if (value && !(createFormData[field.name] || []).includes(value)) {
                              setCreateFormData({
                                ...createFormData, 
                                [field.name]: [...(createFormData[field.name] || []), value]
                              })
                            }
                          }}>
                            <SelectTrigger className="font-mono text-sm">
                              <SelectValue placeholder={`Add ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.filter((option: string) => !(createFormData[field.name] || []).includes(option)).map((option: string) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : createMode === "automated" ? (
              /* Automated Integration Selection */
              <div className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-mono text-sm font-medium text-green-800 flex items-center gap-2">
                        <Workflow className="h-4 w-4" />
                        AUTOMATED_SETUP
                      </div>
                      <div className="font-mono text-xs text-green-700 mt-1">
                        Connect to an integration to automatically create and configure your {selectedCreateEntityType.toLowerCase()}.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="font-mono text-sm font-medium text-posthog-black">AVAILABLE_INTEGRATIONS</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getIntegrationOptions(selectedCreateEntityType).map((integration, index) => {
                      // Map integration icons to actual icon components
                      const getIntegrationIcon = (iconName: string) => {
                        switch (iconName) {
                          case "Cloud": return Cloud
                          case "Server": return Server
                          case "Package": return Package
                          case "Network": return Network
                          case "Shield": return Shield
                          case "BookOpen": return BookOpen
                          case "Database": return Database
                          case "Activity": return Activity
                          case "Brain": return Brain
                          case "Globe": return Globe
                          case "Smartphone": return Smartphone
                          case "Zap": return Zap
                          default: return Server
                        }
                      }
                      
                      const IconComponent = getIntegrationIcon(integration.icon)
                      return (
                        <Card
                          key={index}
                          className="border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors cursor-pointer"
                          onClick={() => {
                            onQuickAction(`connect to ${integration.name} for ${selectedCreateEntityType}`)
                            setIsCreateModalOpen(false)
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-posthog-cream rounded">
                                <IconComponent className="h-5 w-5 text-posthog-orange" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-mono text-sm font-medium text-posthog-black">{integration.name}</h3>
                                <p className="font-mono text-xs text-posthog-gray mt-1">{integration.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  
                  {getIntegrationOptions(selectedCreateEntityType).length === 0 && (
                    <div className="text-center py-8">
                      <div className="font-mono text-sm text-posthog-gray">
                        No integrations available for {selectedCreateEntityType.toLowerCase()}.
                      </div>
                      <div className="font-mono text-xs text-posthog-gray mt-1">
                        Try switching to manual setup or a different entity type.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Ask CoPilot Chat Interface */
              <div className="space-y-6">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-mono text-sm font-medium text-purple-800 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        ASK_COPILOT
                      </div>
                      <div className="font-mono text-xs text-purple-700 mt-1">
                        Chat with CoPilot to create your {selectedCreateEntityType.toLowerCase()} catalog entity. Describe what you need and I'll help you set it up.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto border border-posthog-cream-dark rounded-lg p-4 bg-white">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="h-8 w-8 text-posthog-orange mx-auto mb-2" />
                      <div className="font-mono text-sm text-posthog-gray">
                        Hi! I'm CoPilot. Tell me about the {selectedCreateEntityType.toLowerCase()} you want to create.
                      </div>
                      <div className="font-mono text-xs text-posthog-gray mt-1">
                        I can help you with configuration, dependencies, and best practices.
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'copilot' && (
                          <div className="p-2 bg-posthog-cream rounded-full">
                            <Bot className="h-4 w-4 text-posthog-orange" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg font-mono text-sm ${
                            message.type === 'user'
                              ? 'bg-posthog-orange text-white'
                              : 'bg-posthog-cream text-posthog-black'
                          }`}
                        >
                          {message.content}
                        </div>
                        {message.type === 'user' && (
                          <div className="p-2 bg-posthog-orange rounded-full">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="p-2 bg-posthog-cream rounded-full">
                        <Bot className="h-4 w-4 text-posthog-orange" />
                      </div>
                      <div className="bg-posthog-cream text-posthog-black p-3 rounded-lg font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          CoPilot is thinking...
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Describe what you need for your entity..."
                      className="font-mono text-sm flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="font-mono text-xs bg-posthog-orange hover:bg-posthog-orange/90 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-mono text-xs text-posthog-gray">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                </div>
              </div>
            )}

            </div>
          </div>
          
          {/* Sticky Action Buttons */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-posthog-cream-dark bg-white">
                  <Button
                    variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="font-mono text-xs"
                  >
              CANCEL
                  </Button>
            {createMode === "manual" && (
                  <Button
                onClick={() => {
                  onQuickAction(`create ${selectedCreateEntityType.toLowerCase()} with manual setup`)
                  setIsCreateModalOpen(false)
                }}
                className="font-mono text-xs bg-posthog-orange hover:bg-posthog-orange/90 text-white"
              >
                CREATE_ENTITY
                  </Button>
          )}
            {createMode === "copilot" && (
                  <Button
                onClick={() => {
                  onQuickAction(`create ${selectedCreateEntityType.toLowerCase()} with copilot assistance`)
                  setIsCreateModalOpen(false)
                }}
                className="font-mono text-xs bg-posthog-orange hover:bg-posthog-orange/90 text-white"
              >
                CREATE_WITH_COPILOT
                  </Button>
          )}
        </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
