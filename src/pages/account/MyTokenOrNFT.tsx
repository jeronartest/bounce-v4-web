import { Box, Container, Stack, Typography } from '@mui/material'
import AccountLayout from 'bounceComponents/account/AccountLayout'
import AuctionCreatedTab from 'bounceComponents/account/AuctionAddressTab/CreatedTab'
import AuctionParticipatedTab from 'bounceComponents/account/AuctionAddressTab/ParticipatedTab'
import NoData from 'bounceComponents/common/NoData'
import { useActiveWeb3React } from 'hooks'
import { useState } from 'react'
import { useWalletModalToggle } from 'state/application/hooks'
import styles from './styles'

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
          <Typography padding="40px 60px 0" variant="h3" fontSize={30}>
            My Token & NFT Auction
          </Typography>
          <Typography pl={60} mt={5}>
            Current address: {account}
          </Typography>
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

            <Box padding="40px 60px">
              {!account ? (
                <NoData>
                  <Typography onClick={toggleWalletModal} fontSize={24} textAlign="center" sx={{ cursor: 'pointer' }}>
                    Connect Wallet
                    <Typography>Connect wallet to view information for this address</Typography>
                  </Typography>
                </NoData>
              ) : (
                <>
                  {curTab === TabListProp.Auction_Created && <AuctionCreatedTab />}
                  {curTab === TabListProp.Auction_Participated && <AuctionParticipatedTab />}
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </AccountLayout>
  )
}
