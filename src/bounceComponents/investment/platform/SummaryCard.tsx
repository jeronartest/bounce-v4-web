import { Box, Card, CardContent, Chip, Stack, SxProps, Typography } from '@mui/material'
import React from 'react'
import { ReactComponent as RightJTSVG } from 'assets/imgs/components/rightJT.svg'
const styles = {
  card: {
    borderRadius: 20,
    height: 300
  }
} as Record<string, SxProps>

export type ISummaryCardProps = {
  imageUrl: string
  title: string
  description: string
  active?: boolean
  rightSVG?: boolean
}

const SummaryCard: React.FC<ISummaryCardProps> = ({ imageUrl, title, description, active, rightSVG }) => {
  return (
    <Card
      elevation={0}
      sx={
        {
          ...styles.card,
          bgcolor: '#E9E9FF',
          cursor: !active && 'pointer',
          borderRadius: 20,
          ':hover': !active && {
            bgcolor: 'var(--ps-blue)',
            '.MuiChip-root': { bgcolor: 'var(--ps-white)', color: 'var(--ps-blue)' },
            '.MuiCardContent-root': { color: 'var(--ps-white)' }
          }
        } as SxProps
      }
    >
      <CardContent sx={{ height: 146, p: 0, overflow: 'hidden', position: 'relative' }}>
        <Stack direction="row" justifyContent="space-between">
          <picture>
            <img src={imageUrl} alt={title} />
          </picture>
          <Box sx={{ top: 20, position: 'absolute', right: 16 }}>
            <Chip
              label={active ? 'Coming soon' : 'Live'}
              sx={{
                color: active ? 'var(--ps-blue)' : 'var(--ps-white)',
                height: 24,
                bgcolor: active ? 'rgba(38, 99, 255, 0.15)' : 'var(--ps-blue)',
                '.MuiChip-label': { px: 8, fontSize: 10 }
              }}
            />
          </Box>
        </Stack>
      </CardContent>
      <CardContent sx={{ py: 0 }}>
        <Typography variant="h5">{title}&nbsp;&nbsp;</Typography>
        <Typography variant="body1" sx={{ pt: 12, opacity: 0.8 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default SummaryCard
