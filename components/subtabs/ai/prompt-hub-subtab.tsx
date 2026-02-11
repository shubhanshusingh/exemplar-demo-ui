import React from 'react'
import { BaseSubtab } from '../base-subtab'
import PromptHub from '@/components/ai/prompt-hub'

interface PromptHubSubtabProps {
  onQuickAction: (command: string) => void
  onSwitchSubTab: (value: string) => void
}

export const PromptHubSubtab: React.FC<PromptHubSubtabProps> = ({ 
  onQuickAction, 
  onSwitchSubTab 
}) => {
  return (
    <BaseSubtab value="prompt-hub">
      <div className="flex flex-col h-full">
        <PromptHub onQuickAction={onQuickAction} onSwitchSubTab={onSwitchSubTab} />
      </div>
    </BaseSubtab>
  )
}

export default PromptHubSubtab 