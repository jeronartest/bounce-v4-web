import React from 'react'
import { useWarnIfUnsavedChanges } from '@/hooks/profile/useWarnIfUnsavedChanges'

export interface ILeavePageWarnProps {
  dirty: boolean
}
export const LeavePageWarn: React.FC<ILeavePageWarnProps> = ({ dirty }) => {
  useWarnIfUnsavedChanges(dirty)
  return <></>
}
