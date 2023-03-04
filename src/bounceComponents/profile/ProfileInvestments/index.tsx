import { Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import ProfileInvestmentsList from '../ProfileInvestmentsList'
import { IInvestmentItems } from '@/api/profile/type'
import { RootState } from '@/store'
import { IPager } from '@/api/type'
import { getBasicInvestments } from '@/api/profile'
import ViewMoreListBox from '@/components/company/ViewMoreListBox'
import NoData from '@/components/common/NoData'

export type IProfileInvestmentsProps = {
  personalInfoId: number
}

const ProfileInvestments: React.FC<IProfileInvestmentsProps> = ({ personalInfoId }) => {
  const [list, setList] = useState<IInvestmentItems[]>([])

  useEffect(() => {
    setList([])
  }, [personalInfoId])

  const { data, loading, pagination } = usePagination<IPager<IInvestmentItems>, Params>(
    async ({ current, pageSize }) => {
      const res = await getBasicInvestments({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        userId: personalInfoId,
      })
      return {
        total: res?.data?.total,
        list: res?.data?.list,
      }
    },
    {
      defaultPageSize: 4,
      ready: !!personalInfoId,
      refreshDeps: [personalInfoId],
    },
  )

  useEffect(() => {
    data?.list?.length && setList((val) => [...val, ...data?.list])
  }, [data?.list])

  const handleClick = useCallback(() => {
    pagination.changeCurrent(pagination.current + 1)
  }, [pagination])

  return (
    <ViewMoreListBox show={list?.length < data?.total} title="Investments" loading={loading} handleClick={handleClick}>
      {list?.length ? (
        <Stack spacing={16}>
          <Stack direction="row" justifyContent="space-between" color="var(--ps-gray-700)">
            <Typography variant="body2" sx={{ flex: '2 1' }}>
              Project Name
            </Typography>
            <Typography variant="body2" sx={{ flex: '1 1' }}>
              Amount
            </Typography>
            <Typography variant="body2" sx={{ flex: '1 1' }}>
              Investment Date
            </Typography>
          </Stack>
          <ProfileInvestmentsList list={list} />
        </Stack>
      ) : (
        <NoData color="var(--ps-gray-900)" svgColor="#F1F1F1" />
      )}
    </ViewMoreListBox>
  )
}

export default ProfileInvestments
