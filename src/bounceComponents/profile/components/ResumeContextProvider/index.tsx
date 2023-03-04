import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react'
import { ActionMap } from '../BasicContextProvider'
import { educationItems, experienceItems, IUpdatePersonalParams } from 'api/profile/type'
import { IFileType } from 'api/upload/type'
import { CompletedSteps } from 'bounceComponents/create-auction-pool/types'

export enum ResumeActionType {
  SetJobOverview = 'SET_JOB_OVERVIEW',
  SetExperience = 'SET_EXPERIENCE',
  SetEducation = 'SET_EDUCATION',
  SetPreference = 'SET_PREFERENCE',
  SetResume = 'SET_RESUME',
  SetActiveStep = 'SET_ACTIVE_STEP',
  HandleStep = 'HANDLE_STEP'
}

type Payload = {
  [ResumeActionType.SetJobOverview]: {
    primaryRole: number
    years: number
    skills: string
    completed: CompletedSteps
  }
  [ResumeActionType.SetExperience]: {
    experience: experienceItems[]
    completed: CompletedSteps
  }
  [ResumeActionType.SetEducation]: {
    education: educationItems[]
    completed: CompletedSteps
  }
  [ResumeActionType.SetPreference]: {
    careJobs: number[]
    currentState: string
    desiredCompanySize: number
    desiredMarket: number[]
    desiredSalary: string
    ifRemotely: number
    jobTypes: number[]
    completed: CompletedSteps
  }
  [ResumeActionType.SetResume]: {
    resumes: IFileType[]
    completed: CompletedSteps
  }
  [ResumeActionType.HandleStep]: {
    activeStep: number
  }
  [ResumeActionType.SetActiveStep]: {
    activeStep: number
    completed: CompletedSteps
  }
}
type Actions = ActionMap<Payload>[keyof ActionMap<Payload>]

export type ResumeActions = ActionMap<Payload>[keyof ActionMap<Payload>]

const ResumeProfileContext = createContext<IUpdatePersonalParams | null>(null)
const ResumeProfileDispatchContext = createContext<Dispatch<any> | null>(null)

export const useResumeProfileValues = () => {
  const context = useContext(ResumeProfileContext)
  if (!context) {
    throw new Error('useResumeProfileValues must be used within ResumeProfileContext')
  }
  return context
}

export const useResumeProfileDispatch = () => {
  const context = useContext(ResumeProfileDispatchContext)
  if (!context) {
    throw new Error('useResumeProfileDispatch must be used within ResumeProfileDispatchContext')
  }
  return context
}

const initialValues: IUpdatePersonalParams = {
  careJobs: [],
  currentState: '',
  desiredCompanySize: 0,
  desiredMarket: [],
  desiredSalary: '',
  education: [],
  experience: [],
  ifRemotely: 0,
  jobTypes: [],
  primaryRole: 0,
  resumes: [],
  skills: '',
  years: 0,
  activeStep: 0,
  completed: {}
}

const reducer = (state: IUpdatePersonalParams, action: Actions) => {
  switch (action.type) {
    case ResumeActionType.SetActiveStep:
      return {
        ...state,
        activeStep: action.payload.activeStep
      }
    case ResumeActionType.HandleStep:
      return {
        ...state,
        activeStep: action.payload.activeStep,
        completed: { ...state.completed, [action.payload.activeStep]: false }
      }
    case ResumeActionType.SetJobOverview:
      return {
        ...state,
        primaryRole: action.payload.primaryRole,
        years: action.payload.years,
        skills: action.payload.skills,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true }
      }
    case ResumeActionType.SetExperience:
      return {
        ...state,
        experience: action.payload.experience,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true }
      }
    case ResumeActionType.SetEducation:
      return {
        ...state,
        education: action.payload.education,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true }
      }
    case ResumeActionType.SetPreference:
      return {
        ...state,
        careJobs: action.payload.careJobs,
        currentState: action.payload.currentState,
        desiredCompanySize: action.payload.desiredCompanySize,
        desiredMarket: action.payload.desiredMarket,
        desiredSalary: action.payload.desiredSalary,
        ifRemotely: action.payload.ifRemotely,
        jobTypes: action.payload.jobTypes,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true }
      }
    case ResumeActionType.SetResume:
      return {
        ...state,
        resumes: action.payload.resumes,
        activeStep: state.activeStep + 1,
        completed: { ...state.completed, [state.activeStep]: true }
      }
    default:
      return state
  }
}

export interface IResumeContextProviderProps {
  children: ReactNode
}

const ResumeContextProvider: React.FC<IResumeContextProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValues)
  return (
    <ResumeProfileContext.Provider value={state}>
      <ResumeProfileDispatchContext.Provider value={dispatch}>{children}</ResumeProfileDispatchContext.Provider>
    </ResumeProfileContext.Provider>
  )
}

export default ResumeContextProvider
