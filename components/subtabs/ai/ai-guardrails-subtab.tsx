import React from 'react'
import { BaseSubtab } from '../base-subtab'
import AIGuardrails from '@/components/ai/ai-guardrails'

interface AIGuardrailsSubtabProps {
  onQuickAction: (command: string) => void
}

export const AIGuardrailsSubtab: React.FC<AIGuardrailsSubtabProps> = ({ onQuickAction }) => {
  return (
    <BaseSubtab value="ai-guardrails">
      <AIGuardrails onQuickAction={onQuickAction} />
    </BaseSubtab>
  )
}

export default AIGuardrailsSubtab 