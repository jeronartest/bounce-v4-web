import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import CompanyOverviewLayout from 'bounceComponents/company/CompanyOverviewLayout'
import { TopicType } from 'api/user/type'
import Comments from 'bounceComponents/common/Comments'
import { useQueryParams } from 'hooks/useQueryParams'
import { useUserInfo } from 'state/users/hooks'

const CompanyComments: React.FC = () => {
  const { companyInfo } = useUserInfo()
  const query = useQueryParams()
  const { id, thirdpartId } = query
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
        {commentsParams && <Comments topicId={commentsParams?.topicId} topicType={commentsParams?.topicType} />}
      </Box>
    </CompanyOverviewLayout>
  )
}

export default CompanyComments
