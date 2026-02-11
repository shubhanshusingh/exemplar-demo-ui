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
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Plus,
  Edit,
  Eye,
  Activity,
  BarChart3,
  Clock,
  Lock,
  Zap,
  Filter,
  Search,
} from "lucide-react"

interface AIGuardrailsProps {
  onQuickAction: (command: string) => void
}

const guardrailCategories = [
  { id: "all", name: "All Guardrails", count: 24, icon: Shield },
  { id: "content", name: "Content Safety", count: 8, icon: Lock },
  { id: "security", name: "Security", count: 6, icon: Shield },
  { id: "compliance", name: "Compliance", count: 5, icon: CheckCircle },
  { id: "performance", name: "Performance", count: 3, icon: Zap },
  { id: "custom", name: "Custom Rules", count: 2, icon: Settings },
]

const guardrails = [
  {
    id: "1",
    name: "PII Detection & Redaction",
    description: "Automatically detect and redact personally identifiable information in AI responses",
    category: "security",
    severity: "high",
    status: "active",
    triggers: 156,
    blocks: 23,
    warnings: 133,
    lastTriggered: "2 hours ago",
    rules: [
      "Detect credit card numbers, SSNs, phone numbers",
      "Redact email addresses in sensitive contexts",
      "Block sharing of internal employee data",
    ],
    isEnabled: true,
    confidence: 0.95,
  },
  {
    id: "2",
    name: "Code Security Scanner",
    description: "Prevent AI from generating or suggesting insecure code patterns",
    category: "security",
    severity: "high",
    status: "active",
    triggers: 89,
    blocks: 12,
    warnings: 77,
    lastTriggered: "4 hours ago",
    rules: [
      "Block hardcoded credentials in code suggestions",
      "Warn about SQL injection vulnerabilities",
      "Prevent insecure cryptographic implementations",
    ],
    isEnabled: true,
    confidence: 0.88,
  },
  {
    id: "3",
    name: "Content Appropriateness Filter",
    description: "Ensure AI responses maintain professional and appropriate tone",
    category: "content",
    severity: "medium",
    status: "active",
    triggers: 234,
    blocks: 45,
    warnings: 189,
    lastTriggered: "1 hour ago",
    rules: [
      "Block inappropriate language or content",
      "Maintain professional communication standards",
      "Prevent discriminatory or biased responses",
    ],
    isEnabled: true,
    confidence: 0.92,
  },
  {
    id: "4",
    name: "API Rate Limiting",
    description: "Prevent excessive API calls and resource consumption",
    category: "performance",
    severity: "medium",
    status: "active",
    triggers: 67,
    blocks: 67,
    warnings: 0,
    lastTriggered: "30 minutes ago",
    rules: [
      "Limit to 100 requests per minute per user",
      "Block requests exceeding token limits",
      "Throttle during high system load",
    ],
    isEnabled: true,
    confidence: 1.0,
  },
  {
    id: "5",
    name: "GDPR Compliance Check",
    description: "Ensure AI responses comply with GDPR data protection requirements",
    category: "compliance",
    severity: "high",
    status: "active",
    triggers: 45,
    blocks: 8,
    warnings: 37,
    lastTriggered: "6 hours ago",
    rules: [
      "Prevent processing of EU citizen data without consent",
      "Ensure right to be forgotten compliance",
      "Block cross-border data transfer violations",
    ],
    isEnabled: true,
    confidence: 0.87,
  },
]

const guardrailStats = {
  totalGuardrails: 24,
  activeGuardrails: 22,
  totalTriggers: 591,
  totalBlocks: 155,
  totalWarnings: 436,
  avgConfidence: 0.91,
  recentActivity: [
    { type: "block", guardrail: "PII Detection", reason: "Credit card number detected", time: "2 hours ago" },
    { type: "warning", guardrail: "Content Filter", reason: "Potentially inappropriate language", time: "3 hours ago" },
    { type: "block", guardrail: "API Rate Limiting", reason: "Rate limit exceeded", time: "4 hours ago" },
  ],
}

export default function AIGuardrails({ onQuickAction }: AIGuardrailsProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const filteredGuardrails = guardrails.filter((guardrail) => {
    const matchesCategory = selectedCategory === "all" || guardrail.category === selectedCategory
    const matchesSearch =
      guardrail.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guardrail.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 border-red-600"
      case "medium":
        return "text-yellow-600 border-yellow-600"
      case "low":
        return "text-green-600 border-green-600"
      default:
        return "text-posthog-gray border-posthog-gray"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-posthog-gray" />
    }
  }

  const getCategoryIcon = (category: string) => {
    const categoryConfig = guardrailCategories.find((c) => c.id === category)
    return categoryConfig ? categoryConfig.icon : Shield
  }

  return (
    <div className="space-y-6 min-h-[calc(100vh-200px)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-posthog-black">AI_GUARDRAILS</h2>
          <p className="text-posthog-gray font-mono text-xs sm:text-sm">
            SAFETY_AND_COMPLIANCE_CONTROLS_FOR_AI_SYSTEMS
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            CREATE_GUARDRAIL
          </Button>
          <Button
            onClick={() => onQuickAction("analyze guardrail effectiveness")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs w-full sm:w-auto"
          >
            <Shield className="h-4 w-4 mr-2" />
            ANALYZE_EFFECTIVENESS
          </Button>
          <Button
            onClick={() => onQuickAction("configure guardrail rules")}
            variant="outline"
            className="font-mono text-xs border-border text-foreground hover:bg-accent w-full sm:w-auto"
          >
            <Settings className="h-4 w-4 mr-2" />
            CONFIGURE_RULES
          </Button>
        </div>
      </div>

      <Tabs defaultValue="guardrails" className="space-y-4 min-h-[600px]">
        <TabsList className="bg-card border border-border w-full sm:w-auto">
          <TabsTrigger
            value="guardrails"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">GUARDRAILS</span>
            <span className="sm:hidden">GUARD</span>
          </TabsTrigger>
          <TabsTrigger
            value="monitoring"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <Activity className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">MONITORING</span>
            <span className="sm:hidden">MON</span>
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1 sm:flex-none"
          >
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">SETTINGS</span>
            <span className="sm:hidden">SET</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guardrails" className="space-y-4 min-h-[500px]">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-posthog-gray" />
              <Input
                placeholder="SEARCH_GUARDRAILS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 font-mono text-sm border-posthog-orange bg-white"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 font-mono text-sm border-posthog-orange">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {guardrailCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="font-mono text-sm">
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Guardrail Categories Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {guardrailCategories.map((category) => (
              <Card
                key={category.id}
                className={`border-border bg-card hover:border-primary transition-colors cursor-pointer h-20 ${
                  selectedCategory === category.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center h-full flex flex-col justify-center">
                  <category.icon className="h-5 w-5 mx-auto mb-1 text-posthog-orange" />
                  <div className="text-lg font-bold font-mono text-foreground">{category.count}</div>
                  <div className="text-xs font-mono text-muted-foreground">{category.name.toUpperCase()}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Guardrails List */}
          <div className="space-y-4 min-h-[300px]">
            {filteredGuardrails.map((guardrail) => {
              const CategoryIcon = getCategoryIcon(guardrail.category)
              return (
                <Card
                  key={guardrail.id}
                  className="border-border bg-card hover:border-primary transition-colors"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <CategoryIcon className="h-5 w-5 text-posthog-orange" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-mono text-sm font-medium text-posthog-black truncate">
                                {guardrail.name}
                              </h4>
                              <Switch checked={guardrail.isEnabled} />
                            </div>
                            <p className="text-xs text-posthog-gray font-mono line-clamp-2">{guardrail.description}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {getStatusIcon(guardrail.status)}
                            <Badge
                              variant="outline"
                              className={`font-mono text-xs ${getSeverityColor(guardrail.severity)}`}
                            >
                              {guardrail.severity.toUpperCase()}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 text-xs font-mono">
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-sm sm:text-lg font-bold text-foreground">{guardrail.triggers}</div>
                            <div className="text-xs font-mono text-muted-foreground">TRIGGERS</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-sm sm:text-lg font-bold text-foreground">{guardrail.blocks}</div>
                            <div className="text-xs font-mono text-muted-foreground">BLOCKS</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-sm sm:text-lg font-bold text-foreground">{guardrail.warnings}</div>
                            <div className="text-xs font-mono text-muted-foreground">WARNINGS</div>
                          </div>
                          <div className="text-center p-2 bg-muted rounded">
                            <div className="text-sm sm:text-lg font-bold text-foreground">
                              {(guardrail.confidence * 100).toFixed(0)}%
                            </div>
                            <div className="text-xs font-mono text-muted-foreground">CONFIDENCE</div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-xs font-mono text-posthog-gray">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Last triggered: {guardrail.lastTriggered}
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
                                  <DialogTitle className="font-mono text-posthog-black">{guardrail.name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-mono">
                                    <div>
                                      <span className="font-medium text-posthog-black">CATEGORY:</span>{" "}
                                      {guardrail.category}
                                    </div>
                                    <div>
                                      <span className="font-medium text-posthog-black">SEVERITY:</span>{" "}
                                      {guardrail.severity}
                                    </div>
                                    <div>
                                      <span className="font-medium text-posthog-black">STATUS:</span> {guardrail.status}
                                    </div>
                                    <div>
                                      <span className="font-medium text-posthog-black">CONFIDENCE:</span>{" "}
                                      {(guardrail.confidence * 100).toFixed(0)}%
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-mono text-sm font-medium text-posthog-black mb-2">RULES:</h4>
                                    <div className="space-y-2">
                                      {guardrail.rules.map((rule, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start gap-2 p-2 bg-muted rounded"
                                        >
                                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                          <span className="font-mono text-xs text-posthog-black">{rule}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                    <div className="p-3 bg-muted rounded">
                                      <div className="text-2xl font-bold font-mono text-foreground">
                                        {guardrail.triggers}
                                      </div>
                                      <div className="text-xs font-mono text-muted-foreground">TOTAL TRIGGERS</div>
                                    </div>
                                    <div className="p-3 bg-muted rounded">
                                      <div className="text-2xl font-bold font-mono text-foreground">
                                        {guardrail.blocks}
                                      </div>
                                      <div className="text-xs font-mono text-muted-foreground">BLOCKS</div>
                                    </div>
                                    <div className="p-3 bg-muted rounded">
                                      <div className="text-2xl font-bold font-mono text-foreground">
                                        {guardrail.warnings}
                                      </div>
                                      <div className="text-xs font-mono text-muted-foreground">WARNINGS</div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs">
                                      <Edit className="h-4 w-4 mr-2" />
                                      EDIT_GUARDRAIL
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => onQuickAction(`test guardrail: ${guardrail.name}`)}
                                      className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                                    >
                                      <Zap className="h-4 w-4 mr-2" />
                                      TEST
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              EDIT
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

        <TabsContent value="monitoring" className="space-y-4 min-h-[500px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-brand-orange" />
                  <span className="font-mono text-xs text-muted-foreground">TOTAL_GUARDRAILS</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">{guardrailStats.totalGuardrails}</div>
                <div className="text-xs font-mono text-green-600">{guardrailStats.activeGuardrails} active</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-posthog-orange" />
                  <span className="font-mono text-xs text-muted-foreground">TOTAL_TRIGGERS</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">{guardrailStats.totalTriggers}</div>
                <div className="text-xs font-mono text-green-600">+23 today</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-posthog-orange" />
                  <span className="font-mono text-xs text-muted-foreground">BLOCKS</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">{guardrailStats.totalBlocks}</div>
                <div className="text-xs font-mono text-posthog-gray">26% block rate</div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card h-24">
              <CardContent className="p-4 h-full flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-posthog-orange" />
                  <span className="font-mono text-xs text-muted-foreground">WARNINGS</span>
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">{guardrailStats.totalWarnings}</div>
                <div className="text-xs font-mono text-posthog-gray">74% warning rate</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-mono text-posthog-black">RECENT_ACTIVITY</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {guardrailStats.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded border border-border"
                  >
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                        activity.type === "block" ? "bg-red-100" : "bg-yellow-100"
                      }`}
                    >
                      {activity.type === "block" ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm text-posthog-black">
                        <span className="font-medium">{activity.guardrail}</span> {activity.type}
                      </p>
                      <p className="text-xs text-posthog-gray font-mono truncate">{activity.reason}</p>
                      <p className="text-xs text-posthog-gray font-mono">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 min-h-[500px]">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-mono text-posthog-black">GLOBAL_SETTINGS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium font-mono text-posthog-black mb-2">DEFAULT_ACTION</label>
                  <Select defaultValue="warn">
                    <SelectTrigger className="font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="block" className="font-mono text-sm">
                        Block
                      </SelectItem>
                      <SelectItem value="warn" className="font-mono text-sm">
                        Warn
                      </SelectItem>
                      <SelectItem value="log" className="font-mono text-sm">
                        Log Only
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium font-mono text-posthog-black mb-2">
                    CONFIDENCE_THRESHOLD
                  </label>
                  <Select defaultValue="0.8">
                    <SelectTrigger className="font-mono text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.6" className="font-mono text-sm">
                        60%
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
                <Button className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  SAVE_SETTINGS
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onQuickAction("test all guardrails")}
                  className="font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  TEST_ALL
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Guardrail Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-mono text-posthog-black">CREATE_NEW_GUARDRAIL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium font-mono text-posthog-black mb-1">NAME</label>
                <Input placeholder="Enter guardrail name..." className="font-mono text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium font-mono text-posthog-black mb-1">CATEGORY</label>
                <Select>
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {guardrailCategories.slice(1).map((category) => (
                      <SelectItem key={category.id} value={category.id} className="font-mono text-sm">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium font-mono text-posthog-black mb-1">DESCRIPTION</label>
              <Input placeholder="Brief description of the guardrail..." className="font-mono text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium font-mono text-posthog-black mb-1">RULES</label>
              <Textarea
                placeholder="Enter guardrail rules (one per line)..."
                className="min-h-[100px] font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium font-mono text-posthog-black mb-1">SEVERITY</label>
                <Select>
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue placeholder="Select severity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="font-mono text-sm">
                      Low
                    </SelectItem>
                    <SelectItem value="medium" className="font-mono text-sm">
                      Medium
                    </SelectItem>
                    <SelectItem value="high" className="font-mono text-sm">
                      High
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium font-mono text-posthog-black mb-1">ACTION</label>
                <Select>
                  <SelectTrigger className="font-mono text-sm">
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block" className="font-mono text-sm">
                      Block
                    </SelectItem>
                    <SelectItem value="warn" className="font-mono text-sm">
                      Warn
                    </SelectItem>
                    <SelectItem value="log" className="font-mono text-sm">
                      Log Only
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button className="bg-posthog-orange hover:bg-posthog-orange-dark text-white font-mono text-xs">
                <CheckCircle className="h-4 w-4 mr-2" />
                CREATE_GUARDRAIL
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