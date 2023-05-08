import { Common } from './index'
import { Avatar, Box, Grid, styled, Typography } from '@mui/material'
import { CenterRow, Row } from '../../components/Layout'
import PoolStatusBox from '../fixed-swap-nft/ActionBox/NftPoolStatus'
import { H4, H5 } from '../../components/Text'
import { AlignBottomBG, CardDesc } from './TokenCard'

const WhiteTagBg = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 12px;
  gap: 10px;
  height: 29px;
  width: auto;
  background: #ffffff;
  backdrop-filter: blur(2px);
  border-radius: 100px;
`

function TokenDesc() {
  const fakeDesc = [
    {
      title: 'Token symbol',
      content: 'Auction'
    },
    {
      title: 'Contract address',
      content: (
        <Row>
          <H5 sx={{ color: 'white' }}>0xCc39...780E6f</H5>
        </Row>
      )
    },
    {
      title: 'Fixed price ratio',
      content: '1 Auction = 0.05 ETH'
    },
    {
      title: 'Price,$',
      content: '33.5'
    }
  ]
  return (
    <Grid mt={24} container spacing={16}>
      {fakeDesc.map((d, i) => (
        <Grid key={i} item md={6}>
          <CardDesc title={d.title} content={d.content} />
        </Grid>
      ))}
    </Grid>
  )
}

export function LaunchPadCard() {
  return (
    <Common
      img={''}
      child={
        <Box padding={'24px 40px'} display={'flex'} flexDirection={'column'} height={'100%'}>
          <CenterRow justifyContent={'space-between'}>
            <Row gap={16}>
              <Avatar sx={{ width: 48, height: 48 }} />
              <Box sx={{ color: 'white' }}>
                <Typography fontSize={16} lineHeight={'24px'}>
                  Hiley Golbel Coin
                </Typography>
                <Typography fontSize={14} lineHeight={'21px'}>
                  Hiley Golbel Coin and text and the coin
                </Typography>
              </Box>
            </Row>
            <PoolStatusBox status={1} claimAt={0} closeTime={0} openTime={0} />
          </CenterRow>
          <H4 mt={24} style={{ color: 'white' }}>
            $HOOKED Fixed Price Auction Pool
          </H4>
          <Row gap={6} mt={8}>
            {['Fixed Price', 'Public', 'Ethereum'].map((t, i) => (
              <WhiteTagBg key={i}>{t}</WhiteTagBg>
            ))}
          </Row>
          <AlignBottomBG>
            <H5 style={{ color: '#D6DFF6' }}>
              1,785 Auction <span style={{ color: 'white' }}>/ 1,785 Auction</span>
            </H5>
            <Box position={'relative'}>
              <Box
                sx={{
                  width: '100%',
                  height: '6px',
                  background: '#626262',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  borderRadius: '4px'
                }}
              />
              <Box
                sx={{
                  width: '70%',
                  height: '6px',
                  background: '#2B51DA',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  borderRadius: '4px'
                }}
              />
            </Box>
            <TokenDesc />
          </AlignBottomBG>
        </Box>
      }
    />
  )
}
