import React from 'react'
import { BaseSubtab } from '../base-subtab'
import ApprovalWorkflow from '@/components/catalog/approval-workflow'

interface ApprovalsSubtabProps {
  onQuickAction: (command: string) => void
}

export const ApprovalsSubtab: React.FC<ApprovalsSubtabProps> = ({ onQuickAction }) => {
  return (
    <BaseSubtab value="approvals">
      <ApprovalWorkflow onQuickAction={onQuickAction} />
    </BaseSubtab>
  )
}

export default ApprovalsSubtab 