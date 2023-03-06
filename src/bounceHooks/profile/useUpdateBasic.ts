import { useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useGetBasicInvestments } from './useGetBasicInvestments'
import { useGetResumeExperience } from './useGetResumeExperience'
import { useGetResumeEducation } from './useGetResumeEducation'
import { updateBasic, updatePersonal } from 'api/profile'
import { timezone } from 'bounceComponents/common/LocationTimeZone'
import { useUserInfo } from 'state/users/hooks'
import { fetchUserInfo } from 'state/users/reducer'

export const useUpdateBasic = () => {
  const dispatch = useDispatch()
  const { userId, userInfo } = useUserInfo()
  const { data: investData, runAsync: runGetBasicInvestments } = useGetBasicInvestments()

  useEffect(() => {
    userId &&
      runGetBasicInvestments({
        userId,
        limit: 100,
        offset: 0
      })
  }, [runGetBasicInvestments, userId])

  return useRequest(
    async params => {
      const _params = {
        avatar: userInfo?.avatar || {
          fileName: '',
          fileSize: 0,
          fileThumbnailUrl: '',
          fileType: '',
          fileUrl: '',
          id: 0
        },
        fullName: userInfo?.fullName || '',
        publicRole: userInfo?.publicRole || [],
        companyRole: userInfo?.companyRole || 0,
        description: userInfo?.description || '',

        company: userInfo?.company || {
          avatar: '',
          link: '',
          name: ''
        },
        contactEmail: userInfo?.contactEmail || '',
        github: userInfo?.github || '',
        instagram: userInfo?.instagram || '',
        invest: investData?.data?.list || [],
        linkedin: userInfo?.linkedin || '',
        location: userInfo?.location || '',
        timezone: userInfo?.timezone || timezone.toString(),
        twitter: userInfo?.twitter || '',
        university: userInfo?.university || {
          avatar: '',
          link: '',
          name: ''
        },
        website: userInfo?.website || '',
        ...params
      }
      return updateBasic(_params)
    },
    {
      manual: true,
      onSuccess: res => {
        const { code } = res
        if (code !== 200) {
          return toast.error('submit fail')
        }
        toast.success('submit successed')
        dispatch(fetchUserInfo({ userId: userId }))
        userId &&
          runGetBasicInvestments({
            userId,
            limit: 100,
            offset: 0
          })
        return
      }
    }
  )
}

export const usePersonalResume = () => {
  const dispatch = useDispatch()
  const { userId, userInfo } = useUserInfo()
  const { data: experienceData, runAsync: runGetResumeExperience } = useGetResumeExperience()
  const { data: educationData, runAsync: runGetResumeEducation } = useGetResumeEducation()

  useEffect(() => {
    userId &&
      runGetResumeExperience({
        userId,
        limit: 100,
        offset: 0
      })
  }, [runGetResumeExperience, userId])

  useEffect(() => {
    userId &&
      runGetResumeEducation({
        userId,
        limit: 100,
        offset: 0
      })
  }, [runGetResumeEducation, userId])

  return useRequest(
    async (params: any) => {
      const _params = {
        primaryRole: userInfo?.primaryRole || 0,
        years: userInfo?.years || 0,
        skills: userInfo?.skills || '',
        careJobs: userInfo?.careJobs || [],
        currentState: userInfo?.currentState || 'Active',
        desiredCompanySize: userInfo?.desiredCompanySize || 0,
        desiredMarket: userInfo?.desiredMarket || [],
        desiredSalary: userInfo?.desiredSalary || '',
        education: educationData?.data?.list || [],
        experience: experienceData?.data?.list || [],
        ifRemotely: userInfo?.ifRemotely || undefined,
        jobTypes: userInfo?.jobTypes || [],
        resumes: userInfo?.resumes || [],
        ...params
      }
      return updatePersonal(_params)
    },
    {
      manual: true,
      onSuccess: res => {
        const { code } = res
        if (code !== 200) {
          return toast.error('submit fail')
        }
        toast.success('submit successed')
        dispatch(fetchUserInfo({ userId: userId }))
        userId &&
          runGetResumeExperience({
            userId,
            limit: 100,
            offset: 0
          })
        userId &&
          runGetResumeEducation({
            userId,
            limit: 100,
            offset: 0
          })

        return
      }
    }
  )
}
