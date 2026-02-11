import React from 'react'
import { BaseTab } from './base-tab'
import ApprovalWorkflow from '@/components/catalog/approval-workflow'

interface ApprovalsTabProps {
  onQuickAction: (command: string) => void
}

export const ApprovalsTab: React.FC<ApprovalsTabProps> = ({ onQuickAction }) => {
  return (
    <BaseTab value="approvals">
      <ApprovalWorkflow onQuickAction={onQuickAction} />
    </BaseTab>
  )
}

export default ApprovalsTab
