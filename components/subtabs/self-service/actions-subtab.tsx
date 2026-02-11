import React from 'react'
import { BaseSubtab } from '../base-subtab'
import SelfServiceActions from '@/components/self-service/self-service-actions'

export const ActionsSubtab: React.FC = () => {
  return (
    <BaseSubtab value="actions">
      <div className="flex flex-col h-full">
        <SelfServiceActions />
      </div>
    </BaseSubtab>
  )
}

export default ActionsSubtab 