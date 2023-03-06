import { Container, styled } from '@mui/material'

const RoundedContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: 20,
  marginTop: 40
}))

export default RoundedContainer
