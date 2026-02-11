import React from 'react'
import { BaseSubtab } from '../base-subtab'
import HumanInTheLoop from '@/components/ai/human-in-the-loop'

interface HumanInLoopSubtabProps {
  onQuickAction: (command: string) => void
}

export const HumanInLoopSubtab: React.FC<HumanInLoopSubtabProps> = ({ onQuickAction }) => {
  return (
    <BaseSubtab value="human-in-loop">
      <HumanInTheLoop onQuickAction={onQuickAction} />
    </BaseSubtab>
  )
}

export default HumanInLoopSubtab 