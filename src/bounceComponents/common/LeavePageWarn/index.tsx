import React from 'react'
import { useWarnIfUnsavedChanges } from 'bounceHooks/profile/useWarnIfUnsavedChanges'

export interface ILeavePageWarnProps {
  dirty: boolean
}
export const LeavePageWarn: React.FC<ILeavePageWarnProps> = ({ dirty }) => {
  useWarnIfUnsavedChanges(dirty)
  return <></>
}
