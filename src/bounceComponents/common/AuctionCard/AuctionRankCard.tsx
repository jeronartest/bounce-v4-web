import React, { useState } from 'react'
import { CenterRow, Row } from '../../../components/Layout'
import { Box, MenuItem, Select, styled } from '@mui/material'
import EmptyAvatar from 'assets/imgs/auction/empty-avatar.svg'
import { H5, H7, H7Gray, SmallText } from '../../../components/Text'
import Table from '../../../components/Table'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { useRequest } from 'ahooks'
import { getPoolsFilter } from '../../../api/market'
import { useOptionDatas } from '../../../state/configOptions/hooks'

enum StatusE {
  'live',
  'upcoming',
  'close'
}

interface IAuctionRank {
  index: string
  avatar: string
  name: string
  asset: string
  type: string
  status: StatusE
}

const Avatar = styled('img')`
  margin-right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 6px;
`

const StatusLive = styled(Box)`
  display: flex;
  width: fit-content;
  align-items: center;
  padding: 4px 12px;
  background: #cff8d1;
  backdrop-filter: blur(2px);
  font-family: 'Inter';
  font-size: 12px;
  line-height: 140%;
  text-align: center;
  color: #20994b;
  border-radius: 100px;
`

const StatusUpcoming = styled(StatusLive)`
  color: #626262;
  background: #d7d6d9;
`
const StatusClose = styled(StatusLive)`
  color: #a45e3f;
  background: #f9e3da;
`

const Status: React.FC<{ status: StatusE }> = ({ status }) => {
  switch (status) {
    case StatusE.close:
      return <StatusClose>Close</StatusClose>
    case StatusE.live:
      return <StatusLive>Live</StatusLive>
    case StatusE.upcoming:
      return <StatusUpcoming>Upcoming</StatusUpcoming>
    default:
      return <></>
  }
}

function AuctionRow(props: IAuctionRank): ReactJSXElement[] {
  return [
    <CenterRow key={0}>
      <H7Gray mr={12}>{props.index}</H7Gray>
      <Avatar src={props.avatar ? props.avatar : EmptyAvatar} />
      <H7>{props.name}</H7>
    </CenterRow>,
    <SmallText key={1}>{props.asset}</SmallText>,
    <SmallText key={2}>{props.type}</SmallText>,
    <Status key={3} status={props.status} />
  ]
}

const Tab = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  padding: 24px;
  gap: 10px;
  width: 240px;
  height: 76px;
  background: transparent;

  &.active {
    background: #ffffff;
    border-radius: 20px 20px 0 0;
  }
`

export const AuctionRankCard: React.FC = () => {
  const Tabs = ['Trending Auction', 'Upcoming Auction', 'Latest Auction']
  const [currentTab, setTab] = useState(Tabs[0])
  const optionDatas = useOptionDatas()
  const action = Tabs.indexOf(currentTab) + 1
  const [chainFilter, setChainFilter] = useState<number>(0)
  const { data, loading } = useRequest(async () => {
    const resp = await getPoolsFilter({
      action: action,
      chainId: chainFilter
    })
    return {
      list: resp.data.list,
      total: resp.data
    }
  })
  console.log('AuctionRankCard', data)
  console.log('AuctionRankCard', loading)
  const fakeData: IAuctionRank[] = [
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.live,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.close,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    },
    {
      index: '1',
      avatar: '',
      name: 'Austin McBroom: Lover...',
      asset: 'NFT',
      status: StatusE.upcoming,
      type: 'English Auction'
    }
  ]

  return (
    <Box mt={40}>
      <CenterRow justifyContent={'space-between'}>
        <Row>
          {Tabs.map((tab, idx) => (
            <Tab key={idx} onClick={() => setTab(tab)} className={tab === currentTab ? 'active' : ''}>
              <H5>{tab}</H5>
            </Tab>
          ))}
        </Row>
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
      <Box
        sx={{
          padding: '12px',
          display: 'flex',
          background: 'white',
          overflow: 'hidden',
          borderRadius: '0px 30px 30px 30px'
        }}
      >
        <Table header={['Auction', 'Asset', 'Auction', 'Status']} rows={fakeData.slice(0, 5).map(d => AuctionRow(d))} />
        <Table header={['Auction', 'Asset', 'Auction', 'Status']} rows={fakeData.slice(5).map(d => AuctionRow(d))} />
      </Box>
    </Box>
  )
}
