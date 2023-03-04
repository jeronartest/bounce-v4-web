import React from 'react'
import { Box } from '@mui/material'
import CompanyOverviewLayout from '@/components/company/CompanyOverviewLayout'
import Activties from '@/components/company/components/Activties'
import { UserType } from '@/api/market/type'

const CompanyActivities: React.FC = () => {
  return (
    <CompanyOverviewLayout>
      <Box sx={{ mt: 40, pb: 48 }}>
        <Activties type={UserType.Company} />
      </Box>
    </CompanyOverviewLayout>
  )
}

export default CompanyActivities
