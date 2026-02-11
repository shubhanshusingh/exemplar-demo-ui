"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Zap, Search, Settings, Activity, Code } from "lucide-react"

interface ContextualSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void
  lastMessage: string
  isVisible: boolean
  onClose: () => void
}

const suggestionCategories = {
  serviceHealth: [
    { text: "check health of payment-service and show recent deployments", icon: Activity, category: "HEALTH" },
    { text: "check service health and uptime metrics", icon: Activity, category: "MONITOR" },
    { text: "show deployment status and logs", icon: Activity, category: "DEPLOY" },
    { text: "check service health", icon: Activity, category: "HEALTH" },
  ],
  scaling: [
    { text: "scale user-auth service to 5 replicas and show cost impact", icon: Zap, category: "SCALE" },
    { text: "scale backend to 3 instances", icon: Zap, category: "SCALE" },
    { text: "scale deployment", icon: Zap, category: "DEPLOY" },
  ],
  infrastructure: [
    { text: "create Kafka topic 'order-events' with 6 partitions", icon: Code, category: "INFRA" },
    { text: "deploy frontend-service to production", icon: Settings, category: "DEPLOY" },
    { text: "provision new environment", icon: Zap, category: "PROVISION" },
    { text: "backup databases", icon: Settings, category: "BACKUP" },
  ],
  monitoring: [
    { text: "check deployment status and logs", icon: Search, category: "LOGS" },
    { text: "view error logs", icon: Search, category: "LOGS" },
    { text: "check alerts", icon: Activity, category: "ALERTS" },
    { text: "analyze performance", icon: Activity, category: "PERFORMANCE" },
  ],
  cost: [
    { text: "analyze cloud costs and optimization", icon: Activity, category: "COST" },
    { text: "analyze costs", icon: Activity, category: "COST" },
    { text: "show cost impact", icon: Activity, category: "COST" },
  ],
  security: [
    { text: "run security scan and show vulnerabilities", icon: Settings, category: "SECURITY" },
    { text: "security scan", icon: Settings, category: "SECURITY" },
    { text: "check compliance and governance", icon: Settings, category: "GOVERNANCE" },
  ],
  workflows: [
    { text: "show workflow automation stats", icon: Zap, category: "AUTOMATION" },
    { text: "create new CI/CD pipeline", icon: Zap, category: "PIPELINE" },
    { text: "workflow automation", icon: Zap, category: "AUTOMATION" },
  ],
  development: [
    { text: "generate API documentation", icon: Code, category: "DOCS" },
    { text: "check code quality", icon: Code, category: "QUALITY" },
    { text: "create new CI/CD pipeline", icon: Code, category: "PIPELINE" },
  ],
  database: [
    { text: "database operations and monitoring", icon: Code, category: "DATABASE" },
    { text: "backup databases", icon: Settings, category: "BACKUP" },
    { text: "database queries", icon: Code, category: "DATABASE" },
  ],
  cloud: [
    { text: "cloud resources", icon: Settings, category: "CLOUD" },
    { text: "analyze cloud costs and optimization", icon: Activity, category: "COST" },
    { text: "provision new environment", icon: Zap, category: "PROVISION" },
  ],
}

export default function ContextualSuggestions({
  onSuggestionClick,
  lastMessage,
  isVisible,
  onClose,
}: ContextualSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<any[]>([])

  useEffect(() => {
    if (!isVisible) return

    // Generate contextual suggestions based on the last message
    const generateSuggestions = () => {
      const message = lastMessage.toLowerCase()
      let relevantSuggestions: any[] = []

      // Service Health & Monitoring
      if (message.includes("health") || message.includes("service") || message.includes("deploy")) {
        relevantSuggestions = [
          ...suggestionCategories.serviceHealth,
          ...suggestionCategories.monitoring,
          ...suggestionCategories.scaling
        ]
      }
      // Scaling & Infrastructure
      else if (message.includes("scale") || message.includes("replicas") || message.includes("instances")) {
        relevantSuggestions = [
          ...suggestionCategories.scaling,
          ...suggestionCategories.infrastructure,
          ...suggestionCategories.cost
        ]
      }
      // Infrastructure & Kafka
      else if (message.includes("kafka") || message.includes("topic") || message.includes("infra")) {
        relevantSuggestions = [
          ...suggestionCategories.infrastructure,
          ...suggestionCategories.database,
          ...suggestionCategories.monitoring
        ]
      }
      // Deployment & Production
      else if (message.includes("deploy") || message.includes("production") || message.includes("frontend")) {
        relevantSuggestions = [
          ...suggestionCategories.infrastructure,
          ...suggestionCategories.serviceHealth,
          ...suggestionCategories.workflows
        ]
      }
      // Logs & Monitoring
      else if (message.includes("log") || message.includes("error") || message.includes("monitor")) {
        relevantSuggestions = [
          ...suggestionCategories.monitoring,
          ...suggestionCategories.serviceHealth,
          ...suggestionCategories.development
        ]
      }
      // Cost & Optimization
      else if (message.includes("cost") || message.includes("money") || message.includes("spend")) {
        relevantSuggestions = [
          ...suggestionCategories.cost,
          ...suggestionCategories.cloud,
          ...suggestionCategories.scaling
        ]
      }
      // Security & Compliance
      else if (message.includes("security") || message.includes("scan") || message.includes("vulnerability")) {
        relevantSuggestions = [
          ...suggestionCategories.security,
          ...suggestionCategories.monitoring,
          ...suggestionCategories.development
        ]
      }
      // Workflows & Automation
      else if (message.includes("workflow") || message.includes("automation") || message.includes("pipeline")) {
        relevantSuggestions = [
          ...suggestionCategories.workflows,
          ...suggestionCategories.development,
          ...suggestionCategories.infrastructure
        ]
      }
      // Database Operations
      else if (message.includes("database") || message.includes("db") || message.includes("sql")) {
        relevantSuggestions = [
          ...suggestionCategories.database,
          ...suggestionCategories.infrastructure,
          ...suggestionCategories.monitoring
        ]
      }
      // Cloud & Resources
      else if (message.includes("cloud") || message.includes("aws") || message.includes("resources")) {
        relevantSuggestions = [
          ...suggestionCategories.cloud,
          ...suggestionCategories.cost,
          ...suggestionCategories.infrastructure
        ]
      }
      // Default suggestions - mix of all categories
      else {
        relevantSuggestions = [
          ...suggestionCategories.serviceHealth.slice(0, 2),
          ...suggestionCategories.scaling.slice(0, 1),
          ...suggestionCategories.infrastructure.slice(0, 1),
          ...suggestionCategories.monitoring.slice(0, 1),
          ...suggestionCategories.cost.slice(0, 1),
          ...suggestionCategories.security.slice(0, 1),
          ...suggestionCategories.workflows.slice(0, 1),
        ]
      }

      // Shuffle and take first 8 for ticker (more suggestions)
      const shuffled = relevantSuggestions.sort(() => 0.5 - Math.random())
      setSuggestions(shuffled.slice(0, 8))
    }

    generateSuggestions()
  }, [lastMessage, isVisible])

  if (!isVisible || suggestions.length === 0) return null

  return (
    <div className="mt-2 p-2 bg-muted border border-border rounded">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="h-3 w-3 text-brand-orange" />
        <span className="text-xs font-medium font-mono text-foreground">SUGGESTIONS:</span>
      </div>
      
      {/* Compact Ticker */}
      <div className="overflow-hidden">
        <div className="flex animate-scroll-right-to-left">
          {/* Duplicate suggestions for seamless loop */}
          {[...suggestions, ...suggestions].map((suggestion, index) => (
            <button
              key={`${suggestion.text}-${index}`}
              onClick={() => onSuggestionClick(suggestion.text)}
              className="flex items-center gap-1 px-2 py-1 bg-card rounded border border-border hover:bg-accent transition-all text-xs font-mono text-foreground shadow-sm hover:shadow-md whitespace-nowrap mr-2 flex-shrink-0"
            >
              <suggestion.icon className="h-2.5 w-2.5" />
              <span className="truncate max-w-[120px]">{suggestion.text}</span>
              <Badge variant="outline" className="text-xs font-mono border-brand-orange text-brand-orange flex-shrink-0 px-1 py-0">
                {suggestion.category}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
