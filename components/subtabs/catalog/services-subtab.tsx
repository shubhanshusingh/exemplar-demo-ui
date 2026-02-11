import React from 'react'
import ServiceCatalog from '@/components/catalog/service-catalog'

interface ServicesSubtabProps {
  onQuickAction: (command: string) => void
}

export const ServicesSubtab: React.FC<ServicesSubtabProps> = ({ onQuickAction }) => {
  return (
    <div className="h-full overflow-auto">
      <ServiceCatalog onQuickAction={onQuickAction} />
    </div>
  )
}

export default ServicesSubtab 