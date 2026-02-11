export interface SubtabProps {
  onQuickAction: (command: string) => void
}

// AI Tab Subtabs
export interface PromptHubSubtabProps extends SubtabProps {
  onSwitchSubTab: (value: string) => void
}

export interface AIMemorySubtabProps extends SubtabProps {}

export interface AIGuardrailsSubtabProps extends SubtabProps {}

export interface HumanInLoopSubtabProps extends SubtabProps {}

// Self-Service Tab Subtabs
export interface ActionsSubtabProps {}

export interface CreateActionSubtabProps {}

// Integrations Tab Subtabs
export interface CloudSubtabProps extends SubtabProps {}

export interface VaultSubtabProps extends SubtabProps {}

export interface ExternalSubtabProps extends SubtabProps {}

// Catalog Tab Subtabs
export interface ServicesSubtabProps extends SubtabProps {}

export interface ApprovalsSubtabProps extends SubtabProps {} 