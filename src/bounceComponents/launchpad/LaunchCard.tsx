import React from 'react'
import { Common } from './index'
import { Avatar, Box, Grid, Stack, styled, Typography } from '@mui/material'
import { CenterRow, Row } from '../../components/Layout'
import PoolStatusBox from '../fixed-swap-nft/ActionBox/NftPoolStatus'
import { Body02, Body03, H5, H6 } from '../../components/Text'
import { ReactComponent as Web } from 'assets/imgs/auction/round-icon-web.svg'
import { ReactComponent as Twitter } from 'assets/imgs/auction/round-icon-twitter.svg'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { PoolStatus } from '../../api/pool/type'

export function CardDesc({ title, content }: { title: string; content: string | React.ReactElement }) {
  return (
    <Box sx={{ color: 'white', gap: 4 }}>
      <Typography fontSize={13} lineHeight={'18px'}>
        {title}
      </Typography>
      <H6 sx={{ color: 'white' }}>{content}</H6>
    </Box>
  )
}

export const AlignBottomBG = styled(Box)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`

export function TimeBlock({ isEnd }: { isEnd: boolean }) {
  return (
    <AlignBottomBG>
      <Body03>{isEnd ? 'End Time:' : 'Start Time'}</Body03>
      <H5 sx={{ color: '#E1F25C' }}>2022-03-09</H5>
    </AlignBottomBG>
  )
}

const CardContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export function LaunchPadProcess({
  title,
  time,
  isAchieve,
  isLast
}: {
  title: string
  time: string
  isAchieve: boolean
  isLast?: boolean
}) {
  return (
    <Box>
      <Body03 mr={36}>{title}</Body03>
      <Body02 mr={36} mt={8}>
        {time}
      </Body02>
      <Box mt={23} display={'flex'} alignItems={'center'}>
        <Box
          sx={{
            width: '10px',
            height: '10px',
            borderRadius: '5px',
            background: isAchieve ? '#C8F056' : '#FFFFFF33'
          }}
        />
        {!isLast && (
          <Box
            sx={{
              height: '4px',
              width: '100%',
              background: isAchieve ? '#C8F056' : '#FFFFFF33'
            }}
          />
        )}
      </Box>
    </Box>
  )
}

export function Progress() {
  const fakeProcess = [
    {
      title: 'Staked calculation period',
      time: '2022-02-17 11:00',
      isAchieve: true
    },
    {
      title: 'Staked calculation period',
      time: '2022-02-17 11:00',
      isAchieve: false
    },
    {
      title: 'Staked calculation period',
      time: '2022-02-17 11:00',
      isAchieve: false
    },
    {
      title: 'Staked calculation period',
      time: '2022-02-17 11:00',
      isAchieve: false
    }
  ]
  return (
    <AlignBottomBG>
      <Stack direction={'row'}>
        {fakeProcess.map((p, i) => (
          <LaunchPadProcess
            key={i}
            isLast={i === fakeProcess.length - 1}
            title={p.title}
            time={p.time}
            isAchieve={p.isAchieve}
          />
        ))}
      </Stack>
    </AlignBottomBG>
  )
}

export function LaunchPadDesc() {
  const descList = [
    {
      title: 'Token offered',
      content: '420,000,000.0000 GMT'
    },
    {
      title: 'Participants',
      content: '130,672'
    },
    {
      title: 'Sale price',
      content: '1 GMT = 0.00002514 BNB'
    },
    {
      title: 'Sale price',
      content: '8,742,450.4131 BNB'
    }
  ]
  return (
    <Grid mt={24} container spacing={16}>
      {descList.map((d, i) => (
        <Grid key={i} item md={6}>
          <CardDesc title={d.title} content={d.content} />
        </Grid>
      ))}
    </Grid>
  )
}

export function SocialMedia() {
  return (
    <AlignBottomBG>
      <Body03>
        Equilibria Finance is designed exclusively for PENDLE holders and liquidity providers, offering an easy-to-use
        platform to maximize your profits. It leverages the veToken boosted yield model ...
      </Body03>
      <Row mt={24} gap={10}>
        <Web />
        <Twitter />
      </Row>
    </AlignBottomBG>
  )
}

export const LaunchCard: React.FC<{ child: ReactJSXElement; state: PoolStatus }> = props => {
  return (
    <Common
      img={''}
      child={
        <Box padding={'24px 40px'} display={'flex'} flexDirection={'column'} height={'100%'}>
          <CenterRow justifyContent={'space-between'}>
            <Row gap={16}>
              <Avatar sx={{ width: 60, height: 60 }} />
              <Box sx={{ color: 'white' }}>
                <Typography fontSize={28} lineHeight={'36px'}>
                  Hiley Golbel Coin
                </Typography>
                <Typography fontSize={14} lineHeight={'21px'}>
                  Hiley Golbel Coin and text and the coin
                </Typography>
              </Box>
            </Row>
            <PoolStatusBox status={props.state} claimAt={0} closeTime={1685376000} openTime={1685376000} />
          </CenterRow>
          {props.child}
        </Box>
      }
    />
  )
}
export const LaunchCardFinish: React.FC = () => {
  return (
    <LaunchCard
      state={PoolStatus.Finish}
      child={
        <CardContainer>
          <LaunchPadDesc />
          <TimeBlock isEnd={true} />
        </CardContainer>
      }
    />
  )
}

export const LaunchCardLive: React.FC = () => {
  return (
    <LaunchCard
      state={PoolStatus.Live}
      child={
        <CardContainer>
          <LaunchPadDesc />
          <Progress />
        </CardContainer>
      }
    />
  )
}
export const LaunchCardUpcoming: React.FC = () => {
  return (
    <LaunchCard
      state={PoolStatus.Upcoming}
      child={
        <CardContainer>
          <LaunchPadDesc />
          <TimeBlock isEnd={false} />
        </CardContainer>
      }
    />
  )
}
export const LaunchCardSocial: React.FC = () => {
  return (
    <LaunchCard
      state={PoolStatus.Upcoming}
      child={
        <CardContainer>
          <SocialMedia />
          <AlignBottomBG>
            <LaunchPadDesc />
          </AlignBottomBG>
        </CardContainer>
      }
    />
  )
}
