import React from 'react'
import { TabsContent } from '@/components/ui/tabs'

interface BaseSubtabProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const BaseSubtab: React.FC<BaseSubtabProps> = ({ 
  value, 
  children, 
  className = "h-full overflow-auto" 
}) => {
  return (
    <TabsContent value={value} className={className}>
      {children}
    </TabsContent>
  )
}

export default BaseSubtab 