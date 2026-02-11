"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, BookOpen, Code, Zap, CheckCircle, Clock, AlertTriangle, Target, GitBranch } from "lucide-react"

interface DeveloperPortalProps {
  onQuickAction: (command: string) => void
}

const onboardingTemplates = [
  {
    id: "frontend-developer",
    name: "Frontend Developer",
    description: "React, TypeScript, and modern frontend tooling",
    duration: "4 hours",
    steps: 8,
    completionRate: "92%",
    icon: Code,
  },
  {
    id: "backend-developer",
    name: "Backend Developer",
    description: "Node.js, APIs, databases, and microservices",
    duration: "6 hours",
    steps: 12,
    completionRate: "87%",
    icon: Zap,
  },
  {
    id: "fullstack-developer",
    name: "Full-Stack Developer",
    description: "Complete frontend and backend development stack",
    duration: "8 hours",
    steps: 15,
    completionRate: "78%",
    icon: Users,
  },
  {
    id: "platform-engineer",
    name: "Platform Engineer",
    description: "Infrastructure, DevOps, and platform tooling",
    duration: "10 hours",
    steps: 18,
    completionRate: "85%",
    icon: Target,
  },
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

const goldenPaths = [
  {
    id: "web-service",
    name: "Web Service",
    description: "Standard REST API with authentication, monitoring, and deployment",
    usage: "89%",
    services: 34,
    lastUpdated: "2 days ago",
    technologies: ["Node.js", "Express", "PostgreSQL", "Docker"],
  },
  {
    id: "frontend-app",
    name: "Frontend Application",
    description: "React application with TypeScript, testing, and CI/CD",
    usage: "76%",
    services: 12,
    lastUpdated: "1 week ago",
    technologies: ["React", "TypeScript", "Vite", "Jest"],
  },
  {
    id: "data-pipeline",
    name: "Data Pipeline",
    description: "Batch and streaming data processing with monitoring",
    usage: "65%",
    services: 8,
    lastUpdated: "3 days ago",
    technologies: ["Python", "Apache Kafka", "Apache Spark", "Airflow"],
  },
]

const knowledgeBase = [
  {
    category: "Getting Started",
    articles: [
      { title: "Developer Environment Setup", views: 1250, lastUpdated: "1 week ago" },
      { title: "Code Review Guidelines", views: 890, lastUpdated: "3 days ago" },
      { title: "Git Workflow and Branching", views: 2100, lastUpdated: "2 weeks ago" },
    ],
  },
  {
    category: "Architecture",
    articles: [
      { title: "Microservices Design Patterns", views: 750, lastUpdated: "1 week ago" },
      { title: "API Design Guidelines", views: 1100, lastUpdated: "4 days ago" },
      { title: "Database Schema Standards", views: 650, lastUpdated: "1 week ago" },
    ],
  },
  {
    category: "Platform Tools",
    articles: [
      { title: "Monitoring and Alerting Setup", views: 980, lastUpdated: "2 days ago" },
      { title: "CI/CD Pipeline Configuration", views: 1350, lastUpdated: "5 days ago" },
      { title: "Security Best Practices", views: 1800, lastUpdated: "1 week ago" },
    ],
  },
]

export default function DeveloperPortal({ onQuickAction }: DeveloperPortalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-posthog-black">DEVELOPER_PORTAL</h2>
          <p className="text-posthog-gray font-mono text-sm">ONBOARDING,_GOLDEN_PATHS,_AND_KNOWLEDGE_BASE</p>
        </div>
        <Button
          onClick={() => onQuickAction("check developer onboarding progress")}
          className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
        >
          <Users className="h-4 w-4 mr-2" />
          VIEW_ONBOARDING
        </Button>
      </div>

      <Tabs defaultValue="onboarding" className="space-y-4">
        <TabsList className="bg-white border border-posthog-cream-dark">
          <TabsTrigger
            value="onboarding"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            ONBOARDING
          </TabsTrigger>
          <TabsTrigger
            value="golden-paths"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            GOLDEN_PATHS
          </TabsTrigger>
          <TabsTrigger
            value="knowledge"
            className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
          >
            KNOWLEDGE_BASE
          </TabsTrigger>
        </TabsList>

        <TabsContent value="onboarding" className="space-y-6">
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
                    onClick={() => setSelectedTemplate(template)}
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
        </TabsContent>

        <TabsContent value="golden-paths" className="space-y-6">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="font-mono text-posthog-black">GOLDEN_PATHS</CardTitle>
              <p className="text-sm text-posthog-gray font-mono">STANDARDIZED_TEMPLATES_FOR_COMMON_SERVICE_PATTERNS</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {goldenPaths.map((path) => (
                  <Card key={path.id} className="border-posthog-cream-dark bg-posthog-cream">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-mono text-sm font-medium text-posthog-black">{path.name}</h4>
                          <p className="text-xs text-posthog-gray font-mono mt-1">{path.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold font-mono text-posthog-orange">{path.usage}</div>
                          <div className="text-xs font-mono text-posthog-gray">ADOPTION</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4 text-xs font-mono text-posthog-gray">
                          <span>{path.services} services using</span>
                          <span>Updated {path.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {path.technologies.map((tech) => (
                          <Badge key={tech} variant="outline" className="font-mono text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                          onClick={() => onQuickAction(`create service from ${path.name} template`)}
                        >
                          <GitBranch className="h-3 w-3 mr-1" />
                          USE_TEMPLATE
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                        >
                          <BookOpen className="h-3 w-3 mr-1" />
                          VIEW_DOCS
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card className="border-posthog-cream-dark bg-white">
            <CardHeader>
              <CardTitle className="font-mono text-posthog-black">KNOWLEDGE_BASE</CardTitle>
              <p className="text-sm text-posthog-gray font-mono">DOCUMENTATION,_GUIDES,_AND_BEST_PRACTICES</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {knowledgeBase.map((category) => (
                  <div key={category.category}>
                    <h4 className="font-mono text-sm font-medium text-posthog-black mb-3">
                      {category.category.toUpperCase()}
                    </h4>
                    <div className="space-y-2">
                      {category.articles.map((article, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-posthog-cream rounded border border-posthog-cream-dark hover:border-posthog-orange transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <BookOpen className="h-4 w-4 text-posthog-orange" />
                            <div>
                              <span className="font-mono text-sm text-posthog-black">{article.title}</span>
                              <div className="flex items-center gap-3 mt-1 text-xs font-mono text-posthog-gray">
                                <span>{article.views} views</span>
                                <span>Updated {article.lastUpdated}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                          >
                            READ
                          </Button>
                        </div>
                      ))}
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
