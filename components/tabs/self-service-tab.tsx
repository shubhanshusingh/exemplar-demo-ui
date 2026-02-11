import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaseTab } from './base-tab'
import { ActionsSubtab } from '../subtabs/self-service/actions-subtab'
import { CreateActionSubtab } from '../subtabs/self-service/create-action-subtab'
import { DeveloperWorkflowsSubtab } from '../subtabs/self-service/developer-workflows-subtab'

interface SelfServiceTabProps {
  activeSubTab: string
  onSubTabChange: (value: string) => void
  selfServiceSubTabs: any[]
}

export const SelfServiceTab: React.FC<SelfServiceTabProps> = ({
  activeSubTab,
  onSubTabChange,
  selfServiceSubTabs
}) => {
  return (
    <BaseTab value="self-service">
      <Tabs value={activeSubTab} onValueChange={onSubTabChange} className="h-full flex flex-col" style={{ height: '100%' }}>
        <TabsList className="bg-white border border-posthog-cream-dark flex-shrink-0">
          {selfServiceSubTabs.map((subTab) => {
            const IconComponent = subTab.icon && typeof subTab.icon === 'function' ? subTab.icon : null
            return (
              <TabsTrigger
                key={subTab.id}
                value={subTab.id}
                className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
              >
                {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                {subTab.label}
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {activeSubTab === 'actions' && (
            <ActionsSubtab />
          )}

          {activeSubTab === 'create-action' && (
            <CreateActionSubtab />
          )}

          {activeSubTab === 'developer-workflows' && (
            <DeveloperWorkflowsSubtab onQuickAction={() => {}} />
          )}
        </div>
      </Tabs>
    </BaseTab>
  )
}

export default SelfServiceTab 