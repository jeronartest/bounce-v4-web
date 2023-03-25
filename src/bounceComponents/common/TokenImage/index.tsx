import { Avatar, AvatarProps } from '@mui/material'
import BlockSVG from 'assets/imgs/icon/block.svg'

export type TokenImageProps = AvatarProps & { size: number; fallbackSize?: number }

const TokenImage = (props: TokenImageProps) => {
  const { size, src, sx, fallbackSize } = props

  // TODO: use next/Image
  return (
    <Avatar
      {...props}
      src={src || BlockSVG}
      sx={{
        '& img': {
          height: 'auto',
          width: 'auto'
        },
        ...sx,
        width: !src ? fallbackSize ?? size : size,
        height: !src ? fallbackSize ?? size : size
      }}
    >
      <Avatar {...props} src={BlockSVG} sx={{ ...sx, width: fallbackSize ?? size, height: fallbackSize ?? size }} />
    </Avatar>
  )
}

export default TokenImage
