import { styled, Tooltip as MuiTooltip, tooltipClasses, TooltipProps } from '@mui/material'

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} arrow classes={{ popper: className }} />
))(({}) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#3C3C3C'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#3C3C3C',
    borderRadius: '8px'
  }
}))

export default Tooltip
