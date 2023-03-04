import { Box } from '@mui/material'
import React from 'react'

export type ISignupLayoutProps = { children?: React.ReactNode }

const SignupLayout: React.FC<ISignupLayoutProps> = ({ children }) => {
  return <Box sx={{ pt: 40 }}>{children}</Box>
}

export default SignupLayout
