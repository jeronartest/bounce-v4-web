import { Button } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import CompanyProfileInvestments from '../../CompanyProfileInvestments'
import InvestorsList from './components/InvestorsList'
import { RootState } from '@/store'
import { useGetCompanyInvestors } from 'bounceHooks/company/useGetCompanyInvestors'
import { ICompanyOverviewInfo } from 'api/company/type'
import { useGetCompanyInvestments } from 'bounceHooks/company/useGetCompanyInvestments'

export type IFundingProps = {
  targetCompanyId: number
}

const Funding: React.FC<IFundingProps> = ({ targetCompanyId }) => {
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const router = useRouter()
  const { tab, thirdpartId } = router.query

  const { data, runAsync: runGetCompanyInvestors } = useGetCompanyInvestors()
  useEffect(() => {
    targetCompanyId && !thirdpartId && runGetCompanyInvestors({ limit: 100, offset: 0, companyId: targetCompanyId })
  }, [runGetCompanyInvestors, targetCompanyId, thirdpartId])

  const { data: investmentsData, runAsync: runGetCompanyInvestments } = useGetCompanyInvestments()
  useEffect(() => {
    targetCompanyId && !thirdpartId && runGetCompanyInvestments({ limit: 100, offset: 0, companyId: targetCompanyId })
  }, [runGetCompanyInvestments, targetCompanyId, thirdpartId])

  return (
    <Box sx={{ p: '40px 48px 46px 48px' }}>
      <Box display={'flex'} alignItems={'center'} sx={{ mb: 16 }}>
        <Box>
          <Button
            variant={['investors'].includes(tab as string) || !tab ? 'contained' : 'outlined'}
            onClick={() => {
              router.push({
                pathname: '/company/funding',
                query: {
                  ...router.query,
                  tab: 'investors'
                }
              })
            }}
          >
            Investors ({data?.data.total || 0})
          </Button>
          <Button
            variant={['investments'].includes(tab as string) ? 'contained' : 'outlined'}
            sx={{ ml: 10 }}
            onClick={() => {
              router.push({
                pathname: '/company/funding',
                query: {
                  ...router.query,
                  tab: 'investments'
                }
              })
            }}
          >
            Investments ({investmentsData?.data?.total || 0})
          </Button>
        </Box>
      </Box>
      <Box>
        {['investments'].includes(tab as string) ? (
          <CompanyProfileInvestments type="ALL" targetCompanyId={targetCompanyId} />
        ) : (
          <InvestorsList dataList={data} optionDatas={optionDatas} />
        )}
      </Box>
    </Box>
  )
}

export default Funding
