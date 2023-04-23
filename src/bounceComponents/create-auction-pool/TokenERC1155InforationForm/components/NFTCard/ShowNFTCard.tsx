import React from 'react'
import { Box, Typography } from '@mui/material'
import EmptyNFTIcon from './emptyNFTIcon.png'
import Image from 'components/Image'
import { ReactComponent as CloseIcon } from 'assets/imgs/components/nft-close.svg'

interface NftCardProps {
  handleClear?: () => void
  style?: React.CSSProperties
  hideClose?: boolean
  imgH?: number
  boxH?: number
  balance?: string
  name: string
  tokenId: string
  image?: string
}
const ShowCard = (props: NftCardProps) => {
  const { handleClear, style, hideClose = false, imgH = 220, boxH = 286, balance, name, tokenId, image } = props
  return (
    <Box
      sx={{
        position: 'relative',
        width: 220,
        height: boxH,
        background: '#FFFFFF',
        border: '1px solid rgba(23, 23, 23, 0.1)',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0 auto',
        ...style
      }}
    >
      <Image
        style={{
          display: 'block',
          objectFit: 'cover'
        }}
        width={'100%'}
        height={imgH}
        src={image || EmptyNFTIcon}
        alt={'nft'}
      />
      {balance && (
        <Box
          sx={{
            position: 'absolute',
            left: 8,
            top: 8,
            height: 22,
            lineHeight: '22px',
            textAlign: 'center',
            padding: '0 8px',
            background: '#2B51DA',
            borderRadius: '100px',
            fontFamily: 'Sharp Grotesk DB Cyr Book 20',
            color: '#fff'
          }}
        >
          x{balance}
        </Box>
      )}
      <Box
        sx={{
          height: boxH - imgH,
          display: 'grid',
          alignContent: 'center',
          // flexFlow: 'column nowrap',
          // justifyContent: 'center',
          padding: '0 16px'
        }}
      >
        <Typography
          component="h1"
          noWrap
          sx={{
            fontFamily: 'Sharp Grotesk DB Cyr Book 20',
            fontWeight: 400,
            fontSize: 14,
            height: '18px',
            lineHeight: '18px',
            color: '#171717',
            width: '100%'
          }}
        >
          {name}
        </Typography>
        <Typography
          component="h1"
          noWrap
          sx={{
            fontFamily: `'Sharp Grotesk DB Cyr Medium 22'`,
            fontWeight: 400,
            fontSize: 14,
            height: '20px',
            lineHeight: '20px',
            color: '#171717',
            width: '100%'
          }}
        >
          ID:{tokenId ? (tokenId.length > 8 ? `${tokenId.slice(0, 5)}...${tokenId.slice(-5)}` : tokenId) : '--'}
        </Typography>
      </Box>
      {!hideClose && (
        <CloseIcon
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            cursor: 'pointer'
          }}
          onClick={handleClear}
        />
      )}
    </Box>
  )
}

export default ShowCard
