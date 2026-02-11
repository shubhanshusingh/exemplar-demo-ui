import React from 'react'

interface BaseTabProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const BaseTab: React.FC<BaseTabProps> = ({ 
  value, 
  children, 
  className = "flex-1 m-4 mb-0 overflow-hidden h-full max-h-[90vh]" 
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default BaseTab 