import React, { useState } from 'react'
import { Box, Container, MenuItem, Pagination, Select, styled } from '@mui/material'
import HeaderTab from '../../bounceComponents/auction/HeaderTab'
import ArrowBanner from '../../bounceComponents/auction/ArrowBanner'
import { H2 } from '../../components/Text'
import { CenterColumn, CenterRow } from '../../components/Layout'
import AuctionTypeSelect from '../../bounceComponents/common/AuctionTypeSelect'
import { BackedTokenType } from '../account/MyTokenOrNFT'
import { useOptionDatas } from '../../state/configOptions/hooks'
import { TokenCard } from '../../bounceComponents/launchpad/TokenCard'
import { LaunchPadCard } from '../../bounceComponents/launchpad/LaunchPadCard'

export const Launchpad: React.FC = () => {
  return (
    <Container>
      <HeaderTab />
      <Box mt={16}>
        <ArrowBanner />
      </Box>
      <PrivatePad />
    </Container>
  )
}

const PrivatePadBg = styled(CenterColumn)`
  display: flex;
  margin-top: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 40px 100px;
  width: 100%;
  background: #ffffff;
  border-radius: 30px 30px 0 0;
`

const PrivatePad: React.FC = () => {
  const optionDatas = useOptionDatas()
  const [auction, setAuction] = useState(0)
  const [chainFilter, setChainFilter] = useState<number>(0)
  return (
    <PrivatePadBg>
      <CenterRow mb={54} width={'100%'} justifyContent={'space-between'}>
        <H2>Private launchpad</H2>
        <CenterRow gap={8}>
          <AuctionTypeSelect curPoolType={auction} setCurPoolType={setAuction} tokenType={BackedTokenType.TOKEN} />
          <Select
            sx={{
              width: '200px',
              height: '38px'
            }}
            value={chainFilter}
            onChange={e => setChainFilter(Number(e.target.value))}
          >
            <MenuItem key={0} value={0}>
              All Chains
            </MenuItem>
            {optionDatas?.chainInfoOpt?.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.chainName}
              </MenuItem>
            ))}
          </Select>
        </CenterRow>
      </CenterRow>
      <LaunchPadCard />
      <TokenCard />
      <Pagination />
    </PrivatePadBg>
  )
}
