import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BaseTab } from './base-tab'
import { OverviewSubtab } from '../subtabs/insights/overview-subtab'
import { ProductivitySubtab } from '../subtabs/insights/productivity-subtab'
import { CostSubtab } from '../subtabs/insights/cost-subtab'
import { ComplianceSubtab } from '../subtabs/insights/compliance-subtab'
import { ScorecardSubtab } from '../subtabs/insights/scorecard-subtab'

interface InsightsTabProps {
  activeTab: string
  activeSubTab: string
  onSubTabChange: (subtab: string) => void
}

export const InsightsTab: React.FC<InsightsTabProps> = ({ 
  activeTab, 
  activeSubTab, 
  onSubTabChange
}) => {
  const insightsSubTabs = [
    { id: 'overview', label: 'OVERVIEW', icon: 'BarChart3' },
    { id: 'productivity', label: 'PRODUCTIVITY', icon: 'TrendingUp' },
    { id: 'cost', label: 'COST', icon: 'DollarSign' },
    { id: 'compliance', label: 'COMPLIANCE', icon: 'Shield' },
    { id: 'scorecard', label: 'SCORECARD', icon: 'Target' }
  ]

  const defaultSubTab = insightsSubTabs[0]?.id || 'overview'

  return (
    <BaseTab value="insights">
      <Tabs
        value={activeSubTab || defaultSubTab}
        onValueChange={onSubTabChange}
        className="space-y-4 h-full flex flex-col"
      >
        <TabsList className="bg-white border border-posthog-cream-dark flex-shrink-0">
          {insightsSubTabs.map((subTab) => (
            <TabsTrigger
              key={subTab.id}
              value={subTab.id}
              className="font-mono text-xs data-[state=active]:bg-posthog-orange data-[state=active]:text-white"
            >
              {subTab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {activeSubTab === 'overview' && (
            <div className="h-full overflow-auto">
              <OverviewSubtab onQuickAction={() => {}} />
            </div>
          )}

          {activeSubTab === 'productivity' && (
            <div className="h-full overflow-auto">
              <ProductivitySubtab onQuickAction={() => {}} />
            </div>
          )}

          {activeSubTab === 'cost' && (
            <div className="h-full overflow-auto">
              <CostSubtab onQuickAction={() => {}} />
            </div>
          )}

          {activeSubTab === 'compliance' && (
            <div className="h-full overflow-auto">
              <ComplianceSubtab onQuickAction={() => {}} />
            </div>
          )}

          {activeSubTab === 'scorecard' && (
            <div className="h-full overflow-auto">
              <ScorecardSubtab onQuickAction={() => {}} />
            </div>
          )}
        </div>
      </Tabs>
    </BaseTab>
  )
}

export default InsightsTab 