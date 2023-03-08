import { Radio as MuiRadio, styled } from '@mui/material'

const Radio = styled(MuiRadio)(() => ({
  '&.Mui-checked': {
    color: '#000000'
  },
  '& span:first-of-type': {
    background: '#ECECEC',
    borderRadius: '50%',
    '& svg:first-of-type': {
      color: 'transparent'
    }
  }
}))

export default Radio
