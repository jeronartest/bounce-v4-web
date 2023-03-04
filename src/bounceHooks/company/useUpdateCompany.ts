import { useRequest } from 'ahooks'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useGetCompanyInvestors } from './useGetCompanyInvestors'
import { useGetCompanyTeam } from './useGetCompanyTeam'
import { useGetCompanyTokens } from './useGetCompanyTokens'
import { useGetCompanyInvestments } from './useGetCompanyInvestments'
import { updateCompanyProfile } from '@/api/company'
import { ICompanyProfileParams } from '@/api/company/type'
import { RootState } from '@/store'
import { fetchCompanyInfo } from '@/store/user'
import { timezone } from '@/components/common/LocationTimeZone'

export const useUpdateCompany = (firstEdit = false) => {
  const dispatch = useDispatch()
  const { userId, companyInfo } = useSelector((state: RootState) => state.user)
  const { data: companyTeamData, runAsync: runGetCompanyTeam } = useGetCompanyTeam()
  const { data: companyInvestorsData, runAsync: runGetCompanyInvestors } = useGetCompanyInvestors()
  const { data: companyTokensData, runAsync: runGetCompanyTokens } = useGetCompanyTokens()
  const { data: companyInvestmentsData, runAsync: runGetCompanyInvestments } = useGetCompanyInvestments()

  return useRequest(
    async (params: ICompanyProfileParams) => {
      !firstEdit && !!userId && runGetCompanyTeam({ limit: 100, offset: 0, companyId: Number(userId) })
      !firstEdit && !!userId && runGetCompanyInvestors({ limit: 100, offset: 0, companyId: Number(userId) })
      !firstEdit && !!userId && runGetCompanyTokens({ limit: 100, offset: 0, companyId: Number(userId) })
      !firstEdit && !!userId && runGetCompanyInvestments({ limit: 100, offset: 0, companyId: Number(userId) })

      const _params = {
        companyBasicInfo: {
          avatar: companyInfo?.avatar || {
            fileName: '',
            fileSize: 0,
            fileThumbnailUrl: '',
            fileType: '',
            fileUrl: '',
            id: 0,
          },
          companyName: companyInfo?.companyName || '',
          location: companyInfo?.location || '',
          timezone: timezone.toString() || companyInfo?.timezone,
          companyState: companyInfo?.companyState || 0,
          marketType: companyInfo?.marketType || 0,
          companySize: companyInfo?.companySize || 0,
          companyBriefIntro: companyInfo?.briefIntro || '',
          companyFullIntro: companyInfo?.about || '',
          startupDate: companyInfo?.startupDate || 0,

          contactEmail: companyInfo?.contactEmail || '',
          website: companyInfo?.website || '',
          linkedin: companyInfo?.linkedin || '',
          github: companyInfo?.github || '',
          twitter: companyInfo?.twitter || '',
          instagram: companyInfo?.instagram || '',
          medium: companyInfo?.medium || '',
        },
        companyInvestments: companyInvestmentsData?.data?.list || [],
        companyInvestors: companyInvestorsData?.data?.list || [],
        companyTokens: companyTokensData?.data?.list || [],
        teamMembers: companyTeamData?.data?.list || [],
        ...params,
      }
      return updateCompanyProfile(_params)
    },
    {
      manual: true,
      onSuccess: (res) => {
        const { code, data } = res
        if (code !== 200) {
          return toast.error('submit fail')
        }
        toast.success('submit successed')
        dispatch(fetchCompanyInfo({ thirdpartId: 0, userId: userId }))

        !firstEdit && runGetCompanyTeam({ limit: 100, offset: 0, companyId: Number(userId) })

        !firstEdit && runGetCompanyTokens({ limit: 100, offset: 0, companyId: Number(userId) })

        !firstEdit && runGetCompanyInvestors({ limit: 100, offset: 0, companyId: Number(userId) })

        !firstEdit && runGetCompanyInvestments({ limit: 100, offset: 0, companyId: Number(userId) })
      },
    },
  )
}
