import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as AddIcon } from 'assets/imgs/auction/add-icon.svg'
import { Box } from '@mui/material'

export default function EmptyCard({
  onClick,
  width,
  height,
  disabled
}: {
  onClick: () => void
  width?: number
  height?: number
  disabled?: boolean
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: width || '170px',
        height: height || '220px',
        justifyContent: 'center',
        alignItems: 'center',
        background: `#F4F5F8`,
        borderRadius: '10px',
        cursor: 'pointer',
        margin: '0 auto 51px',
        opacity: disabled ? 0.3 : 1
      }}
      onClick={onClick}
    >
      <FormItem name="tokenId" required>
        <AddIcon />
      </FormItem>
    </Box>
  )
}
