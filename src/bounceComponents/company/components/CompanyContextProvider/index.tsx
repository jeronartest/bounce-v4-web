import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { CompletedSteps } from '@/components/create-auction-pool/types'
import { ActionMap } from '@/components/profile/components/BasicContextProvider'
import {
  ICompanyBasicInfo,
  ICompanyInvestmentsListItems,
  ICompanyInvestorsListItems,
  ICompanyProfileParams,
  ICompanyTeamListItems,
  ICompanyTokensListItems,
} from '@/api/company/type'
import { IFileType } from '@/api/upload/type'

export enum CompanyActionType {
  SetProfilePicture = 'SET_PROFILE_PICTURE',
  SetIntro = 'SET_INTRO',
  SetTeam = 'SET_TEAM',
  SetTokens = 'SET_TOKENS',
  SetInvestors = 'SET_INVESTORS',
  SetInvestments = 'SET_INVESTMENTS',
  SetActiveStep = 'SET_ACTIVE_STEP',
  HandleStep = 'HANDLE_STEP',
}

type Payload = {
  [CompanyActionType.SetProfilePicture]: {
    companyBasicInfo: {
      avatar: IFileType
    }
    completed: CompletedSteps
  }
  [CompanyActionType.SetIntro]: {
    companyBasicInfo: ICompanyBasicInfo
    completed: CompletedSteps
  }
  [CompanyActionType.SetTeam]: {
    teamMembers: ICompanyTeamListItems[]
    completed: CompletedSteps
  }
  [CompanyActionType.SetTokens]: {
    companyTokens?: ICompanyTokensListItems[]
    completed: CompletedSteps
  }
  [CompanyActionType.SetInvestors]: {
    companyInvestors?: ICompanyInvestorsListItems[]
    completed: CompletedSteps
  }
  [CompanyActionType.SetInvestments]: {
    companyInvestments?: ICompanyInvestmentsListItems[]
    completed: CompletedSteps
  }
  [CompanyActionType.HandleStep]: {
    activeStep: number
  }
  [CompanyActionType.SetActiveStep]: {
    activeStep: number
    completed: CompletedSteps
  }
}
type Actions = ActionMap<Payload>[keyof ActionMap<Payload>]

export type CompanyActions = ActionMap<Payload>[keyof ActionMap<Payload>]

const CompanyProfileContext = createContext<ICompanyProfileParams | null>(null)
const CompanyProfileDispatchContext = createContext<Dispatch<any> | null>(null)

export const useCompanyProfileValues = () => {
  const context = useContext(CompanyProfileContext)
  if (!context) {
    throw new Error('useCompanyProfileValues must be used within CompanyProfileContext')
  }
  return context
}

export const useCompanyProfileDispatch = () => {
  const context = useContext(CompanyProfileDispatchContext)
  if (!context) {
    throw new Error('useCompanyProfileDispatch must be used within CompanyProfileDispatchContext')
  }
  return context
}

const initialValues: ICompanyProfileParams = {
  companyBasicInfo: {
    avatar: {
      fileName: '',
      fileSize: 0,
      fileThumbnailUrl: '',
      fileType: '',
      fileUrl: '',
      id: 0,
    },
    companyBriefIntro: '',
    companyFullIntro: '',
    companyName: '',
    companySize: 0,
    companyState: 0,
    contactEmail: '',
    github: '',
    instagram: '',
    linkedin: '',
    location: '',
    marketType: 0,
    medium: '',
    startupDate: 0,
    timezone: '',
    twitter: '',
    website: '',
  },
  companyInvestments: [],
  companyInvestors: [],
  companyTokens: [],
  teamMembers: [],
  activeStep: 0,
  completed: {},
}

const reducer = (state: ICompanyProfileParams, action: Actions) => {
  switch (action.type) {
    case CompanyActionType.SetActiveStep:
      return {
        ...state,
        activeStep: action.payload.activeStep,
      }
    case CompanyActionType.HandleStep:
      return {
        ...state,
        activeStep: action.payload.activeStep,
        completed: { ...state.completed, [action.payload.activeStep]: false },
      }
    case CompanyActionType.SetProfilePicture:
      return {
        ...state,
        companyBasicInfo: {
          ...state.companyBasicInfo,
          avatar: action.payload.companyBasicInfo.avatar,
        },
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }

    case CompanyActionType.SetIntro:
      return {
        ...state,
        companyBasicInfo: action.payload.companyBasicInfo,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    case CompanyActionType.SetTeam:
      return {
        ...state,
        teamMembers: action.payload.teamMembers,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    case CompanyActionType.SetTokens:
      return {
        ...state,
        companyTokens: action.payload.companyTokens,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    case CompanyActionType.SetInvestors:
      return {
        ...state,
        companyInvestors: action.payload.companyInvestors,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    case CompanyActionType.SetInvestments:
      return {
        ...state,
        companyInvestments: action.payload.companyInvestments,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    default:
      return state
  }
}

export interface ICompanyContextProviderProps {
  children: ReactNode
}

const CompanyContextProvider: React.FC<ICompanyContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValues)
  return (
    <CompanyProfileContext.Provider value={state}>
      <CompanyProfileDispatchContext.Provider value={dispatch}>{children}</CompanyProfileDispatchContext.Provider>
    </CompanyProfileContext.Provider>
  )
}

export default CompanyContextProvider
