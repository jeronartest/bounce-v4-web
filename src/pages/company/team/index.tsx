import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'
import { RootState } from '@/store'
import { ReactComponent as EditSVG } from 'assets/imgs/companies/edit.svg'
import { ICompanyOverviewInfo } from 'api/company/type'
import { getCompanyInfo } from 'api/company'
import CompanyOverviewLayout from 'bounceComponents/company/CompanyOverviewLayout'
import Team from 'bounceComponents/company/components/Team'

const CompanyTeam: React.FC = () => {
  const { companyInfo: initCompanyInfo, userId } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const { id, thirdpartId } = router.query
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
              router.push('/company/edit/team')
            } else {
              router.push('/company/edit')
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
          Edit team
        </Button>
      )
    }
    return <></>
  }

  return (
    <CompanyOverviewLayout extraLink={extraLinkBtn()}>
      <Team targetCompanyId={companyInfo?.companyId} />
    </CompanyOverviewLayout>
  )
}

export default CompanyTeam
