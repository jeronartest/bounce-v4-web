import { Box, Button, Stack, styled, Typography } from '@mui/material'
import { getLabelById } from 'utils'
import { useOptionDatas } from 'state/configOptions/hooks'
import { Link } from 'react-router-dom'
import { routes } from 'constants/routes'
import NoData from 'bounceComponents/common/NoData'
import { PoolType } from 'api/pool/type'
import { useMemo } from 'react'
import TokenImage from 'bounceComponents/common/TokenImage'
import { ChainId, ChainListMap } from 'constants/chain'

const StyledStatCard = styled(Box)({
  height: 100,
  display: 'grid',
  gap: 14,
  alignContent: 'center',
  backgroundColor: '#fff',
  borderRadius: '20px',
  p: {
    textAlign: 'center'
  }
})

const btnStyle = {
  height: 26,
  display: 'flex',
  alignItems: 'center',
  fontSize: 12,
  padding: '0 8px',
  borderRadius: 20
}

export function DashboardPoolCard({ title, children }: { title: string; children?: JSX.Element }) {
  return (
    <Box
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: '20px',
        padding: 16
      }}
    >
      <Typography pb={10} fontWeight={500}>
        {title}
      </Typography>
      <Stack
        height={240}
        spacing={8}
        sx={{
          overflow: 'auto'
        }}
      >
        {children}
      </Stack>
    </Box>
  )
}

export function DashboardStatCard({ name, value }: { name: string; value: string | number }) {
  return (
    <StyledStatCard>
      <Typography color={'#908E96'}>{name}</Typography>
      <Typography fontSize={22} fontWeight={500} color="#2663FF">
        {value}
      </Typography>
    </StyledStatCard>
  )
}

export function DashboardNoData() {
  return (
    <NoData
      sx={{
        svg: {
          height: 'auto',
          maxHeight: 200,
          minHeight: 'auto !important'
        }
      }}
    />
  )
}

export function DashboardToPoolButton({
  text,
  poolId,
  backedChainId
}: {
  text: string
  poolId: number
  backedChainId: number
}) {
  const optionDatas = useOptionDatas()
  return (
    <Link
      to={routes.auction.fixedPrice
        .replace(':chainShortName', getLabelById(backedChainId, 'shortName', optionDatas?.chainInfoOpt))
        .replace(':poolId', poolId.toString())}
    >
      <Button variant="contained" sx={btnStyle}>
        {text}
      </Button>
    </Link>
  )
}

export function DashboardShowCategoryName({ category, backedChainId }: { category: PoolType; backedChainId: number }) {
  const optionDatas = useOptionDatas()
  const ethChainId = useMemo(
    () => getLabelById(backedChainId, 'ethChainId', optionDatas?.chainInfoOpt),
    [backedChainId, optionDatas?.chainInfoOpt]
  )

  return (
    <Box display={'flex'} alignItems="center">
      <TokenImage src={ethChainId ? ChainListMap?.[ethChainId as ChainId]?.logo : ''} size={12} />
      <Typography fontSize={12} ml={4} noWrap>
        {category === PoolType.FixedSwap ? 'ERC20 Fixed Price' : '-'}
      </Typography>
    </Box>
  )
}
