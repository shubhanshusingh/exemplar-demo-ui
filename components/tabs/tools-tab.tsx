import React from 'react'
import { BaseTab } from './base-tab'
import DevTools from '@/components/tools/dev-tools'

interface ToolsTabProps {
  onQuickAction: (command: string) => void
}

export const ToolsTab: React.FC<ToolsTabProps> = ({ onQuickAction }) => {
  return (
    <BaseTab value="tools">
      <div className="h-full overflow-auto p-4">
        <DevTools onQuickAction={onQuickAction} />
      </div>
    </BaseTab>
  )
}

export default ToolsTab 