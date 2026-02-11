"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Server,
  Database,
  Key,
  Search,
  Activity,
  Code,
  Zap,
  Send,
  Bot,
  User,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Shield,
  Terminal,
  Users,
  BarChart3,
  BookOpen,
  DollarSign,
  TrendingUp,
  Cloud,
  Wrench,
  Settings,
  Lock,
  Layers,
  Bell,
  LogOut,
  UserCircle,
  Moon,
  Sun,
  HelpCircle,
  Menu,
  X,
  AlertCircle,
  Folder,
  Globe,
  Plus,
  Workflow,
  GitBranch,
  Target,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
import { ThemeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import tabConfig from "../../tab-config.json"
import { useRouter, usePathname } from "next/navigation"

// Icon mapping for dynamic icon rendering
const iconMap = {
  Bot,
  Cloud,
  Layers,
  BarChart3,
  Users,
  Code,
  Wrench,
  Lock,
  Settings,
  Zap,
  Plus,
  Database,
  Shield,
  Workflow,
  BookOpen,
  CheckCircle,
  GitBranch,
  Target,
}

// Helper function to get icon component from string
const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Bot
}

// Helper function to get enabled tabs from config
const getEnabledTabs = () => {
  return Object.entries(tabConfig.tabs)
    .filter(([_, config]) => config.enabled)
    .map(([id, config]) => ({
      id,
      label: config.label,
      icon: getIconComponent(config.icon),
    }))
}

// Helper function to get enabled subtabs for a specific tab
const getEnabledSubtabs = (tabId: string) => {
  const tab = tabConfig.tabs[tabId as keyof typeof tabConfig.tabs]
  if (!tab || !('subtabs' in tab) || !tab.subtabs) return []

  return Object.entries(tab.subtabs)
    .filter(([_, config]) => config.enabled)
    .map(([id, config]) => ({
      id,
      label: config.label,
      icon: getIconComponent(config.icon),
    }))
}

// Helper function to search through tabs and subtabs
const searchTabsAndSubtabs = (query: string) => {
  if (!query.trim()) return []
  
  const results: any[] = []
  const lowerQuery = query.toLowerCase()
  
  // Search through tabs
  Object.entries(tabConfig.tabs).forEach(([tabId, tabConfig]) => {
    if (!tabConfig.enabled) return
    
    const tabLabel = tabConfig.label.toLowerCase()
    const tabIcon = getIconComponent(tabConfig.icon)
    
    // Check if tab matches query
    if (tabLabel.includes(lowerQuery)) {
      results.push({
        type: 'tab',
        id: tabId,
        label: tabConfig.label,
        icon: tabIcon,
        path: `/${tabId}`,
        description: tabConfig.description || `${tabConfig.label}`
      })
    }
    
    // Search through subtabs if they exist
    if ('subtabs' in tabConfig && tabConfig.subtabs) {
      Object.entries(tabConfig.subtabs).forEach(([subtabId, subtabConfig]) => {
        if (!subtabConfig.enabled) return
        
        const subtabLabel = subtabConfig.label.toLowerCase()
        const subtabIcon = getIconComponent(subtabConfig.icon)
        
        if (subtabLabel.includes(lowerQuery)) {
          results.push({
            type: 'subtab',
            id: subtabId,
            label: subtabConfig.label,
            icon: subtabIcon,
            path: `/${tabId}?subtab=${subtabId}`,
            description: subtabConfig.description || `${subtabConfig.label}`,
            parentTab: tabConfig.label
          })
        }
      })
    }
  })
  
  return results.slice(0, 10) // Limit to 10 results
}

export default function TabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const currentTab = pathname.split('/')[1] // Get tab from URL

  const [commandTicker, setCommandTicker] = useState(0)
  const [showCommandHelper, setShowCommandHelper] = useState(true)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(() => {
    // Check if current tab should be expanded by default
    const tab = tabConfig.tabs[currentTab as keyof typeof tabConfig.tabs]
    if (tab && 'expandByDefault' in tab && tab.expandByDefault) {
      return currentTab
    }
    return null
  })

  // Get suggested results (popular/common tabs and subtabs)
  const getSuggestedResults = () => {
    const suggestions = [
      // Popular tabs
      {
        type: 'tab',
        id: 'self-service',
        label: 'SELF_SERVICE',
        icon: getIconComponent('Wrench'),
        path: '/self-service',
        description: tabConfig.tabs['self-service'].description,
        priority: 1
      },
      {
        type: 'tab',
        id: 'integrations',
        label: 'INTEGRATIONS',
        icon: getIconComponent('Cloud'),
        path: '/integrations',
        description: tabConfig.tabs['integrations'].description,
        priority: 1
      },
      {
        type: 'tab',
        id: 'ai',
        label: 'AI',
        icon: getIconComponent('Bot'),
        path: '/ai',
        description: tabConfig.tabs['ai'].description,
        priority: 1
      },
      {
        type: 'tab',
        id: 'catalog',
        label: 'CATALOG',
        icon: getIconComponent('Database'),
        path: '/catalog',
        description: tabConfig.tabs['catalog'].description,
        priority: 2
      },
      // Popular subtabs
      {
        type: 'subtab',
        id: 'actions',
        label: 'ACTIONS',
        icon: getIconComponent('Zap'),
        path: '/self-service?subtab=actions',
        description: tabConfig.tabs['self-service'].subtabs.actions.description,
        parentTab: 'SELF_SERVICE',
        priority: 1
      },
      {
        type: 'subtab',
        id: 'onboarding',
        label: 'ONBOARDING',
        icon: getIconComponent('Users'),
        path: '/portal?subtab=onboarding',
        description: tabConfig.tabs['portal'].subtabs.onboarding.description,
        parentTab: 'PORTAL',
        priority: 1
      },
      {
        type: 'subtab',
        id: 'prompt-hub',
        label: 'PROMPT_HUB',
        icon: getIconComponent('BookOpen'),
        path: '/ai?subtab=prompt-hub',
        description: tabConfig.tabs['ai'].subtabs['prompt-hub'].description,
        parentTab: 'AI',
        priority: 1
      },
      {
        type: 'subtab',
        id: 'service-catalog',
        label: 'SERVICE_CATALOG',
        icon: getIconComponent('Database'),
        path: '/catalog?subtab=service-catalog',
        description: 'Browse and manage services in the catalog',
        parentTab: 'CATALOG',
        priority: 2
      },
      {
        type: 'subtab',
        id: 'developer-workflows',
        label: 'DEVELOPER_WORKFLOWS',
        icon: getIconComponent('Workflow'),
        path: '/self-service?subtab=developer-workflows',
        description: tabConfig.tabs['self-service'].subtabs['developer-workflows'].description,
        parentTab: 'SELF_SERVICE',
        priority: 2
      },
      {
        type: 'subtab',
        id: 'external-services',
        label: 'EXTERNAL_SERVICES',
        icon: getIconComponent('Globe'),
        path: '/integrations?subtab=external',
        description: tabConfig.tabs['integrations'].subtabs.external.description,
        parentTab: 'INTEGRATIONS',
        priority: 2
      }
    ]
    
    // Sort by priority (1 = high, 2 = medium)
    return suggestions.sort((a, b) => a.priority - b.priority)
  }

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchTabsAndSubtabs(query)
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      // When clearing search, show suggestions again
      setSearchResults(getSuggestedResults())
      setShowSearchResults(true)
    }
  }

  // Handle search result click
  const handleSearchResultClick = (result: any) => {
    router.push(result.path)
    setShowSearchResults(false)
    setSearchQuery("")
    setSearchResults([])
  }

  // Click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowSearchResults(false)
        setSearchQuery("")
        setSearchResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Project and Environment state
  const [currentProject, setCurrentProject] = useState("payment-service")
  const [currentEnvironment, setCurrentEnvironment] = useState("production")

  // Sample data for projects and environments
  const projects = [
    { id: "payment-service", name: "Payment Service", description: "Core payment processing" },
    { id: "user-service", name: "User Service", description: "User management and auth" },
    { id: "notification-service", name: "Notification Service", description: "Email and SMS notifications" },
    { id: "analytics-service", name: "Analytics Service", description: "Data analytics and reporting" },
    { id: "frontend-app", name: "Frontend App", description: "Main web application" },
  ]

  const environments = [
    { id: "development", name: "Development", color: "bg-blue-500" },
    { id: "staging", name: "Staging", color: "bg-yellow-500" },
    { id: "production", name: "Production", color: "bg-green-500" },
    { id: "testing", name: "Testing", color: "bg-purple-500" },
  ]

  const tabItems = getEnabledTabs()
  const integrationSubTabs = getEnabledSubtabs("integrations")
  const aiSubTabs = getEnabledSubtabs("ai")
  const selfServiceSubTabs = getEnabledSubtabs("self-service")

  // Handle tab navigation
  const handleTabClick = (tabId: string) => {
    router.push(`/${tabId}`)
    
    // Toggle submenu for AI tab, but respect expandByDefault
    if (tabId === "ai") {
      const aiTab = tabConfig.tabs.ai
      if (aiTab && 'subtabs' in aiTab && aiTab.subtabs) {
        if ('expandByDefault' in aiTab && aiTab.expandByDefault) {
          // If expandByDefault is true, only collapse if already expanded
          setExpandedSubmenu(expandedSubmenu === "ai" ? "ai" : "ai")
        } else {
          // Normal toggle behavior
          setExpandedSubmenu(expandedSubmenu === "ai" ? null : "ai")
        }
      }
    } else if (tabId === "self-service") {
      const selfServiceTab = tabConfig.tabs["self-service"]
      if (selfServiceTab && 'subtabs' in selfServiceTab && selfServiceTab.subtabs) {
        if ('expandByDefault' in selfServiceTab && selfServiceTab.expandByDefault) {
          // If expandByDefault is true, only collapse if already expanded
          setExpandedSubmenu(expandedSubmenu === "self-service" ? "self-service" : "self-service")
        } else {
          // Normal toggle behavior
          setExpandedSubmenu(expandedSubmenu === "self-service" ? null : "self-service")
        }
      }
    } else {
      setExpandedSubmenu(null)
    }
  }

  // Handle subtab navigation
  const handleSubtabClick = (tabId: string, subtabId: string) => {
    router.push(`/${tabId}?subtab=${subtabId}`)
  }

  return (
    <div className="h-screen bg-background font-mono flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-card border-b border-border px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0">
        {/* Left Side */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="lg:hidden flex-shrink-0" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Logo */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
              <Bot className="h-3 w-3 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <h1 className="text-sm sm:text-xl font-bold text-foreground font-mono truncate">
              <span className="hidden xs:inline">EXEMPLAR</span><span className="xs:hidden">EX</span><span className="text-brand-orange">DEV</span>
            </h1>
          </div>

          {/* Project Selector - Desktop */}
          {/* <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="font-mono text-xs">
                  <Folder className="h-3 w-3 mr-2" />
                  <span className="hidden xl:inline">{projects.find(p => p.id === currentProject)?.name || "Select Project"}</span>
                  <span className="xl:hidden">{projects.find(p => p.id === currentProject)?.name.split(' ')[0] || "PROJ"}</span>
                  <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="font-mono">SELECT_PROJECT</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onClick={() => setCurrentProject(project.id)}
                    className={`font-mono text-xs ${currentProject === project.id ? "bg-accent" : ""}`}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs text-posthog-gray">{project.description}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}

          {/* Environment Selector - Desktop */}
          {/* <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="font-mono text-xs">
                  <Globe className="h-3 w-3 mr-2" />
                  <span className="hidden lg:inline">{environments.find(e => e.id === currentEnvironment)?.name.toUpperCase() || "ENV"}</span>
                  <span className="lg:hidden">{environments.find(e => e.id === currentEnvironment)?.name.toUpperCase().slice(0, 3) || "ENV"}</span>
                  <div className={`w-2 h-2 rounded-full ml-2 ${environments.find(e => e.id === currentEnvironment)?.color || "bg-gray-500"}`}></div>
                  <ChevronDown className="h-3 w-3 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel className="font-mono">SELECT_ENVIRONMENT</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {environments.map((env) => (
                  <DropdownMenuItem
                    key={env.id}
                    onClick={() => setCurrentEnvironment(env.id)}
                    className={`font-mono text-xs ${currentEnvironment === env.id ? "bg-accent" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${env.color}`}></div>
                      <span>{env.name}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div> */}

          {/* Mobile Project/Environment Badge */}
          {/* <div className="lg:hidden flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Badge variant="outline" className="font-mono text-xs text-brand-orange border-brand-orange">
              {projects.find(p => p.id === currentProject)?.name.split(' ')[0] || "PROJ"}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs text-brand-orange border-brand-orange">
              {currentEnvironment.toUpperCase().slice(0, 3)}
            </Badge>
          </div> */}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="sm" className="md:hidden flex-shrink-0">
            <Search className="h-4 w-4" />
          </Button>

          {/* Search - Desktop */}
          <div className="hidden md:flex relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-posthog-gray" />
            <Input
              placeholder="SEARCH_PLATFORM..."
              className="pl-10 w-60 lg:w-80 font-mono text-sm"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim() && searchResults.length > 0) {
                  setShowSearchResults(true)
                } else if (!searchQuery.trim()) {
                  // Show suggested results when focusing on empty search
                  setSearchResults(getSuggestedResults())
                  setShowSearchResults(true)
                }
              }}
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-posthog-cream-dark rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs font-mono text-posthog-gray mb-2 px-2">
                    {searchQuery.trim() 
                      ? (searchResults.length > 0 ? `SEARCH_RESULTS (${searchResults.length})` : 'NO_RESULTS_FOUND')
                      : `SUGGESTED_NAVIGATION (${searchResults.length})`
                    }
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((result, index) => (
                      <button
                        key={`${result.type}-${result.id}-${index}`}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full text-left p-3 hover:bg-posthog-cream rounded-md transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            <result.icon className="h-4 w-4 text-brand-orange" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-posthog-black text-sm truncate">
                                {result.label}
                              </span>
                              <Badge 
                                variant="outline" 
                                className="text-xs font-mono border-brand-orange text-brand-orange"
                              >
                                {result.type.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="text-xs text-posthog-gray truncate">
                              {result.description}
                            </div>
                          </div>
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ChevronRight className="h-4 w-4 text-posthog-gray" />
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm text-posthog-gray font-mono">
                      {searchQuery.trim() 
                        ? `No tabs or subtabs found matching "${searchQuery}"`
                        : "Start typing to search for specific tabs and subtabs..."
                      }
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Integration Status Badge - Desktop */}
          <div className="hidden lg:flex relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative px-2 lg:px-3 py-2 h-auto bg-posthog-cream hover:bg-posthog-cream-dark border border-posthog-cream-dark"
                    onClick={() => router.push('/integrations')}
                  >
                    <div className="flex items-center gap-1 lg:gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-xs font-mono text-posthog-black font-medium hidden xl:inline">
                        INTEGRATIONS
                      </span>
                      <Badge variant="outline" className="text-xs font-mono border-green-500 text-green-600 bg-green-50">
                        70+
                      </Badge>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="font-mono text-xs">
                  <div className="text-center">
                    <div className="font-medium mb-1">LIVE INTEGRATIONS</div>
                    <div className="text-xs text-muted-foreground">
                      70+ tools connected<br/>
                      Status: All Healthy
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Integration Status Badge - Mobile */}
          <div className="lg:hidden flex relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative px-2 py-2 h-auto bg-posthog-cream hover:bg-posthog-cream-dark border border-posthog-cream-dark"
                    onClick={() => router.push('/integrations')}
                  >
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono border-green-500 text-green-600 bg-green-50">
                        70+
                      </Badge>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="font-mono text-xs">
                  <div className="text-center">
                    <div className="font-medium mb-1">LIVE INTEGRATIONS</div>
                    <div className="text-xs text-muted-foreground">
                      70+ tools connected<br/>
                      Status: All Healthy
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative flex-shrink-0">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="font-mono">INBOX</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-2 bg-muted rounded text-sm font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="h-3 w-3 text-yellow-600" />
                    <span className="font-medium">DEPLOYMENT_ALERT</span>
                  </div>
                  <p className="text-xs text-muted-foreground">payment-service deployment failed in staging</p>
                  <span className="text-xs text-muted-foreground">2 minutes ago</span>
                </div>
                <div className="p-2 bg-muted rounded text-sm font-mono">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="font-medium">APPROVAL_COMPLETED</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Infrastructure request approved by platform team</p>
                  <span className="text-xs text-muted-foreground">5 minutes ago</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 flex-shrink-0">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="/placeholder.svg?height=24&width=24" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-mono">JD</AvatarFallback>
                </Avatar>
                <span className="hidden lg:block font-mono text-sm text-foreground">john.doe@company.com</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-mono">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">JOHN_DOE</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@company.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-mono text-xs">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>PROFILE</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-mono text-xs">
                <Settings className="mr-2 h-4 w-4" />
                <span>SETTINGS</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-mono text-xs">
                <Key className="mr-2 h-4 w-4" />
                <span>API_KEYS</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="font-mono text-xs">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>HELP</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-mono text-xs text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>LOGOUT</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar Navigation - Desktop */}
        <div
          className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 flex-shrink-0 ${
            sidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <div className="p-4 border-b border-border">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="w-full justify-start font-mono text-xs"
                  >
                    <Menu className="h-4 w-4" />
                    {!sidebarCollapsed && <span className="ml-2">HELLO_WORLD</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You're my world!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <nav className="flex-1 p-2 overflow-y-auto">
            <div className="space-y-1">
              {tabItems.map((tab) => (
                <div key={tab.id}>
                  <Button
                    variant={currentTab === tab.id ? "default" : "ghost"}
                    className={`w-full justify-start font-mono text-xs ${
                      currentTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent"
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <tab.icon className="h-4 w-4" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="ml-2">{tab.label}</span>
                        {tab.id === "ai" && (() => {
                          const aiTab = tabConfig.tabs.ai
                          return aiTab && 'subtabs' in aiTab && aiTab.subtabs ? (
                            <ChevronDown
                              className={`h-3 w-3 ml-auto transition-transform ${
                                expandedSubmenu === "ai" ? "rotate-180" : ""
                              }`}
                            />
                          ) : null
                        })()}
                        {tab.id === "self-service" && (() => {
                          const selfServiceTab = tabConfig.tabs["self-service"]
                          return selfServiceTab && 'subtabs' in selfServiceTab && selfServiceTab.subtabs ? (
                            <ChevronDown
                              className={`h-3 w-3 ml-auto transition-transform ${
                                expandedSubmenu === "self-service" ? "rotate-180" : ""
                              }`}
                            />
                          ) : null
                        })()}
                      </>
                    )}
                  </Button>

                  {/* AI Submenu */}
                  {tab.id === "ai" && expandedSubmenu === "ai" && !sidebarCollapsed && tabConfig.tabs.ai?.subtabs && (
                    <div className="ml-6 mt-1 space-y-1">
                      {aiSubTabs.map((subTab) => (
                        <Button
                          key={subTab.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => handleSubtabClick("ai", subTab.id)}
                        >
                          <subTab.icon className="h-3 w-3" />
                          <span className="ml-2 text-xs">{subTab.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Self-Service Submenu */}
                  {tab.id === "self-service" && expandedSubmenu === "self-service" && !sidebarCollapsed && tabConfig.tabs["self-service"]?.subtabs && (
                    <div className="ml-6 mt-1 space-y-1">
                      {selfServiceSubTabs.map((subTab) => (
                        <Button
                          key={subTab.id}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                          onClick={() => handleSubtabClick("self-service", subTab.id)}
                        >
                          <subTab.icon className="h-3 w-3" />
                          <span className="ml-2 text-xs">{subTab.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="bg-card w-64 h-full border-r border-border">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-medium text-foreground">NAVIGATION</span>
                  <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <nav className="p-2 overflow-y-auto h-full">
                <div className="space-y-1">
                  {tabItems.map((tab) => (
                    <div key={tab.id}>
                      <Button
                        variant={currentTab === tab.id ? "default" : "ghost"}
                        className={`w-full justify-start font-mono text-xs ${
                          currentTab === tab.id
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent"
                        }`}
                        onClick={() => {
                          handleTabClick(tab.id)
                          if (tab.id === "ai" && tabConfig.tabs.ai?.subtabs) {
                            if (tabConfig.tabs.ai?.expandByDefault) {
                              setExpandedSubmenu("ai")
                            } else {
                              setExpandedSubmenu(expandedSubmenu === "ai" ? null : "ai")
                            }
                          } else if (tab.id === "self-service" && tabConfig.tabs["self-service"]?.subtabs) {
                            if (tabConfig.tabs["self-service"]?.expandByDefault) {
                              setExpandedSubmenu("self-service")
                            } else {
                              setExpandedSubmenu(expandedSubmenu === "self-service" ? null : "self-service")
                            }
                          } else {
                            setExpandedSubmenu(null)
                            setMobileMenuOpen(false)
                          }
                        }}
                      >
                        <tab.icon className="h-4 w-4 mr-2" />
                        {tab.label}
                        {tab.id === "ai" && (() => {
                          const aiTab = tabConfig.tabs.ai
                          return aiTab && 'subtabs' in aiTab && aiTab.subtabs ? (
                            <ChevronDown
                              className={`h-3 w-3 ml-auto transition-transform ${
                                expandedSubmenu === "ai" ? "rotate-180" : ""
                              }`}
                            />
                          ) : null
                        })()}
                        {tab.id === "self-service" && (() => {
                          const selfServiceTab = tabConfig.tabs["self-service"]
                          return selfServiceTab && 'subtabs' in selfServiceTab && selfServiceTab.subtabs ? (
                            <ChevronDown
                              className={`h-3 w-3 ml-auto transition-transform ${
                                expandedSubmenu === "self-service" ? "rotate-180" : ""
                              }`}
                            />
                          ) : null
                        })()}
                      </Button>

                      {/* AI Submenu - Mobile */}
                      {tab.id === "ai" && expandedSubmenu === "ai" && tabConfig.tabs.ai?.subtabs && (
                        <div className="ml-6 mt-1 space-y-1">
                          {aiSubTabs.map((subTab) => (
                            <Button
                              key={subTab.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                              onClick={() => {
                                handleSubtabClick("ai", subTab.id)
                                setMobileMenuOpen(false)
                              }}
                            >
                              <subTab.icon className="h-3 w-3 mr-2" />
                              <span className="text-xs">{subTab.label}</span>
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Self-Service Submenu - Mobile */}
                      {tab.id === "self-service" && expandedSubmenu === "self-service" && tabConfig.tabs["self-service"]?.subtabs && (
                        <div className="ml-6 mt-1 space-y-1">
                          {selfServiceSubTabs.map((subTab) => (
                            <Button
                              key={subTab.id}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start font-mono text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                              onClick={() => {
                                handleSubtabClick("self-service", subTab.id)
                                setMobileMenuOpen(false)
                              }}
                            >
                              <subTab.icon className="h-3 w-3 mr-2" />
                              <span className="text-xs">{subTab.label}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
} 