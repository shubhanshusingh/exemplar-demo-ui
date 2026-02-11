import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaseTab } from './base-tab'
import { ServicesSubtab } from '../subtabs/catalog/services-subtab'
import { Server } from 'lucide-react'

interface CatalogTabProps {
  onQuickAction: (command: string) => void
}

export const CatalogTab: React.FC<CatalogTabProps> = ({ onQuickAction }) => {
  return (
    <BaseTab value="catalog">
      <ServicesSubtab onQuickAction={onQuickAction} />
    </BaseTab>
  )
}

export default CatalogTab 