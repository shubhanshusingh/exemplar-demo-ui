import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, BookOpen, Code, Zap, CheckCircle, Clock, AlertTriangle, Target, GitBranch, Database, Brain, FileText, ExternalLink, Link as LinkIcon } from "lucide-react"

interface OnboardingSubtabProps {
  onQuickAction: (command: string) => void
}

interface DocumentSource {
  type: 'notion' | 'confluence' | 'udemy' | 'link' | 'kb'
  title: string
  url?: string
}

interface OnboardingStep {
  id: string
  title: string
  description: string
  duration: string
  resources?: string[]
  checklist?: string[]
  documents?: DocumentSource[]
}

interface OnboardingTemplate {
  id: string
  name: string
  description: string
  duration: string
  steps: number
  completionRate: string
  icon: any
  detailedSteps: OnboardingStep[]
}

export const OnboardingSubtab: React.FC<OnboardingSubtabProps> = ({ onQuickAction }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<OnboardingTemplate | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const onboardingTemplates: OnboardingTemplate[] = [
    {
      id: "frontend-developer",
      name: "Frontend Developer",
      description: "React, TypeScript, and modern frontend tooling",
      duration: "4 hours",
      steps: 8,
      completionRate: "92%",
      icon: Code,
      detailedSteps: [
        {
          id: "step-1",
          title: "Environment Setup",
          description: "Install Node.js, npm/yarn, and configure your development environment",
          duration: "30 min",
          checklist: ["Install Node.js v18+", "Install VS Code with extensions", "Configure Git credentials", "Set up SSH keys"],
          resources: ["Developer Environment Setup Guide", "VS Code Extension Pack"],
          documents: [
            { type: 'notion', title: "Developer Environment Setup Guide", url: "https://notion.so/dev-env-setup" },
            { type: 'kb', title: "VS Code Extension Pack", url: "/kb/vscode-extensions" },
            { type: 'confluence', title: "Git Configuration", url: "https://confluence.company.com/git-setup" }
          ]
        },
        {
          id: "step-2",
          title: "Repository Access",
          description: "Get access to frontend repositories and understand the codebase structure",
          duration: "20 min",
          checklist: ["Request repository access", "Clone main frontend repo", "Review README and architecture docs", "Set up local development server"],
          resources: ["Repository Access Guide", "Architecture Documentation"],
          documents: [
            { type: 'notion', title: "Repository Access Guide", url: "https://notion.so/repo-access" },
            { type: 'confluence', title: "Architecture Documentation", url: "https://confluence.company.com/frontend-architecture" },
            { type: 'kb', title: "Local Development Setup", url: "/kb/local-dev-setup" }
          ]
        },
        {
          id: "step-3",
          title: "Project Structure",
          description: "Understand the project structure, folder organization, and naming conventions",
          duration: "25 min",
          checklist: ["Review folder structure", "Understand component organization", "Learn naming conventions", "Explore shared utilities"],
          resources: ["Project Structure Guide", "Coding Standards"],
          documents: [
            { type: 'notion', title: "Project Structure Guide", url: "https://notion.so/project-structure" },
            { type: 'confluence', title: "Coding Standards", url: "https://confluence.company.com/coding-standards" }
          ]
        },
        {
          id: "step-4",
          title: "React & TypeScript Basics",
          description: "Review React hooks, TypeScript patterns, and component best practices",
          duration: "40 min",
          checklist: ["Review React hooks usage", "Understand TypeScript interfaces", "Learn component patterns", "Study state management"],
          resources: ["React Best Practices", "TypeScript Guide"],
          documents: [
            { type: 'udemy', title: "React Hooks Mastery", url: "https://udemy.com/react-hooks" },
            { type: 'notion', title: "TypeScript Guide", url: "https://notion.so/typescript-guide" },
            { type: 'link', title: "React Official Docs", url: "https://react.dev" }
          ]
        },
        {
          id: "step-5",
          title: "UI Component Library",
          description: "Learn the internal UI component library and design system",
          duration: "30 min",
          checklist: ["Explore component library", "Review design tokens", "Understand theme system", "Test component usage"],
          resources: ["Component Library Docs", "Design System Guide"],
          documents: [
            { type: 'kb', title: "Component Library Docs", url: "/kb/component-library" },
            { type: 'notion', title: "Design System Guide", url: "https://notion.so/design-system" }
          ]
        },
        {
          id: "step-6",
          title: "Testing Setup",
          description: "Set up testing tools and write your first test",
          duration: "35 min",
          checklist: ["Install testing dependencies", "Configure Jest and React Testing Library", "Write first component test", "Run test suite"],
          resources: ["Testing Guide", "Test Examples"],
          documents: [
            { type: 'confluence', title: "Testing Guide", url: "https://confluence.company.com/testing-guide" },
            { type: 'kb', title: "Test Examples", url: "/kb/test-examples" },
            { type: 'link', title: "Jest Documentation", url: "https://jestjs.io" }
          ]
        },
        {
          id: "step-7",
          title: "First Contribution",
          description: "Make your first small contribution to the codebase",
          duration: "45 min",
          checklist: ["Create feature branch", "Make small UI change", "Write tests", "Submit PR for review"],
          resources: ["Git Workflow Guide", "PR Template"],
          documents: [
            { type: 'notion', title: "Git Workflow Guide", url: "https://notion.so/git-workflow" },
            { type: 'confluence', title: "PR Template", url: "https://confluence.company.com/pr-template" }
          ]
        },
        {
          id: "step-8",
          title: "Code Review Process",
          description: "Understand the code review process and best practices",
          duration: "20 min",
          checklist: ["Review PR guidelines", "Understand review criteria", "Learn review tools", "Schedule review session"],
          resources: ["Code Review Guide", "Review Checklist"],
          documents: [
            { type: 'notion', title: "Code Review Guide", url: "https://notion.so/code-review" },
            { type: 'kb', title: "Review Checklist", url: "/kb/review-checklist" }
          ]
        }
      ]
    },
    {
      id: "backend-developer",
      name: "Backend Developer",
      description: "Node.js, APIs, databases, and microservices",
      duration: "6 hours",
      steps: 12,
      completionRate: "87%",
      icon: Zap,
      detailedSteps: [
        {
          id: "step-1",
          title: "Development Environment",
          description: "Set up Node.js, database tools, and API testing clients",
          duration: "45 min",
          checklist: ["Install Node.js and npm", "Set up PostgreSQL/MongoDB", "Install Postman/Insomnia", "Configure environment variables"],
          resources: ["Environment Setup Guide", "Database Setup"]
        },
        {
          id: "step-2",
          title: "Repository & Codebase",
          description: "Clone repositories and understand the backend architecture",
          duration: "30 min",
          checklist: ["Clone backend repositories", "Review architecture docs", "Understand service structure", "Set up local services"],
          resources: ["Architecture Overview", "Service Documentation"],
          documents: [
            { type: 'confluence', title: "Architecture Overview", url: "https://confluence.company.com/backend-architecture" },
            { type: 'notion', title: "Service Documentation", url: "https://notion.so/service-docs" }
          ]
        },
        {
          id: "step-3",
          title: "API Framework",
          description: "Learn the API framework, routing, and middleware patterns",
          duration: "50 min",
          checklist: ["Review Express/Fastify setup", "Understand routing patterns", "Learn middleware usage", "Study error handling"],
          resources: ["API Framework Guide", "Middleware Patterns"],
          documents: [
            { type: 'notion', title: "API Framework Guide", url: "https://notion.so/api-framework" },
            { type: 'kb', title: "Middleware Patterns", url: "/kb/middleware-patterns" },
            { type: 'link', title: "Express.js Docs", url: "https://expressjs.com" }
          ]
        },
        {
          id: "step-4",
          title: "Database Access",
          description: "Understand database models, migrations, and query patterns",
          duration: "40 min",
          checklist: ["Review database schema", "Understand ORM/ODM patterns", "Learn migration process", "Practice queries"],
          resources: ["Database Guide", "Migration Tutorial"],
          documents: [
            { type: 'confluence', title: "Database Guide", url: "https://confluence.company.com/database-guide" },
            { type: 'notion', title: "Migration Tutorial", url: "https://notion.so/migrations" },
            { type: 'udemy', title: "Database Design Course", url: "https://udemy.com/database-design" }
          ]
        },
        {
          id: "step-5",
          title: "Authentication & Authorization",
          description: "Learn authentication flows, JWT tokens, and role-based access",
          duration: "45 min",
          checklist: ["Understand auth flow", "Learn JWT implementation", "Review RBAC patterns", "Test authentication"],
          resources: ["Auth Guide", "Security Best Practices"],
          documents: [
            { type: 'notion', title: "Auth Guide", url: "https://notion.so/auth-guide" },
            { type: 'confluence', title: "Security Best Practices", url: "https://confluence.company.com/security" },
            { type: 'kb', title: "JWT Implementation", url: "/kb/jwt-implementation" }
          ]
        },
        {
          id: "step-6",
          title: "API Design Standards",
          description: "Learn RESTful API design, versioning, and documentation",
          duration: "35 min",
          checklist: ["Review API design standards", "Understand versioning", "Learn OpenAPI/Swagger", "Write API docs"],
          resources: ["API Design Guide", "OpenAPI Tutorial"],
          documents: [
            { type: 'confluence', title: "API Design Guide", url: "https://confluence.company.com/api-design" },
            { type: 'link', title: "OpenAPI Tutorial", url: "https://swagger.io/docs" },
            { type: 'kb', title: "API Versioning", url: "/kb/api-versioning" }
          ]
        },
        {
          id: "step-7",
          title: "Testing Backend Services",
          description: "Set up unit tests, integration tests, and test databases",
          duration: "50 min",
          checklist: ["Configure test framework", "Write unit tests", "Set up integration tests", "Run test suite"],
          resources: ["Testing Guide", "Test Examples"],
          documents: [
            { type: 'notion', title: "Testing Guide", url: "https://notion.so/backend-testing" },
            { type: 'kb', title: "Test Examples", url: "/kb/test-examples" }
          ]
        },
        {
          id: "step-8",
          title: "Microservices Communication",
          description: "Understand service-to-service communication patterns",
          duration: "40 min",
          checklist: ["Learn gRPC/REST patterns", "Understand service discovery", "Review message queues", "Test inter-service calls"],
          resources: ["Microservices Guide", "Communication Patterns"],
          documents: [
            { type: 'confluence', title: "Microservices Guide", url: "https://confluence.company.com/microservices" },
            { type: 'notion', title: "Communication Patterns", url: "https://notion.so/communication-patterns" },
            { type: 'udemy', title: "Microservices Architecture", url: "https://udemy.com/microservices" }
          ]
        },
        {
          id: "step-9",
          title: "Logging & Monitoring",
          description: "Set up logging, monitoring, and observability tools",
          duration: "30 min",
          checklist: ["Configure logging", "Set up monitoring dashboards", "Learn error tracking", "Review metrics"],
          resources: ["Observability Guide", "Monitoring Setup"],
          documents: [
            { type: 'notion', title: "Observability Guide", url: "https://notion.so/observability" },
            { type: 'kb', title: "Monitoring Setup", url: "/kb/monitoring-setup" }
          ]
        },
        {
          id: "step-10",
          title: "Deployment Process",
          description: "Understand CI/CD pipelines and deployment workflows",
          duration: "35 min",
          checklist: ["Review CI/CD config", "Understand deployment stages", "Learn rollback process", "Test deployment"],
          resources: ["Deployment Guide", "CI/CD Documentation"],
          documents: [
            { type: 'confluence', title: "Deployment Guide", url: "https://confluence.company.com/deployment" },
            { type: 'notion', title: "CI/CD Documentation", url: "https://notion.so/cicd" }
          ]
        },
        {
          id: "step-11",
          title: "First API Endpoint",
          description: "Create your first API endpoint with tests and documentation",
          duration: "60 min",
          checklist: ["Create new endpoint", "Implement business logic", "Write tests", "Add API documentation"],
          resources: ["Endpoint Template", "API Examples"],
          documents: [
            { type: 'kb', title: "Endpoint Template", url: "/kb/endpoint-template" },
            { type: 'notion', title: "API Examples", url: "https://notion.so/api-examples" }
          ]
        },
        {
          id: "step-12",
          title: "Code Review & Best Practices",
          description: "Submit PR and learn backend code review process",
          duration: "25 min",
          checklist: ["Submit PR", "Address review feedback", "Learn best practices", "Schedule review"],
          resources: ["Code Review Guide", "Best Practices"],
          documents: [
            { type: 'notion', title: "Code Review Guide", url: "https://notion.so/code-review" },
            { type: 'confluence', title: "Best Practices", url: "https://confluence.company.com/best-practices" }
          ]
        }
      ]
    },
    {
      id: "fullstack-developer",
      name: "Full-Stack Developer",
      description: "Complete frontend and backend development stack",
      duration: "8 hours",
      steps: 15,
      completionRate: "78%",
      icon: Users,
      detailedSteps: [
        {
          id: "step-1",
          title: "Complete Environment Setup",
          description: "Set up both frontend and backend development environments",
          duration: "60 min",
          checklist: ["Install Node.js and tools", "Set up databases", "Configure IDEs", "Install all dependencies"],
          resources: ["Full Environment Guide"],
          documents: [
            { type: 'notion', title: "Full Environment Guide", url: "https://notion.so/full-env-setup" },
            { type: 'kb', title: "Development Tools", url: "/kb/dev-tools" }
          ]
        },
        {
          id: "step-2",
          title: "Repository Access",
          description: "Get access to all frontend and backend repositories",
          duration: "30 min",
          checklist: ["Request all repo access", "Clone repositories", "Review architecture", "Set up local stack"],
          resources: ["Repository Guide"],
          documents: [
            { type: 'confluence', title: "Repository Guide", url: "https://confluence.company.com/repos" }
          ]
        },
        {
          id: "step-3",
          title: "Frontend Fundamentals",
          description: "Review React, TypeScript, and frontend patterns",
          duration: "45 min",
          checklist: ["React basics", "TypeScript patterns", "Component structure", "State management"],
          resources: ["Frontend Guide"],
          documents: [
            { type: 'notion', title: "Frontend Guide", url: "https://notion.so/frontend-guide" },
            { type: 'udemy', title: "React Complete Guide", url: "https://udemy.com/react-complete" }
          ]
        },
        {
          id: "step-4",
          title: "Backend Fundamentals",
          description: "Review API framework, databases, and backend patterns",
          duration: "45 min",
          checklist: ["API framework", "Database access", "Authentication", "Error handling"],
          resources: ["Backend Guide"],
          documents: [
            { type: 'notion', title: "Backend Guide", url: "https://notion.so/backend-guide" },
            { type: 'confluence', title: "API Patterns", url: "https://confluence.company.com/api-patterns" }
          ]
        },
        {
          id: "step-5",
          title: "Full-Stack Integration",
          description: "Understand how frontend and backend communicate",
          duration: "40 min",
          checklist: ["API integration", "Data flow", "Error handling", "Loading states"],
          resources: ["Integration Guide"],
          documents: [
            { type: 'kb', title: "Integration Guide", url: "/kb/integration-guide" },
            { type: 'notion', title: "API Integration Patterns", url: "https://notion.so/api-integration" }
          ]
        },
        {
          id: "step-6",
          title: "End-to-End Feature",
          description: "Build a complete feature from frontend to backend",
          duration: "90 min",
          checklist: ["Design feature", "Implement backend", "Build frontend", "Add tests"],
          resources: ["Feature Template"],
          documents: [
            { type: 'kb', title: "Feature Template", url: "/kb/feature-template" },
            { type: 'notion', title: "Feature Development Guide", url: "https://notion.so/feature-dev" }
          ]
        },
        {
          id: "step-7",
          title: "Testing Full Stack",
          description: "Write tests for both frontend and backend",
          duration: "50 min",
          checklist: ["Frontend tests", "Backend tests", "Integration tests", "E2E tests"],
          resources: ["Testing Guide"],
          documents: [
            { type: 'confluence', title: "Testing Guide", url: "https://confluence.company.com/testing" },
            { type: 'kb', title: "E2E Testing", url: "/kb/e2e-testing" }
          ]
        },
        {
          id: "step-8",
          title: "Deployment Workflow",
          description: "Understand full-stack deployment process",
          duration: "35 min",
          checklist: ["Build process", "Deployment stages", "Environment configs", "Rollback process"],
          resources: ["Deployment Guide"],
          documents: [
            { type: 'notion', title: "Deployment Guide", url: "https://notion.so/deployment" },
            { type: 'confluence', title: "CI/CD Pipeline", url: "https://confluence.company.com/cicd" }
          ]
        },
        {
          id: "step-9",
          title: "Code Review",
          description: "Submit and review full-stack PR",
          duration: "30 min",
          checklist: ["Submit PR", "Review feedback", "Best practices", "Merge process"],
          resources: ["Review Guide"],
          documents: [
            { type: 'notion', title: "Review Guide", url: "https://notion.so/review-guide" },
            { type: 'kb', title: "PR Best Practices", url: "/kb/pr-best-practices" }
          ]
        }
      ]
    },
    {
      id: "platform-engineer",
      name: "Platform Engineer",
      description: "Infrastructure, DevOps, and platform tooling",
      duration: "10 hours",
      steps: 18,
      completionRate: "85%",
      icon: Target,
      detailedSteps: [
        {
          id: "step-1",
          title: "Infrastructure Access",
          description: "Get access to cloud accounts, Kubernetes clusters, and infrastructure tools",
          duration: "45 min",
          checklist: ["Cloud account setup", "Kubernetes access", "VPN configuration", "SSH key setup"],
          resources: ["Infrastructure Access Guide"],
          documents: [
            { type: 'confluence', title: "Infrastructure Access Guide", url: "https://confluence.company.com/infra-access" },
            { type: 'kb', title: "Cloud Account Setup", url: "/kb/cloud-setup" }
          ]
        },
        {
          id: "step-2",
          title: "Kubernetes Basics",
          description: "Understand Kubernetes concepts, pods, services, and deployments",
          duration: "60 min",
          checklist: ["Kubernetes concepts", "kubectl setup", "Cluster access", "Basic operations"],
          resources: ["Kubernetes Guide"],
          documents: [
            { type: 'notion', title: "Kubernetes Guide", url: "https://notion.so/kubernetes" },
            { type: 'udemy', title: "Kubernetes Complete Course", url: "https://udemy.com/kubernetes" },
            { type: 'link', title: "Kubernetes Official Docs", url: "https://kubernetes.io/docs" }
          ]
        },
        {
          id: "step-3",
          title: "Infrastructure as Code",
          description: "Learn Terraform, infrastructure templates, and provisioning",
          duration: "50 min",
          checklist: ["Terraform basics", "Review IAC templates", "Understand modules", "Test provisioning"],
          resources: ["Terraform Guide"],
          documents: [
            { type: 'confluence', title: "Terraform Guide", url: "https://confluence.company.com/terraform" },
            { type: 'notion', title: "IAC Templates", url: "https://notion.so/iac-templates" },
            { type: 'link', title: "Terraform Docs", url: "https://terraform.io/docs" }
          ]
        },
        {
          id: "step-4",
          title: "CI/CD Pipelines",
          description: "Understand CI/CD tools, pipeline configuration, and automation",
          duration: "55 min",
          checklist: ["CI/CD tools", "Pipeline structure", "Build stages", "Deployment automation"],
          resources: ["CI/CD Guide"],
          documents: [
            { type: 'notion', title: "CI/CD Guide", url: "https://notion.so/cicd" },
            { type: 'kb', title: "Pipeline Examples", url: "/kb/pipeline-examples" }
          ]
        },
        {
          id: "step-5",
          title: "Monitoring & Observability",
          description: "Set up monitoring, logging, and alerting systems",
          duration: "45 min",
          checklist: ["Monitoring tools", "Log aggregation", "Alert configuration", "Dashboard setup"],
          resources: ["Monitoring Guide"],
          documents: [
            { type: 'confluence', title: "Monitoring Guide", url: "https://confluence.company.com/monitoring" },
            { type: 'kb', title: "Alert Configuration", url: "/kb/alert-config" }
          ]
        },
        {
          id: "step-6",
          title: "Service Mesh",
          description: "Learn service mesh concepts and configuration",
          duration: "40 min",
          checklist: ["Service mesh basics", "Istio/Linkerd setup", "Traffic management", "Security policies"],
          resources: ["Service Mesh Guide"],
          documents: [
            { type: 'notion', title: "Service Mesh Guide", url: "https://notion.so/service-mesh" },
            { type: 'link', title: "Istio Documentation", url: "https://istio.io/docs" }
          ]
        },
        {
          id: "step-7",
          title: "Container Orchestration",
          description: "Understand Docker, containerization, and orchestration",
          duration: "50 min",
          checklist: ["Docker basics", "Container builds", "Registry access", "Orchestration patterns"],
          resources: ["Container Guide"],
          documents: [
            { type: 'confluence', title: "Container Guide", url: "https://confluence.company.com/containers" },
            { type: 'udemy', title: "Docker Mastery", url: "https://udemy.com/docker" },
            { type: 'link', title: "Docker Documentation", url: "https://docs.docker.com" }
          ]
        },
        {
          id: "step-8",
          title: "Security & Compliance",
          description: "Learn security best practices, secrets management, and compliance",
          duration: "45 min",
          checklist: ["Secrets management", "Security policies", "Compliance requirements", "Audit processes"],
          resources: ["Security Guide"],
          documents: [
            { type: 'notion', title: "Security Guide", url: "https://notion.so/security" },
            { type: 'confluence', title: "Compliance Requirements", url: "https://confluence.company.com/compliance" }
          ]
        },
        {
          id: "step-9",
          title: "First Infrastructure Change",
          description: "Make your first infrastructure change and deploy",
          duration: "60 min",
          checklist: ["Plan change", "Update IAC", "Test locally", "Deploy to staging"],
          resources: ["Change Template"],
          documents: [
            { type: 'kb', title: "Change Template", url: "/kb/change-template" },
            { type: 'notion', title: "Infrastructure Change Process", url: "https://notion.so/infra-changes" }
          ]
        }
      ]
    },
    {
      id: "data-engineer",
      name: "Data Engineer",
      description: "Data pipelines, ETL processes, and data infrastructure",
      duration: "7 hours",
      steps: 14,
      completionRate: "81%",
      icon: Database,
      detailedSteps: [
        {
          id: "step-1",
          title: "Data Infrastructure Access",
          description: "Get access to data warehouses, data lakes, and processing tools",
          duration: "40 min",
          checklist: ["Data warehouse access", "S3/data lake access", "Spark cluster access", "Airflow access"],
          resources: ["Data Infrastructure Guide"]
        },
        {
          id: "step-2",
          title: "Data Pipeline Framework",
          description: "Learn the data pipeline framework and ETL patterns",
          duration: "50 min",
          checklist: ["Pipeline architecture", "ETL patterns", "Data transformation", "Error handling"],
          resources: ["Pipeline Framework Guide"],
          documents: [
            { type: 'notion', title: "Pipeline Framework Guide", url: "https://notion.so/pipeline-framework" },
            { type: 'kb', title: "ETL Patterns", url: "/kb/etl-patterns" }
          ]
        },
        {
          id: "step-3",
          title: "Apache Spark Basics",
          description: "Understand Spark, data processing, and distributed computing",
          duration: "55 min",
          checklist: ["Spark concepts", "DataFrame operations", "Spark SQL", "Performance optimization"],
          resources: ["Spark Guide"],
          documents: [
            { type: 'notion', title: "Spark Guide", url: "https://notion.so/spark" },
            { type: 'udemy', title: "Apache Spark Course", url: "https://udemy.com/spark" },
            { type: 'link', title: "Spark Documentation", url: "https://spark.apache.org/docs" }
          ]
        },
        {
          id: "step-4",
          title: "Workflow Orchestration",
          description: "Learn Airflow, DAG creation, and workflow management",
          duration: "45 min",
          checklist: ["Airflow basics", "DAG structure", "Task dependencies", "Scheduling"],
          resources: ["Airflow Guide"],
          documents: [
            { type: 'confluence', title: "Airflow Guide", url: "https://confluence.company.com/airflow" },
            { type: 'link', title: "Airflow Documentation", url: "https://airflow.apache.org/docs" }
          ]
        },
        {
          id: "step-5",
          title: "Data Storage Patterns",
          description: "Understand data warehouses, data lakes, and storage formats",
          duration: "40 min",
          checklist: ["Storage options", "Data formats", "Partitioning strategies", "Data retention"],
          resources: ["Storage Guide"],
          documents: [
            { type: 'notion', title: "Storage Guide", url: "https://notion.so/data-storage" },
            { type: 'kb', title: "Storage Best Practices", url: "/kb/storage-practices" }
          ]
        },
        {
          id: "step-6",
          title: "Data Quality & Testing",
          description: "Learn data quality checks, validation, and testing frameworks",
          duration: "45 min",
          checklist: ["Data quality checks", "Validation rules", "Testing frameworks", "Data profiling"],
          resources: ["Data Quality Guide"],
          documents: [
            { type: 'confluence', title: "Data Quality Guide", url: "https://confluence.company.com/data-quality" },
            { type: 'notion', title: "Testing Frameworks", url: "https://notion.so/data-testing" }
          ]
        },
        {
          id: "step-7",
          title: "Streaming Data",
          description: "Understand streaming data processing with Kafka and Spark Streaming",
          duration: "50 min",
          checklist: ["Kafka basics", "Stream processing", "Event sourcing", "Real-time pipelines"],
          resources: ["Streaming Guide"],
          documents: [
            { type: 'notion', title: "Streaming Guide", url: "https://notion.so/streaming" },
            { type: 'udemy', title: "Kafka & Stream Processing", url: "https://udemy.com/kafka" },
            { type: 'link', title: "Kafka Documentation", url: "https://kafka.apache.org/documentation" }
          ]
        },
        {
          id: "step-8",
          title: "First Data Pipeline",
          description: "Create your first ETL pipeline with tests",
          duration: "70 min",
          checklist: ["Design pipeline", "Implement ETL", "Add tests", "Deploy to staging"],
          resources: ["Pipeline Template"],
          documents: [
            { type: 'kb', title: "Pipeline Template", url: "/kb/pipeline-template" },
            { type: 'notion', title: "ETL Best Practices", url: "https://notion.so/etl-practices" }
          ]
        }
      ]
    },
    {
      id: "ai-engineer",
      name: "AI Engineer",
      description: "AI/ML model development, deployment, and MLOps",
      duration: "9 hours",
      steps: 16,
      completionRate: "73%",
      icon: Brain,
      detailedSteps: [
        {
          id: "step-1",
          title: "ML Infrastructure Access",
          description: "Get access to ML platforms, GPU clusters, and model repositories",
          duration: "45 min",
          checklist: ["ML platform access", "GPU cluster access", "Model registry", "Experiment tracking"],
          resources: ["ML Infrastructure Guide"],
          documents: [
            { type: 'confluence', title: "ML Infrastructure Guide", url: "https://confluence.company.com/ml-infra" },
            { type: 'kb', title: "GPU Access Request", url: "/kb/gpu-access" }
          ]
        },
        {
          id: "step-2",
          title: "ML Framework Setup",
          description: "Set up ML frameworks, libraries, and development environment",
          duration: "50 min",
          checklist: ["Python environment", "ML libraries", "Jupyter setup", "GPU configuration"],
          resources: ["ML Framework Guide"],
          documents: [
            { type: 'notion', title: "ML Framework Guide", url: "https://notion.so/ml-framework" },
            { type: 'kb', title: "Python Environment Setup", url: "/kb/python-env" },
            { type: 'link', title: "PyTorch Documentation", url: "https://pytorch.org/docs" }
          ]
        },
        {
          id: "step-3",
          title: "Model Development Workflow",
          description: "Understand model development, training, and evaluation process",
          duration: "60 min",
          checklist: ["Model development", "Training pipelines", "Evaluation metrics", "Hyperparameter tuning"],
          resources: ["Model Development Guide"],
          documents: [
            { type: 'notion', title: "Model Development Guide", url: "https://notion.so/model-dev" },
            { type: 'udemy', title: "Deep Learning Course", url: "https://udemy.com/deep-learning" }
          ]
        },
        {
          id: "step-4",
          title: "MLOps Tools",
          description: "Learn MLflow, model versioning, and experiment tracking",
          duration: "55 min",
          checklist: ["MLflow setup", "Experiment tracking", "Model versioning", "Artifact storage"],
          resources: ["MLOps Guide"],
          documents: [
            { type: 'confluence', title: "MLOps Guide", url: "https://confluence.company.com/mlops" },
            { type: 'notion', title: "MLflow Setup", url: "https://notion.so/mlflow" },
            { type: 'link', title: "MLflow Documentation", url: "https://mlflow.org/docs" }
          ]
        },
        {
          id: "step-5",
          title: "Model Deployment",
          description: "Understand model serving, APIs, and deployment patterns",
          duration: "50 min",
          checklist: ["Model serving", "API endpoints", "Containerization", "Deployment strategies"],
          resources: ["Deployment Guide"],
          documents: [
            { type: 'notion', title: "Deployment Guide", url: "https://notion.so/model-deployment" },
            { type: 'kb', title: "Model Serving Patterns", url: "/kb/model-serving" }
          ]
        },
        {
          id: "step-6",
          title: "Feature Engineering",
          description: "Learn feature stores, feature engineering, and data pipelines",
          duration: "45 min",
          checklist: ["Feature stores", "Feature engineering", "Data pipelines", "Feature versioning"],
          resources: ["Feature Engineering Guide"],
          documents: [
            { type: 'confluence', title: "Feature Engineering Guide", url: "https://confluence.company.com/features" },
            { type: 'kb', title: "Feature Store Guide", url: "/kb/feature-store" }
          ]
        },
        {
          id: "step-7",
          title: "Model Monitoring",
          description: "Set up model monitoring, drift detection, and alerting",
          duration: "40 min",
          checklist: ["Model monitoring", "Drift detection", "Performance tracking", "Alerting"],
          resources: ["Monitoring Guide"],
          documents: [
            { type: 'notion', title: "Monitoring Guide", url: "https://notion.so/model-monitoring" },
            { type: 'kb', title: "Drift Detection", url: "/kb/drift-detection" }
          ]
        },
        {
          id: "step-8",
          title: "First ML Model",
          description: "Develop and deploy your first ML model",
          duration: "90 min",
          checklist: ["Develop model", "Train and evaluate", "Deploy model", "Monitor performance"],
          resources: ["Model Template"],
          documents: [
            { type: 'kb', title: "Model Template", url: "/kb/model-template" },
            { type: 'notion', title: "ML Model Checklist", url: "https://notion.so/model-checklist" }
          ]
        }
      ]
    },
    {
      id: "ml-engineer",
      name: "ML Engineer",
      description: "Machine learning systems, model optimization, and production ML",
      duration: "8 hours",
      steps: 15,
      completionRate: "76%",
      icon: Brain,
      detailedSteps: [
        {
          id: "step-1",
          title: "ML Platform Access",
          description: "Get access to ML infrastructure, compute resources, and tools",
          duration: "40 min",
          checklist: ["ML platform access", "GPU/TPU access", "Model registry", "Experiment tracking"],
          resources: ["ML Platform Guide"]
        },
        {
          id: "step-2",
          title: "ML Development Environment",
          description: "Set up ML development environment with frameworks and tools",
          duration: "50 min",
          checklist: ["Python environment", "ML frameworks", "Jupyter/Notebooks", "Development tools"],
          resources: ["Environment Setup Guide"],
          documents: [
            { type: 'notion', title: "Environment Setup Guide", url: "https://notion.so/ml-env" },
            { type: 'kb', title: "Jupyter Setup", url: "/kb/jupyter-setup" }
          ]
        },
        {
          id: "step-3",
          title: "Model Training Infrastructure",
          description: "Understand distributed training, GPU clusters, and training pipelines",
          duration: "55 min",
          checklist: ["Training infrastructure", "Distributed training", "GPU utilization", "Training pipelines"],
          resources: ["Training Guide"],
          documents: [
            { type: 'confluence', title: "Training Guide", url: "https://confluence.company.com/training" },
            { type: 'udemy', title: "Distributed Training", url: "https://udemy.com/distributed-training" }
          ]
        },
        {
          id: "step-4",
          title: "Model Optimization",
          description: "Learn model optimization, quantization, and performance tuning",
          duration: "50 min",
          checklist: ["Model optimization", "Quantization", "Pruning", "Performance tuning"],
          resources: ["Optimization Guide"],
          documents: [
            { type: 'notion', title: "Optimization Guide", url: "https://notion.so/model-optimization" },
            { type: 'kb', title: "Quantization Techniques", url: "/kb/quantization" }
          ]
        },
        {
          id: "step-5",
          title: "Model Serving",
          description: "Understand model serving, inference APIs, and serving infrastructure",
          duration: "45 min",
          checklist: ["Model serving", "Inference APIs", "Serving infrastructure", "Load balancing"],
          resources: ["Serving Guide"],
          documents: [
            { type: 'confluence', title: "Serving Guide", url: "https://confluence.company.com/model-serving" },
            { type: 'notion', title: "Inference APIs", url: "https://notion.so/inference" }
          ]
        },
        {
          id: "step-6",
          title: "MLOps Pipeline",
          description: "Set up MLOps pipeline for automated training and deployment",
          duration: "60 min",
          checklist: ["MLOps pipeline", "CI/CD for ML", "Automated training", "Model deployment"],
          resources: ["MLOps Guide"],
          documents: [
            { type: 'notion', title: "MLOps Guide", url: "https://notion.so/mlops" },
            { type: 'kb', title: "CI/CD for ML", url: "/kb/ml-cicd" }
          ]
        },
        {
          id: "step-7",
          title: "Model Monitoring & Observability",
          description: "Set up monitoring for model performance, drift, and health",
          duration: "45 min",
          checklist: ["Model monitoring", "Performance tracking", "Drift detection", "Health checks"],
          resources: ["Monitoring Guide"],
          documents: [
            { type: 'confluence', title: "Monitoring Guide", url: "https://confluence.company.com/ml-monitoring" },
            { type: 'kb', title: "Drift Detection Setup", url: "/kb/drift-detection" }
          ]
        },
        {
          id: "step-8",
          title: "First Production Model",
          description: "Develop, optimize, and deploy your first production ML model",
          duration: "100 min",
          checklist: ["Develop model", "Optimize performance", "Deploy to production", "Monitor and iterate"],
          resources: ["Production Model Template"],
          documents: [
            { type: 'kb', title: "Production Model Template", url: "/kb/production-model" },
            { type: 'notion', title: "Production Checklist", url: "https://notion.so/production-checklist" }
          ]
        }
      ]
    }
  ]

  const recentOnboardings = [
    {
      developer: "jane.doe@company.com",
      role: "Frontend Developer",
      progress: 75,
      currentStep: "Setting up development environment",
      startDate: "2 days ago",
      mentor: "senior.dev@company.com",
      status: "in_progress",
    },
    {
      developer: "john.smith@company.com",
      role: "Backend Developer",
      progress: 100,
      currentStep: "Completed",
      startDate: "1 week ago",
      mentor: "tech.lead@company.com",
      status: "completed",
    },
    {
      developer: "alice.johnson@company.com",
      role: "Full-Stack Developer",
      progress: 45,
      currentStep: "First code review",
      startDate: "3 days ago",
      mentor: "senior.dev@company.com",
      status: "in_progress",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-posthog-orange" />
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'notion':
        return '📝'
      case 'confluence':
        return '🔗'
      case 'udemy':
        return '🎓'
      case 'link':
        return <ExternalLink className="h-3 w-3" />
      case 'kb':
        return <BookOpen className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const getDocumentBadgeColor = (type: string) => {
    switch (type) {
      case 'notion':
        return 'border-blue-500 text-blue-600 bg-blue-50'
      case 'confluence':
        return 'border-blue-400 text-blue-600 bg-blue-50'
      case 'udemy':
        return 'border-purple-500 text-purple-600 bg-purple-50'
      case 'link':
        return 'border-gray-500 text-gray-600 bg-gray-50'
      case 'kb':
        return 'border-posthog-orange text-posthog-orange bg-orange-50'
      default:
        return 'border-posthog-cream-dark text-posthog-gray'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-posthog-black">ONBOARDING</h1>
          <p className="text-posthog-gray font-mono text-sm">DEVELOPER_ONBOARDING_TEMPLATES_AND_PROGRESS</p>
        </div>
        <Button
          onClick={() => onQuickAction("check developer onboarding progress")}
          className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
        >
          <Users className="h-4 w-4 mr-2" />
          VIEW_ONBOARDING
        </Button>
      </div>

      {/* Onboarding Templates */}
      <Card className="border-posthog-cream-dark bg-white">
        <CardHeader>
          <CardTitle className="font-mono text-posthog-black">ONBOARDING_TEMPLATES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {onboardingTemplates.map((template) => (
              <Card
                key={template.id}
                className={`border-posthog-cream-dark bg-posthog-cream hover:border-posthog-orange transition-colors cursor-pointer ${
                  selectedTemplate?.id === template.id ? "ring-2 ring-posthog-orange" : ""
                }`}
                onClick={() => {
                  setSelectedTemplate(template)
                  setShowDetails(true)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <template.icon className="h-6 w-6 text-posthog-orange mt-1" />
                    <div className="flex-1">
                      <h4 className="font-mono text-sm font-medium text-posthog-black">{template.name}</h4>
                      <p className="text-xs text-posthog-gray font-mono mt-1">{template.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs font-mono">
                        <span className="text-posthog-gray">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {template.duration}
                        </span>
                        <span className="text-posthog-gray">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          {template.steps} steps
                        </span>
                        <Badge
                          variant="outline"
                          className="font-mono text-xs border-posthog-orange text-posthog-orange"
                        >
                          {template.completionRate} success
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Onboardings */}
      <Card className="border-posthog-cream-dark bg-white">
        <CardHeader>
          <CardTitle className="font-mono text-posthog-black">RECENT_ONBOARDINGS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOnboardings.map((onboarding, index) => (
              <div key={index} className="p-4 bg-posthog-cream rounded border border-posthog-cream-dark">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(onboarding.status)}
                    <div>
                      <span className="font-mono text-sm font-medium text-posthog-black">
                        {onboarding.developer}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="font-mono text-xs border-posthog-orange text-posthog-orange"
                        >
                          {onboarding.role}
                        </Badge>
                        <span className="text-xs font-mono text-posthog-gray">Started {onboarding.startDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-posthog-orange">{onboarding.progress}%</div>
                    <div className="text-xs font-mono text-posthog-gray">COMPLETE</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={onboarding.progress} className="h-2" />
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-posthog-gray">Current: {onboarding.currentStep}</span>
                    <span className="text-posthog-gray">Mentor: {onboarding.mentor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Details Dialog */}
      {selectedTemplate && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-posthog-black flex items-center gap-2">
                <selectedTemplate.icon className="h-5 w-5 text-posthog-orange" />
                {selectedTemplate.name} ONBOARDING
              </DialogTitle>
              <DialogDescription className="font-mono text-posthog-gray">
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {selectedTemplate.duration}
                  </span>
                  <span className="text-xs">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    {selectedTemplate.steps} steps
                  </span>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs border-posthog-orange text-posthog-orange"
                  >
                    {selectedTemplate.completionRate} success rate
                  </Badge>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Template Overview */}
              <div className="p-4 bg-posthog-cream rounded border border-posthog-cream-dark">
                <div className="text-xs font-mono font-medium text-posthog-black mb-2">DESCRIPTION</div>
                <p className="font-mono text-sm text-posthog-gray">{selectedTemplate.description}</p>
              </div>

              {/* Onboarding Steps */}
              <div>
                <div className="text-xs font-mono font-medium text-posthog-black mb-3">ONBOARDING_STEPS</div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pr-4">
                    {selectedTemplate.detailedSteps.map((step, index) => (
                      <Card key={step.id} className="border-posthog-cream-dark bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-posthog-orange text-white flex items-center justify-center font-mono text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-mono text-sm font-medium text-posthog-black">{step.title}</h4>
                                <Badge variant="outline" className="font-mono text-xs border-posthog-cream-dark text-posthog-gray">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {step.duration}
                                </Badge>
                              </div>
                              <p className="font-mono text-xs text-posthog-gray mb-3">{step.description}</p>
                              
                              {step.checklist && step.checklist.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-xs font-mono font-medium text-posthog-black mb-2">CHECKLIST:</div>
                                  <ul className="space-y-1">
                                    {step.checklist.map((item, itemIndex) => (
                                      <li key={itemIndex} className="flex items-start gap-2 text-xs font-mono text-posthog-gray">
                                        <CheckCircle className="h-3 w-3 text-posthog-orange mt-0.5 flex-shrink-0" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {step.documents && step.documents.length > 0 && (
                                <div className="mb-3">
                                  <div className="text-xs font-mono font-medium text-posthog-black mb-2">DOCUMENTATION_SOURCES:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {step.documents.map((doc, docIndex) => {
                                      const icon = getDocumentIcon(doc.type)
                                      const isStringIcon = typeof icon === 'string'
                                      return (
                                        <Badge
                                          key={docIndex}
                                          variant="outline"
                                          className={`font-mono text-xs cursor-pointer hover:opacity-80 ${getDocumentBadgeColor(doc.type)}`}
                                          onClick={() => doc.url && window.open(doc.url, '_blank')}
                                        >
                                          {isStringIcon ? (
                                            <span className="mr-1">{icon}</span>
                                          ) : (
                                            <span className="mr-1 inline-flex items-center">{icon}</span>
                                          )}
                                          <span className="mr-1">{doc.type.toUpperCase()}:</span>
                                          {doc.title}
                                          {doc.url && (
                                            <ExternalLink className="h-3 w-3 inline ml-1" />
                                          )}
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {step.resources && step.resources.length > 0 && (
                                <div>
                                  <div className="text-xs font-mono font-medium text-posthog-black mb-2">ADDITIONAL_RESOURCES:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {step.resources.map((resource, resourceIndex) => (
                                      <Badge
                                        key={resourceIndex}
                                        variant="outline"
                                        className="font-mono text-xs border-posthog-cream-dark text-posthog-gray"
                                      >
                                        <BookOpen className="h-3 w-3 inline mr-1" />
                                        {resource}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-posthog-cream-dark">
                <Button
                  className="flex-1 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
                  onClick={() => onQuickAction(`start ${selectedTemplate.name.toLowerCase()} onboarding`)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  START_ONBOARDING
                </Button>
                <Button
                  variant="outline"
                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                  onClick={() => setShowDetails(false)}
                >
                  CLOSE
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 