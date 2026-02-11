import React from 'react'
import { BaseSubtab } from '../base-subtab'
import VaultSecrets from '@/components/integrations/vault-secrets'

interface VaultSubtabProps {
  onQuickAction: (command: string) => void
}

export const VaultSubtab: React.FC<VaultSubtabProps> = ({ onQuickAction }) => {
  return (
    <BaseSubtab value="vault">
      <VaultSecrets onQuickAction={onQuickAction} />
    </BaseSubtab>
  )
}

export default VaultSubtab 