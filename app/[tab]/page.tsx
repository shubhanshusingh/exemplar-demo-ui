"use client"

import { useParams, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { createTabRegistry } from "@/components/tab-registry"
import tabConfig from "../../tab-config.json"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command"
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
} from "lucide-react"

interface TabPageProps {
  params: Promise<{ tab: string }>
}

export default function TabPage({ params }: TabPageProps) {
  const resolvedParams = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<string>("")
  const [activeSubTab, setActiveSubTab] = useState<string>("")
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const commandInputRef = useRef<HTMLInputElement>(null)

  // Get tab from URL params
  const tabFromUrl = resolvedParams.tab as string
  const subtabFromQuery = searchParams.get('subtab')

  // Helper functions
  const getEnabledTabs = () => {
    return Object.entries(tabConfig.tabs)
      .filter(([_, config]) => config.enabled)
      .map(([id, config]) => ({
        id,
        label: config.label,
        icon: config.icon,
        enabled: config.enabled,
        expandByDefault: 'expandByDefault' in config ? config.expandByDefault : false,
        subtabs: 'subtabs' in config ? config.subtabs : {}
      }))
  }

  const getEnabledSubtabs = (tabId: string) => {
    const tab = tabConfig.tabs[tabId as keyof typeof tabConfig.tabs]
    if (!tab || !('subtabs' in tab) || !tab.subtabs) return []

    return Object.entries(tab.subtabs)
      .filter(([_, config]) => config.enabled)
      .map(([id, config]) => ({
        id,
        label: config.label,
        icon: config.icon,
        enabled: config.enabled
      }))
  }

  // Validate tab and redirect if invalid
  useEffect(() => {
    const enabledTabs = getEnabledTabs()
    const validTab = enabledTabs.find(tab => tab.id === tabFromUrl)

    if (!validTab) {
      // Redirect to first enabled tab if invalid
      const firstTab = enabledTabs[0]?.id || "chat"
      router.replace(`/${firstTab}`)
      return
    }

    setActiveTab(tabFromUrl)

    // Set default subtab if none specified
    if (!subtabFromQuery) {
      const subtabs = getEnabledSubtabs(tabFromUrl)
      if (subtabs.length > 0) {
        const defaultSubtab = subtabs[0].id
        setActiveSubTab(defaultSubtab)
        // Update URL with default subtab
        router.replace(`/${tabFromUrl}?subtab=${defaultSubtab}`, { scroll: false })
      }
    } else {
      setActiveSubTab(subtabFromQuery)
    }

    // Set expanded submenu based on tab config
    const tab = tabConfig.tabs[tabFromUrl as keyof typeof tabConfig.tabs]
    if (tab && 'expandByDefault' in tab && tab.expandByDefault) {
      setExpandedSubmenu(tabFromUrl)
    }
  }, [tabFromUrl, subtabFromQuery, router])

  // Handle subtab changes
  const handleSubtabChange = (subtab: string) => {
    setActiveSubTab(subtab)
    router.replace(`/${activeTab}?subtab=${subtab}`, { scroll: false })
  }

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsCommandOpen(true)
        setTimeout(() => commandInputRef.current?.focus(), 100)
      }
      if (e.key === "Escape") {
        setIsCommandOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Get tab registry with minimal props
  const tabRegistry = createTabRegistry({
    activeTab,
    activeSubTab,
    onSubTabChange: handleSubtabChange,
    tabItems: getEnabledTabs(),
    aiSubTabs: getEnabledSubtabs("ai"),
    selfServiceSubTabs: getEnabledSubtabs("self-service"),
    integrationSubTabs: getEnabledSubtabs("integrations"),
    insightsSubTabs: getEnabledSubtabs("insights"),
    expandedSubmenu,
    setExpandedSubmenu
  })
  const currentTabConfig = tabRegistry.getTab(activeTab)

  if (!activeTab || !currentTabConfig) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading tab...</p>
        </div>
      </div>
    )
  }

  // Render the tab component with proper props
  const TabComponent = currentTabConfig.component
  const tabProps = currentTabConfig.props || {}

  return (
    <TabComponent
      {...tabProps}
      activeTab={activeTab}
      activeSubTab={activeSubTab}
      onSubtabChange={handleSubtabChange}
      expandedSubmenu={expandedSubmenu}
      setExpandedSubmenu={setExpandedSubmenu}
    />
  )
} 