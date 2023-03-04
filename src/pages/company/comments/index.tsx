import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import CompanyOverviewLayout from 'bounceComponents/company/CompanyOverviewLayout'
import { TopicType } from 'api/user/type'
import Comments from 'bounceComponents/common/Comments'
import { RootState } from '@/store'

const CompanyComments: React.FC = () => {
  const { companyInfo } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const { id, thirdpartId } = router.query
  const [commentsParams, setCommentsParams] = useState<{ topicId: number; topicType: number } | null>(null)

  useEffect(() => {
    if (Number(thirdpartId)) {
      setCommentsParams({
        topicId: Number(thirdpartId),
        topicType: TopicType.ThirdPartyCompany
      })
    } else if (Number(id)) {
      setCommentsParams({
        topicId: Number(id),
        topicType: TopicType.Company
      })
    } else {
      setCommentsParams({
        topicId: companyInfo?.companyId,
        topicType: TopicType.Company
      })
    }
  }, [id, thirdpartId, companyInfo])

  return (
    <CompanyOverviewLayout>
      <Box sx={{ padding: '40px 48px 48px' }}>
        <Comments topicId={commentsParams?.topicId} topicType={commentsParams?.topicType} />
      </Box>
    </CompanyOverviewLayout>
  )
}

export default CompanyComments
