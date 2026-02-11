import React from 'react'
import { BaseSubtab } from '../base-subtab'
import CloudIntegrations from '@/components/integrations/cloud-integrations'

interface CloudSubtabProps {
  onQuickAction: (command: string) => void
}

export const CloudSubtab: React.FC<CloudSubtabProps> = ({ onQuickAction }) => {
  return (
    <BaseSubtab value="cloud">
      <CloudIntegrations onQuickAction={onQuickAction} />
    </BaseSubtab>
  )
}

export default CloudSubtab 