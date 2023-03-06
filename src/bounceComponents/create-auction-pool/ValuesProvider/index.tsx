import { Moment } from 'moment'
import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { AllocationStatus, AuctionPool, CompletedSteps, ParticipantStatus } from '../types'

const ValuesStateContext = createContext<AuctionPool | null>(null)
const ValuesDispatchContext = createContext<Dispatch<any> | null>(null)

export const useValuesState = () => {
  const context = useContext(ValuesStateContext)
  if (!context) {
    throw new Error('useValuesState must be used within ValuesStateContext')
  }
  return context
}

export const useValuesDispatch = () => {
  const context = useContext(ValuesDispatchContext)
  if (!context) {
    throw new Error('useValuesDispatch must be used within ValuesDispatchContext')
  }
  return context
}

const initialValues: AuctionPool = {
  tokenFrom: {
    address: '',
    logoURI: '',
    symbol: '',
    decimals: ''
  },
  tokenTo: {
    address: '',
    logoURI: '',
    symbol: '',
    decimals: ''
  },
  swapRatio: '',
  poolSize: '',
  allocationPerWallet: '',
  allocationStatus: AllocationStatus.NoLimits,
  poolName: '',
  startTime: null,
  endTime: null,
  shouldDelayUnlocking: false,
  delayUnlockingTime: null,
  whitelist: [],
  activeStep: 0,
  completed: {},
  participantStatus: ParticipantStatus.Public
}

export enum ActionType {
  SetActiveStep = 'SET_ACTIVE_STEP',
  SetTokenFrom = 'SET_TOKEN_FROM',
  CommitTokenImformation = 'COMMIT_TOKEN_IMFORMATION',
  CommitAuctionParameters = 'COMMIT_AUCTION_PARAMETERS',
  CommitAdvancedSettings = 'COMMIT_ADVANCED_SETTINGS',
  HandleStep = 'HANDLE_STEP',
  SetWhitelist = 'SET_WHITELIST'
}

type Payload = {
  [ActionType.SetActiveStep]: {
    activeStep: number
    completed: CompletedSteps
  }
  [ActionType.SetTokenFrom]: {
    tokenFrom: {
      address: string
      logoURI: string
      symbol: string
      decimals: string | number
    }
  }
  [ActionType.CommitTokenImformation]: {
    tokenFrom: {
      address: string
      logoURI: string
      symbol: string
      decimals: string | number
    }
    activeStep: number
    completed: CompletedSteps
  }
  [ActionType.CommitAuctionParameters]: {
    tokenTo: {
      address: string
      logoURI: string
      symbol: string
      decimals: string | number
    }
    swapRatio: string
    poolSize: string
    allocationStatus: AllocationStatus
    allocationPerWallet: string
    activeStep: number
    completed: CompletedSteps
  }
  [ActionType.CommitAdvancedSettings]: {
    poolName: string
    startTime: Moment
    endTime: Moment
    delayUnlockingTime: Moment
    whitelist: string[]
    participantStatus: ParticipantStatus
    shouldDelayUnlocking: boolean
  }
  [ActionType.HandleStep]: {
    activeStep: number
  }
  [ActionType.SetWhitelist]: {
    whitelist: string[]
  }
}

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

export type Actions = ActionMap<Payload>[keyof ActionMap<Payload>]

const reducer = (state: AuctionPool, action: Actions) => {
  console.log('action: ', action)

  switch (action.type) {
    case ActionType.SetTokenFrom:
      return {
        ...state,
        tokenFrom: {
          ...state.tokenFrom,
          ...action.payload.tokenFrom
        }
      }
    case ActionType.CommitTokenImformation:
      return {
        ...state,
        tokenFrom: {
          ...state.tokenFrom,
          ...action.payload.tokenFrom
        },
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true }
      }
    case ActionType.CommitAuctionParameters:
      return {
        ...state,
        tokenTo: {
          ...state.tokenTo,
          ...action.payload.tokenTo
        },
        swapRatio: action.payload.swapRatio,
        poolSize: action.payload.poolSize,
        allocationStatus: action.payload.allocationStatus,
        allocationPerWallet: action.payload.allocationPerWallet,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true }
      }
    case ActionType.CommitAdvancedSettings:
      return {
        ...state,
        poolName: action.payload.poolName,
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        whitelist: action.payload.whitelist,
        delayUnlockingTime: action.payload.delayUnlockingTime,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
        participantStatus: action.payload.participantStatus,
        shouldDelayUnlocking: action.payload.shouldDelayUnlocking
      }

    case ActionType.HandleStep:
      return {
        ...state,
        activeStep: action.payload.activeStep,
        completed: { ...state.completed, [action.payload.activeStep]: false }
      }
    case ActionType.SetWhitelist:
      return {
        ...state,
        whitelist: action.payload.whitelist
      }
    default:
      return state
  }
}

const ValuesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialValues)

  return (
    <ValuesStateContext.Provider value={state}>
      <ValuesDispatchContext.Provider value={dispatch}>{children}</ValuesDispatchContext.Provider>
    </ValuesStateContext.Provider>
  )
}

export default ValuesProvider
