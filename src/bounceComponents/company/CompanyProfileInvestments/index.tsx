import { Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import CompanyInvestmentsList from '../CompanyInvestmentsList'
import { ICompanyInvestmentsListItems } from 'api/company/type'
import { IPager } from 'api/type'
import { getCompanyInvestments } from 'api/company'
import ViewMoreListBox from 'bounceComponents/company/ViewMoreListBox'
import NoData from 'bounceComponents/common/NoData'
import { useQueryParams } from 'hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

export const InvestmentList: React.FC<{ list: ICompanyInvestmentsListItems[] }> = ({ list }) => {
  const { thirdpartId } = useQueryParams()
  return (
    <>
      {list?.length === 0 || thirdpartId ? (
        <NoData color="var(--ps-gray-900)" svgColor="#F1F1F1" />
      ) : (
        <Stack spacing={16}>
          <Stack direction="row" justifyContent="space-between" color="#878A8E">
            <Typography variant="body2" sx={{ flex: '2 1' }}>
              Company Name
            </Typography>
            <Typography variant="body2" sx={{ flex: '1 1' }}>
              Amount
            </Typography>
            <Typography variant="body2" sx={{ flex: '1 1' }}>
              Investment Date
            </Typography>
          </Stack>
          <CompanyInvestmentsList list={list} />
        </Stack>
      )}
    </>
  )
}

export type ICompanyProfileInvestmentsProps = {
  type?: string
  targetCompanyId?: number
}

const CompanyProfileInvestments: React.FC<ICompanyProfileInvestmentsProps> = ({ type, targetCompanyId }) => {
  const navigate = useNavigate()
  const [list, setList] = useState<ICompanyInvestmentsListItems[]>([])

  useEffect(() => {
    setList([])
  }, [targetCompanyId])

  const { data, loading } = usePagination<IPager<ICompanyInvestmentsListItems>, Params>(
    async ({ current, pageSize }) => {
      const res = await getCompanyInvestments({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        companyId: targetCompanyId || 0
      })
      return {
        total: res?.data?.total,
        list: res?.data?.list
      }
    },
    {
      defaultPageSize: type && ['ALL'].includes(type) ? 100 : 4,
      refreshDeps: [targetCompanyId],
      ready: !!targetCompanyId
    }
  )

  useEffect(() => {
    data?.list?.length && setList(val => [...val, ...data?.list])
  }, [data?.list])

  const handleClick = useCallback(() => {
    navigate(`${routes.company.funding}?tab=investments`)
  }, [navigate])

  if (type && ['ALL'].includes(type)) {
    return <InvestmentList list={list} />
  }

  return (
    <ViewMoreListBox
      show={(!type || !['ALL'].includes(type)) && list?.length < (data?.total || 0)}
      title={'Investments'}
      loading={loading}
      handleClick={handleClick}
      showDivider={!type || !['ALL'].includes(type)}
    >
      <InvestmentList list={list} />
    </ViewMoreListBox>
  )
}

export default CompanyProfileInvestments
