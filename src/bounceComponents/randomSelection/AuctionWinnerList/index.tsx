import {
  Box,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import moment from 'moment'

import NoData from 'bounceComponents/common/NoData'
// import { PoolEvent } from 'api/pool/type'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'
// import { formatNumber, removeRedundantZeroOfFloat } from 'utils/number'
import { shortenAddress } from 'utils'
import { useGetWinnersList } from 'hooks/useCreateRandomSelectionPool'
import { FixedSwapPoolProp } from 'api/pool/type'
import { useActiveWeb3React } from 'hooks'

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    color: '#908E96',
    backgroundColor: '#FFFFFF',
    paddingTop: '4px',
    paddingBottom: '4px'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(() => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#F5F5F5',

    'td:first-of-type': {
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20
    },
    'td:last-child': {
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20
    }
  },
  td: {
    border: 0
  }
}))

// const SaleTypography = <Typography sx={theme => ({ color: theme.palette.success.main })}>Sale</Typography>
// const RegretTypography = <Typography sx={theme => ({ color: theme.palette.error.main })}>Regret</Typography>

// const PoolEventTypography: Record<PoolEvent, JSX.Element> = {
//   Swapped: SaleTypography,
//   Reversed: RegretTypography
// }

const AuctionWinnerList = ({ poolInfo }: { poolInfo: FixedSwapPoolProp }) => {
  const { chainId } = useActiveWeb3React()
  const { data, loading: isGettingWinnersList } = useGetWinnersList(poolInfo.poolId, chainId || 0)
  console.log('data>>>', data)
  return (
    <Box sx={{ borderRadius: 20, px: 12, py: 20, bgcolor: '#fff' }}>
      <Typography variant="h2" sx={{ ml: 12 }}>
        Winner list
      </Typography>

      {data && data?.list && data?.list.length > 0 && !isGettingWinnersList ? (
        <TableContainer sx={{ mt: 20 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Event</StyledTableCell>
                <StyledTableCell>Amount</StyledTableCell>
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.list.map(record => (
                <StyledTableRow key={record.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <StyledTableCell>Win</StyledTableCell>
                  <StyledTableCell>1 Ticket</StyledTableCell>
                  <StyledTableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography>{shortenAddress(record.requestor)}</Typography>
                      <CopyToClipboard text={record.requestor} />
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell>{moment(record.blockTs * 1000).format('Y/M/D hh:mm A')}</StyledTableCell>
                  <StyledTableCell>2022/11/16 12:19</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ width: '100%' }}>
          <NoData />
        </Box>
      )}
    </Box>
  )
}

export default AuctionWinnerList
