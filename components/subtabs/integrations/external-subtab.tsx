import React from 'react'
import { BaseSubtab } from '../base-subtab'
import ExternalServices from '@/components/integrations/external-services'

interface ExternalSubtabProps {
  onQuickAction: (command: string) => void
}

export const ExternalSubtab: React.FC<ExternalSubtabProps> = ({ onQuickAction }) => {
  return (
    <BaseSubtab value="external">
      <ExternalServices onQuickAction={onQuickAction} />
    </BaseSubtab>
  )
}

export default ExternalSubtab 