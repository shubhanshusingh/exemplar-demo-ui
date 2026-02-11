import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaseTab } from './base-tab'
import { CloudSubtab } from '../subtabs/integrations/cloud-subtab'
import { VaultSubtab } from '../subtabs/integrations/vault-subtab'
import { ExternalSubtab } from '../subtabs/integrations/external-subtab'
import ExternalServices from '../integrations/external-services'
import { Cloud, Lock, Settings } from 'lucide-react'

interface IntegrationsTabProps {
  activeSubTab: string
  onSubTabChange: (value: string) => void
  integrationSubTabs: any[]
  onQuickAction: (command: string) => void
}

// Icon mapping for dynamic icon rendering
const iconMap = {
  Cloud,
  Lock,
  Settings,
}

// Helper function to get icon component from string
const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Settings
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({
  activeSubTab,
  onSubTabChange,
  integrationSubTabs,
  onQuickAction
}) => {
  return (
    <BaseTab value="integrations">
      <div className="h-full flex flex-col px-4 py-2">
        <Tabs
          value={activeSubTab || "external"}
          onValueChange={onSubTabChange}
          className="space-y-4 h-full flex flex-col"
        >
          <TabsList className="bg-card border border-border flex-shrink-0">
            {integrationSubTabs.map((subTab) => {
              const IconComponent = getIconComponent(subTab.icon)
              return (
                <TabsTrigger
                  key={subTab.id}
                  value={subTab.id}
                  className="font-mono text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {subTab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="flex-1 overflow-hidden">
            {activeSubTab === 'cloud' && (
              <CloudSubtab onQuickAction={onQuickAction} />
            )}
            
            {activeSubTab === 'vault' && (
              <VaultSubtab onQuickAction={onQuickAction} />
            )}
            
            {activeSubTab === 'external' && (
              <ExternalSubtab onQuickAction={onQuickAction} />
            )}
          </div>
        </Tabs>
      </div>
    </BaseTab>
  )
}

export default IntegrationsTab