import React from 'react'
import { ChatTab } from './tabs/chat-tab'
import { AITab } from './tabs/ai-tab'
import { SelfServiceTab } from './tabs/self-service-tab'
import { ToolsTab } from './tabs/tools-tab'
import { AccountTab } from './tabs/account-tab'
import { IntegrationsTab } from './tabs/integrations-tab'
import { CatalogTab } from './tabs/catalog-tab'
import { ApprovalsTab } from './tabs/approvals-tab'
import { InsightsTab } from './tabs/insights-tab'
import { PortalTab } from './tabs/portal-tab'
import { TechRadarTab } from './tabs/tech-radar-tab'

export interface TabConfig {
  id: string
  component: React.ComponentType<any>
  props?: Record<string, any>
  enabled: boolean
  expandByDefault?: boolean
  subtabs?: string[]
}

export interface TabRegistryProps {
  activeTab: string
  activeSubTab: string
  onSubTabChange: (value: string) => void
  expandedSubmenu: string | null
  setExpandedSubmenu: (submenu: string | null) => void
  tabItems: any[]
  aiSubTabs: any[]
  selfServiceSubTabs: any[]
  integrationSubTabs: any[]
  insightsSubTabs: any[]
}

export class TabRegistry {
  private tabs = new Map<string, TabConfig>()

  register(tab: TabConfig) {
    this.tabs.set(tab.id, tab)
  }

  getEnabledTabs() {
    return Array.from(this.tabs.values()).filter(tab => tab.enabled)
  }

  getTab(id: string) {
    return this.tabs.get(id)
  }

  renderTab(id: string, props: any) {
    const tab = this.tabs.get(id)
    if (!tab || !tab.enabled) return null

    const Component = tab.component
    return <Component {...props} />
  }
}

// Create and configure the tab registry
export const createTabRegistry = (props: TabRegistryProps) => {
  const registry = new TabRegistry()

  // Register Chat Tab
  registry.register({
    id: 'chat',
    component: ChatTab,
    enabled: true
  })

  // Register AI Tab
  registry.register({
    id: 'ai',
    component: AITab,
    enabled: true,
    expandByDefault: true,
    subtabs: ['prompt-hub', 'ai-memory', 'ai-guardrails', 'human-in-loop'],
    props: {
      activeSubTab: props.activeSubTab,
      onSubTabChange: props.onSubTabChange,
      aiSubTabs: props.aiSubTabs
    }
  })

  // Register Self-Service Tab
  registry.register({
    id: 'self-service',
    component: SelfServiceTab,
    enabled: true,
    expandByDefault: true,
    subtabs: ['actions', 'create-action', 'developer-workflows'],
    props: {
      activeSubTab: props.activeSubTab,
      onSubTabChange: props.onSubTabChange,
      selfServiceSubTabs: props.selfServiceSubTabs
    }
  })

  // Register Tools Tab
  registry.register({
    id: 'tools',
    component: ToolsTab,
    enabled: true
  })

  // Register Account Settings Tab
  registry.register({
    id: 'account-settings',
    component: AccountTab,
    enabled: true
  })

  // Register Integrations Tab
  registry.register({
    id: 'integrations',
    component: IntegrationsTab,
    enabled: true,
    expandByDefault: true,
    subtabs: ['cloud', 'vault', 'external'],
    props: {
      activeSubTab: props.activeSubTab,
      onSubTabChange: props.onSubTabChange,
      integrationSubTabs: props.integrationSubTabs
    }
  })

  // Register Catalog Tab
  registry.register({
    id: 'catalog',
    component: CatalogTab,
    enabled: true,
    subtabs: ['services']
  })

  // Register Approvals Tab
  registry.register({
    id: 'approvals',
    component: ApprovalsTab,
    enabled: true
  })

  // Register Insights Tab
  registry.register({
    id: 'insights',
    component: InsightsTab,
    enabled: true,
    expandByDefault: true,
    subtabs: ['overview', 'productivity', 'cost', 'compliance'],
    props: {
      activeTab: props.activeTab,
      activeSubTab: props.activeSubTab,
      onSubTabChange: props.onSubTabChange
    }
  })

  // Register Portal Tab
  registry.register({
    id: 'portal',
    component: PortalTab,
    enabled: true,
    expandByDefault: true,
    subtabs: ['onboarding', 'golden-paths', 'knowledge-base'],
    props: {
      activeTab: props.activeTab,
      activeSubTab: props.activeSubTab,
      onSubTabChange: props.onSubTabChange,
      expandedSubmenu: props.expandedSubmenu,
      setExpandedSubmenu: props.setExpandedSubmenu
    }
  })

  // Register Tech Radar Tab
  registry.register({
    id: 'tech-radar',
    component: TechRadarTab,
    enabled: true
  })

  return registry
}

export default TabRegistry 