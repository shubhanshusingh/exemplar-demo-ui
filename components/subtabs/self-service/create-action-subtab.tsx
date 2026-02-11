import React from 'react'
import { BaseSubtab } from '../base-subtab'
import CreateAction from '@/components/self-service/create-action'

export const CreateActionSubtab: React.FC = () => {
  return (
    <BaseSubtab value="create-action">
      <div className="flex flex-col h-full">
        <CreateAction />
      </div>
    </BaseSubtab>
  )
}

export default CreateActionSubtab 