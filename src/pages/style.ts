import { Container, styled } from '@mui/material'

const AppWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  overflowX: 'hidden',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: '100vh'
  }
}))

const ContentWrapper = styled('div')({
  width: '100%'
  // maxHeight: '100vh',
  // overflow: 'auto',
  // alignItems: 'center'
})

const BodyWrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: `calc(100vh - ${theme.height.header})`,
  padding: '50px 0 80px',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  // overflowY: 'auto',
  overflowX: 'hidden',
  position: 'relative',
  [theme.breakpoints.down('md')]: {
    minHeight: `calc(100vh - ${theme.height.header} - ${theme.height.mobileHeader})`,
    paddingTop: 20
  }
}))

export { AppWrapper, BodyWrapper, ContentWrapper }
