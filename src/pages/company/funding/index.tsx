import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { ReactComponent as EditSVG } from 'assets/imgs/companies/edit.svg'
import { ICompanyOverviewInfo } from 'api/company/type'
import { getCompanyInfo } from 'api/company'
import CompanyOverviewLayout from 'bounceComponents/company/CompanyOverviewLayout'
import Funding from 'bounceComponents/company/components/Funding'
import { useUserInfo } from 'state/users/hooks'
import { useQueryParams } from 'hooks/useQueryParams'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const CompanyFunding: React.FC = () => {
  const { companyInfo: initCompanyInfo, userId } = useUserInfo()
  const navigate = useNavigate()
  const { id, thirdpartId } = useQueryParams()
  const [companyInfo, setCompanyInfo] = useState<ICompanyOverviewInfo>()

  useEffect(() => {
    const getInfo = async () => {
      const res = await getCompanyInfo({
        thirdpartId: thirdpartId ? Number(thirdpartId) : undefined,
        userId: id ? Number(id) : undefined
      })
      setCompanyInfo(res.data)
    }
    if ((!id && !thirdpartId) || Number(id) === Number(userId)) {
      setCompanyInfo(initCompanyInfo)
    } else {
      getInfo()
    }
  }, [id, userId, initCompanyInfo, thirdpartId])

  const extraLinkBtn = () => {
    if ((!id && !thirdpartId) || Number(id) === Number(userId)) {
      return (
        <Button
          onClick={() => {
            if (companyInfo?.avatar?.fileUrl) {
              navigate(routes.company.edit.investors)
            } else {
              navigate(routes.company.edit.index)
            }
          }}
          size="small"
          sx={{
            background: 'none',
            '&:hover': {
              background: 'none',
              color: 'var(--ps-blue)'
            }
          }}
        >
          <EditSVG style={{ marginRight: 10 }} />
          Edit funding
        </Button>
      )
    }
    return <></>
  }

  return (
    <CompanyOverviewLayout extraLink={extraLinkBtn()}>
      {companyInfo?.companyId && <Funding targetCompanyId={companyInfo?.companyId} />}
    </CompanyOverviewLayout>
  )
}

export default CompanyFunding
