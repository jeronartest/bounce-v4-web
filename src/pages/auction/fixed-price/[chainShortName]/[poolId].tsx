import { Box, CircularProgress, Container, Stack } from '@mui/material'
import React from 'react'

import { useAccount } from 'wagmi'
import Head from 'next/head'
import CreatorMainBlock from 'bounceComponents/fixed-swap/MainBlock/CreatorMainBlock'
import CreatorInfoCard from 'bounceComponents/fixed-swap/CreatorInfoCard'
import ActionHistory from 'bounceComponents/fixed-swap/ActionHistory'
import Header from 'bounceComponents/fixed-swap/Header'
import UserMainBlock from 'bounceComponents/fixed-swap/MainBlock/UserMainBlock'
import usePoolInfo from 'bounceHooks/auction/usePoolInfo'
import useEagerConnect from 'bounceHooks/web3/useEagerConnect'
import { BounceAnime } from 'bounceComponents/common/BounceAnime'

const FixedSwapPoolPageContent = () => {
  const { address: account } = useAccount()
  const { data: poolInfo } = usePoolInfo()

  if (!poolInfo) {
    return (
      <Box sx={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BounceAnime />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 60 }}>
        <Header />

        <Box sx={{ mt: 40, display: 'flex', columnGap: 20 }}>
          <CreatorInfoCard creatorUserInfo={poolInfo?.creatorUserInfo} />

          <Stack sx={{ flex: 1 }} spacing={20}>
            {account === poolInfo.creator ? <CreatorMainBlock /> : <UserMainBlock />}
            <ActionHistory />
          </Stack>
        </Box>
      </Box>
    </Container>
  )
}

const FixedSwapPoolPage = () => {
  useEagerConnect()
  return (
    <section>
      <Head>
        <title>Pool Detail | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
      <FixedSwapPoolPageContent />
    </section>
  )
}

export default FixedSwapPoolPage
