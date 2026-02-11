"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Database,
  Search,
  Plus,
  Brain,
  Clock,
  Code,
  Trash2,
  Edit,
  Eye,
  Filter,
  TrendingUp,
  BarChart3,
  Users,
  CheckCircle,
  Download,
  Save,
  Zap,
  RefreshCw,
  Settings,
} from "lucide-react"

interface AIMemoryProps {
  onQuickAction: (command: string) => void
}

const memoryTypes = [
  { id: "all", name: "All Memories", count: 156, icon: Database },
  { id: "conversations", name: "Conversations", count: 89, icon: Users },
  { id: "code-context", name: "Code Context", count: 34, icon: Code },
  { id: "decisions", name: "Decisions", count: 23, icon: CheckCircle },
  { id: "learnings", name: "Learnings", count: 10, icon: Brain },
]

const memories = [
  {
    id: "1",
    type: "conversations",
    title: "Payment Service Architecture Discussion",
    content:
      "Discussed microservices architecture for payment processing. Key decisions: Use event sourcing for transaction history, implement circuit breaker pattern for external payment providers, separate read/write models for better performance.",
    context: {
      participants: ["john.doe", "jane.smith", "mike.wilson"],
      project: "payment-service",
      timestamp: "2024-01-15T10:30:00Z",
      tags: ["architecture", "payments", "microservices"],
    },
    relevanceScore: 0.95,
    lastAccessed: "2 hours ago",
    accessCount: 12,
    isActive: true,
  },
  {
    id: "2",
    type: "code-context",
    title: "Authentication Middleware Implementation",
    content:
      "JWT token validation middleware with refresh token logic. Handles token expiration, blacklisting, and role-based access control. Integrated with Redis for session management.",
    context: {
      repository: "auth-service",
      filePath: "/src/middleware/auth.ts",
      commitHash: "a1b2c3d4",
      timestamp: "2024-01-14T15:45:00Z",
      tags: ["authentication", "middleware", "jwt", "security"],
    },
    relevanceScore: 0.88,
    lastAccessed: "1 day ago",
    accessCount: 8,
    isActive: true,
  },
  {
    id: "3",
    type: "decisions",
    title: "Database Migration Strategy",
    content:
      "Decided to use blue-green deployment for database migrations. Zero-downtime approach with backward compatibility for 2 versions. Automated rollback procedures in case of issues.",
    context: {
      decisionMakers: ["platform-team", "dba-team"],
      impact: "high",
      status: "approved",
      timestamp: "2024-01-13T09:15:00Z",
      tags: ["database", "migration", "deployment", "strategy"],
    },
    relevanceScore: 0.92,
    lastAccessed: "3 days ago",
    accessCount: 15,
    isActive: true,
  },
  {
    id: "4",
    type: "learnings",
    title: "Performance Optimization Insights",
    content:
      "Learned that connection pooling significantly improved database performance. Reduced response time by 40% after implementing proper pool sizing and connection lifecycle management.",
    context: {
      source: "performance-testing",
      metrics: {
        beforeResponseTime: "250ms",
        afterResponseTime: "150ms",
        improvement: "40%",
      },
      timestamp: "2024-01-12T14:20:00Z",
      tags: ["performance", "database", "optimization", "connection-pooling"],
    },
    relevanceScore: 0.85,
    lastAccessed: "5 days ago",
    accessCount: 6,
    isActive: true,
  },
]

const memoryStats = {
  totalMemories: 156,
  activeMemories: 142,
  storageUsed: "2.3 GB",
  avgRelevanceScore: 0.87,
  topTags: ["architecture", "security", "performance", "database", "api"],
  recentActivity: [
    { action: "Created", memory: "API Rate Limiting Strategy", user: "sarah.chen", time: "1 hour ago" },
    { action: "Accessed", memory: "Payment Service Architecture", user: "john.doe", time: "2 hours ago" },
    { action: "Updated", memory: "Database Migration Strategy", user: "platform-team", time: "4 hours ago" },
  ],
}

export default function AIMemory({ onQuickAction }: AIMemoryProps) {
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMemory, setSelectedMemory] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filteredMemories = memories.filter((memory) => {
    const matchesType = selectedType === "all" || memory.type === selectedType
    const matchesSearch =
      memory.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      memory.context.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesType && matchesSearch
  })

  const getTypeIcon = (type: string) => {
    const typeConfig = memoryTypes.find((t) => t.id === type)
    return typeConfig ? typeConfig.icon : Database
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return "text-green-600"
    if (score >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-posthog-black">AI_MEMORY</h2>
          <p className="text-posthog-gray font-mono text-xs sm:text-sm">CONTEXTUAL_MEMORY_SYSTEM_FOR_AI_INTERACTIONS</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            ADD_MEMORY
          </Button>
          <Button
            onClick={() => onQuickAction("analyze memory patterns")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs w-full sm:w-auto"
          >
            <Brain className="h-4 w-4 mr-2" />
            ANALYZE_PATTERNS
          </Button>
          <Button
            onClick={() => onQuickAction("optimize memory storage")}
            variant="outline"
            className="font-mono text-xs border-border text-foreground hover:bg-accent w-full sm:w-auto"
          >
            <Database className="h-4 w-4 mr-2" />
            OPTIMIZE_STORAGE
          </Button>
        </div>
      </div>

      <Tabs defaultValue="memories" className="space-y-4 min-h-[600px]">
        <TabsList className="bg-card border border-border w-full sm:w-auto">
          <TabsTrigger
            value="memories"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">MEMORIES</span>
            <span className="sm:hidden">MEM</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">ANALYTICS</span>
            <span className="sm:hidden">STATS</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <Brain className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">SETTINGS</span>
            <span className="sm:hidden">SET</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="memories" className="space-y-4 min-h-[500px]">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-posthog-gray" />
              <Input
                placeholder="SEARCH_MEMORY_ENTRIES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-mono text-sm"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48 font-mono text-sm">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="FILTER_BY_TYPE" />
              </SelectTrigger>
              <SelectContent>
                {memoryTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="font-mono text-sm">
                    {type.name} ({type.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Memory Types Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {memoryTypes.map((type) => (
              <Card
                key={type.id}
                className={`border-border bg-card hover:border-primary transition-colors cursor-pointer h-24 ${
                  selectedType === type.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedType(type.id)}
              >
                <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                  <type.icon className="h-6 w-6 mx-auto mb-2 text-brand-orange" />
                  <div className="text-lg sm:text-xl font-bold font-mono text-posthog-black">{type.count}</div>
                  <div className="text-xs font-mono text-posthog-gray truncate">{type.name.toUpperCase()}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Memory List */}
          <div className="space-y-4 min-h-[300px]">
            {filteredMemories.map((memory) => {
              const TypeIcon = getTypeIcon(memory.type)
              return (
                <Card
                  key={memory.id}
                  className="border-border bg-card hover:border-primary transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-10 h-10 bg-posthog-cream rounded flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="h-5 w-5 text-brand-orange" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                          <div className="min-w-0">
                            <h4 className="font-mono text-sm font-medium text-posthog-black truncate">
                              {memory.title}
                            </h4>
                            <p className="text-xs text-posthog-gray font-mono mt-1 line-clamp-2">{memory.content}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge
                              variant="outline"
                              className={`font-mono text-xs ${getRelevanceColor(memory.relevanceScore)}`}
                            >
                              {(memory.relevanceScore * 100).toFixed(0)}% RELEVANT
                            </Badge>
                            {memory.isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3 min-h-[24px]">
                          {memory.context.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="font-mono text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {memory.context.tags.length > 4 && (
                            <Badge variant="outline" className="font-mono text-xs">
                              +{memory.context.tags.length - 4}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-posthog-gray">
                            <span>
                              <Clock className="h-3 w-3 inline mr-1" />
                              {memory.lastAccessed}
                            </span>
                            <span>
                              <Eye className="h-3 w-3 inline mr-1" />
                              {memory.accessCount} views
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  VIEW
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle className="font-mono text-posthog-black">{memory.title}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                                    <div>
                                      <span className="font-medium text-posthog-black">TYPE:</span> {memory.type}
                                    </div>
                                    <div>
                                      <span className="font-medium text-posthog-black">RELEVANCE:</span>{" "}
                                      {(memory.relevanceScore * 100).toFixed(0)}%
                                    </div>
                                    <div>
                                      <span className="font-medium text-posthog-black">ACCESSED:</span>{" "}
                                      {memory.accessCount} times
                                    </div>
                                    <div>
                                      <span className="font-medium text-posthog-black">LAST_ACCESS:</span>{" "}
                                      {memory.lastAccessed}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-mono text-sm font-medium text-posthog-black mb-2">CONTENT:</h4>
                                    <div className="p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                                      <p className="font-mono text-sm text-posthog-black">{memory.content}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-mono text-sm font-medium text-posthog-black mb-2">CONTEXT:</h4>
                                    <div className="p-3 bg-posthog-cream rounded border border-posthog-cream-dark">
                                      <pre className="font-mono text-xs text-posthog-black overflow-auto">
                                        {JSON.stringify(memory.context, null, 2)}
                                      </pre>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                      onClick={() => onQuickAction(`use memory: ${memory.title}`)}
                                      className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
                                    >
                                      <Brain className="h-4 w-4 mr-2" />
                                      USE_IN_CONTEXT
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      EDIT
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              onClick={() => onQuickAction(`use memory: ${memory.title}`)}
                              className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs"
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              USE
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 min-h-[500px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-posthog-gray">TOTAL_MEMORIES</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-posthog-black">
                  {memoryStats.totalMemories}
                </div>
                <div className="text-xs font-mono text-green-600">+12 this week</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-posthog-gray">ACTIVE_MEMORIES</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-posthog-black">
                  {memoryStats.activeMemories}
                </div>
                <div className="text-xs font-mono text-posthog-gray">91% active rate</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-posthog-gray">AVG_RELEVANCE</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-posthog-black">
                  {(memoryStats.avgRelevanceScore * 100).toFixed(0)}%
                </div>
                <div className="text-xs font-mono text-green-600">+3% this month</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-posthog-gray">STORAGE_USED</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-posthog-black">
                  {memoryStats.storageUsed}
                </div>
                <div className="text-xs font-mono text-posthog-gray">of 10 GB limit</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-mono text-posthog-black">TOP_TAGS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {memoryStats.topTags.map((tag, index) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`font-mono text-xs ${index === 0 ? "border-brand-orange text-brand-orange" : ""}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="font-mono text-posthog-black">RECENT_ACTIVITY</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memoryStats.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary rounded flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs text-posthog-black">
                          <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()}
                          <span className="font-medium"> "{activity.memory}"</span>
                        </p>
                        <p className="text-xs text-posthog-gray font-mono">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 min-h-[500px]">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-mono text-posthog-black">MEMORY_SETTINGS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-mono text-posthog-black mb-2">
                    RETENTION_PERIOD
                  </label>
                  <Select defaultValue="90">
                    <SelectTrigger className="font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30" className="font-mono text-sm">
                        30 days
                      </SelectItem>
                      <SelectItem value="90" className="font-mono text-sm">
                        90 days
                      </SelectItem>
                      <SelectItem value="180" className="font-mono text-sm">
                        180 days
                      </SelectItem>
                      <SelectItem value="365" className="font-mono text-sm">
                        1 year
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium font-mono text-posthog-black mb-2">
                    MIN_RELEVANCE_SCORE
                  </label>
                  <Select defaultValue="0.7">
                    <SelectTrigger className="font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5" className="font-mono text-sm">
                        50%
                      </SelectItem>
                      <SelectItem value="0.7" className="font-mono text-sm">
                        70%
                      </SelectItem>
                      <SelectItem value="0.8" className="font-mono text-sm">
                        80%
                      </SelectItem>
                      <SelectItem value="0.9" className="font-mono text-sm">
                        90%
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  SAVE_SETTINGS
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onQuickAction("cleanup old memories")}
                  className="font-mono text-xs border-border text-foreground hover:bg-accent bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  CLEAR_OLD_ENTRIES
                </Button>
                <Button
                  onClick={() => onQuickAction("backup memory data")}
                  variant="outline"
                  className="font-mono text-xs border-border text-foreground hover:bg-accent bg-transparent"
                >
                  <Save className="h-4 w-4 mr-2" />
                  BACKUP_DATA
                </Button>
                <Button
                  onClick={() => onQuickAction("optimize memory performance")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  OPTIMIZE_PERFORMANCE
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Memory Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-mono text-posthog-black">ADD_NEW_MEMORY</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium font-mono text-posthog-black mb-1">TITLE</label>
                <Input placeholder="Enter memory title..." className="font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium font-mono text-posthog-black mb-1">TYPE</label>
                <Select>
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {memoryTypes.slice(1).map((type) => (
                      <SelectItem key={type.id} value={type.id} className="font-mono text-sm">
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium font-mono text-posthog-black mb-1">CONTENT</label>
              <Textarea placeholder="Enter the memory content..." className="min-h-[150px] font-mono text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium font-mono text-posthog-black mb-1">TAGS</label>
              <Input placeholder="Enter tags separated by commas..." className="font-mono text-sm" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs">
                <CheckCircle className="h-4 w-4 mr-2" />
                ADD_MEMORY_ENTRY
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="font-mono text-xs">
                CANCEL
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
