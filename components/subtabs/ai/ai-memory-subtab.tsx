import React from 'react'
import { BaseSubtab } from '../base-subtab'
import AIMemory from '@/components/ai/ai-memory'

interface AIMemorySubtabProps {
  onQuickAction: (command: string) => void
}

export const AIMemorySubtab: React.FC<AIMemorySubtabProps> = ({ onQuickAction }) => {
  return (
    <BaseSubtab value="ai-memory">
      <AIMemory onQuickAction={onQuickAction} />
    </BaseSubtab>
  )
}

export default AIMemorySubtab 