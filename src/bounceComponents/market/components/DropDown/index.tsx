import { MenuItem, Select, styled } from '@mui/material'

export const DropDown = styled(Select)`
  width: 200px;
  height: 38px;
  border-radius: 8px;

  & .MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper {
    background: antiquewhite !important;
    border-radius: 8px;
  }
`

export const DropDownItem = styled(MenuItem)`
  & .MuiButtonBase-root-MuiMenuItem-root {
    font-size: 48px;
  }
`
