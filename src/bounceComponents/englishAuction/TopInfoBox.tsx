import { Box, Stack, Typography } from '@mui/material'
import { ReactNode, useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import TokenImage from 'bounceComponents/common/TokenImage'
import CopyToClipboard from 'bounceComponents/common/CopyToClipboard'

// import CoingeckoSVG from 'assets/imgs/chains/coingecko.svg'
// import ErrorSVG from 'assets/imgs/icon/error_outline.svg'
import DefaultNftIcon from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/emptyCollectionIcon.png'
import { shortenAddress } from 'utils'
import PoolInfoItem from 'bounceComponents/fixed-swap/PoolInfoItem'
import { useEnglishAuctionPoolInfo } from 'pages/auction/englishAuctionNFT/ValuesProvider'
import ShowNFTCard from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/NFTCard/ShowNFTCard'

const Title = ({ children }: { children: ReactNode }): JSX.Element => (
  <Typography variant="h6" sx={{ mb: 10 }}>
    {children}
  </Typography>
)

const TopInfoBox = (): JSX.Element => {
  const { data: poolInfo } = useEnglishAuctionPoolInfo()
  const isOneNft = useMemo(() => true, [])

  const formatedMaxAmount1PerWallet =
    poolInfo?.maxAmount1PerWallet &&
    poolInfo.maxAmount1PerWallet !== '0' &&
    poolInfo.maxAmount1PerWallet !== poolInfo.amountTotal0
      ? `${poolInfo.maxAmount1PerWallet} NFT`
      : 'No'

  if (!poolInfo) return <></>

  return (
    <Box
      sx={{
        backgroundColor: '#EBEFFB',
        borderRadius: '20px',
        padding: 16,
        display: 'grid',
        gap: 24,
        gridTemplateColumns: isOneNft ? '340px 1fr' : 'unset'
      }}
    >
      <ShowNFTCard
        hideClose
        name={'test'}
        tokenId={'1'}
        image={''}
        boxH={isOneNft ? 286 : 220}
        imgH={isOneNft ? 220 : 170}
        style={{
          width: isOneNft ? 220 : '100%',
          maxWidth: '100%'
        }}
      />
      <Box sx={{ borderRadius: 20, bgcolor: 'transparent', px: 16, py: 36, flex: 1, height: 'fit-content' }}>
        <Box display={'grid'} alignContent={'space-between'}>
          <Stack flex={1} spacing={10}>
            <Title>Token Information</Title>
            <PoolInfoItem title="Contact address" tip="Token Contract Address.">
              <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
                <Typography>{shortenAddress(poolInfo.token0.address)}</Typography>
                <CopyToClipboard text={poolInfo.token0.address} />
              </Stack>
            </PoolInfoItem>

            <PoolInfoItem title="Token type">
              <Stack direction="row" spacing={4} sx={{ alignItems: 'center' }}>
                <TokenImage
                  src={
                    poolInfo.token0.largeUrl || poolInfo.token0.smallUrl || poolInfo.token0.thumbUrl || DefaultNftIcon
                  }
                  alt={poolInfo.token0.symbol}
                  size={20}
                />
                <Typography>ERC721</Typography>
              </Stack>
            </PoolInfoItem>
          </Stack>

          <Stack flex={1} spacing={10}>
            <Title>Auction Information</Title>

            <PoolInfoItem title="Auction type">Fixed Price Auction</PoolInfoItem>
            <PoolInfoItem title="Participant">{poolInfo.enableWhiteList ? 'Whitelist' : 'Public'}</PoolInfoItem>
            <PoolInfoItem title="Allocation per Wallet">{formatedMaxAmount1PerWallet}</PoolInfoItem>
            <PoolInfoItem title="Total available Amount">
              {poolInfo.amountTotal0} {poolInfo.token0.symbol}
            </PoolInfoItem>
            <PoolInfoItem title="Price per unit, $">
              {new BigNumber(poolInfo.poolPrice).decimalPlaces(6, BigNumber.ROUND_DOWN).toFormat()}
            </PoolInfoItem>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default TopInfoBox
