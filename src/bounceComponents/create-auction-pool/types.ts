import { Moment } from 'moment'

export interface Token {
  address: string
  chainId?: number
  decimals?: number | string
  logoURI?: string
  name?: string
  symbol: string
  dangerous?: boolean
}

// type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export enum CreationStep {
  'TOKEN_INFORMATION',
  'AUCTION_PARAMETERS',
  'ADVANCED_SETTINGS',
  'CREATION_CONFIRMATION'
}

export type CompletedSteps = { [k: number]: boolean }

export enum ParticipantStatus {
  'Public' = 'PUBLIC',
  'Whitelist' = 'WHITELIST'
}

export enum AllocationStatus {
  'NoLimits' = 'NO_LIMITS',
  'Limited' = 'LIMITED'
}

export interface AuctionPool {
  tokenFrom: Token
  tokenTo: Token
  swapRatio: string
  poolSize: string
  allocationPerWallet: string
  allocationStatus: AllocationStatus
  poolName: string
  startTime: Moment | null
  endTime: Moment | null
  shouldDelayUnlocking: boolean
  delayUnlockingTime: Moment | null
  whitelist: string[]
  activeStep: CreationStep
  completed: CompletedSteps
  participantStatus: ParticipantStatus
}
