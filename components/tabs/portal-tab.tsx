import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaseTab } from './base-tab'
import { OnboardingSubtab } from '../subtabs/portal/onboarding-subtab'
import { GoldenPathsSubtab } from '../subtabs/portal/golden-paths-subtab'
import { KnowledgeBaseSubtab } from '../subtabs/portal/knowledge-base-subtab'

interface PortalTabProps {
  activeTab: string
  activeSubTab: string
  onSubTabChange: (subtab: string) => void
  expandedSubmenu: string | null
  setExpandedSubmenu: (submenu: string | null) => void
}

export const PortalTab: React.FC<PortalTabProps> = ({ 
  activeTab, 
  activeSubTab, 
  onSubTabChange, 
  expandedSubmenu, 
  setExpandedSubmenu 
}) => {
  const portalSubTabs = [
    { id: 'onboarding', label: 'ONBOARDING', icon: 'Users' },
    { id: 'golden-paths', label: 'GOLDEN_PATHS', icon: 'GitBranch' },
    { id: 'knowledge-base', label: 'KNOWLEDGE_BASE', icon: 'BookOpen' }
  ]

  const defaultSubTab = portalSubTabs[0]?.id || 'onboarding'

  return (
    <BaseTab value="portal">
      <Tabs
        value={activeSubTab || defaultSubTab}
        onValueChange={onSubTabChange}
        className="space-y-4 h-full flex flex-col"
      >
        <TabsList className="bg-white border border-posthog-cream-dark flex-shrink-0">
          {portalSubTabs.map((subTab) => (
            <TabsTrigger
              key={subTab.id}
              value={subTab.id}
              className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
            >
              {subTab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {activeSubTab === 'onboarding' && (
            <div className="h-full overflow-auto">
              <OnboardingSubtab onQuickAction={() => {}} />
            </div>
          )}

          {activeSubTab === 'golden-paths' && (
            <div className="h-full overflow-auto">
              <GoldenPathsSubtab onQuickAction={() => {}} />
            </div>
          )}

          {activeSubTab === 'knowledge-base' && (
            <div className="h-full overflow-auto">
              <KnowledgeBaseSubtab onQuickAction={() => {}} />
            </div>
          )}
        </div>
      </Tabs>
    </BaseTab>
  )
}

export default PortalTab 