import { Box } from '@mui/material'
import EmptyDataIcon from 'assets/imgs/common/NoData.png'
const EmptyData = () => {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 0'
      }}
    >
      <img
        style={{
          width: 118
        }}
        src={EmptyDataIcon}
        alt=""
        srcSet=""
      />
    </Box>
  )
}
export default EmptyData
