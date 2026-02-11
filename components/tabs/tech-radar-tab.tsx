import React from 'react'
import { BaseTab } from './base-tab'
import TechRadar from '@/components/platform/tech-radar'

interface TechRadarTabProps {
  onQuickAction: (command: string) => void
}

export const TechRadarTab: React.FC<TechRadarTabProps> = ({ onQuickAction }) => {
  return (
    <BaseTab value="tech-radar">
      <div className="h-full overflow-auto">
        <TechRadar onQuickAction={onQuickAction} />
      </div>
    </BaseTab>
  )
}

export default TechRadarTab 