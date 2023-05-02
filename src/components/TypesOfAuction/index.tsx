import React, { useState } from 'react'
import { Box, Typography } from '@mui/material'
import FixedPriceWhite from 'assets/imgs/home/TypeOfAuction/FixedPriced-white.svg'
import FixedPriceBlack from 'assets/imgs/home/TypeOfAuction/FixedPriced-black.svg'
import DutchAuctionWhite from 'assets/imgs/home/TypeOfAuction/DutchAuction-white.svg'
import DutchAuctionBlack from 'assets/imgs/home/TypeOfAuction/DutchAuction-black.svg'
import EnglishAuctionWhite from 'assets/imgs/home/TypeOfAuction/EnglishAuction-white.svg'
import EnglishAuctionBlack from 'assets/imgs/home/TypeOfAuction/EnglishAuction-black.svg'
import SealedBidAuctionBlack from 'assets/imgs/home/TypeOfAuction/Sealed-BidAuction-black.svg'
import SealedBidAuctionWhite from 'assets/imgs/home/TypeOfAuction/Sealed-BidAuction-white.svg'
import LeftArrow from 'assets/imgs/home/TypeOfAuction/leftArrow.svg'
import CenterBottomArrow from 'assets/imgs/home/TypeOfAuction/centerBottomArrow.svg'
import Logo from 'assets/imgs/home/TypeOfAuction/logo.svg'
import RightArrow from 'assets/imgs/home/TypeOfAuction/rightArrow.svg'
import RandomSelectWhite from 'assets/imgs/home/TypeOfAuction/RandomSelect-white.svg'
import RandomSelectBlack from 'assets/imgs/home/TypeOfAuction/RandomSelect-black.svg'
import PlayableBlack from 'assets/imgs/home/TypeOfAuction/Playable-black.svg'
import PlayableWhite from 'assets/imgs/home/TypeOfAuction/Playable-white.svg'
import OrderBookBlack from 'assets/imgs/home/TypeOfAuction/OrderBook-black.svg'
import OrderBookWhite from 'assets/imgs/home/TypeOfAuction/OrderBook-white.svg'
import HoldToCompeteBlack from 'assets/imgs/home/TypeOfAuction/Hold-to-compete-black.svg'
import HoldToCompeteWhite from 'assets/imgs/home/TypeOfAuction/Hold-to-compete-white.svg'
import { keyframes } from '@mui/system'
import { styled } from '@mui/material/styles'

interface AuctionItemParams {
  title: string
  defaultImg: string
  hoverImg: string
  totalValue: number
  link?: string
}
const AuctionItem = (props: AuctionItemParams) => {
  const { title, defaultImg, hoverImg, totalValue, link } = props
  const [isHover, setIsHover] = useState(false)
  return (
    <Box
      sx={{
        width: 230,
        height: 110,
        cursor: 'pointer'
      }}
      onMouseEnter={() => {
        setIsHover(true)
      }}
      onMouseLeave={() => {
        setIsHover(false)
      }}
      onClick={() => {
        link && window.open(link, '_blank')
      }}
    >
      {!isHover && (
        <Box
          sx={{
            width: 230,
            height: 110,
            background: 'var(--ps-text-3)',
            borderRadius: 24,
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <img
            src={defaultImg}
            style={{
              display: 'block',
              width: 24
            }}
            alt=""
          />
          <Typography
            sx={{
              fontFamily: `'Inter'`,
              fontWeight: 400,
              fontSize: 14,
              color: '#fff'
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      {isHover && (
        <Box
          sx={{
            width: 230,
            height: 110,
            background: 'var(--ps-yellow-1)',
            borderRadius: 24,
            display: 'flex',
            flexFlow: 'column nowrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '12px 16px'
          }}
        >
          <Typography
            sx={{
              fontFamily: `'Inter'`,
              fontWeight: 400,
              fontSize: 14,
              color: 'var(--ps-text-3)',
              lineHeight: '24px',
              marginBottom: 15
            }}
          >
            <img
              src={hoverImg}
              style={{
                display: 'inline-block',
                width: 24,
                verticalAlign: 'middle',
                marginRight: 12
              }}
              alt=""
            />
            {title}
          </Typography>
          <Typography
            sx={{
              fontFamily: `'Inter'`,
              fontWeight: 400,
              fontSize: 12,
              color: 'var(--ps-text-1)',
              lineHeight: '17px'
            }}
          >
            total value
          </Typography>
          <Typography
            sx={{
              fontFamily: `'Public Sans'`,
              fontWeight: 600,
              fontSize: 20,
              color: 'var(--ps-text-3)',
              lineHeight: '28px'
            }}
          >
            ${totalValue}
          </Typography>
        </Box>
      )}
    </Box>
  )
}
const logoDown = keyframes`
  25% { transform: translateY(-3px); }
  50% { transform: translateY(0); }
  75% { transform: translateY(3px); }
`
const LogoDown = styled('img')(() => ({
  width: 90,
  animation: `${logoDown} 1.2s infinite`
}))
const TypesOfAuction: React.FC = () => {
  const leftAuctioinList = [
    {
      title: 'Fixed-priced Auction',
      defaultImg: FixedPriceWhite,
      hoverImg: FixedPriceBlack,
      totalValue: 5000,
      link: 'https://docs.bounce.finance/bounce-auctions/fixed-price-auction'
    },
    {
      title: 'English Auction',
      defaultImg: EnglishAuctionWhite,
      hoverImg: EnglishAuctionBlack,
      totalValue: 5000,
      link: 'https://docs.bounce.finance/bounce-auctions/english-auction'
    },
    {
      title: 'Dutch Auction',
      defaultImg: DutchAuctionWhite,
      hoverImg: DutchAuctionBlack,
      totalValue: 5000,
      link: 'https://docs.bounce.finance/bounce-auctions/dutch-auction'
    },
    {
      title: 'Sealed-Bid Auction',
      defaultImg: SealedBidAuctionWhite,
      hoverImg: SealedBidAuctionBlack,
      totalValue: 5000,
      link: 'https://docs.bounce.finance/bounce-auctions/sealed-bid-auction'
    }
  ]
  const rightAuctioinList = [
    {
      title: 'Random Selection Auction',
      defaultImg: RandomSelectWhite,
      hoverImg: RandomSelectBlack,
      totalValue: 5000,
      link: 'https://docs.bounce.finance/bounce-auctions/random-selection-auction'
    },
    {
      title: 'Playable Auction',
      defaultImg: PlayableWhite,
      hoverImg: PlayableBlack,
      totalValue: 5000,
      link: 'https://docs.bounce.finance/bounce-auctions/playable-auction'
    },
    {
      title: 'Order Book Auction',
      defaultImg: OrderBookWhite,
      hoverImg: OrderBookBlack,
      totalValue: 5000,
      link: 'https://docs.bounce.finance/bounce-auctions/orderbook-auction'
    },
    {
      title: 'Hold-to-compete Auction',
      defaultImg: HoldToCompeteWhite,
      hoverImg: HoldToCompeteBlack,
      totalValue: 5000,
      link: ''
    }
  ]
  return (
    <>
      {/* Types of Auction On Bounce Finance */}
      <Box
        sx={{
          width: 'calc(100% - 40px)',
          margin: '0 auto 20px',
          background: `var(--ps-text-4)`,
          borderRadius: 30,
          padding: '60px 0 0',
          marginBottom: 20
        }}
      >
        <Typography
          sx={{
            color: 'var(--ps-yellow-1)',
            fontFamily: `'Public Sans'`,
            fontWeight: 600,
            fontSize: 36,
            lineHeight: '26px',
            marginBottom: 46,
            textAlign: 'center'
          }}
        >
          Types of Auction On Bounce Finance
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'column nowrap',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              border: '1px solid var(--ps-yellow-1)',
              padding: 16
            }}
            gap={16}
          >
            {leftAuctioinList.map((item, index) => (
              <AuctionItem
                key={index}
                title={item.title}
                defaultImg={item.defaultImg}
                hoverImg={item.hoverImg}
                totalValue={item.totalValue}
                link={item.link}
              />
            ))}
          </Box>
          <img
            src={LeftArrow}
            style={{
              width: 120
            }}
            alt=""
            srcSet=""
          />
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'column nowrap',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                width: 300,
                height: 300,
                borderRadius: 30,
                border: '1px solid var(--ps-yellow-1)',
                display: 'flex',
                flexFlow: 'column nowrap',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <LogoDown src={Logo} alt="" srcSet="" />
            </Box>
            <img
              src={CenterBottomArrow}
              style={{
                width: 24
              }}
              alt=""
              srcSet=""
            />
          </Box>
          <img
            src={RightArrow}
            style={{
              width: 120
            }}
            alt=""
            srcSet=""
          />
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'column nowrap',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              border: '1px solid var(--ps-yellow-1)',
              padding: 16
            }}
            gap={16}
          >
            {rightAuctioinList.map((item, index) => (
              <AuctionItem
                key={index}
                title={item.title}
                defaultImg={item.defaultImg}
                hoverImg={item.hoverImg}
                totalValue={item.totalValue}
                link={item.link}
              />
            ))}
          </Box>
        </Box>
      </Box>
      {/* slide */}
      <Box
        sx={{
          width: '100%',
          height: 90,
          maxWidth: 1400,
          margin: '0 auto 20px',
          background: 'var(--ps-yellow-1)',
          borderRadius: 90
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1100px',
            margin: '0 auto'
          }}
        ></Box>
      </Box>
    </>
  )
}

export default TypesOfAuction