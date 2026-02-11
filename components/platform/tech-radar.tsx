"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Code,
  Wrench,
  Server,
  Layers,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  BookOpen,
  Users,
  Calendar,
} from "lucide-react"

interface TechRadarProps {
  onQuickAction: (command: string) => void
}

const techRadarData = {
  tools: [
    {
      name: "Docker",
      ring: "adopt",
      description: "Containerization platform for consistent deployments",
      team: "platform",
      lastUpdated: "2024-01-15",
      reasoning: "Proven technology with excellent ecosystem support",
      impact: "high",
      effort: "low",
      maturity: "mature",
      usage: "95%",
      trend: "stable",
    },
    {
      name: "Kubernetes",
      ring: "adopt",
      description: "Container orchestration for scalable applications",
      team: "platform",
      lastUpdated: "2024-01-10",
      reasoning: "Industry standard for container orchestration",
      impact: "high",
      effort: "high",
      maturity: "mature",
      usage: "78%",
      trend: "growing",
    },
    {
      name: "Terraform",
      ring: "adopt",
      description: "Infrastructure as Code for cloud resources",
      team: "platform",
      lastUpdated: "2024-01-20",
      reasoning: "Declarative infrastructure management",
      impact: "high",
      effort: "medium",
      maturity: "mature",
      usage: "89%",
      trend: "stable",
    },
    {
      name: "Pulumi",
      ring: "trial",
      description: "Modern Infrastructure as Code with programming languages",
      team: "platform",
      lastUpdated: "2024-01-12",
      reasoning: "Better developer experience than traditional IaC",
      impact: "medium",
      effort: "medium",
      maturity: "growing",
      usage: "12%",
      trend: "growing",
    },
    {
      name: "Ansible",
      ring: "assess",
      description: "Configuration management and automation",
      team: "platform",
      lastUpdated: "2024-01-08",
      reasoning: "Evaluating for specific use cases",
      impact: "medium",
      effort: "medium",
      maturity: "mature",
      usage: "5%",
      trend: "stable",
    },
    {
      name: "Chef",
      ring: "hold",
      description: "Legacy configuration management tool",
      team: "platform",
      lastUpdated: "2023-12-15",
      reasoning: "Being phased out in favor of modern alternatives",
      impact: "low",
      effort: "high",
      maturity: "legacy",
      usage: "8%",
      trend: "declining",
    },
  ],
  techniques: [
    {
      name: "Microservices",
      ring: "adopt",
      description: "Distributed system architecture pattern",
      team: "architecture",
      lastUpdated: "2024-01-18",
      reasoning: "Enables team autonomy and scalability",
      impact: "high",
      effort: "high",
      maturity: "mature",
      usage: "85%",
      trend: "stable",
    },
    {
      name: "Event Sourcing",
      ring: "trial",
      description: "Event-driven data persistence pattern",
      team: "architecture",
      lastUpdated: "2024-01-14",
      reasoning: "Exploring for audit-heavy domains",
      impact: "medium",
      effort: "high",
      maturity: "growing",
      usage: "15%",
      trend: "growing",
    },
    {
      name: "CQRS",
      ring: "assess",
      description: "Command Query Responsibility Segregation",
      team: "architecture",
      lastUpdated: "2024-01-10",
      reasoning: "Evaluating for read/write optimization",
      impact: "medium",
      effort: "high",
      maturity: "niche",
      usage: "3%",
      trend: "stable",
    },
    {
      name: "Monolithic Architecture",
      ring: "hold",
      description: "Single deployable unit architecture",
      team: "architecture",
      lastUpdated: "2023-11-20",
      reasoning: "Moving away from monoliths for new services",
      impact: "low",
      effort: "low",
      maturity: "legacy",
      usage: "25%",
      trend: "declining",
    },
  ],
  platforms: [
    {
      name: "AWS",
      ring: "adopt",
      description: "Primary cloud platform for infrastructure",
      team: "platform",
      lastUpdated: "2024-01-22",
      reasoning: "Comprehensive service offering and reliability",
      impact: "high",
      effort: "medium",
      maturity: "mature",
      usage: "92%",
      trend: "stable",
    },
    {
      name: "Vercel",
      ring: "adopt",
      description: "Frontend deployment and hosting platform",
      team: "frontend",
      lastUpdated: "2024-01-19",
      reasoning: "Excellent developer experience for frontend apps",
      impact: "high",
      effort: "low",
      maturity: "mature",
      usage: "78%",
      trend: "growing",
    },
    {
      name: "Google Cloud",
      ring: "trial",
      description: "Secondary cloud platform for specific workloads",
      team: "platform",
      lastUpdated: "2024-01-16",
      reasoning: "Evaluating for ML and data analytics workloads",
      impact: "medium",
      effort: "medium",
      maturity: "mature",
      usage: "18%",
      trend: "growing",
    },
    {
      name: "Azure",
      ring: "assess",
      description: "Enterprise cloud platform",
      team: "platform",
      lastUpdated: "2024-01-11",
      reasoning: "Considering for enterprise customer requirements",
      impact: "low",
      effort: "high",
      maturity: "mature",
      usage: "5%",
      trend: "stable",
    },
    {
      name: "Heroku",
      ring: "hold",
      description: "Legacy PaaS platform",
      team: "platform",
      lastUpdated: "2023-10-15",
      reasoning: "Migrating away due to cost and limitations",
      impact: "low",
      effort: "low",
      maturity: "legacy",
      usage: "12%",
      trend: "declining",
    },
  ],
  languages_frameworks: [
    {
      name: "TypeScript",
      ring: "adopt",
      description: "Typed JavaScript superset for better development",
      team: "frontend",
      lastUpdated: "2024-01-21",
      reasoning: "Improved developer experience and code quality",
      impact: "high",
      effort: "low",
      maturity: "mature",
      usage: "94%",
      trend: "stable",
    },
    {
      name: "React",
      ring: "adopt",
      description: "Frontend UI library for building interfaces",
      team: "frontend",
      lastUpdated: "2024-01-20",
      reasoning: "Large ecosystem and community support",
      impact: "high",
      effort: "medium",
      maturity: "mature",
      usage: "89%",
      trend: "stable",
    },
    {
      name: "Node.js",
      ring: "adopt",
      description: "JavaScript runtime for backend services",
      team: "backend",
      lastUpdated: "2024-01-18",
      reasoning: "Unified language across frontend and backend",
      impact: "high",
      effort: "low",
      maturity: "mature",
      usage: "76%",
      trend: "stable",
    },
    {
      name: "Next.js",
      ring: "adopt",
      description: "React framework with SSR and static generation",
      team: "frontend",
      lastUpdated: "2024-01-17",
      reasoning: "Full-stack React framework with great performance",
      impact: "high",
      effort: "medium",
      maturity: "mature",
      usage: "67%",
      trend: "growing",
    },
    {
      name: "Svelte",
      ring: "trial",
      description: "Compile-time UI framework with small bundle size",
      team: "frontend",
      lastUpdated: "2024-01-13",
      reasoning: "Exploring for performance-critical applications",
      impact: "medium",
      effort: "medium",
      maturity: "growing",
      usage: "8%",
      trend: "growing",
    },
    {
      name: "Vue.js",
      ring: "assess",
      description: "Progressive UI framework",
      team: "frontend",
      lastUpdated: "2024-01-09",
      reasoning: "Evaluating for specific team preferences",
      impact: "low",
      effort: "medium",
      maturity: "mature",
      usage: "3%",
      trend: "stable",
    },
    {
      name: "Angular",
      ring: "hold",
      description: "Enterprise UI framework",
      team: "frontend",
      lastUpdated: "2023-12-01",
      reasoning: "Too complex for our current needs",
      impact: "low",
      effort: "high",
      maturity: "mature",
      usage: "15%",
      trend: "declining",
    },
  ],
}

const ringColors = {
  adopt: { bg: "bg-green-100", border: "border-green-500", text: "text-green-800", icon: CheckCircle },
  trial: { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800", icon: Clock },
  assess: { bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-800", icon: AlertTriangle },
  hold: { bg: "bg-red-100", border: "border-red-500", text: "text-red-800", icon: XCircle },
}

const categoryIcons = {
  tools: Wrench,
  techniques: Layers,
  platforms: Server,
  languages_frameworks: Code,
}

export default function TechRadar({ onQuickAction }: TechRadarProps) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRing, setSelectedRing] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTech, setSelectedTech] = useState<any>(null)
  const [viewMode, setViewMode] = useState("grid")

  const categories = ["all", "tools", "techniques", "platforms", "languages_frameworks"]
  const rings = ["all", "adopt", "trial", "assess", "hold"]

  const getAllTechnologies = () => {
    return Object.entries(techRadarData).flatMap(([category, techs]) => techs.map((tech) => ({ ...tech, category })))
  }

  const filteredTechnologies = getAllTechnologies().filter((tech) => {
    const matchesCategory = selectedCategory === "all" || tech.category === selectedCategory
    const matchesRing = selectedRing === "all" || tech.ring === selectedRing
    const matchesSearch =
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesRing && matchesSearch
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "growing":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "declining":
        return <TrendingDown className="h-3 w-3 text-red-600" />
      default:
        return <div className="h-3 w-3" />
    }
  }

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case "mature":
        return "text-green-600"
      case "growing":
        return "text-blue-600"
      case "niche":
        return "text-yellow-600"
      case "legacy":
        return "text-red-600"
      default:
        return "text-posthog-gray"
    }
  }

  const RadarVisualization = () => (
    <Card className="border-posthog-cream-dark bg-white">
      <CardHeader>
        <CardTitle className="font-mono text-posthog-black">TECHNOLOGY_RADAR_VISUALIZATION</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 bg-posthog-cream rounded-lg flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-80 h-80 relative">
              {/* Radar Rings */}
              <div className="absolute inset-0 border-4 border-green-500 rounded-full opacity-20"></div>
              <div className="absolute inset-4 border-4 border-blue-500 rounded-full opacity-20"></div>
              <div className="absolute inset-8 border-4 border-yellow-500 rounded-full opacity-20"></div>
              <div className="absolute inset-12 border-4 border-red-500 rounded-full opacity-20"></div>

              {/* Quadrant Lines */}
              <div className="absolute top-0 left-1/2 w-0.5 h-full bg-posthog-gray opacity-30 transform -translate-x-0.5"></div>
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-posthog-gray opacity-30 transform -translate-y-0.5"></div>

              {/* Quadrant Labels */}
              <div className="absolute top-4 left-4 font-mono text-xs text-posthog-black font-medium">TOOLS</div>
              <div className="absolute top-4 right-4 font-mono text-xs text-posthog-black font-medium">TECHNIQUES</div>
              <div className="absolute bottom-4 left-4 font-mono text-xs text-posthog-black font-medium">PLATFORMS</div>
              <div className="absolute bottom-4 right-4 font-mono text-xs text-posthog-black font-medium">
                LANGUAGES
              </div>

              {/* Ring Labels */}
              <div className="absolute top-1/2 left-2 font-mono text-xs text-green-600 font-medium transform -translate-y-1/2">
                ADOPT
              </div>
              <div className="absolute top-1/2 left-6 font-mono text-xs text-blue-600 font-medium transform -translate-y-1/2">
                TRIAL
              </div>
              <div className="absolute top-1/2 left-10 font-mono text-xs text-yellow-600 font-medium transform -translate-y-1/2">
                ASSESS
              </div>
              <div className="absolute top-1/2 left-14 font-mono text-xs text-red-600 font-medium transform -translate-y-1/2">
                HOLD
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 text-xs font-mono text-posthog-gray">
            INTERACTIVE_RADAR_VISUALIZATION_COMING_SOON
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-posthog-black">TECHNOLOGY_RADAR</h2>
          <p className="text-posthog-gray font-mono text-sm">
            TECHNOLOGY_ADOPTION_AND_RECOMMENDATIONS_FROM_GLOBAL_TEAMS
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "radar" : "grid")}
            className="font-mono text-xs border-border text-foreground hover:bg-accent bg-transparent"
          >
            <Eye className="h-4 w-4 mr-2" />
            {viewMode === "grid" ? "RADAR_VIEW" : "GRID_VIEW"}
          </Button>
          <Button
            onClick={() => onQuickAction("show tech radar for frontend frameworks")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-mono text-xs"
          >
            <Search className="h-4 w-4 mr-2" />
            EXPLORE_RADAR
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="SEARCH_TECHNOLOGIES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border font-mono text-sm"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-border font-mono">
                <SelectValue placeholder="FILTER_BY_CATEGORY" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.replace("_", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedRing} onValueChange={setSelectedRing}>
              <SelectTrigger className="border-border font-mono">
                <SelectValue placeholder="FILTER_BY_RING" />
              </SelectTrigger>
              <SelectContent>
                {rings.map((ring) => (
                  <SelectItem key={ring} value={ring}>
                    {ring.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <span>{filteredTechnologies.length} TECHNOLOGIES</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === "radar" ? (
        <RadarVisualization />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Technology List */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="bg-card border border-border">
                <TabsTrigger
                  value="all"
                  className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  ALL
                </TabsTrigger>
                {Object.keys(techRadarData).map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons]
                  return (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {category.replace("_", " ").toUpperCase()}
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              <TabsContent value="all" className="space-y-3 mt-0">
                {filteredTechnologies.map((tech, index) => {
                  const ringConfig = ringColors[tech.ring as keyof typeof ringColors]
                  const CategoryIcon = categoryIcons[tech.category as keyof typeof categoryIcons]

                  return (
                    <Card
                      key={index}
                      className={`border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors cursor-pointer ${
                        selectedTech?.name === tech.name ? "ring-2 ring-posthog-orange" : ""
                      }`}
                      onClick={() => setSelectedTech(tech)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <CategoryIcon className="h-5 w-5 text-posthog-orange" />
                            <div>
                              <h4 className="font-mono text-sm font-medium text-posthog-black">{tech.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs border-posthog-orange text-posthog-orange"
                                >
                                  {tech.category.replace("_", " ").toUpperCase()}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="font-mono text-xs border-posthog-orange text-posthog-orange"
                                >
                                  {tech.team.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`p-2 rounded ${ringConfig.bg} ${ringConfig.border} border`}>
                              <ringConfig.icon className={`h-4 w-4 ${ringConfig.text}`} />
                            </div>
                            <Badge
                              variant={
                                tech.ring === "adopt"
                                  ? "default"
                                  : tech.ring === "trial"
                                    ? "secondary"
                                    : tech.ring === "assess"
                                      ? "outline"
                                      : "destructive"
                              }
                              className="font-mono text-xs"
                            >
                              {tech.ring.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-posthog-gray font-mono mb-3">{tech.description}</p>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-4">
                            <span className="text-posthog-gray">Usage: {tech.usage}</span>
                            <span className={`${getMaturityColor(tech.maturity)}`}>{tech.maturity.toUpperCase()}</span>
                            <div className="flex items-center gap-1">
                              {getTrendIcon(tech.trend)}
                              <span className="text-posthog-gray">{tech.trend}</span>
                            </div>
                          </div>
                          <span className="text-posthog-gray">Updated: {tech.lastUpdated}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </TabsContent>

              {Object.entries(techRadarData).map(([category, technologies]) => (
                <TabsContent key={category} value={category} className="space-y-3 mt-0">
                  {technologies
                    .filter((tech) => {
                      const matchesRing = selectedRing === "all" || tech.ring === selectedRing
                      const matchesSearch =
                        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tech.description.toLowerCase().includes(searchQuery.toLowerCase())
                      return matchesRing && matchesSearch
                    })
                    .map((tech, index) => {
                      const ringConfig = ringColors[tech.ring as keyof typeof ringColors]
                      const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]

                      return (
                        <Card
                          key={index}
                          className={`border-posthog-cream-dark bg-white hover:border-posthog-orange transition-colors cursor-pointer ${
                            selectedTech?.name === tech.name ? "ring-2 ring-posthog-orange" : ""
                          }`}
                          onClick={() => setSelectedTech({ ...tech, category })}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <CategoryIcon className="h-5 w-5 text-posthog-orange" />
                                <div>
                                  <h4 className="font-mono text-sm font-medium text-posthog-black">{tech.name}</h4>
                                  <Badge
                                    variant="outline"
                                    className="font-mono text-xs border-posthog-orange text-posthog-orange mt-1"
                                  >
                                    {tech.team.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded ${ringConfig.bg} ${ringConfig.border} border`}>
                                  <ringConfig.icon className={`h-4 w-4 ${ringConfig.text}`} />
                                </div>
                                <Badge
                                  variant={
                                    tech.ring === "adopt"
                                      ? "default"
                                      : tech.ring === "trial"
                                        ? "secondary"
                                        : tech.ring === "assess"
                                          ? "outline"
                                          : "destructive"
                                  }
                                  className="font-mono text-xs"
                                >
                                  {tech.ring.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-posthog-gray font-mono mb-3">{tech.description}</p>
                            <div className="flex items-center justify-between text-xs font-mono">
                              <div className="flex items-center gap-4">
                                <span className="text-posthog-gray">Usage: {tech.usage}</span>
                                <span className={`${getMaturityColor(tech.maturity)}`}>
                                  {tech.maturity.toUpperCase()}
                                </span>
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(tech.trend)}
                                  <span className="text-posthog-gray">{tech.trend}</span>
                                </div>
                              </div>
                              <span className="text-posthog-gray">Updated: {tech.lastUpdated}</span>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Technology Details */}
          <div className="space-y-4">
            {selectedTech ? (
              <>
                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="font-mono text-posthog-black text-sm">TECHNOLOGY_DETAILS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-mono text-xs font-medium text-posthog-black mb-2">ADOPTION_INFO</h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">RING:</span>
                          <Badge
                            variant={
                              selectedTech.ring === "adopt"
                                ? "default"
                                : selectedTech.ring === "trial"
                                  ? "secondary"
                                  : selectedTech.ring === "assess"
                                    ? "outline"
                                    : "destructive"
                            }
                            className="font-mono text-xs"
                          >
                            {selectedTech.ring.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">USAGE:</span>
                          <span className="text-posthog-black">{selectedTech.usage}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">MATURITY:</span>
                          <span className={getMaturityColor(selectedTech.maturity)}>
                            {selectedTech.maturity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">TREND:</span>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(selectedTech.trend)}
                            <span className="text-posthog-black">{selectedTech.trend}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-mono text-xs font-medium text-posthog-black mb-2">ASSESSMENT</h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">IMPACT:</span>
                          <Badge
                            variant={
                              selectedTech.impact === "high"
                                ? "default"
                                : selectedTech.impact === "medium"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="font-mono text-xs"
                          >
                            {selectedTech.impact.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">EFFORT:</span>
                          <Badge
                            variant={
                              selectedTech.effort === "high"
                                ? "destructive"
                                : selectedTech.effort === "medium"
                                  ? "secondary"
                                  : "default"
                            }
                            className="font-mono text-xs"
                          >
                            {selectedTech.effort.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">TEAM:</span>
                          <span className="text-posthog-black">{selectedTech.team.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-posthog-gray">UPDATED:</span>
                          <span className="text-posthog-black">{selectedTech.lastUpdated}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-mono text-xs font-medium text-posthog-black mb-2">REASONING</h4>
                      <p className="text-xs font-mono text-posthog-gray p-2 bg-posthog-cream rounded">
                        {selectedTech.reasoning}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-posthog-cream-dark bg-white">
                  <CardHeader>
                    <CardTitle className="font-mono text-posthog-black text-sm">QUICK_ACTIONS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                      onClick={() => onQuickAction(`search tech radar for ${selectedTech.name}`)}
                    >
                      <Search className="h-3 w-3 mr-2" />
                      SEARCH_SIMILAR
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                    >
                      <BookOpen className="h-3 w-3 mr-2" />
                      VIEW_DOCS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                    >
                      <Users className="h-3 w-3 mr-2" />
                      CONTACT_TEAM
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full font-mono text-xs border-posthog-orange text-posthog-orange hover:bg-posthog-orange hover:text-white bg-transparent"
                    >
                      <Calendar className="h-3 w-3 mr-2" />
                      SCHEDULE_REVIEW
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-posthog-cream-dark bg-white h-96 flex items-center justify-center">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto text-posthog-gray mb-4" />
                  <p className="text-posthog-gray font-mono">SELECT_A_TECHNOLOGY_TO_VIEW_DETAILS</p>
                </div>
              </Card>
            )}

            {/* Ring Legend */}
            <Card className="border-posthog-cream-dark bg-white">
              <CardHeader>
                <CardTitle className="font-mono text-posthog-black text-sm">ADOPTION_RINGS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(ringColors).map(([ring, config]) => (
                  <div key={ring} className="flex items-center gap-3">
                    <div className={`p-2 rounded ${config.bg} ${config.border} border`}>
                      <config.icon className={`h-4 w-4 ${config.text}`} />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-medium text-posthog-black">{ring.toUpperCase()}</div>
                      <div className="font-mono text-xs text-posthog-gray">
                        {ring === "adopt" && "Use for new projects"}
                        {ring === "trial" && "Try on non-critical projects"}
                        {ring === "assess" && "Evaluate potential"}
                        {ring === "hold" && "Avoid or phase out"}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
