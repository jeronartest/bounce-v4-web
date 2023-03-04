import { Box, Typography } from '@mui/material'
import React from 'react'
import { ReactComponent as VectorSVG } from 'assets/imgs/icon/vector.svg'
export type IMarketcardProps = {
  title: string
  imageUrl: string
  hover?: boolean
  handleClick?: () => void
}

const Marketcard: React.FC<IMarketcardProps> = ({ title, imageUrl, hover, handleClick }) => {
  return (
    <Box
      width={280}
      height={72}
      bgcolor={'var(--ps-white)'}
      borderRadius={20}
      display={'flex'}
      alignItems={'center'}
      onClick={() => {
        handleClick()
      }}
      sx={{
        cursor: hover && 'pointer',
        ':hover': hover && {
          boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.1)',
          'div:nth-child(3)': { visibility: 'visible' }
        }
      }}
    >
      <picture style={{ width: 40, height: 40, marginLeft: 20, marginRight: 10 }}>
        <img src={imageUrl} />
      </picture>
      <Typography variant="body1">{title}</Typography>
      {hover && (
        <Box ml={20} display={'flex'} visibility={'hidden'}>
          <VectorSVG />
        </Box>
      )}
    </Box>
  )
}

export default Marketcard
