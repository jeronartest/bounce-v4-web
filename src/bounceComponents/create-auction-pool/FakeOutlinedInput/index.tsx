import { OutlinedInput, styled } from '@mui/material'

const FakeOutlinedInput = styled(OutlinedInput)(() => ({
  '&.Mui-disabled': {
    '.Mui-disabled': {
      color: '#000000',
      WebkitTextFillColor: '#000000'
    },
    '.MuiOutlinedInput-notchedOutline': {
      borderColor: '#D7D6D9'
    }
  }
}))

export default FakeOutlinedInput
