import React from 'react'
import { BaseTab } from './base-tab'
import AccountSettings from '@/components/account/account-settings'

export const AccountTab: React.FC = () => {
  return (
    <BaseTab value="account-settings">
      <AccountSettings />
    </BaseTab>
  )
}

export default AccountTab 