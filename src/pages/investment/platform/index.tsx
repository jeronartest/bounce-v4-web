import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import React from 'react'
import styles from './styles'
import SummaryCard from '@/components/investment/platform/SummaryCard'
import { ReactComponent as OutSVG } from '@/assets/imgs/investment/platform/out.svg'
import NoData from '@/components/common/NoData'
import AuctionCard, { AuctionHolder, AuctionListItem } from '@/components/common/AuctionCard'
import CopyToClipboard from '@/components/common/CopyToClipboard'

const Platform = ({}) => {
  // const datas = []
  const datas = new Array(9).fill('')
  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={styles.rootPaper}>
        <Typography variant="h2" fontSize={24}>
          One-stop investment platform
        </Typography>
        <div>
          <Grid container spacing={20} sx={{ pt: 32 }}>
            <Grid xs={3} item>
              <SummaryCard
                active={true}
                imageUrl="/imgs/investment/platform/1.png"
                title="Token Auction Pool"
                description="Token Decentralized Auction platform including Fixed Swap Auction, Dutch Auction and Sealed-Bid Auction."
              />
            </Grid>
            <Grid xs={3} item>
              <SummaryCard
                imageUrl="/imgs/investment/platform/2.png"
                title="NFT Auction Pool"
                description="NFT Decentralized Auction platform including Dutch Auction, English Auction and Lottery Auction."
              />
            </Grid>
            <Grid xs={3} item>
              <SummaryCard
                imageUrl="/imgs/investment/platform/3.png"
                title="NFT Launchpad"
                description="For the new NFT collection to launch. Collectors can mint NFTs at plateform or at project website."
              />
            </Grid>
            <Grid xs={3} item>
              <SummaryCard
                imageUrl="/imgs/investment/platform/4.png"
                title="M&A Particle Pool"
                description="A decentralized merger and acquisition protocol in order for the myriad of projects to survive, they must adapt in a natural selection."
              />
            </Grid>
          </Grid>
        </div>
        <Box sx={{ pt: 80 }}>
          <Stack direction="row" spacing={10}>
            <Typography variant="h2" fontSize={24}>
              Trending Token Auction Pools
            </Typography>
            <OutSVG color="var(--ps-gray-900)" />
          </Stack>
          <Box sx={{ mt: 32 }}>
            {!datas.length ? (
              <NoData />
            ) : (
              <Grid rowSpacing={20} columnSpacing={10} container>
                {datas.map((v, i) => (
                  <Grid key={i} xs={4} item>
                    <Box>sdfsd</Box>
                    {/* <AuctionCard
                      poolId={`000${101 + i}`}
                      title="Cameron Williamson Auction Fixed Swap Pool"
                      status={['Live', 'Upcoming', 'Closed'][i % 3] as any}
                      dateStr={i % 3 === 2 ? '' : ' 12:12:00'}
                      headTips={i % 3 === 2 ? 'Start to claim in  12:12:00' : ''}
                      holder={<AuctionHolder avatar={''} name="Cameron Williamson" description="Individual Investor" />}
                      progress={{
                        symbol: 'Auction',
                        sold: 820,
                        supply: 1234.98,
                      }}
                      listItems={
                        <>
                          <AuctionListItem
                            label="Token symbol"
                            value={
                              <Stack direction="row" alignItems="center" spacing={4}>
                                <picture>
                                  <img src="/imgs/tokens/auction.svg" alt="Auction" />
                                </picture>
                                <span>Auction</span>
                              </Stack>
                            }
                          />
                          <AuctionListItem
                            label="Token contact"
                            value={
                              <Stack direction="row" alignItems="center" spacing={4}>
                                <span>0xCc39y...0E6f</span>
                                <CopyToClipboard text="0xCc39y...0E6f" />
                              </Stack>
                            }
                          />
                          <AuctionListItem label="Fixed price ratio" value="1 Auction = 0.05 ETH" />
                          <AuctionListItem label="Price,$" value="33.5" />
                        </>
                      }
                      tags={['Fixed-Swap', 'Public', 'Ethereum']}
                    /> */}
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Platform
