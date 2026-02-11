export interface TabItem {
  id: string
  label: string
  icon: React.ComponentType<any>
}

export interface SubTab {
  id: string
  label: string
  icon: React.ComponentType<any>
}

export interface TabProps {
  activeTab: string
  activeSubTab: string
  onSubTabChange: (value: string) => void
  onQuickAction: (command: string) => void
}

export interface ChatTabProps {
  messages: any[]
  input: string
  isLoading: boolean
  showCommandHelper: boolean
  commandTicker: number
  allQuickCommands: any[]
  onInputChange: (e: any) => void
  onSubmit: (e: any) => void
  onQuickCommand: (command: string) => void
  onToggleCommandHelper: () => void
}

export interface AITabProps {
  activeSubTab: string
  onSubTabChange: (value: string) => void
  aiSubTabs: SubTab[]
  onQuickAction: (command: string) => void
}

export interface SelfServiceTabProps {
  activeSubTab: string
  onSubTabChange: (value: string) => void
  selfServiceSubTabs: SubTab[]
}

export interface ToolsTabProps {
  onQuickAction: (command: string) => void
}

export interface AccountTabProps {
  // No specific props needed for account tab
}

export interface IntegrationsTabProps {
  integrationSubTabs: SubTab[]
  onQuickAction: (command: string) => void
}

export interface CatalogTabProps {
  onQuickAction: (command: string) => void
}

export interface InsightsTabProps {
  activeTab: string
  activeSubTab: string
  onSubtabChange: (subtab: string) => void
  expandedSubmenu: string | null
  setExpandedSubmenu: (submenu: string | null) => void
}

export interface PortalTabProps {
  onQuickAction: (command: string) => void
}

export interface TechRadarTabProps {
  onQuickAction: (command: string) => void
} 