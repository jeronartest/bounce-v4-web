import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { IInvestmentItems, IupdateBasicParams } from '@/api/profile/type'
import { timezone } from '@/components/common/LocationTimeZone'
import { IAvatarLinkType, IFileType } from '@/api/upload/type'
import { CompletedSteps } from '@/components/create-auction-pool/types'

export enum ActionType {
  SetProfileAvatar = 'SET_PROFILE_AVATAR',
  SetIntro = 'SET_INTRO',
  SetSocial = 'SET_SOCIAL',
  SetInvestments = 'SET_INVESTMENTS',
  SetActiveStep = 'SET_ACTIVE_STEP',
  HandleStep = 'HANDLE_STEP',
}

type Payload = {
  [ActionType.SetProfileAvatar]: {
    avatar: IFileType
    completed: CompletedSteps
  }
  [ActionType.SetIntro]: {
    company: IAvatarLinkType
    companyId: number
    thirdpartId: number
    companyRole: number
    description: string
    fullName: string
    location: string
    publicRole: number[]
    timezone: string
    university: IAvatarLinkType
    completed: CompletedSteps
  }
  [ActionType.SetSocial]: {
    contactEmail: string
    github: string
    instagram: string
    linkedin: string
    twitter: string
    website: string
    completed: CompletedSteps
  }
  [ActionType.SetInvestments]: {
    invest: IInvestmentItems[]
    completed: CompletedSteps
  }
  [ActionType.HandleStep]: {
    activeStep: number
  }
  [ActionType.SetActiveStep]: {
    activeStep: number
    completed: CompletedSteps
  }
}

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key
      }
    : {
        type: Key
        payload: M[Key]
      }
}

type Actions = ActionMap<Payload>[keyof ActionMap<Payload>]

const BasicProfileContext = createContext<IupdateBasicParams | null>(null)
const BasicProfileDispatchContext = createContext<Dispatch<any> | null>(null)

export const useBasicProfileValues = () => {
  const context = useContext(BasicProfileContext)
  if (!context) {
    throw new Error('useBasicProfileValues must be used within BasicProfileContext')
  }
  return context
}

export const useBasicProfileDispatch = () => {
  const context = useContext(BasicProfileDispatchContext)
  if (!context) {
    throw new Error('useBasicProfileDispatch must be used within BasicProfileDispatchContext')
  }
  return context
}

const initialValues: IupdateBasicParams = {
  avatar: {
    fileName: '',
    fileSize: 0,
    fileThumbnailUrl: '',
    fileType: '',
    fileUrl: '',
    id: 0,
  },
  fullName: '',
  publicRole: [],
  companyRole: 0,
  description: '',

  company: {
    avatar: '',
    link: '',
    name: '',
  },
  companyId: 0,
  thirdpartId: 0,
  contactEmail: '',
  github: '',
  instagram: '',
  invest: [],
  linkedin: '',
  location: '',
  timezone: timezone.toString(),
  twitter: '',
  university: {
    avatar: '',
    link: '',
    name: '',
  },
  website: '',
  activeStep: 0,
  completed: {},
}

const reducer = (state: IupdateBasicParams, action: Actions) => {
  switch (action.type) {
    case ActionType.SetActiveStep:
      return {
        ...state,
        activeStep: action.payload.activeStep,
      }
    case ActionType.HandleStep:
      return {
        ...state,
        activeStep: action.payload.activeStep,
        completed: { ...state.completed, [action.payload.activeStep]: false },
      }
    case ActionType.SetProfileAvatar:
      return {
        ...state,
        avatar: action.payload.avatar,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    case ActionType.SetIntro:
      return {
        ...state,
        company: action.payload.company,
        companyId: action.payload.companyId,
        thirdpartId: action.payload.thirdpartId,
        companyRole: action.payload.companyRole,
        description: action.payload.description,
        fullName: action.payload.fullName,
        location: action.payload.location,
        publicRole: action.payload.publicRole,
        timezone: action.payload.timezone,
        university: action.payload.university,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    case ActionType.SetSocial:
      return {
        ...state,
        contactEmail: action.payload.contactEmail,
        github: action.payload.github,
        instagram: action.payload.instagram,
        linkedin: action.payload.linkedin,
        twitter: action.payload.twitter,
        website: action.payload.website,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    case ActionType.SetInvestments:
      return {
        ...state,
        invest: action.payload.invest,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true },
      }
    default:
      return state
  }
}

export interface IBasicContextProviderProps {
  children: ReactNode
}

const BasicContextProvider: React.FC<IBasicContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValues)
  return (
    <BasicProfileContext.Provider value={state}>
      <BasicProfileDispatchContext.Provider value={dispatch}>{children}</BasicProfileDispatchContext.Provider>
    </BasicProfileContext.Provider>
  )
}

export default BasicContextProvider
