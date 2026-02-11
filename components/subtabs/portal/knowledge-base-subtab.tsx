import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { BookOpen, ExternalLink, FileText, Calendar, Eye, User, Link as LinkIcon } from "lucide-react"

interface KnowledgeBaseSubtabProps {
  onQuickAction: (command: string) => void
}

interface Article {
  title: string
  views: number
  lastUpdated: string
  source: 'notion' | 'confluence'
  url: string
  author: string
  description: string
  tags: string[]
  lastSynced?: string
}

export const KnowledgeBaseSubtab: React.FC<KnowledgeBaseSubtabProps> = ({ onQuickAction }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const knowledgeBase = [
    {
      category: "Getting Started",
      articles: [
        { 
          title: "Developer Environment Setup", 
          views: 1250, 
          lastUpdated: "1 week ago",
          source: 'notion' as const,
          url: "https://notion.so/developer-env-setup",
          author: "Platform Team",
          description: "Complete guide to setting up your local development environment, including required tools, configurations, and troubleshooting tips.",
          tags: ["setup", "development", "onboarding"],
          lastSynced: "2 hours ago"
        },
        { 
          title: "Code Review Guidelines", 
          views: 890, 
          lastUpdated: "3 days ago",
          source: 'confluence' as const,
          url: "https://confluence.company.com/code-review",
          author: "Engineering Team",
          description: "Standards and best practices for conducting effective code reviews, including checklist items and review process workflows.",
          tags: ["code-review", "best-practices", "process"],
          lastSynced: "1 hour ago"
        },
        { 
          title: "Git Workflow and Branching", 
          views: 2100, 
          lastUpdated: "2 weeks ago",
          source: 'notion' as const,
          url: "https://notion.so/git-workflow",
          author: "DevOps Team",
          description: "Comprehensive guide to our Git workflow, branching strategies, commit conventions, and merge request process.",
          tags: ["git", "workflow", "version-control"],
          lastSynced: "30 minutes ago"
        },
      ],
    },
    {
      category: "Architecture",
      articles: [
        { 
          title: "Microservices Design Patterns", 
          views: 750, 
          lastUpdated: "1 week ago",
          source: 'confluence' as const,
          url: "https://confluence.company.com/microservices-patterns",
          author: "Architecture Team",
          description: "Design patterns and architectural decisions for building scalable microservices, including communication patterns and service boundaries.",
          tags: ["architecture", "microservices", "design-patterns"],
          lastSynced: "3 hours ago"
        },
        { 
          title: "API Design Guidelines", 
          views: 1100, 
          lastUpdated: "4 days ago",
          source: 'notion' as const,
          url: "https://notion.so/api-design",
          author: "Platform Team",
          description: "RESTful API design standards, naming conventions, versioning strategies, and documentation requirements.",
          tags: ["api", "design", "standards"],
          lastSynced: "1 hour ago"
        },
        { 
          title: "Database Schema Standards", 
          views: 650, 
          lastUpdated: "1 week ago",
          source: 'confluence' as const,
          url: "https://confluence.company.com/db-standards",
          author: "Data Team",
          description: "Database design principles, naming conventions, migration strategies, and schema evolution best practices.",
          tags: ["database", "schema", "standards"],
          lastSynced: "2 hours ago"
        },
      ],
    },
    {
      category: "Platform Tools",
      articles: [
        { 
          title: "Monitoring and Alerting Setup", 
          views: 980, 
          lastUpdated: "2 days ago",
          source: 'notion' as const,
          url: "https://notion.so/monitoring-setup",
          author: "SRE Team",
          description: "How to set up monitoring dashboards, configure alerts, and use observability tools for your services.",
          tags: ["monitoring", "alerting", "observability"],
          lastSynced: "15 minutes ago"
        },
        { 
          title: "CI/CD Pipeline Configuration", 
          views: 1350, 
          lastUpdated: "5 days ago",
          source: 'confluence' as const,
          url: "https://confluence.company.com/cicd-pipeline",
          author: "DevOps Team",
          description: "Step-by-step guide to configuring CI/CD pipelines, including build, test, and deployment stages.",
          tags: ["ci-cd", "pipeline", "automation"],
          lastSynced: "45 minutes ago"
        },
        { 
          title: "Security Best Practices", 
          views: 1800, 
          lastUpdated: "1 week ago",
          source: 'notion' as const,
          url: "https://notion.so/security-practices",
          author: "Security Team",
          description: "Security guidelines, vulnerability management, secret handling, and compliance requirements for development.",
          tags: ["security", "compliance", "best-practices"],
          lastSynced: "1 hour ago"
        },
      ],
    },
  ]

  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article)
    setShowDetails(true)
  }

  const getSourceIcon = (source: 'notion' | 'confluence') => {
    return source === 'notion' ? '📝' : '🔗'
  }

  const getSourceBadgeColor = (source: 'notion' | 'confluence') => {
    return source === 'notion' 
      ? 'border-blue-500 text-blue-600 bg-blue-50' 
      : 'border-blue-400 text-blue-600 bg-blue-50'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-posthog-black">KNOWLEDGE_BASE</h1>
          <p className="text-posthog-gray font-mono text-sm">DOCUMENTATION,_GUIDES,_AND_BEST_PRACTICES</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs border-blue-500 text-blue-600">
            📝 NOTION
          </Badge>
          <Badge variant="outline" className="font-mono text-xs border-blue-400 text-blue-600">
            🔗 CONFLUENCE
          </Badge>
        </div>
      </div>

      {/* Knowledge Base */}
      <Card className="border-posthog-cream-dark bg-white">
        <CardHeader>
          <CardTitle className="font-mono text-posthog-black flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-posthog-orange" />
            KNOWLEDGE_BASE
          </CardTitle>
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
                      className="flex items-center justify-between p-4 bg-posthog-cream rounded border border-posthog-cream-dark hover:border-posthog-orange transition-colors cursor-pointer"
                      onClick={() => handleReadArticle(article)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <BookOpen className="h-5 w-5 text-posthog-orange flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm font-medium text-posthog-black">{article.title}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs font-mono ${getSourceBadgeColor(article.source)}`}
                            >
                              {getSourceIcon(article.source)} {article.source.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs font-mono text-posthog-gray mb-2 line-clamp-1">
                            {article.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs font-mono text-posthog-gray">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{article.views} views</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Updated {article.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{article.author}</span>
                            </div>
                            {article.lastSynced && (
                              <div className="flex items-center gap-1 text-posthog-orange">
                                <span>Synced {article.lastSynced}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {article.tags.map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className="text-xs font-mono border-posthog-cream-dark text-posthog-gray"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReadArticle(article)
                          }}
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          VIEW
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="font-mono text-xs text-posthog-gray hover:text-posthog-orange"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(article.url, '_blank')
                          }}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Article Details Dialog */}
      {selectedArticle && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-mono text-posthog-black flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-posthog-orange" />
                {selectedArticle.title}
              </DialogTitle>
              <DialogDescription className="font-mono text-posthog-gray">
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={`text-xs font-mono ${getSourceBadgeColor(selectedArticle.source)}`}
                  >
                    {getSourceIcon(selectedArticle.source)} {selectedArticle.source.toUpperCase()}
                  </Badge>
                  <span className="text-xs">Powered by {selectedArticle.source === 'notion' ? 'Notion' : 'Confluence'}</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {/* Article Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-posthog-cream rounded border border-posthog-cream-dark">
                <div>
                  <div className="text-xs font-mono text-posthog-gray mb-1">AUTHOR</div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-posthog-orange" />
                    <span className="font-mono text-sm text-posthog-black">{selectedArticle.author}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-posthog-gray mb-1">LAST_UPDATED</div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-posthog-orange" />
                    <span className="font-mono text-sm text-posthog-black">{selectedArticle.lastUpdated}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-posthog-gray mb-1">VIEWS</div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-posthog-orange" />
                    <span className="font-mono text-sm text-posthog-black">{selectedArticle.views.toLocaleString()}</span>
                  </div>
                </div>
                {selectedArticle.lastSynced && (
                  <div>
                    <div className="text-xs font-mono text-posthog-gray mb-1">LAST_SYNCED</div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-posthog-orange">{selectedArticle.lastSynced}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="text-xs font-mono font-medium text-posthog-black mb-2">DESCRIPTION</div>
                <p className="font-mono text-sm text-posthog-gray">{selectedArticle.description}</p>
              </div>

              {/* Tags */}
              <div>
                <div className="text-xs font-mono font-medium text-posthog-black mb-2">TAGS</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedArticle.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className="text-xs font-mono border-posthog-orange text-posthog-orange"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Source Information */}
              <div className="p-4 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getSourceIcon(selectedArticle.source)}</span>
                  <div className="text-xs font-mono font-medium text-posthog-black">
                    SOURCE: {selectedArticle.source === 'notion' ? 'NOTION' : 'CONFLUENCE'}
                  </div>
                </div>
                <div className="text-xs font-mono text-posthog-gray mb-3">
                  This article is synced from {selectedArticle.source === 'notion' ? 'Notion' : 'Confluence'} and automatically updated.
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="font-mono text-xs border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white"
                  onClick={() => window.open(selectedArticle.url, '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  OPEN_IN_{selectedArticle.source === 'notion' ? 'NOTION' : 'CONFLUENCE'}
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-posthog-cream-dark">
                <Button
                  className="flex-1 font-mono text-xs bg-posthog-orange hover:bg-posthog-orange-dark text-white"
                  onClick={() => window.open(selectedArticle.url, '_blank')}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  OPEN_ARTICLE
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