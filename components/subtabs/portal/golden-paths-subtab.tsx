import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { GitBranch, BookOpen, Github, ExternalLink, Star, GitFork, Calendar, Users, FileText, Link as LinkIcon, RefreshCw } from "lucide-react"

interface GoldenPathsSubtabProps {
  onQuickAction: (command: string) => void
}

interface GoldenPath {
  id: string
  name: string
  description: string
  usage: string
  services: number
  lastUpdated: string
  technologies: string[]
  source: 'github' | 'cookiecutter'
  repositoryUrl?: string
  templateUrl?: string
  stars?: number
  forks?: number
  version?: string
  author?: string
  lastSynced?: string
  documentationUrl?: string
  cookiecutterTemplate?: string
}

export const GoldenPathsSubtab: React.FC<GoldenPathsSubtabProps> = ({ onQuickAction }) => {
  const [selectedPath, setSelectedPath] = useState<GoldenPath | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const goldenPaths: GoldenPath[] = [
    {
      id: "web-service",
      name: "Web Service",
      description: "Standard REST API with authentication, monitoring, and deployment",
      usage: "89%",
      services: 34,
      lastUpdated: "2 days ago",
      technologies: ["Node.js", "Express", "PostgreSQL", "Docker"],
      source: 'github',
      repositoryUrl: "https://github.com/company/golden-path-web-service",
      stars: 245,
      forks: 89,
      version: "v2.1.0",
      author: "Platform Team",
      lastSynced: "1 hour ago",
      documentationUrl: "https://github.com/company/golden-path-web-service/blob/main/README.md"
    },
    {
      id: "frontend-app",
      name: "Frontend Application",
      description: "React application with TypeScript, testing, and CI/CD",
      usage: "76%",
      services: 12,
      lastUpdated: "1 week ago",
      technologies: ["React", "TypeScript", "Vite", "Jest"],
      source: 'cookiecutter',
      templateUrl: "https://github.com/company/cookiecutter-frontend-app",
      cookiecutterTemplate: "cookiecutter-frontend-app",
      version: "v1.5.2",
      author: "Frontend Team",
      lastSynced: "2 hours ago",
      documentationUrl: "https://github.com/company/cookiecutter-frontend-app#readme"
    },
    {
      id: "data-pipeline",
      name: "Data Pipeline",
      description: "Batch and streaming data processing with monitoring",
      usage: "65%",
      services: 8,
      lastUpdated: "3 days ago",
      technologies: ["Python", "Apache Kafka", "Apache Spark", "Airflow"],
      source: 'github',
      repositoryUrl: "https://github.com/company/golden-path-data-pipeline",
      stars: 156,
      forks: 42,
      version: "v1.8.3",
      author: "Data Engineering Team",
      lastSynced: "30 minutes ago",
      documentationUrl: "https://github.com/company/golden-path-data-pipeline/blob/main/docs/README.md"
    },
    {
      id: "microservice",
      name: "Microservice",
      description: "Containerized microservice with gRPC, service mesh, and observability",
      usage: "82%",
      services: 28,
      lastUpdated: "4 days ago",
      technologies: ["Go", "gRPC", "Kubernetes", "Istio", "Prometheus"],
      source: 'cookiecutter',
      templateUrl: "https://github.com/company/cookiecutter-microservice",
      cookiecutterTemplate: "cookiecutter-microservice",
      version: "v3.2.1",
      author: "Platform Team",
      lastSynced: "45 minutes ago",
      documentationUrl: "https://github.com/company/cookiecutter-microservice#readme"
    },
    {
      id: "serverless-function",
      name: "Serverless Function",
      description: "AWS Lambda function with event triggers, logging, and error handling",
      usage: "71%",
      services: 19,
      lastUpdated: "1 week ago",
      technologies: ["Python", "AWS Lambda", "CloudWatch", "S3", "DynamoDB"],
      source: 'github',
      repositoryUrl: "https://github.com/company/golden-path-serverless",
      stars: 189,
      forks: 67,
      version: "v2.0.5",
      author: "Cloud Team",
      lastSynced: "1 hour ago",
      documentationUrl: "https://github.com/company/golden-path-serverless/blob/main/README.md"
    },
    {
      id: "graphql-api",
      name: "GraphQL API",
      description: "GraphQL server with schema-first design, subscriptions, and federation",
      usage: "58%",
      services: 15,
      lastUpdated: "5 days ago",
      technologies: ["TypeScript", "Apollo Server", "GraphQL", "PostgreSQL", "Redis"],
      source: 'cookiecutter',
      templateUrl: "https://github.com/company/cookiecutter-graphql-api",
      cookiecutterTemplate: "cookiecutter-graphql-api",
      version: "v1.9.0",
      author: "Backend Team",
      lastSynced: "2 hours ago",
      documentationUrl: "https://github.com/company/cookiecutter-graphql-api#readme"
    },
    {
      id: "ml-model-service",
      name: "ML Model Service",
      description: "Machine learning model serving with inference API, versioning, and monitoring",
      usage: "54%",
      services: 11,
      lastUpdated: "1 week ago",
      technologies: ["Python", "FastAPI", "MLflow", "Docker", "Kubernetes"],
      source: 'github',
      repositoryUrl: "https://github.com/company/golden-path-ml-service",
      stars: 312,
      forks: 124,
      version: "v2.3.0",
      author: "ML Engineering Team",
      lastSynced: "30 minutes ago",
      documentationUrl: "https://github.com/company/golden-path-ml-service/blob/main/docs/README.md"
    },
    {
      id: "event-driven-service",
      name: "Event-Driven Service",
      description: "Event-driven architecture with message queues, event sourcing, and CQRS",
      usage: "63%",
      services: 16,
      lastUpdated: "3 days ago",
      technologies: ["Java", "Spring Boot", "RabbitMQ", "MongoDB", "Kafka"],
      source: 'cookiecutter',
      templateUrl: "https://github.com/company/cookiecutter-event-driven",
      cookiecutterTemplate: "cookiecutter-event-driven",
      version: "v1.7.2",
      author: "Architecture Team",
      lastSynced: "1 hour ago",
      documentationUrl: "https://github.com/company/cookiecutter-event-driven#readme"
    },
    {
      id: "mobile-backend",
      name: "Mobile Backend",
      description: "Backend for mobile apps with push notifications, offline sync, and auth",
      usage: "47%",
      services: 9,
      lastUpdated: "6 days ago",
      technologies: ["Node.js", "Firebase", "MongoDB", "Redis", "FCM"],
      source: 'github',
      repositoryUrl: "https://github.com/company/golden-path-mobile-backend",
      stars: 98,
      forks: 34,
      version: "v1.4.1",
      author: "Mobile Team",
      lastSynced: "15 minutes ago",
      documentationUrl: "https://github.com/company/golden-path-mobile-backend/blob/main/README.md"
    },
    {
      id: "streaming-service",
      name: "Streaming Service",
      description: "Real-time streaming service with WebSockets, message queues, and scaling",
      usage: "52%",
      services: 13,
      lastUpdated: "2 days ago",
      technologies: ["Go", "WebSocket", "NATS", "Redis", "Docker"],
      source: 'cookiecutter',
      templateUrl: "https://github.com/company/cookiecutter-streaming-service",
      cookiecutterTemplate: "cookiecutter-streaming-service",
      version: "v2.0.0",
      author: "Platform Team",
      lastSynced: "1 hour ago",
      documentationUrl: "https://github.com/company/cookiecutter-streaming-service#readme"
    },
    {
      id: "batch-job",
      name: "Batch Job",
      description: "Scheduled batch processing job with error handling, retries, and reporting",
      usage: "41%",
      services: 7,
      lastUpdated: "1 week ago",
      technologies: ["Python", "Airflow", "PostgreSQL", "S3", "Slack"],
      source: 'github',
      repositoryUrl: "https://github.com/company/golden-path-batch-job",
      stars: 76,
      forks: 28,
      version: "v1.2.3",
      author: "Data Team",
      lastSynced: "45 minutes ago",
      documentationUrl: "https://github.com/company/golden-path-batch-job/blob/main/README.md"
    },
    {
      id: "api-gateway",
      name: "API Gateway",
      description: "API gateway with rate limiting, authentication, routing, and monitoring",
      usage: "68%",
      services: 5,
      lastUpdated: "4 days ago",
      technologies: ["Kong", "Nginx", "Redis", "Prometheus", "Grafana"],
      source: 'cookiecutter',
      templateUrl: "https://github.com/company/cookiecutter-api-gateway",
      cookiecutterTemplate: "cookiecutter-api-gateway",
      version: "v1.6.0",
      author: "Infrastructure Team",
      lastSynced: "2 hours ago",
      documentationUrl: "https://github.com/company/cookiecutter-api-gateway#readme"
    },
  ]

  const handleViewDetails = (path: GoldenPath) => {
    setSelectedPath(path)
    setShowDetails(true)
  }

  const getSourceIcon = (source: 'github' | 'cookiecutter') => {
    return source === 'github' ? <Github className="h-4 w-4" /> : <FileText className="h-4 w-4" />
  }

  const getSourceBadgeColor = (source: 'github' | 'cookiecutter') => {
    return source === 'github' 
      ? 'border-gray-700 text-gray-700 bg-gray-50' 
      : 'border-orange-500 text-orange-600 bg-orange-50'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-posthog-black">GOLDEN_PATHS</h1>
          <p className="text-posthog-gray font-mono text-sm">STANDARDIZED_TEMPLATES_FOR_COMMON_SERVICE_PATTERNS</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs border-gray-700 text-gray-700">
            <Github className="h-3 w-3 mr-1" />
            GITHUB
          </Badge>
          <Badge variant="outline" className="font-mono text-xs border-orange-500 text-orange-600">
            <FileText className="h-3 w-3 mr-1" />
            COOKIECUTTER
          </Badge>
        </div>
      </div>

      {/* Golden Paths */}
      <Card className="border-posthog-cream-dark bg-white">
        <CardHeader>
          <CardTitle className="font-mono text-posthog-black flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-posthog-orange" />
            GOLDEN_PATHS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {goldenPaths.map((path) => (
              <Card 
                key={path.id} 
                className="border-posthog-cream-dark bg-posthog-cream hover:border-posthog-orange transition-colors cursor-pointer"
                onClick={() => handleViewDetails(path)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-mono text-sm font-medium text-posthog-black">{path.name}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs font-mono ${getSourceBadgeColor(path.source)}`}
                        >
                          {getSourceIcon(path.source)}
                          <span className="ml-1">{path.source === 'github' ? 'GITHUB' : 'COOKIECUTTER'}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-posthog-gray font-mono mb-2">{path.description}</p>
                      <div className="flex items-center gap-4 text-xs font-mono text-posthog-gray mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{path.services} services using</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {path.lastUpdated}</span>
                        </div>
                        {path.lastSynced && (
                          <div className="flex items-center gap-1 text-posthog-orange">
                            <RefreshCw className="h-3 w-3" />
                            <span>Synced {path.lastSynced}</span>
                          </div>
                        )}
                      </div>
                      {path.source === 'github' && path.stars && path.forks && (
                        <div className="flex items-center gap-4 text-xs font-mono text-posthog-gray mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{path.stars} stars</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitFork className="h-3 w-3" />
                            <span>{path.forks} forks</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold font-mono text-posthog-orange">{path.usage}</div>
                      <div className="text-xs font-mono text-posthog-gray">ADOPTION</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {path.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="font-mono text-xs border-posthog-cream-dark text-posthog-gray">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        onQuickAction(`create service from ${path.name} template`)
                      }}
                    >
                      <GitBranch className="h-3 w-3 mr-1" />
                      USE_TEMPLATE
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(path)
                      }}
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      VIEW_DETAILS
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="font-mono text-xs text-posthog-gray hover:text-posthog-orange"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (path.source === 'github' && path.repositoryUrl) {
                          window.open(path.repositoryUrl, '_blank')
                        } else if (path.source === 'cookiecutter' && path.templateUrl) {
                          window.open(path.templateUrl, '_blank')
                        }
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Path Details Dialog */}
      {selectedPath && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-posthog-black flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-posthog-orange" />
                {selectedPath.name}
              </DialogTitle>
              <DialogDescription className="font-mono text-posthog-gray">
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-mono ${getSourceBadgeColor(selectedPath.source)}`}
                  >
                    {getSourceIcon(selectedPath.source)}
                    <span className="ml-1">{selectedPath.source === 'github' ? 'GITHUB' : 'COOKIECUTTER'}</span>
                  </Badge>
                  <span className="text-xs">Powered by {selectedPath.source === 'github' ? 'GitHub Repository' : 'Cookiecutter Template'}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Path Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-posthog-cream rounded border border-posthog-cream-dark">
                <div>
                  <div className="text-xs font-mono text-posthog-gray mb-1">ADOPTION_RATE</div>
                  <div className="text-lg font-bold font-mono text-posthog-orange">{selectedPath.usage}</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-posthog-gray mb-1">SERVICES_USING</div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-posthog-orange" />
                    <span className="font-mono text-sm text-posthog-black">{selectedPath.services} services</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-posthog-gray mb-1">LAST_UPDATED</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-posthog-orange" />
                    <span className="font-mono text-sm text-posthog-black">{selectedPath.lastUpdated}</span>
                  </div>
                </div>
                {selectedPath.version && (
                  <div>
                    <div className="text-xs font-mono text-posthog-gray mb-1">VERSION</div>
                    <span className="font-mono text-sm text-posthog-black">{selectedPath.version}</span>
                  </div>
                )}
                {selectedPath.author && (
                  <div>
                    <div className="text-xs font-mono text-posthog-gray mb-1">AUTHOR</div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-posthog-orange" />
                      <span className="font-mono text-sm text-posthog-black">{selectedPath.author}</span>
                    </div>
                  </div>
                )}
                {selectedPath.lastSynced && (
                  <div>
                    <div className="text-xs font-mono text-posthog-gray mb-1">LAST_SYNCED</div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-posthog-orange" />
                      <span className="font-mono text-sm text-posthog-orange">{selectedPath.lastSynced}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* GitHub Stats */}
              {selectedPath.source === 'github' && selectedPath.stars && selectedPath.forks && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded border border-gray-200">
                  <div>
                    <div className="text-xs font-mono text-posthog-gray mb-1">GITHUB_STARS</div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-mono text-sm font-bold text-posthog-black">{selectedPath.stars.toLocaleString()}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-posthog-gray mb-1">GITHUB_FORKS</div>
                    <div className="flex items-center gap-2">
                      <GitFork className="h-4 w-4 text-posthog-orange" />
                      <span className="font-mono text-sm font-bold text-posthog-black">{selectedPath.forks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="text-xs font-mono font-medium text-posthog-black mb-2">DESCRIPTION</div>
                <p className="font-mono text-sm text-posthog-gray">{selectedPath.description}</p>
              </div>

              {/* Technologies */}
              <div>
                <div className="text-xs font-mono font-medium text-posthog-black mb-2">TECHNOLOGIES</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedPath.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className="text-xs font-mono border-posthog-orange text-posthog-orange"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Source Information */}
              <div className={`p-4 rounded border ${selectedPath.source === 'github' ? 'bg-gray-50 border-gray-200' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getSourceIcon(selectedPath.source)}
                  <div className="text-xs font-mono font-medium text-posthog-black">
                    SOURCE: {selectedPath.source === 'github' ? 'GITHUB_REPOSITORY' : 'COOKIECUTTER_TEMPLATE'}
                  </div>
                </div>
                <div className="text-xs font-mono text-posthog-gray mb-3">
                  {selectedPath.source === 'github' 
                    ? 'This golden path template is hosted on GitHub and automatically synced.'
                    : 'This golden path uses Cookiecutter for template generation and is automatically synced.'}
                </div>
                {selectedPath.source === 'github' && selectedPath.repositoryUrl && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-posthog-gray">Repository URL:</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-white px-2 py-1 rounded border border-gray-300 flex-1">
                        {selectedPath.repositoryUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-mono text-xs border-gray-500 text-gray-600 hover:bg-gray-500 hover:text-white"
                        onClick={() => window.open(selectedPath.repositoryUrl, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        OPEN_IN_GITHUB
                      </Button>
                    </div>
                  </div>
                )}
                {selectedPath.source === 'cookiecutter' && selectedPath.cookiecutterTemplate && (
                  <div className="space-y-2">
                    <div className="text-xs font-mono text-posthog-gray">Cookiecutter Template:</div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono bg-white px-2 py-1 rounded border border-orange-300 flex-1">
                        {selectedPath.cookiecutterTemplate}
                      </code>
                      {selectedPath.templateUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-mono text-xs border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
                          onClick={() => window.open(selectedPath.templateUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          OPEN_TEMPLATE
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-posthog-cream-dark">
                <Button
                  className="flex-1 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
                  onClick={() => onQuickAction(`create service from ${selectedPath.name} template`)}
                >
                  <GitBranch className="h-4 w-4 mr-2" />
                  USE_TEMPLATE
                </Button>
                {selectedPath.documentationUrl && (
                  <Button
                    variant="outline"
                    className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                    onClick={() => window.open(selectedPath.documentationUrl, '_blank')}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    VIEW_DOCS
                  </Button>
                )}
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