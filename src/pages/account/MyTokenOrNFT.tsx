import { Box, Button, Container, Stack, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import AuctionCreatedTab from 'bounceComponents/account/AuctionAddressTab/CreatedTab'
import AuctionParticipatedTab from 'bounceComponents/account/AuctionAddressTab/ParticipatedTab'
import ActivitiesTab from 'bounceComponents/account/AuctionAddressTab/ActivitiesTab'
import NoData from 'bounceComponents/common/NoData'
import { useActiveWeb3React } from 'hooks'
import { useState } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import styles from './styles'
import CurrentPoolStatus from 'bounceComponents/account/CurrentPoolStatus'

enum TabListProp {
  'Auction_Created' = 'Auction Created',
  'Auction_Participated' = 'Auction Participated',
  'Activities' = 'Activities'
}

const tabsList = [TabListProp.Auction_Created, TabListProp.Auction_Participated, TabListProp.Activities]
export default function MyProfile() {
  const [curTab, setCurTab] = useState(TabListProp.Auction_Created)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()

  return (
    <AccountLayout>
      <Box>
        <Container maxWidth="lg">
          <Typography padding="40px 20px 0" variant="h3" fontSize={30}>
            My Token & NFT Auction
          </Typography>

          {!account ? (
            <NoData>
              <Box display={'grid'} gap="10px" justifyItems="center">
                <Button variant="contained" onClick={toggleWalletModal}>
                  Connect Wallet
                </Button>
                <Typography color={'var(--ps-gray-600)'}>
                  Connect wallet to view information for this address
                </Typography>
              </Box>
            </NoData>
          ) : (
            <>
              <CurrentPoolStatus />
              <Box
                sx={{
                  mt: 40,
                  borderRadius: '20px'
                }}
              >
                <Stack direction={'row'} justifyContent="space-between" sx={styles.tabsBox}>
                  <Stack direction="row" spacing={36} alignItems="center">
                    {tabsList?.map(item => {
                      return (
                        <Typography
                          variant="h4"
                          onClick={() => setCurTab(item)}
                          key={item}
                          sx={{ ...styles.menu, ...(curTab === item ? styles.menuActive : ({} as any)) }}
                        >
                          {item}
                        </Typography>
                      )
                    })}
                  </Stack>
                </Stack>

                <Box padding="40px 20px">
                  <>
                    {curTab === TabListProp.Auction_Created && <AuctionCreatedTab />}
                    {curTab === TabListProp.Auction_Participated && <AuctionParticipatedTab />}
                    {curTab === TabListProp.Activities && <ActivitiesTab />}
                  </>
                </Box>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </AccountLayout>
  )
}
