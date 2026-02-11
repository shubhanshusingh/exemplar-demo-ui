import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaseTab } from './base-tab'
import { PromptHubSubtab } from '../subtabs/ai/prompt-hub-subtab'
import { AIMemorySubtab } from '../subtabs/ai/ai-memory-subtab'
import { AIGuardrailsSubtab } from '../subtabs/ai/ai-guardrails-subtab'
import { HumanInLoopSubtab } from '../subtabs/ai/human-in-loop-subtab'

interface AITabProps {
  activeSubTab: string
  onSubTabChange: (value: string) => void
  aiSubTabs: any[]
  onQuickAction: (command: string) => void
}

export const AITab: React.FC<AITabProps> = ({
  activeSubTab,
  onSubTabChange,
  aiSubTabs,
  onQuickAction
}) => {
  return (
    <BaseTab value="ai">
      <Tabs
        value={activeSubTab || aiSubTabs[0]?.id || "prompt-hub"}
        onValueChange={onSubTabChange}
        className="space-y-4 h-full flex flex-col"
      >
        <TabsList className="bg-white border border-posthog-cream-dark flex-shrink-0">
          {aiSubTabs.map((subTab) => (
            <TabsTrigger
              key={subTab.id}
              value={subTab.id}
              className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
            >
              <subTab.icon className="h-4 w-4 mr-2" />
              {subTab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {activeSubTab === 'prompt-hub' && (
            <PromptHubSubtab onQuickAction={onQuickAction} onSwitchSubTab={onSubTabChange} />
          )}

          {activeSubTab === 'ai-memory' && (
            <AIMemorySubtab onQuickAction={onQuickAction} />
          )}

          {activeSubTab === 'ai-guardrails' && (
            <AIGuardrailsSubtab onQuickAction={onQuickAction} />
          )}

          {activeSubTab === 'human-in-loop' && (
            <HumanInLoopSubtab onQuickAction={onQuickAction} />
          )}
        </div>
      </Tabs>
    </BaseTab>
  )
}

export default AITab 