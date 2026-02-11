"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Bot,
  Search,
  Plus,
  Star,
  Copy,
  Play,
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Zap,
  X,
  RotateCcw,
  Download,
  Save,
  Edit,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Link,
  Link2Off,
  ChevronUp,
  List,
  LayoutGrid,
} from "lucide-react"
import PromptCreationWizard from "./prompt-creation-wizard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { createHash } from "crypto"

interface PromptHubProps {
  onQuickAction: (command: string) => void
  onSwitchSubTab?: (subTab: string) => void
}

const promptCategories = [
  { id: "all", name: "All Prompts", count: 15 },
  { id: "code-review", name: "Code Review", count: 4 },
  { id: "documentation", name: "Documentation", count: 3 },
  { id: "debugging", name: "Debugging", count: 3 },
  { id: "architecture", name: "Architecture", count: 2 },
  { id: "testing", name: "Testing", count: 3 },
]

const prompts = [
  {
    id: "0",
    title: "Default",
    description: "A basic prompt with a system and user message for starting from scratch.",
    category: "general",
    author: "system",
    version: "1.0",
    usage: 0,
    rating: 0,
    tags: ["starter", "default"],
    lastUpdated: "just now",
    messages: [
      {
        role: "system",
        content: "You are a helpful AI assistant. Please help with the following:\n\n{{query}}"
      },
      {
        role: "user",
        content: ""
      }
    ],
    variables: ["query"],
    isPublic: false,
    isFavorite: false,
  },
  {
    id: "1",
    title: "Code Review Assistant",
    description: "Comprehensive code review with security, performance, and best practices analysis",
    category: "code-review",
    author: "platform-team",
    version: "2.1",
    usage: 234,
    rating: 4.8,
    tags: ["security", "performance", "best-practices"],
    lastUpdated: "2 days ago",
    messages: [
      {
        role: "system",
        content: `You are an expert code reviewer. Analyze the following code for:

1. **Security vulnerabilities**
2. **Performance issues** 
3. **Code quality and best practices**
4. **Potential bugs**
5. **Maintainability concerns**

Code to review:
{{code}}

User input:
{{user_input}}`
      },
      {
        role: "user",
        content: `Code: function add(a, b) { return a + b; }\nUser input: Please check if this function is secure and efficient.`
      }
    ],
    variables: ["code", "user_input"],
    isPublic: true,
    isFavorite: true,
  },
  {
    id: "2",
    title: "API Documentation Generator",
    description: "Generate comprehensive API documentation from code or specifications",
    category: "documentation",
    author: "docs-team",
    version: "1.5",
    usage: 156,
    rating: 4.6,
    tags: ["api", "documentation", "openapi"],
    lastUpdated: "1 week ago",
    messages: [
      {
        role: "system",
        content: `Generate comprehensive API documentation for the following endpoint:

**Endpoint**: {{endpoint}}
**Method**: {{method}}
**Description**: {{description}}

Include:
- Request/response schemas
- Example requests and responses
- Error codes and descriptions
- Authentication requirements
- Rate limiting information

Code/Specification:
{{specification}}

User input:
{{user_input}}`
      },
      {
        role: "user",
        content: `Endpoint: /api/users\nMethod: POST\nDescription: Create a new user\nSpecification: { "name": "string", "email": "string" }\nUser input: Please generate documentation for this endpoint.`
      }
    ],
    variables: ["endpoint", "method", "description", "specification", "user_input"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "3",
    title: "Bug Analysis & Solution",
    description: "Analyze error logs and provide debugging steps with potential solutions",
    category: "debugging",
    author: "sre-team",
    version: "3.0",
    usage: 189,
    rating: 4.9,
    tags: ["debugging", "error-analysis", "troubleshooting"],
    lastUpdated: "3 days ago",
    messages: [
      {
        role: "system",
        content: `Analyze the following error/bug report and provide a structured debugging approach:

**Error/Issue**: {{error_description}}
**Environment**: {{environment}}
**Logs**: {{logs}}
**Steps to Reproduce**: {{reproduction_steps}}

Provide:
1. **Root Cause Analysis**
2. **Immediate Mitigation Steps**
3. **Long-term Solution**
4. **Prevention Strategies**
5. **Monitoring Recommendations**`
      },
      {
        role: "user",
        content: `Error/Issue: Application crashes on login\nEnvironment: Production\nLogs: Error: Cannot read property 'user' of undefined\nSteps to Reproduce: 1. Go to login page 2. Enter credentials 3. Click login`
      }
    ],
    variables: ["error_description", "environment", "logs", "reproduction_steps"],
    isPublic: true,
    isFavorite: true,
  },
  {
    id: "4",
    title: "Architecture Review",
    description: "Review system architecture for scalability, reliability, and best practices",
    category: "architecture",
    author: "architecture-team",
    version: "1.8",
    usage: 98,
    rating: 4.7,
    tags: ["architecture", "scalability", "design-patterns"],
    lastUpdated: "5 days ago",
    messages: [
      {
        role: "system",
        content: `Review the following system architecture:

**System Overview**: {{system_description}}
**Architecture Diagram**: {{architecture_diagram}}
**Requirements**: {{requirements}}
**Current Challenges**: {{challenges}}

Evaluate:
1. **Scalability** - Can it handle growth?
2. **Reliability** - Single points of failure?
3. **Security** - Potential vulnerabilities?
4. **Performance** - Bottlenecks and optimizations?
5. **Maintainability** - Code organization and documentation?
6. **Cost Efficiency** - Resource utilization?

Provide specific recommendations with implementation priorities.`
      },
      {
        role: "user",
        content: `System Overview: E-commerce platform\nArchitecture Diagram: [link to diagram]\nRequirements: Handle 10,000 concurrent users\nCurrent Challenges: Occasional downtime during peak hours`
      }
    ],
    variables: ["system_description", "architecture_diagram", "requirements", "challenges"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "5",
    title: "Database Migration Helper",
    description: "Generate safe database migration scripts with rollback strategies",
    category: "debugging",
    author: "data-team",
    version: "1.3",
    usage: 76,
    rating: 4.5,
    tags: ["database", "migration", "sql"],
    lastUpdated: "1 week ago",
    messages: [
      {
        role: "system",
        content: `Create a database migration plan for the following changes:

**Current Schema**: {{current_schema}}
**Target Schema**: {{target_schema}}
**Database Type**: {{database_type}}
**Data Volume**: {{data_volume}}

Generate:
1. **Migration Script** - Step-by-step SQL commands
2. **Rollback Script** - Commands to revert changes
3. **Data Validation** - Queries to verify migration success
4. **Performance Considerations** - Index management and optimization
5. **Downtime Estimation** - Expected migration duration

Include safety checks and backup recommendations.`
      }
    ],
    variables: ["current_schema", "target_schema", "database_type", "data_volume"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "6",
    title: "Unit Test Generator",
    description: "Generate comprehensive unit tests for functions and classes",
    category: "testing",
    author: "qa-team",
    version: "2.0",
    usage: 143,
    rating: 4.4,
    tags: ["testing", "unit-tests", "tdd"],
    lastUpdated: "4 days ago",
    messages: [
      {
        role: "system",
        content: `Generate comprehensive unit tests for the following code:

**Language**: {{language}}
**Testing Framework**: {{framework}}
**Code to Test**: {{code}}

Generate tests that cover:
1. **Happy Path** - Normal execution scenarios
2. **Edge Cases** - Boundary conditions and limits
3. **Error Handling** - Exception and error scenarios
4. **Mock Dependencies** - External service interactions
5. **Performance** - Basic performance assertions

Include setup, teardown, and helper functions as needed.`
      }
    ],
    variables: ["language", "framework", "code"],
    isPublic: true,
    isFavorite: true,
  },
  {
    id: "7",
    title: "Performance Optimization Analyzer",
    description: "Analyze code and system performance bottlenecks with optimization suggestions",
    category: "code-review",
    author: "performance-team",
    version: "1.7",
    usage: 87,
    rating: 4.6,
    tags: ["performance", "optimization", "profiling"],
    lastUpdated: "6 days ago",
    messages: [
      {
        role: "system",
        content: `Analyze the following code/system for performance optimization:

**Code/System**: {{code_or_system}}
**Performance Metrics**: {{current_metrics}}
**Target Requirements**: {{performance_targets}}
**Environment**: {{environment}}

Provide analysis on:
1. **Bottleneck Identification** - Key performance issues
2. **Optimization Strategies** - Specific improvements
3. **Code Refactoring** - Structural improvements
4. **Caching Opportunities** - Data and computation caching
5. **Resource Utilization** - CPU, memory, I/O optimization
6. **Monitoring Setup** - Performance tracking recommendations

Prioritize recommendations by impact and implementation effort.`
      },
      {
        role: "user",
        content: `Code/System: API endpoint for fetching user data\nCurrent Metrics: 2s average response time\nPerformance Targets: <500ms response\nEnvironment: Production`
      }
    ],
    variables: ["code_or_system", "current_metrics", "performance_targets", "environment"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "8",
    title: "Security Vulnerability Scanner",
    description: "Identify security vulnerabilities and provide remediation steps",
    category: "code-review",
    author: "security-team",
    version: "2.3",
    usage: 201,
    rating: 4.9,
    tags: ["security", "vulnerability", "owasp"],
    lastUpdated: "1 day ago",
    messages: [
      {
        role: "system",
        content: `Perform a security analysis of the following code/system:

**Code/System**: {{code_or_system}}
**Technology Stack**: {{tech_stack}}
**Deployment Environment**: {{environment}}
**Compliance Requirements**: {{compliance}}

Analyze for:
1. **OWASP Top 10** - Common web vulnerabilities
2. **Input Validation** - Data sanitization issues
3. **Authentication/Authorization** - Access control flaws
4. **Data Protection** - Encryption and privacy concerns
5. **Dependency Vulnerabilities** - Third-party security issues
6. **Configuration Security** - Deployment and infrastructure

Provide specific remediation steps with code examples where applicable.`
      },
      {
        role: "user",
        content: `Code/System: Payment processing microservice\nTechnology Stack: Node.js, Express\nDeployment Environment: AWS\nCompliance: PCI DSS`
      }
    ],
    variables: ["code_or_system", "tech_stack", "environment", "compliance"],
    isPublic: true,
    isFavorite: true,
  },
  {
    id: "9",
    title: "README Generator",
    description: "Generate comprehensive README documentation for projects",
    category: "documentation",
    author: "docs-team",
    version: "1.4",
    usage: 167,
    rating: 4.3,
    tags: ["documentation", "readme", "markdown"],
    lastUpdated: "3 days ago",
    messages: [
      {
        role: "system",
        content: `Generate a comprehensive README.md for the following project:

**Project Name**: {{project_name}}
**Description**: {{project_description}}
**Technology Stack**: {{tech_stack}}
**Target Audience**: {{audience}}
**Repository URL**: {{repo_url}}

Include sections for:
1. **Project Overview** - Clear description and purpose
2. **Installation** - Setup and dependency instructions
3. **Usage** - Basic usage examples and API reference
4. **Configuration** - Environment variables and settings
5. **Contributing** - Guidelines for contributors
6. **Testing** - How to run tests
7. **Deployment** - Production deployment instructions
8. **License** - License information
9. **Support** - Contact and support information

Use proper markdown formatting with badges, code blocks, and tables.`
      },
      {
        role: "user",
        content: `Project Name: Task Manager\nDescription: A web app to manage daily tasks\nTechnology Stack: React, Node.js, MongoDB\nTarget Audience: Productivity enthusiasts\nRepository URL: https://github.com/example/task-manager`
      }
    ],
    variables: ["project_name", "project_description", "tech_stack", "audience", "repo_url"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "10",
    title: "Integration Test Planner",
    description: "Plan and generate integration test scenarios for microservices",
    category: "testing",
    author: "qa-team",
    version: "1.6",
    usage: 92,
    rating: 4.5,
    tags: ["integration-testing", "microservices", "api-testing"],
    lastUpdated: "5 days ago",
    messages: [
      {
        role: "system",
        content: `Create an integration test plan for the following system:

**System Architecture**: {{architecture}}
**Services to Test**: {{services}}
**Integration Points**: {{integration_points}}
**Test Environment**: {{test_environment}}

Generate test scenarios for:
1. **Service-to-Service Communication** - API contract testing
2. **Data Flow** - End-to-end data validation
3. **Error Handling** - Failure scenario testing
4. **Performance** - Load and stress testing
5. **Security** - Authentication and authorization testing
6. **Monitoring** - Health check and observability testing

Include test data setup, environment configuration, and success criteria.`
      },
      {
        role: "user",
        content: `System Architecture: Microservices with API Gateway\nServices: Auth, Orders, Inventory\nIntegration Points: Auth <-> Orders, Orders <-> Inventory\nTest Environment: Staging`
      }
    ],
    variables: ["architecture", "services", "integration_points", "test_environment"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "11",
    title: "Microservice Design Pattern Advisor",
    description: "Recommend design patterns and best practices for microservice architecture",
    category: "architecture",
    author: "architecture-team",
    version: "2.1",
    usage: 134,
    rating: 4.8,
    tags: ["microservices", "design-patterns", "distributed-systems"],
    lastUpdated: "2 days ago",
    messages: [
      {
        role: "system",
        content: `Provide microservice design recommendations for the following requirements:

**Business Domain**: {{business_domain}}
**Scale Requirements**: {{scale_requirements}}
**Team Structure**: {{team_structure}}
**Technology Constraints**: {{tech_constraints}}
**Current Challenges**: {{challenges}}

Recommend:
1. **Service Boundaries** - Domain-driven design approach
2. **Communication Patterns** - Sync vs async, event-driven
3. **Data Management** - Database per service, CQRS, event sourcing
4. **Resilience Patterns** - Circuit breaker, retry, timeout
5. **Observability** - Logging, monitoring, tracing strategies
6. **Deployment Strategy** - CI/CD, containerization, orchestration
7. **Security Patterns** - Authentication, authorization, secrets management

Include implementation examples and trade-off analysis.`
      },
      {
        role: "user",
        content: `Business Domain: Online retail\nScale Requirements: 100,000 daily users\nTeam Structure: 3 cross-functional teams\nTechnology Constraints: Must use AWS\nCurrent Challenges: Slow order processing`
      }
    ],
    variables: ["business_domain", "scale_requirements", "team_structure", "tech_constraints", "challenges"],
    isPublic: true,
    isFavorite: true,
  },
  {
    id: "12",
    title: "Error Message Optimizer",
    description: "Improve error messages for better user experience and debugging",
    category: "debugging",
    author: "ux-team",
    version: "1.2",
    usage: 78,
    rating: 4.2,
    tags: ["error-handling", "ux", "debugging"],
    lastUpdated: "1 week ago",
    messages: [
      {
        role: "system",
        content: `Optimize the following error messages for better user experience:

**Current Error Messages**: {{current_errors}}
**User Context**: {{user_context}}
**Application Type**: {{app_type}}
**Target Audience**: {{audience}}

Improve each error message with:
1. **Clear Description** - What went wrong in plain language
2. **User Impact** - How this affects the user's workflow
3. **Actionable Steps** - What the user can do to resolve it
4. **Technical Details** - For developers (when appropriate)
5. **Prevention Tips** - How to avoid this error in the future
6. **Help Resources** - Links to documentation or support

Ensure messages are:
- User-friendly and non-technical when appropriate
- Specific and actionable
- Consistent in tone and format
- Helpful for both users and developers`
      },
      {
        role: "user",
        content: `Current Error Messages: "Invalid password", "User not found"\nUser Context: Login page\nApplication Type: Web app\nAudience: End users`
      }
    ],
    variables: ["current_errors", "user_context", "app_type", "audience"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "13",
    title: "Load Testing Strategy",
    description: "Design comprehensive load testing strategies for applications",
    category: "testing",
    author: "performance-team",
    version: "1.9",
    usage: 115,
    rating: 4.7,
    tags: ["load-testing", "performance", "scalability"],
    lastUpdated: "4 days ago",
    messages: [
      {
        role: "system",
        content: `Design a load testing strategy for the following application:

**Application Type**: {{app_type}}
**Expected Load**: {{expected_load}}
**Critical User Journeys**: {{user_journeys}}
**Infrastructure**: {{infrastructure}}
**Performance SLAs**: {{slas}}

Create a testing plan that includes:
1. **Test Scenarios** - Realistic user behavior patterns
2. **Load Profiles** - Ramp-up, steady state, spike testing
3. **Performance Metrics** - Response time, throughput, error rates
4. **Resource Monitoring** - CPU, memory, database, network
5. **Bottleneck Identification** - Potential failure points
6. **Scalability Testing** - Breaking point analysis
7. **Test Environment** - Infrastructure requirements
8. **Success Criteria** - Pass/fail thresholds

Include test script examples and monitoring setup.`
      },
      {
        role: "user",
        content: `Application Type: SaaS web app\nExpected Load: 10,000 concurrent users\nCritical User Journeys: Signup, login, dashboard\nInfrastructure: AWS, RDS, Redis\nSLAs: 99.9% uptime, <1s response time`
      }
    ],
    variables: ["app_type", "expected_load", "user_journeys", "infrastructure", "slas"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "14",
    title: "Release Notes Generator",
    description: "Generate release notes from commit messages or PRs",
    category: "documentation",
    author: "devops-team",
    version: "1.2",
    usage: 61,
    rating: 4.1,
    tags: ["release-notes", "commits", "automation"],
    lastUpdated: "1 week ago",
    messages: [
      {
        role: "system",
        content: `Generate release notes from the following commit messages or pull requests:

**Commits/PRs**: {{commits}}
**Release Version**: {{version}}
**Audience**: {{audience}}

Include:
1. **New Features**
2. **Bug Fixes**
3. **Improvements**
4. **Breaking Changes**
5. **Upgrade Instructions**
6. **Contributors**`
      },
      {
        role: "user",
        content: `Commits: feat: add user profile page, fix: resolve login bug, chore: update dependencies\nVersion: v2.3.0\nAudience: End users and developers`
      }
    ],
    variables: ["commits", "version", "audience"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "15",
    title: "Deployment Checklist Generator",
    description: "Generate comprehensive deployment checklists for different environments",
    category: "documentation",
    author: "devops-team",
    version: "1.8",
    usage: 203,
    rating: 4.8,
    tags: ["deployment", "devops", "checklist"],
    lastUpdated: "2 days ago",
    messages: [
      {
        role: "system",
        content: `Generate a deployment checklist for the following release:

**Application**: {{application}}
**Environment**: {{environment}}
**Release Type**: {{release_type}}
**Technology Stack**: {{tech_stack}}
**Dependencies**: {{dependencies}}

Create a comprehensive checklist covering:
1. **Pre-Deployment**
   - Code review and testing completion
   - Database migration scripts
   - Configuration updates
   - Backup procedures

2. **Deployment Process**
   - Step-by-step deployment instructions
   - Rollback procedures
   - Health checks and validation
   - Monitoring setup

3. **Post-Deployment**
   - Smoke testing
   - Performance validation
   - Log monitoring
   - User communication

4. **Rollback Plan**
   - Rollback triggers
   - Rollback procedures
   - Data recovery steps
   - Communication plan

Include specific commands, URLs, and contact information.`
      },
      {
        role: "user",
        content: `Application: Inventory Service\nEnvironment: Production\nRelease Type: Major\nTechnology Stack: Python, Flask, PostgreSQL\nDependencies: Redis, RabbitMQ`
      }
    ],
    variables: ["application", "environment", "release_type", "tech_stack", "dependencies"],
    isPublic: true,
    isFavorite: true,
  },
  {
    id: "16",
    title: "Test Case Generator",
    description: "Generate test cases for given code or requirements",
    category: "testing",
    author: "qa-team",
    version: "2.0",
    usage: 120,
    rating: 4.5,
    tags: ["testing", "test-cases", "automation"],
    lastUpdated: "4 days ago",
    messages: [
      {
        role: "system",
        content: `Generate test cases for the following code or requirements:

**Code/Requirements**: {{requirements}}
**Type of Tests**: {{test_type}}
**Edge Cases**: {{edge_cases}}

Provide:
1. **Test Case Description**
2. **Input Data**
3. **Expected Output**
4. **Edge Case Handling**`
      },
      {
        role: "user",
        content: `Requirements: User login functionality\nTest Type: Unit\nEdge Cases: Empty password, invalid email format, SQL injection attempt`
      }
    ],
    variables: ["requirements", "test_type", "edge_cases"],
    isPublic: true,
    isFavorite: false,
  },
  {
    id: "17",
    title: "Changelog Summarizer",
    description: "Summarize changelogs or release notes for quick understanding",
    category: "documentation",
    author: "docs-team",
    version: "1.3",
    usage: 75,
    rating: 4.2,
    tags: ["changelog", "release-notes", "summary"],
    lastUpdated: "1 week ago",
    messages: [
      {
        role: "system",
        content: `Summarize the following changelog or release notes:

**Changelog/Release Notes**: {{changelog}}
**Audience**: {{audience}}

Provide:
1. **Key Features**
2. **Bug Fixes**
3. **Improvements**
4. **Breaking Changes**
5. **Upgrade Instructions**`
      },
      {
        role: "user",
        content: `Changelog: - Added dark mode support\n- Fixed login bug\n- Improved dashboard performance\nAudience: Developers`
      }
    ],
    variables: ["changelog", "audience"],
    isPublic: true,
    isFavorite: false,
  },
]

const recentActivity = [
  { action: "Created", prompt: "Database Migration Helper", user: "john.doe", time: "2 hours ago" },
  { action: "Updated", prompt: "Code Review Assistant", user: "jane.smith", time: "4 hours ago" },
  { action: "Favorited", prompt: "Bug Analysis & Solution", user: "mike.wilson", time: "6 hours ago" },
  { action: "Used", prompt: "API Documentation Generator", user: "sarah.chen", time: "8 hours ago" },
]

const availableModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", description: "Most capable model" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", description: "Fast and efficient" },
  { id: "claude-3-5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", description: "Excellent reasoning" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", description: "Fast responses" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", description: "Multimodal capabilities" },
  { id: "llama-3-70b", name: "Llama 3 70B", provider: "Meta", description: "Open source model" },
]

interface PromptMessageContent {
  type: "text" | "image_url"
  text?: string
  image_url?: {
    url: string
  }
}

interface PromptMessage {
  id: string
  role: string
  content: string | PromptMessageContent[]
}

interface PlaygroundPrompt {
  id: string
  title: string
  messages: PromptMessage[]
  model: string
  response: string
  isLoading: boolean
  responseTime: number
  // New stats fields
  time?: number // in seconds
  cost?: number // in dollars
  inputTokens?: number
  outputTokens?: number
}

// Helper to create a hash of all messages for uniqueness
function getPromptHash(messages: PromptMessage[]): string {
  return messages.map(m => `${m.role}:${m.content}`).join("|")
}

// Helper to deeply clone and re-id messages
function cloneMessagesWithNewIds(messages: { role: string; content: string }[]): PromptMessage[] {
  return messages.map(m => ({
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    role: m.role,
    content: m.content
  }))
}

// Helper to ensure at least one User message exists in a messages array
function ensureAtLeastOneUserMessage(messages: PromptMessage[]): PromptMessage[] {
  if (messages.some(m => m.role === "user")) return messages
  // Insert a blank User message after the first System message, or at the end if none
  const idx = messages.findIndex(m => m.role === "system")
  const userMsg = {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    role: "user",
    content: ""
  }
  if (idx !== -1) {
    return [
      ...messages.slice(0, idx + 1),
      userMsg,
      ...messages.slice(idx + 1)
    ]
  } else {
    return [...messages, userMsg]
  }
}

export default function PromptHub({ onQuickAction, onSwitchSubTab }: PromptHubProps) {
  const [currentView, setCurrentView] = useState<"library" | "create">("library")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editPromptData, setEditPromptData] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [showPlaygroundDialog, setShowPlaygroundDialog] = useState(false)
  const [pendingPlaygroundPrompt, setPendingPlaygroundPrompt] = useState<any>(null)
  
  // New filter and sort states
  const [sortBy, setSortBy] = useState("usage")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAuthor, setSelectedAuthor] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  // Add state to track current tab within Prompt Hub
  const [currentPromptHubTab, setCurrentPromptHubTab] = useState("library")
  
  // Add playground mode state
  const [playgroundMode, setPlaygroundMode] = useState<"single" | "compare">("single")
  
  const itemsPerPage = 12

  // Playground state
  const [playgroundPrompts, setPlaygroundPrompts] = useState<PlaygroundPrompt[]>([])

  // Initialize promptsState with the static prompts
  const [promptsState, setPromptsState] = useState(prompts)

  // Get all unique tags and authors from prompts
  const allTags = Array.from(new Set(promptsState.flatMap(p => p.tags)))
  const allAuthors = Array.from(new Set(promptsState.map(p => p.author)))

  const filteredPrompts = promptsState.filter((prompt) => {
    const matchesCategory = selectedCategory === "all" || prompt.category === selectedCategory
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => prompt.tags.includes(tag))
    const matchesAuthor = selectedAuthor === "all" || prompt.author === selectedAuthor
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "favorite" && prompt.isFavorite) ||
      (selectedStatus === "public" && prompt.isPublic)
    
    return matchesCategory && matchesSearch && matchesTags && matchesAuthor && matchesStatus
  })

  // Sort filtered prompts
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    let aValue: any, bValue: any
    
    switch (sortBy) {
      case "usage":
        aValue = a.usage
        bValue = b.usage
        break
      case "rating":
        aValue = a.rating
        bValue = b.rating
        break
      case "title":
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case "date":
        aValue = new Date(a.lastUpdated)
        bValue = new Date(b.lastUpdated)
        break
      case "author":
        aValue = a.author.toLowerCase()
        bValue = b.author.toLowerCase()
        break
      default:
        aValue = a.usage
        bValue = b.usage
    }
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Add pagination calculations
  const totalPages = Math.ceil(sortedPrompts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPrompts = sortedPrompts.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery, selectedTags, selectedAuthor, selectedStatus, sortBy, sortOrder])

  const handleCopyPrompt = (prompt: any) => {
    navigator.clipboard.writeText(prompt.messages[0].content)
    // Show toast notification
  }

  const handleUsePrompt = (prompt: any) => {
    onQuickAction(`use prompt: ${prompt.title}`)
  }

  const handleCreatePrompt = () => {
    setIsEditMode(false)
    setEditPromptData(null)
    setIsCreateModalOpen(true)
  }

  const handleEditPrompt = (prompt: any) => {
    setIsEditMode(true)
    setEditPromptData(prompt)
    setIsCreateModalOpen(true)
  }

  const handleBackToLibrary = () => {
    setIsCreateModalOpen(false)
    setIsEditMode(false)
    setEditPromptData(null)
  }

  const handlePromptCreated = (promptData: any) => {
    console.log("Prompt created:", promptData)
    
    // Add the new prompt to promptsState
    const newPrompt = {
      id: Date.now().toString(),
      title: promptData.title,
      description: promptData.description,
      messages: promptData.messages,
      variables: promptData.variables,
      tags: promptData.tags,
      version: promptData.version,
      author: "custom-user",
      usage: 0,
      rating: 0,
      lastUpdated: "just now",
      isPublic: false,
      isFavorite: false,
      category: "custom",
    }
    
    setPromptsState(prevPrompts => [newPrompt, ...prevPrompts])
    
    onQuickAction(`Created prompt: ${promptData.title}`)
    setIsCreateModalOpen(false)
    setIsEditMode(false)
    setEditPromptData(null)
  }

  const handlePromptUpdated = (promptData: any) => {
    console.log("Prompt updated:", promptData)
    
    // Update the prompt in promptsState
    setPromptsState(prevPrompts => 
      prevPrompts.map(p => 
        p.id === editPromptData?.id 
          ? {
              ...p,
              title: promptData.title,
              description: promptData.description,
              messages: promptData.messages,
              variables: promptData.variables,
              tags: promptData.tags,
              version: promptData.version,
              lastUpdated: "just now"
            }
          : p
      )
    )
    
    onQuickAction(`Updated prompt: ${promptData.title}`)
    setIsCreateModalOpen(false)
    setIsEditMode(false)
    setEditPromptData(null)
  }

  // Playground functions
  const addPromptToPlayground = () => {
    if (playgroundPrompts.length >= (playgroundMode === "single" ? 1 : 5)) return
    const newPrompt: PlaygroundPrompt = {
      id: Date.now().toString(),
      title: `Custom Prompt ${playgroundPrompts.length + 1}`,
      messages: ensureAtLeastOneUserMessage([
        {
          id: Date.now().toString(),
          role: "system",
          content: "You are a helpful AI assistant. Please help with the following:\n\n{{query}}"
        }
      ]),
      model: "gpt-4o",
      response: "",
      isLoading: false,
      responseTime: 0,
    }
    setPlaygroundPrompts([...playgroundPrompts, newPrompt])
  }

  // Helper function to get text content from message
  const getMessageTextContent = (content: string | PromptMessageContent[]): string => {
    if (typeof content === 'string') {
      return content
    }
    return content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .filter(Boolean)
      .join(' ')
  }

  // Variable substitution function for messages
  const substituteVariables = (messages: PromptMessage[], userQuery: string): PromptMessage[] => {
    if (!userQuery.trim()) return messages
    
    return messages.map(message => {
      if (typeof message.content === 'string') {
        return {
          ...message,
          content: message.content
            .replace(/\{\{query\}\}/gi, userQuery)
            .replace(/\{\{input\}\}/gi, userQuery)
            .replace(/\{\{user_input\}\}/gi, userQuery)
            .replace(/\{\{user_query\}\}/gi, userQuery)
            .replace(/\{\{text\}\}/gi, userQuery)
            .replace(/\{\{content\}\}/gi, userQuery)
            .replace(/\{\{message\}\}/gi, userQuery)
            .replace(/\{\{prompt\}\}/gi, userQuery)
        }
      } else {
        // Handle array content (multimodal)
        return {
          ...message,
          content: message.content.map(item => {
            if (item.type === 'text' && item.text) {
              return {
                ...item,
                text: item.text
                  .replace(/\{\{query\}\}/gi, userQuery)
                  .replace(/\{\{input\}\}/gi, userQuery)
                  .replace(/\{\{user_input\}\}/gi, userQuery)
                  .replace(/\{\{user_query\}\}/gi, userQuery)
                  .replace(/\{\{text\}\}/gi, userQuery)
                  .replace(/\{\{content\}\}/gi, userQuery)
                  .replace(/\{\{message\}\}/gi, userQuery)
                  .replace(/\{\{prompt\}\}/gi, userQuery)
              }
            }
            return item
          })
        }
      }
    })
  }

  // Extract variables from messages
  const extractTemplateVariables = (messages: PromptMessage[]): string[] => {
    const allContent = messages.map(m => getMessageTextContent(m.content)).join(" ")
    const variableRegex = /\{\{([^}]+)\}\}/g
    const variables: string[] = []
    let match
    
    while ((match = variableRegex.exec(allContent)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1])
      }
    }
    
    return variables
  }

  // Add message to playground prompt
  const addMessageToPrompt = (promptId: string) => {
    setPlaygroundPrompts(prompts =>
      prompts.map(p => {
        if (p.id === promptId) {
          const newMessage: PromptMessage = {
            id: Date.now().toString(),
            role: "user",
            content: ""
          }
          return {
            ...p,
            messages: [...p.messages, newMessage]
          }
        }
        return p
      })
    )
  }

  // Remove message from playground prompt
  const removeMessageFromPrompt = (promptId: string, messageId: string) => {
    setPlaygroundPrompts(prompts =>
      prompts.map(p => {
        if (p.id === promptId) {
          return {
            ...p,
            messages: p.messages.filter(m => m.id !== messageId)
          }
        }
        return p
      })
    )
  }

  // Update message in playground prompt
  const updatePromptMessage = (promptId: string, messageId: string, field: keyof PromptMessage, value: string) => {
    setPlaygroundPrompts(prompts =>
      prompts.map(p => {
        if (p.id === promptId) {
          return {
            ...p,
            messages: p.messages.map(m => 
              m.id === messageId ? { ...m, [field]: value } : m
            )
          }
        }
        return p
      })
    )
  }

  const removePromptFromPlayground = (id: string) => {
    setPlaygroundPrompts(playgroundPrompts.filter((p) => p.id !== id))
  }

  // Ensure updatePlaygroundPrompt always creates a new array/object
  const updatePlaygroundPrompt = (id: string, field: keyof PlaygroundPrompt, value: any) => {
    setPlaygroundPrompts(prev => prev.map((p) => (p.id === id ? { ...p, [field]: value } : { ...p })))
  }

  // Update loadPromptToPlayground to accept an optional showDialog parameter (default true)
  const loadPromptToPlayground = (prompt: any, showDialog: boolean = true) => {
    if (playgroundPrompts.length >= 5) return

    const newPrompt: PlaygroundPrompt = {
      id: Date.now().toString(),
      title: prompt.title,
      messages: prompt.messages.map((msg: any, index: number) => ({
        id: (index + 1).toString(),
        role: msg.role,
        content: msg.content
      })),
      model: "gpt-4o",
      response: "",
      isLoading: false,
      responseTime: 0,
    }
    setPlaygroundPrompts([...playgroundPrompts, newPrompt])
    if (showDialog) {
      setPendingPlaygroundPrompt(prompt)
      setShowPlaygroundDialog(true)
    }
  }

  const handleGoToPlayground = () => {
    setShowPlaygroundDialog(false)
    setPendingPlaygroundPrompt(null)
    // Switch to playground tab within the Prompt Hub
    setCurrentPromptHubTab("playground")
  }

  const handleStayInLibrary = () => {
    setShowPlaygroundDialog(false)
    setPendingPlaygroundPrompt(null)
  }

  // When generating a response, set these values (mocked for now)
  const runAllPrompts = async () => {
    // Simulate API calls
    for (const prompt of playgroundPrompts) {
      updatePlaygroundPrompt(prompt.id, "isLoading", true)
      updatePlaygroundPrompt(prompt.id, "response", "")

      // Get substituted messages
      const substitutedMessages = substituteVariables(prompt.messages, "")
      const messagesWithQuery = [
        ...substitutedMessages,
        {
          id: "user-query",
          role: "user",
          content: ""
        }
      ]

      // Simulate API delay
      setTimeout(
        () => {
          // Mock stats
          const mockTime = Math.floor(Math.random() * 8) + 2 // 2-9 seconds
          const mockCost = +(Math.random() * 0.002 + 0.0005).toFixed(6)
          const mockInputTokens = Math.floor(Math.random() * 100) + 20
          const mockOutputTokens = Math.floor(Math.random() * 200) + 20

          const mockResponse = `This is a simulated response from ${availableModels.find((m) => m.id === prompt.model)?.name} for the prompt "${prompt.title}".\n\nMessages sent to AI:\n${messagesWithQuery.map(m => {
            const contentText = typeof m.content === 'string' 
              ? m.content 
              : getMessageTextContent(m.content)
            return `${m.role.toUpperCase()}: ${contentText}`
          }).join('\n\n')}\n\nResponse: Based on your query, here's a comprehensive analysis and recommendations...`
          updatePlaygroundPrompt(prompt.id, "response", mockResponse)
          updatePlaygroundPrompt(prompt.id, "isLoading", false)
          updatePlaygroundPrompt(prompt.id, "responseTime", mockTime * 1000)
          updatePlaygroundPrompt(prompt.id, "time", mockTime)
          updatePlaygroundPrompt(prompt.id, "cost", mockCost)
          updatePlaygroundPrompt(prompt.id, "inputTokens", mockInputTokens)
          updatePlaygroundPrompt(prompt.id, "outputTokens", mockOutputTokens)
        },
        Math.random() * 2000 + 1000,
      )
    }
  }

  const clearAllResponses = () => {
    setPlaygroundPrompts(
      playgroundPrompts.map((p) => ({
        ...p,
        response: "",
        isLoading: false,
        responseTime: 0,
      })),
    )
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedTags([])
    setSelectedAuthor("all")
    setSelectedStatus("all")
    setSortBy("usage")
    setSortOrder("desc")
    setShowAdvancedFilters(false)
  }

  const [isAddPromptModalOpen, setIsAddPromptModalOpen] = useState(false)
  const [promptSearch, setPromptSearch] = useState("")

  // Add Prompt Modal logic
  const handleAddPromptClick = () => setIsAddPromptModalOpen(true)
  const handleAddPromptModalClose = () => {
    setIsAddPromptModalOpen(false)
    setPromptSearch("")
  }
  const handleAddPromptFromTemplate = (templatePrompt: any) => {
    loadPromptToPlayground(templatePrompt)
    handleAddPromptModalClose()
  }
  const handleAddBlankPrompt = () => {
    const now = Date.now().toString();
    const defaultPrompt = {
      id: now,
      title: 'Default Prompt',
      messages: [
        {
          id: now + '-system',
          role: 'system',
          content: 'You are a helpful AI assistant. Please help with the following:\n\n{{query}}'
        },
        {
          id: now + '-user',
          role: 'user',
          content: ''
        }
      ],
      model: 'gpt-4o',
      response: '',
      isLoading: false,
      responseTime: 0,
    };
    setPlaygroundPrompts([...playgroundPrompts, defaultPrompt]);
    setIsAddPromptModalOpen(false);
  }

  const { toast } = useToast()
  const [isSavePromptModalOpen, setIsSavePromptModalOpen] = useState(false)
  const [savePromptData, setSavePromptData] = useState<any>(null)
  const [savePromptTitle, setSavePromptTitle] = useState("")
  const [savePromptDescription, setSavePromptDescription] = useState("")
  const [savePromptTags, setSavePromptTags] = useState<string[]>([])
  const [savePromptTagInput, setSavePromptTagInput] = useState("")

  // Save to Library logic
  const handleOpenSavePromptModal = (prompt: PlaygroundPrompt) => {
    setSavePromptData(prompt)
    setSavePromptTitle(prompt.title)
    setSavePromptDescription("")
    setSavePromptTags([])
    setIsSavePromptModalOpen(true)
  }
  const handleCloseSavePromptModal = () => {
    setIsSavePromptModalOpen(false)
    setSavePromptData(null)
    setSavePromptTitle("")
    setSavePromptDescription("")
    setSavePromptTags([])
    setSavePromptTagInput("")
  }
  const handleSavePromptToLibrary = () => {
    if (!savePromptTitle.trim()) return
    const newPrompt = {
      id: Date.now().toString(),
      title: savePromptTitle.trim(),
      description: savePromptDescription.trim(),
      tags: savePromptTags,
      messages: [
        {
          role: "system",
          content: savePromptData.messages[0]?.content || ""
        }
      ],
      variables: [],
      author: "custom-user",
      version: "1.0",
      usage: 0,
      rating: 0,
      lastUpdated: "just now",
      isPublic: false,
      isFavorite: false,
      category: "custom",
    }
    setPromptsState([newPrompt, ...promptsState])
    toast({ title: "Prompt saved to library!", description: savePromptTitle })
    handleCloseSavePromptModal()
  }
  const handleAddTag = () => {
    if (savePromptTagInput.trim() && !savePromptTags.includes(savePromptTagInput.trim())) {
      setSavePromptTags([...savePromptTags, savePromptTagInput.trim()])
      setSavePromptTagInput("")
    }
  }
  const handleRemoveTag = (tag: string) => {
    setSavePromptTags(savePromptTags.filter(t => t !== tag))
  }
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Use promptsState instead of prompts for template selection
  // ...
  // In Add Prompt Modal, replace prompts with promptsState
  // ...
  // In playground prompt cards, show Save to Library button if not in promptsState
  // ...
  // Helper to check if a playground prompt is already in the library
  const isPromptInLibrary = (playgroundPrompt: PlaygroundPrompt) => {
    const playgroundHash = getPromptHash(playgroundPrompt.messages)
    return promptsState.some(p => getPromptHash(p.messages) === playgroundHash)
  }

  // Helper to get a prompt template by id
  const getPromptTemplateById = (id: string) => promptsState.find(p => p.id === id)

  // Update getPromptTemplateIdForPrompt to match the full messages array for accurate template selection
  const getPromptTemplateIdForPrompt = (prompt: PlaygroundPrompt) => {
    const promptHash = getPromptHash(prompt.messages)
    const found = promptsState.find(p => getPromptHash(p.messages) === promptHash)
    return found ? found.id : ""
  }

  // Update handleSwitchPromptTemplate to use ensureAtLeastOneUserMessage
  const handleSwitchPromptTemplate = (promptId: string, templateId: string) => {
    const template = getPromptTemplateById(templateId)
    if (template) {
      updatePlaygroundPrompt(promptId, "title", template.title)
      updatePlaygroundPrompt(promptId, "messages", template.messages.map((msg: any, index: number) => ({
        id: (index + 1).toString(),
        role: msg.role,
        content: msg.content
      })))
      updatePlaygroundPrompt(promptId, "model", "gpt-4o")
    }
  }

  // Collapsible state per prompt card
  const [substitutedOpen, setSubstitutedOpen] = useState<{ [id: string]: boolean }>({})
  const toggleSubstituted = (id: string) => {
    setSubstitutedOpen(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Add state for advanced sync in playground compare mode
  const [syncUserMessage, setSyncUserMessage] = useState(false)
  const [unsyncedPromptIds, setUnsyncedPromptIds] = useState<string[]>([])

  // Add state for collapsible sections per prompt
  const [messagesOpenMap, setMessagesOpenMap] = useState<{ [id: string]: boolean }>({})
  const [responseOpenMap, setResponseOpenMap] = useState<{ [id: string]: boolean }>({})

  // Helper to toggle messages section
  const toggleMessagesOpen = (id: string) => {
    setMessagesOpenMap(prev => ({ ...prev, [id]: !prev[id] }))
  }
  // Helper to toggle response section
  const toggleResponseOpen = (id: string) => {
    setResponseOpenMap(prev => ({ ...prev, [id]: !prev[id] }))
  }
  // Helper to auto-expand response section when response is received
  useEffect(() => {
    playgroundPrompts.forEach(p => {
      if (p.response && !responseOpenMap[p.id]) {
        setResponseOpenMap(prev => ({ ...prev, [p.id]: true }))
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playgroundPrompts.map(p => p.response).join(",")])

  // Helper functions for copying prompt messages
  const copyMessagesAsText = (messages: PromptMessage[]) => {
    const textContent = messages.map(msg => {
      const contentText = typeof msg.content === 'string' 
        ? msg.content 
        : getMessageTextContent(msg.content)
      return `${msg.role.toUpperCase()}: ${contentText}`
    }).join('\n\n')
    navigator.clipboard.writeText(textContent)
    toast({ title: "Messages copied as text!", description: "Prompt messages copied to clipboard" })
  }

  const copyMessagesAsJSON = (messages: PromptMessage[]) => {
    // Convert to OpenAI-compatible format (remove id field)
    const openAIFormat = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    const jsonContent = JSON.stringify(openAIFormat, null, 2)
    navigator.clipboard.writeText(jsonContent)
    toast({ title: "Messages copied as JSON!", description: "OpenAI-compatible format copied to clipboard" })
  }

  // Helper function to add image to message content
  const addImageToMessage = (promptId: string, messageId: string, imageUrl: string) => {
    setPlaygroundPrompts(prompts =>
      prompts.map(p => {
        if (p.id === promptId) {
          return {
            ...p,
            messages: p.messages.map(m => {
              if (m.id === messageId) {
                const newImageContent: PromptMessageContent = {
                  type: "image_url",
                  image_url: { url: imageUrl }
                }
                
                if (typeof m.content === 'string') {
                  // Convert string content to array with text and image
                  return {
                    ...m,
                    content: [
                      { type: "text", text: m.content },
                      newImageContent
                    ]
                  }
                } else {
                  // Add image to existing array content
                  return {
                    ...m,
                    content: [...m.content, newImageContent]
                  }
                }
              }
              return m
            })
          }
        }
        return p
      })
    )
  }

  // Helper function to remove image from message content
  const removeImageFromMessage = (promptId: string, messageId: string, imageIndex: number) => {
    setPlaygroundPrompts(prompts =>
      prompts.map(p => {
        if (p.id === promptId) {
          return {
            ...p,
            messages: p.messages.map(m => {
              if (m.id === messageId && typeof m.content !== 'string') {
                const contentArray = m.content as PromptMessageContent[]
                const filteredContent = contentArray.filter((item, index) => {
                  if (item.type === 'image_url') {
                    // Count image items to find the right one to remove
                    const imageItems = contentArray.filter((contentItem: PromptMessageContent, contentIndex: number) => 
                      contentIndex < index && contentItem.type === 'image_url'
                    )
                    return imageItems.length !== imageIndex
                  }
                  return true
                })
                
                // If only text remains and it's the only item, convert back to string
                if (filteredContent.length === 1 && filteredContent[0].type === 'text') {
                  return {
                    ...m,
                    content: filteredContent[0].text || ''
                  }
                }
                
                return {
                  ...m,
                  content: filteredContent
                }
              }
              return m
            })
          }
        }
        return p
      })
    )
  }

  // Remove auto-load logic from useEffect
  useEffect(() => {
    // No auto-load; just check tab switch
  }, [currentPromptHubTab])

  // 1. Add state for view mode
  const [promptViewMode, setPromptViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    if (
      currentPromptHubTab === "playground" &&
      playgroundPrompts.length === 0 &&
      promptsState.length > 0
    ) {
      const defaultPrompt = promptsState.find(p => p.id === "0");
      if (defaultPrompt) {
        const now = Date.now().toString();
        setPlaygroundPrompts([
          {
            id: now,
            title: defaultPrompt.title,
            messages: defaultPrompt.messages.map((msg, idx) => ({
              id: now + '-' + idx,
              role: msg.role,
              content: msg.content
            })),
            model: "gpt-4o",
            response: "",
            isLoading: false,
            responseTime: 0,
          },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPromptHubTab, playgroundPrompts.length]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 flex-shrink-0">
        <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-mono text-foreground">PROMPT_HUB</h2>
        <p className="text-muted-foreground font-mono text-xs sm:text-sm">CENTRALIZED_PROMPT_LIBRARY_FOR_AI_WORKFLOWS</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleCreatePrompt}
            className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            CREATE_PROMPT
          </Button>
          <Button
            onClick={() => onQuickAction("show prompt analytics")}
            variant="outline"
                          className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            ANALYTICS
          </Button>
        </div>
      </div>

      {/* Create/Edit Prompt Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
          <PromptCreationWizard 
            onBack={handleBackToLibrary} 
            onComplete={isEditMode ? handlePromptUpdated : handlePromptCreated}
            isEditMode={isEditMode}
            editData={editPromptData}
          />
        </DialogContent>
      </Dialog>

      {/* Add to Playground Confirmation Dialog */}
      <Dialog open={showPlaygroundDialog} onOpenChange={setShowPlaygroundDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-mono text-foreground">PROMPT_ADDED_TO_PLAYGROUND</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm font-mono text-muted-foreground">
              "{pendingPlaygroundPrompt?.title}" has been added to your playground.
            </p>
            <p className="text-sm font-mono text-muted-foreground">
              Would you like to go to the playground to continue adding more prompts or test your prompts?
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleGoToPlayground}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
              >
                <Zap className="h-4 w-4 mr-2" />
                GO_TO_PLAYGROUND
              </Button>
              <Button
                onClick={handleStayInLibrary}
                variant="outline"
                className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
              >
                STAY_IN_LIBRARY
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Prompt Modal */}
      <Dialog open={isAddPromptModalOpen} onOpenChange={setIsAddPromptModalOpen}>
        <DialogContent className="max-w-full sm:max-w-[75vw] max-h-[90vh] sm:max-h-[75vh] overflow-hidden p-4 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-mono text-foreground">Add_Prompt_To_Playground</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={promptSearch}
              onChange={e => setPromptSearch(e.target.value)}
              placeholder="Search prompt templates..."
              className="font-mono text-sm border-primary"
            />
            {/* View toggle */}
            <div className="flex justify-end mb-2 gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={promptViewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      className={promptViewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-primary'}
                      onClick={() => setPromptViewMode('list')}
                      aria-label="List View"
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>List View</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={promptViewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      className={promptViewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-primary'}
                      onClick={() => setPromptViewMode('grid')}
                      aria-label="Grid View"
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Grid View</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* Prompt list/grid */}
            {promptViewMode === 'list' ? (
              <div className="max-h-[45vh] overflow-y-auto flex-1 flex-col gap-4 divide-y divide-border rounded border border-border bg-card px-2 py-2">
                {promptsState
                  .filter(p =>
                    !promptSearch.trim() ||
                    p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
                    p.description?.toLowerCase().includes(promptSearch.toLowerCase())
                  )
                  .map(p => (
                    <div
                      key={p.id}
                      className="p-5 hover:bg-accent cursor-pointer flex flex-col gap-2 rounded transition-colors"
                      onClick={() => handleAddPromptFromTemplate(p)}
                    >
                                              <span className="font-mono font-medium text-base text-foreground">{p.title}</span>
                        <span className="font-mono text-xs text-muted-foreground">{p.description}</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {p.tags?.map(tag => (
                                                        <Badge key={tag} className="bg-brand-orange/10 text-brand-orange font-mono text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                {promptsState.filter(p =>
                  !promptSearch.trim() ||
                  p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
                  p.description?.toLowerCase().includes(promptSearch.toLowerCase())
                ).length === 0 && (
                  <div className="p-3 text-center text-xs text-muted-foreground font-mono">No templates found.</div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-h-[40vh] overflow-y-auto px-1 sm:px-2 py-1 sm:py-2">
                {promptsState
                  .filter(p =>
                    !promptSearch.trim() ||
                    p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
                    p.description?.toLowerCase().includes(promptSearch.toLowerCase())
                  )
                  .map(p => (
                    <div
                      key={p.id}
                      className="border border-border rounded-lg p-4 sm:p-6 hover:border-primary cursor-pointer flex flex-col gap-2 bg-card transition-colors"
                      onClick={() => handleAddPromptFromTemplate(p)}
                    >
                                              <span className="font-mono font-medium text-base sm:text-lg text-foreground">{p.title}</span>
                        <span className="font-mono text-xs sm:text-sm text-muted-foreground">{p.description}</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {p.tags?.map(tag => (
                          <Badge key={tag} className="bg-brand-orange/10 text-brand-orange font-mono text-[10px] sm:text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                {promptsState.filter(p =>
                  !promptSearch.trim() ||
                  p.title.toLowerCase().includes(promptSearch.toLowerCase()) ||
                  p.description?.toLowerCase().includes(promptSearch.toLowerCase())
                ).length === 0 && (
                  <div className="p-3 text-center text-xs text-muted-foreground font-mono col-span-full">No templates found.</div>
                )}
              </div>
            )}
            <div className="flex justify-end pt-2">
              <Button onClick={handleAddBlankPrompt} className="bg-primary text-primary-foreground font-mono text-xs">
                Start with a default prompt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-hidden px-6 pb-6">
        <Tabs value={currentPromptHubTab} onValueChange={setCurrentPromptHubTab} className="h-full flex flex-col">
          <TabsList className="bg-card border border-border w-full sm:w-auto flex-shrink-0">
            <TabsTrigger
              value="library"
              className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">LIBRARY</span>
              <span className="sm:hidden">LIB</span>
            </TabsTrigger>
            <TabsTrigger
              value="playground"
              className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
            >
              <Zap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">PLAYGROUND</span>
              <span className="sm:hidden">PLAY</span>
            </TabsTrigger>
            <TabsTrigger
              value="my-prompts"
              className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
            >
              <Star className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">MY_PROMPTS</span>
              <span className="sm:hidden">MINE</span>
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
            >
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">ACTIVITY</span>
              <span className="sm:hidden">ACT</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">ANALYTICS</span>
              <span className="sm:hidden">STATS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex-col min-h-[65vh] overflow-auto mt-4">
            {/* Enhanced Search and Filters */}
            <div className="space-y-4 mb-4 flex-shrink-0">
              {/* Main Search and Basic Filters */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="SEARCH_PROMPTS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 font-mono text-sm border-primary bg-background"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full lg:w-48 font-mono text-sm border-primary">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {promptCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="font-mono text-sm">
                          {category.name} ({category.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {showAdvancedFilters ? "HIDE_FILTERS" : "MORE_FILTERS"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    CLEAR
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="bg-card border border-border rounded-lg p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Sort Options */}
                    <div>
                      <Label className="font-mono text-xs text-foreground mb-2 block">SORT_BY</Label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="font-mono text-xs border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usage" className="font-mono text-xs">Usage</SelectItem>
                          <SelectItem value="rating" className="font-mono text-xs">Rating</SelectItem>
                          <SelectItem value="title" className="font-mono text-xs">Title</SelectItem>
                          <SelectItem value="date" className="font-mono text-xs">Last Updated</SelectItem>
                          <SelectItem value="author" className="font-mono text-xs">Author</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="font-mono text-xs text-foreground mb-2 block">ORDER</Label>
                      <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                        <SelectTrigger className="font-mono text-xs border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc" className="font-mono text-xs">Descending</SelectItem>
                          <SelectItem value="asc" className="font-mono text-xs">Ascending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Author Filter */}
                    <div>
                      <Label className="font-mono text-xs text-foreground mb-2 block">AUTHOR</Label>
                      <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                        <SelectTrigger className="font-mono text-xs border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="font-mono text-xs">All Authors</SelectItem>
                          {allAuthors.map((author) => (
                            <SelectItem key={author} value={author} className="font-mono text-xs">
                              {author}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <Label className="font-mono text-xs text-foreground mb-2 block">STATUS</Label>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="font-mono text-xs border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="font-mono text-xs">All Prompts</SelectItem>
                          <SelectItem value="favorite" className="font-mono text-xs">Favorites</SelectItem>
                          <SelectItem value="public" className="font-mono text-xs">Public</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tags Filter */}
                  <div>
                    <Label className="font-mono text-xs text-foreground mb-2 block">TAGS</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <Button
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            if (selectedTags.includes(tag)) {
                              setSelectedTags(selectedTags.filter(t => t !== tag))
                            } else {
                              setSelectedTags([...selectedTags, tag])
                            }
                          }}
                          className={`font-mono text-xs ${
                            selectedTags.includes(tag)
                              ? "bg-primary text-primary-foreground"
                              : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                          }`}
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                <span>SHOWING {paginatedPrompts.length} OF {promptsState.length} PROMPTS</span>
                {selectedTags.length > 0 && (
                  <span>FILTERED BY {selectedTags.length} TAG{selectedTags.length > 1 ? 'S' : ''}</span>
                )}
              </div>
            </div>

            {/* Prompt Grid - Using Radix UI Grid */}
                            <div className="flex-1 overflow-auto border border-border rounded-lg bg-card flex flex-col">
              <div className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max">
                  {paginatedPrompts.map((prompt) => (
                    <Card
                      key={prompt.id}
                      className="border-border bg-card hover:border-primary transition-colors"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="font-mono text-sm text-foreground truncate">
                              {prompt.title}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground font-mono mt-1 line-clamp-2">
                              {prompt.description}
                            </p>
                          </div>
                          {prompt.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-1 min-h-[24px]">
                          {prompt.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="font-mono text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {prompt.tags.length > 3 && (
                            <Badge variant="outline" className="font-mono text-xs">
                              +{prompt.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-posthog-gray">
                          <div>
                            <span className="font-medium">USAGE:</span> {prompt.usage}
                          </div>
                          <div>
                            <span className="font-medium">RATING:</span> ⭐ {prompt.rating}
                          </div>
                          <div>
                            <span className="font-medium">VERSION:</span> {prompt.version}
                          </div>
                          <div className="truncate">
                            <span className="font-medium">UPDATED:</span> {prompt.lastUpdated}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  onClick={() => handleUsePrompt(prompt)}
                                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  USE
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Use this prompt</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => loadPromptToPlayground(prompt)}
                                  disabled={playgroundPrompts.length >= 5}
                                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                                >
                                  <Zap className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Add to Playground</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCopyPrompt(prompt)}
                                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy template</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={() => handleEditPrompt(prompt)}
                                  variant="outline"
                                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                                >
                                  <Edit className="h-3 w-3 mr-2" />
                                  EDIT
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit prompt</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {paginatedPrompts.length === 0 && (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Bot className="h-12 w-12 mx-auto mb-4 text-posthog-gray" />
                      <p className="text-posthog-gray font-mono text-sm">NO_PROMPTS_FOUND</p>
                      <p className="text-posthog-gray font-mono text-xs mt-1">Try adjusting your search or filters</p>
                      <Button
                        onClick={clearAllFilters}
                        variant="outline"
                        size="sm"
                        className="mt-2 font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                      >
                        CLEAR_ALL_FILTERS
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="border-t border-posthog-cream-dark p-4 bg-posthog-cream flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono text-posthog-gray">
                      SHOWING {startIndex + 1}-{Math.min(endIndex, sortedPrompts.length)} OF {sortedPrompts.length}{" "}
                      PROMPTS
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                      >
                        PREV
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                size="sm"
                                variant={page === currentPage ? "default" : "outline"}
                                onClick={() => setCurrentPage(page)}
                                className={`font-mono text-xs w-8 h-8 p-0 ${
                                  page === currentPage
                                    ? "bg-posthog-orange text-white"
                                    : "border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                                }`}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <span key={page} className="text-posthog-gray font-mono text-xs px-1">
                                ...
                              </span>
                            )
                          }
                          return null
                        })}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                      >
                        NEXT
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="playground" className="flex-1 min-h-[65vh] flex-col overflow-auto mt-4 relative">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 flex-shrink-0">
              <div className="flex-shrink-0">
                <h3 className="text-lg font-bold font-mono text-foreground">PROMPT_PLAYGROUND</h3>
                <p className="text-xs font-mono text-muted-foreground">TEST_AND_COMPARE_PROMPTS_ACROSS_MODELS</p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 lg:gap-4 items-start md:items-center w-full lg:w-auto">
                {/* Mode Toggle with Switch */}
                <TooltipProvider>
                  <div className="flex items-center space-x-2 md:space-x-3 bg-card border border-border rounded-lg px-3 md:px-4 py-2 w-full md:w-auto justify-center md:justify-start">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1 md:space-x-2 cursor-help">
                          <Play className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-xs font-mono text-foreground hidden sm:inline">TEST_SINGLE</Label>
                          <Label className="text-xs font-mono text-foreground sm:hidden">SINGLE</Label>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-mono text-xs font-medium mb-1">Single Prompt Testing</p>
                          <p className="font-mono text-xs text-gray-600">
                            Focus on testing one prompt with full details, variable substitution preview, and detailed response analysis.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                    <Switch
                      checked={playgroundMode === "compare"}
                      onCheckedChange={(checked) => setPlaygroundMode(checked ? "compare" : "single")}
                      className="data-[state=checked]:bg-primary"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1 md:space-x-2 cursor-help">
                          <Label className="text-xs font-mono text-foreground hidden sm:inline">COMPARE_MULTIPLE</Label>
                          <Label className="text-xs font-mono text-foreground sm:hidden">COMPARE</Label>
                          <Zap className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="max-w-xs">
                          <p className="font-mono text-xs font-medium mb-1">Multiple Prompt Comparison</p>
                          <p className="font-mono text-xs text-gray-600">
                            Compare up to 5 prompts side-by-side with compact cards for quick A/B testing and performance comparison.
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TooltipProvider>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full md:w-auto">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleAddPromptClick}
                          disabled={playgroundMode === "single" ? playgroundPrompts.length >= 1 : playgroundPrompts.length >= 5}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs w-full sm:w-auto"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">{playgroundMode === "single" ? "ADD_PROMPT" : `ADD_PROMPT (${playgroundPrompts.length}/5)`}</span>
                          <span className="sm:hidden">{playgroundMode === "single" ? "ADD" : `ADD (${playgroundPrompts.length}/5)`}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {playgroundMode === "single" 
                          ? "Add a prompt to test individually" 
                          : playgroundPrompts.length >= 5 
                            ? "Maximum 5 prompts allowed in playground" 
                            : "Add a new prompt to compare"
                        }
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={clearAllResponses}
                          variant="outline"
                          className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent w-full sm:w-auto"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">CLEAR_ALL</span>
                          <span className="sm:hidden">CLEAR</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear all prompt responses and reset playground</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Sync Toggle - Only show in compare mode */}
                {playgroundMode === "compare" && (
                  <TooltipProvider>
                    <div className="flex items-center gap-2 md:gap-3 bg-card border border-border rounded-lg px-3 md:px-4 py-2 w-full md:w-auto justify-center md:justify-start">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Switch
                            checked={syncUserMessage}
                            onCheckedChange={setSyncUserMessage}
                            className="data-[state=checked]:bg-primary border-primary h-5 w-9 min-w-0 p-0"
                            id="sync-user-message-toggle"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          When enabled, editing the user message in any prompt will update all synced prompts. Disable to edit prompts independently.
                        </TooltipContent>
                      </Tooltip>
                      <Label htmlFor="sync-user-message-toggle" className="font-mono text-xs text-foreground font-medium">
                        <span className="hidden md:inline">Sync user message across all prompts</span>
                        <span className="md:hidden">Sync messages</span>
                      </Label>
                    </div>
                  </TooltipProvider>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-auto space-y-4">
              {/* Prompt Display - Single Mode */}
              {playgroundMode === "single" && playgroundPrompts.length > 0 && (
                <Card className="border-border bg-card">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {/* Prompt template switch dropdown replaces title */}
                      <Select
                        value={getPromptTemplateIdForPrompt(playgroundPrompts[0])}
                        onValueChange={val => handleSwitchPromptTemplate(playgroundPrompts[0].id, val)}
                      >
                        <SelectTrigger className="w-[220px] font-mono text-sm border-primary">
                          <SelectValue>{
                            (() => {
                              const selectedId = getPromptTemplateIdForPrompt(playgroundPrompts[0]);
                              const selected = promptsState.find(p => p.id === selectedId);
                              return selected ? selected.title : "Select a prompt";
                            })()
                          }</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {promptsState.map(p => (
                            <SelectItem key={p.id} value={p.id} className="font-mono text-sm">
                              {p.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge className="mt-1 bg-primary text-primary-foreground font-mono text-xs">
                        SINGLE_PROMPT_TEST
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Save to Library icon button: only show if not in library */}
                      {!isPromptInLibrary(playgroundPrompts[0]) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => handleOpenSavePromptModal(playgroundPrompts[0])}
                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                              >
                                <Bookmark className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Save to Library</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removePromptFromPlayground(playgroundPrompts[0].id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row gap-6 md:gap-8">
                    {/* Left: Prompt messages and controls */}
                    <div className="flex-1 min-w-0 flex flex-col gap-6">
                      {/* Model Selection */}
                      <div>
                        <label className="block text-xs font-medium font-mono text-foreground mb-1">MODEL</label>
                        <Select
                          value={playgroundPrompts[0].model}
                          onValueChange={(value) => updatePlaygroundPrompt(playgroundPrompts[0].id, "model", value)}
                        >
                          <SelectTrigger className="font-mono text-xs border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableModels.map((model) => (
                              <SelectItem key={model.id} value={model.id} className="font-mono text-xs">
                                <div>
                                  <div className="font-medium">{model.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {model.provider} - {model.description}
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Prompt Messages */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-xs font-medium font-mono text-foreground">
                            PROMPT_MESSAGES
                          </label>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyMessagesAsText(playgroundPrompts[0].messages)}
                                    className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                                  >
                                    <Copy className="h-3 w-3 mr-1" />
                                    COPY_TEXT
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy messages as plain text</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copyMessagesAsJSON(playgroundPrompts[0].messages)}
                                    className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                                  >
                                    <Download className="h-3 w-3 mr-1" />
                                    COPY_JSON
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy messages as OpenAI-compatible JSON</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addMessageToPrompt(playgroundPrompts[0].id)}
                              className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              ADD_MESSAGE
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {playgroundPrompts[0].messages.map((message, index) => (
                            <div key={message.id} className="border border-border rounded-lg p-3 bg-muted">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-primary text-primary-foreground font-mono text-xs">MESSAGE_{index + 1}</Badge>
                                  {typeof message.content !== 'string' && message.content.some(item => item.type === 'image_url') && (
                                    <Badge className="bg-blue-500 text-white font-mono text-xs">IMAGE</Badge>
                                  )}
                                  <Select
                                    value={message.role}
                                    onValueChange={(value) => updatePromptMessage(playgroundPrompts[0].id, message.id, "role", value)}
                                  >
                                    <SelectTrigger className="w-28 h-6 font-mono text-xs border-primary bg-background">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="system" className="font-mono text-xs">System</SelectItem>
                                      <SelectItem value="user" className="font-mono text-xs">User</SelectItem>
                                      <SelectItem value="assistant" className="font-mono text-xs">Assistant</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                {playgroundPrompts[0].messages.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeMessageFromPrompt(playgroundPrompts[0].id, message.id)}
                                    className="h-5 w-5 p-0 text-muted-foreground hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <Textarea
                                value={typeof message.content === 'string' ? message.content : getMessageTextContent(message.content)}
                                onChange={(e) => updatePromptMessage(playgroundPrompts[0].id, message.id, "content", e.target.value)}
                                className="min-h-[80px] font-mono text-xs border-primary bg-background"
                                placeholder={`Enter ${message.role} message content...`}
                              />
                              
                              {/* Image content display and add image button */}
                              {typeof message.content !== 'string' && message.content.some(item => item.type === 'image_url') && (
                                <div className="mt-2 space-y-2">
                                  {message.content.map((item, itemIndex) => {
                                    if (item.type === 'image_url') {
                                      return (
                                        <div key={itemIndex} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                                          <img 
                                            src={item.image_url?.url} 
                                            alt="Message image" 
                                            className="w-16 h-16 object-cover rounded border"
                                            onError={(e) => {
                                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNEM0Q3RDAiLz4KPHBhdGggZD0iTTI0IDI4TDMwIDM0TDM2IDI4TDI0IDE2VjI4WiIgZmlsbD0iI0QzRDdEMCIvPgo8L3N2Zz4K'
                                              }}
                                            />
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs text-gray-600 truncate">{item.image_url?.url}</p>
                                            </div>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => {
                                                if (typeof message.content !== 'string') {
                                                  const imageIndex = message.content.filter((contentItem: PromptMessageContent, contentIndex: number) => contentIndex < itemIndex && contentItem.type === 'image_url').length
                                                  removeImageFromMessage(playgroundPrompts[0].id, message.id, imageIndex)
                                                }
                                              }}
                                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        )
                                      }
                                      return null
                                    })}
                                </div>
                              )}
                              
                              {/* Add Image Button - Only for user messages */}
                              {message.role === 'user' && (
                                <div className="mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const imageUrl = prompt('Enter image URL:')
                                      if (imageUrl && imageUrl.trim()) {
                                        addImageToMessage(playgroundPrompts[0].id, message.id, imageUrl.trim())
                                      }
                                    }}
                                    className="font-mono text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    ADD_IMAGE
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {/* Show detected variables */}
                        {(() => {
                          const variables = extractTemplateVariables(playgroundPrompts[0].messages)
                          return variables.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              <span className="text-xs font-mono text-posthog-gray">Variables:</span>
                              {variables.map((variable, index) => (
                                <Badge key={index} variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200">
                                  {variable}
                                </Badge>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                    {/* Right: Variables and Response */}
                    <div className="w-full md:w-[340px] lg:w-[400px] flex flex-col gap-6">
                      {/* Variables Section */}
                      {(() => {
                        const variables = extractTemplateVariables(playgroundPrompts[0].messages)
                        return variables.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            <span className="text-xs font-mono text-posthog-gray">Variables:</span>
                            {variables.map((variable, index) => (
                              <Badge key={index} variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200">
                                {variable}
                              </Badge>
                            ))}
                          </div>
                        )
                      })()}
                      {/* Response Section */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium font-mono text-posthog-black">RESPONSE</label>
                          {playgroundPrompts[0].responseTime > 0 && (
                            <span className="text-xs font-mono text-posthog-gray">
                              {Math.round(playgroundPrompts[0].responseTime)}ms
                            </span>
                          )}
                        </div>
                        <div className="min-h-[200px] p-3 border border-posthog-cream-dark rounded-md bg-posthog-cream">
                          {playgroundPrompts[0].isLoading ? (
                            <div className="flex items-center justify-center h-full">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-posthog-orange border-t-transparent rounded-full animate-spin" />
                                <span className="font-mono text-xs text-posthog-gray">GENERATING_RESPONSE...</span>
                              </div>
                            </div>
                          ) : playgroundPrompts[0].response ? (
                            <div className="font-mono text-xs text-posthog-black whitespace-pre-wrap">
                              {playgroundPrompts[0].response}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="font-mono text-xs text-posthog-gray">NO_RESPONSE_YET</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prompt Comparison Grid - Compare Mode */}
              {playgroundMode === "compare" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {playgroundPrompts.map((playgroundPrompt, index) => {
                    const isUnsynced = unsyncedPromptIds.includes(playgroundPrompt.id)
                    const messagesOpen = messagesOpenMap[playgroundPrompt.id] !== false // default true
                    const responseOpen = responseOpenMap[playgroundPrompt.id] === true // default false
                    return (
                      <Card key={playgroundPrompt.id} className="border-posthog-cream-dark bg-white">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between relative">
                          {/* Absolutely positioned close button in top right */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removePromptFromPlayground(playgroundPrompt.id)}
                            className="h-6 w-6 p-0 text-posthog-gray hover:text-red-500 absolute top-2 right-2 z-10"
                            aria-label="Remove prompt"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="flex-1 min-w-0">
                            {/* Badge above dropdown/select */}
                            <Badge className="bg-posthog-orange text-white font-mono text-xs mb-2">
                              PROMPT_{index + 1}
                            </Badge>
                            {/* Row: Dropdown/select */}
                            <div className="flex items-center gap-2">
                              <Select
                                value={getPromptTemplateIdForPrompt(playgroundPrompt)}
                                onValueChange={val => handleSwitchPromptTemplate(playgroundPrompt.id, val)}
                              >
                                <SelectTrigger className="w-[220px] font-mono text-sm border-posthog-orange">
                                  <SelectValue>{
                                    (() => {
                                      const selectedId = getPromptTemplateIdForPrompt(playgroundPrompt);
                                      const selected = promptsState.find(p => p.id === selectedId);
                                      return selected ? selected.title : "Select a prompt";
                                    })()
                                  }</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {promptsState.map(p => (
                                    <SelectItem key={p.id} value={p.id} className="font-mono text-sm">
                                      {p.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {/* Per-prompt sync/unsync toggle below dropdown */}
                            <div className="flex items-center gap-2 mt-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Switch
                                      checked={!isUnsynced}
                                      onCheckedChange={checked => {
                                        setUnsyncedPromptIds(ids =>
                                          checked
                                            ? ids.filter(id => id !== playgroundPrompt.id)
                                            : [...ids, playgroundPrompt.id]
                                        )
                                        // If resyncing, copy the current global user message to this prompt
                                        if (checked && syncUserMessage) {
                                          const globalUserMsg = playgroundPrompts.find(p => !unsyncedPromptIds.includes(p.id))?.messages.find(m => m.role === "user")?.content || ""
                                          setPlaygroundPrompts(prompts =>
                                            prompts.map(p =>
                                              p.id === playgroundPrompt.id
                                                ? {
                                                    ...p,
                                                    messages: p.messages.map(m =>
                                                      m.role === "user" ? { ...m, content: globalUserMsg } : m
                                                    )
                                                  }
                                                : p
                                            )
                                          )
                                        }
                                      }}
                                      className="data-[state=checked]:bg-posthog-orange border-posthog-orange h-5 w-9 min-w-0 p-0"
                                      aria-label={isUnsynced ? "Resync this prompt" : "Unsync this prompt"}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    {isUnsynced
                                      ? "Resync this prompt to use the global user message."
                                      : "Unsync this prompt to edit its user message independently."}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Badge className={`font-mono text-xs ${isUnsynced ? "bg-gray-400" : "bg-posthog-orange"}`}>{isUnsynced ? "Unsynced" : "Synced"}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Save to Library icon button: only show if not in library */}
                            {!isPromptInLibrary(playgroundPrompt) && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => handleOpenSavePromptModal(playgroundPrompt)}
                                      className="border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white h-7 w-7 p-0"
                                      style={{ minWidth: 0, minHeight: 0 }}
                                    >
                                      <Bookmark className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Save to Library</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Model Selection */}
                          <div>
                            <label className="block text-xs font-medium font-mono text-posthog-black mb-1">MODEL</label>
                            <Select
                              value={playgroundPrompt.model}
                              onValueChange={(value) => updatePlaygroundPrompt(playgroundPrompt.id, "model", value)}
                            >
                              <SelectTrigger className="font-mono text-xs border-posthog-orange">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {availableModels.map((model) => (
                                  <SelectItem key={model.id} value={model.id} className="font-mono text-xs">
                                    <div>
                                      <div className="font-medium">{model.name}</div>
                                      <div className="text-xs text-posthog-gray">
                                        {model.provider} - {model.description}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Messages Collapsible Section */}
                          <div className="border-b border-posthog-cream-dark pb-2">
                            <button
                              className="flex items-center gap-2 font-mono text-xs text-posthog-black focus:outline-none"
                              onClick={() => toggleMessagesOpen(playgroundPrompt.id)}
                              aria-expanded={messagesOpen}
                              style={{ userSelect: 'none' }}
                            >
                              {messagesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                              MESSAGES
                            </button>
                            <div
                              className={`transition-all duration-200 overflow-hidden ${messagesOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                              {messagesOpen && (
                                <div className="mt-2">
                                  {/* ...existing messages UI... */}
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-medium font-mono text-posthog-black">
                                      PROMPT_MESSAGES
                                    </label>
                                    <div className="flex items-center gap-1">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => copyMessagesAsText(playgroundPrompt.messages)}
                                              className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent h-6 px-2"
                                            >
                                              <Copy className="h-3 w-3" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Copy as text</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => copyMessagesAsJSON(playgroundPrompt.messages)}
                                              className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent h-6 px-2"
                                            >
                                              <Download className="h-3 w-3" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>Copy as JSON</TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addMessageToPrompt(playgroundPrompt.id)}
                                        className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent h-6 px-2"
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {playgroundPrompt.messages.map((message, msgIndex) => (
                                      <div key={message.id} className="border border-posthog-cream-dark rounded p-2 bg-posthog-cream">
                                        <div className="flex items-center justify-between mb-1">
                                          <div className="flex items-center gap-1">
                                            <Badge className="bg-posthog-orange text-white font-mono text-xs text-[10px] px-1 py-0">
                                              {message.role.toUpperCase()}
                                            </Badge>
                                            {typeof message.content !== 'string' && message.content.some(item => item.type === 'image_url') && (
                                              <Badge className="bg-blue-500 text-white font-mono text-xs text-[10px] px-1 py-0">IMG</Badge>
                                            )}
                                            <Select
                                              value={message.role}
                                              onValueChange={(value) => updatePromptMessage(playgroundPrompt.id, message.id, "role", value)}
                                            >
                                              <SelectTrigger className="w-28 h-5 font-mono text-xs border-posthog-orange bg-white">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="system" className="font-mono text-xs">System</SelectItem>
                                                <SelectItem value="user" className="font-mono text-xs">User</SelectItem>
                                                <SelectItem value="assistant" className="font-mono text-xs">Assistant</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          {playgroundPrompt.messages.length > 1 && (
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              onClick={() => removeMessageFromPrompt(playgroundPrompt.id, message.id)}
                                              className="h-4 w-4 p-0 text-posthog-gray hover:text-red-500"
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          )}
                                        </div>
                                        <Textarea
                                          value={typeof message.content === 'string' ? message.content : getMessageTextContent(message.content)}
                                          onChange={(e) => updatePromptMessage(playgroundPrompt.id, message.id, "content", e.target.value)}
                                          className="min-h-[60px] font-mono text-xs border-posthog-orange bg-white"
                                          placeholder={`Enter ${message.role} message content...`}
                                        />
                                        
                                        {/* Image content display and add image button for compare mode */}
                                        {typeof message.content !== 'string' && message.content.some(item => item.type === 'image_url') && (
                                          <div className="mt-1 space-y-1">
                                            {message.content.map((item, itemIndex) => {
                                              if (item.type === 'image_url') {
                                                return (
                                                  <div key={itemIndex} className="flex items-center gap-1 p-1 bg-gray-50 rounded border">
                                                    <img 
                                                      src={item.image_url?.url} 
                                                      alt="Message image" 
                                                      className="w-8 h-8 object-cover rounded border"
                                                      onError={(e) => {
                                                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0NFY0NEgyMFYyMFoiIGZpbGw9IiNEM0Q3RDAiLz4KPHBhdGggZD0iTTI0IDI4TDMwIDM0TDM2IDI4TDI0IDE2VjI4WiIgZmlsbD0iI0QzRDdEMCIvPgo8L3N2Zz4K'
                                                      }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                      <p className="text-[10px] text-gray-600 truncate">{item.image_url?.url}</p>
                                                    </div>
                                                    <Button
                                                      size="sm"
                                                      variant="ghost"
                                                      onClick={() => {
                                                        if (typeof message.content !== 'string') {
                                                          const imageIndex = message.content.filter((contentItem: PromptMessageContent, contentIndex: number) => contentIndex < itemIndex && contentItem.type === 'image_url').length
                                                          removeImageFromMessage(playgroundPrompt.id, message.id, imageIndex)
                                                        }
                                                      }}
                                                      className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                                                    >
                                                      <X className="h-2 w-2" />
                                                    </Button>
                                                  </div>
                                                )
                                              }
                                              return null
                                            })}
                                          </div>
                                        )}
                                        
                                        {/* Add Image Button - Only for user messages in compare mode */}
                                        {message.role === 'user' && (
                                          <div className="mt-1">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => {
                                                const imageUrl = prompt('Enter image URL:')
                                                if (imageUrl && imageUrl.trim()) {
                                                  addImageToMessage(playgroundPrompt.id, message.id, imageUrl.trim())
                                                }
                                              }}
                                              className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent h-5 px-2"
                                            >
                                              <Plus className="h-2 w-2 mr-1" />
                                              IMG
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  {/* Show detected variables */}
                                  {(() => {
                                    const variables = extractTemplateVariables(playgroundPrompt.messages)
                                    return variables.length > 0 && (
                                      <div className="mt-2 flex flex-wrap gap-1">
                                        <span className="text-xs font-mono text-posthog-gray">Variables:</span>
                                        {variables.map((variable, index) => (
                                          <Badge key={index} variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200">
                                            {variable}
                                          </Badge>
                                        ))}
                                      </div>
                                    )
                                  })()}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Response Collapsible Section */}
                          <div>
                            <button
                              className="flex items-center gap-2 font-mono text-xs text-posthog-black focus:outline-none"
                              onClick={() => toggleResponseOpen(playgroundPrompt.id)}
                              aria-expanded={responseOpen}
                              style={{ userSelect: 'none' }}
                            >
                              {responseOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                              RESPONSE
                            </button>
                            <div
                              className={`transition-all duration-200 overflow-hidden ${responseOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                              {responseOpen && (
                                <div className="min-h-[120px] p-3 border border-posthog-cream-dark rounded-md bg-posthog-cream mt-2">
                                  {playgroundPrompt.isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-posthog-orange border-t-transparent rounded-full animate-spin" />
                                        <span className="font-mono text-xs text-posthog-gray">GENERATING...</span>
                                      </div>
                                    </div>
                                  ) : playgroundPrompt.response ? (
                                    <div className="font-mono text-xs text-posthog-black whitespace-pre-wrap">
                                      {playgroundPrompt.response}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-full">
                                      <span className="font-mono text-xs text-posthog-gray">NO_RESPONSE</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* ...rest of card content... */}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {playgroundPrompts.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <p className="font-mono text-lg text-posthog-gray">No prompt added to playground.</p>
                  <Button
                    className="bg-posthog-orange text-white font-mono text-sm px-6 py-2 rounded"
                    onClick={handleAddPromptClick}
                  >
                    Select a prompt to start
                  </Button>
                </div>
              )}
            </div>
            {/* Floating Run/Run All button */}
            {(playgroundMode === "single" && playgroundPrompts.length > 0) || (playgroundMode === "compare" && playgroundPrompts.length > 0) ? (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <Button
                  size="lg"
                  className="rounded-full px-6 py-3 w-64 min-w-[16rem] shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-base flex items-center gap-2 justify-center"
                  onClick={() => {
                    if (playgroundMode === "single") {
                      // Run single prompt
                      const prompt = playgroundPrompts[0]
                      updatePlaygroundPrompt(prompt.id, "isLoading", true)
                      setTimeout(() => {
                        const mockResponse = `Single response from ${availableModels.find((m) => m.id === prompt.model)?.name}:\n\nMessages sent to AI:\n${prompt.messages.map(m => {
                          const contentText = typeof m.content === 'string' 
                            ? m.content 
                            : getMessageTextContent(m.content)
                          return `${m.role.toUpperCase()}: ${contentText}`
                        }).join('\n\n')}\n\nDetailed analysis...`
                        updatePlaygroundPrompt(prompt.id, "response", mockResponse)
                        updatePlaygroundPrompt(prompt.id, "isLoading", false)
                        updatePlaygroundPrompt(prompt.id, "responseTime", Math.random() * 3000 + 500)
                      }, Math.random() * 2000 + 1000)
                    } else {
                      // Run all prompts
                      runAllPrompts()
                    }
                  }}
                  disabled={playgroundPrompts.some(p => p.isLoading)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  {playgroundMode === "single" ? "Run" : "Run All"}
                </Button>
              </div>
            ) : null}
          </TabsContent>

          <TabsContent value="my-prompts" className="flex-1 flex-col overflow-hidden mt-4">
            <Card className="border-posthog-cream-dark bg-white">
              <CardHeader>
                <CardTitle className="font-mono text-posthog-black">MY_PROMPTS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-posthog-gray" />
                  <p className="text-posthog-gray font-mono text-sm mb-4">NO_PERSONAL_PROMPTS_YET</p>
                  <Button
                    onClick={handleCreatePrompt}
                    className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    CREATE_YOUR_FIRST_PROMPT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="flex-1 flex-col overflow-hidden mt-4">
            <Card className="border-posthog-cream-dark bg-white">
              <CardHeader>
                <CardTitle className="font-mono text-posthog-black">RECENT_ACTIVITY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-posthog-cream rounded border border-posthog-cream-dark"
                    >
                      <div className="w-8 h-8 bg-posthog-orange rounded flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-posthog-black">
                          <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}
                          <span className="font-medium"> "{activity.prompt}"</span>
                        </p>
                        <p className="text-xs text-posthog-gray font-mono">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 flex-col overflow-hidden mt-4">
            <div className="overflow-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Key Metrics Cards */}
                <Card className="border-posthog-cream-dark bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-posthog-gray">TOTAL_PROMPTS</p>
                        <p className="text-2xl font-bold font-mono text-posthog-black">47</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-posthog-orange" />
                    </div>
                    <p className="text-xs font-mono text-green-600 mt-2">+12% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-posthog-cream-dark bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-posthog-gray">TOTAL_USAGE</p>
                        <p className="text-2xl font-bold font-mono text-posthog-black">1,247</p>
                      </div>
                      <Play className="h-8 w-8 text-posthog-orange" />
                    </div>
                    <p className="text-xs font-mono text-green-600 mt-2">+28% from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-posthog-cream-dark bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-posthog-gray">AVG_RATING</p>
                        <p className="text-2xl font-bold font-mono text-posthog-black">4.7</p>
                      </div>
                      <Star className="h-8 w-8 text-posthog-orange" />
                    </div>
                    <p className="text-xs font-mono text-green-600 mt-2">+0.3 from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-posthog-cream-dark bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono text-posthog-gray">ACTIVE_USERS</p>
                        <p className="text-2xl font-bold font-mono text-posthog-black">89</p>
                      </div>
                      <Bot className="h-8 w-8 text-posthog-orange" />
                    </div>
                    <p className="text-xs font-mono text-green-600 mt-2">+15% from last month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Most Popular Prompts */}
                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="font-mono text-posthog-black flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      MOST_POPULAR_PROMPTS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { name: "Code Review Assistant", usage: 234, trend: "+15%" },
                        { name: "Bug Analysis & Solution", usage: 189, trend: "+22%" },
                        { name: "API Documentation Generator", usage: 156, trend: "+8%" },
                        { name: "Architecture Review", usage: 98, trend: "+31%" },
                        { name: "Database Migration Helper", usage: 76, trend: "+12%" },
                      ].map((prompt, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-posthog-cream rounded">
                          <div className="flex-1">
                            <p className="font-mono text-sm text-posthog-black">{prompt.name}</p>
                            <p className="font-mono text-xs text-posthog-gray">{prompt.usage} uses</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 font-mono text-xs">{prompt.trend}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="font-mono text-posthog-black flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      CATEGORY_DISTRIBUTION
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { category: "Debugging", count: 15, percentage: 32 },
                        { category: "Code Review", count: 12, percentage: 26 },
                        { category: "Documentation", count: 8, percentage: 17 },
                        { category: "Architecture", count: 7, percentage: 15 },
                        { category: "Testing", count: 5, percentage: 10 },
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-mono text-sm text-posthog-black">{item.category}</span>
                            <span className="font-mono text-xs text-posthog-gray">{item.count} prompts</span>
                          </div>
                          <div className="w-full bg-posthog-cream rounded-full h-2">
                            <div
                              className="bg-posthog-orange h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
