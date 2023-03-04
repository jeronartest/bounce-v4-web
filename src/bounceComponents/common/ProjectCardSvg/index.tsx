import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { ReactComponent as Web3SVG } from '@/assets/imgs/companies/tag/web3.svg'
import { ReactComponent as DaoSVG } from '@/assets/imgs/companies/tag/dao.svg'
import { ReactComponent as Defi3SVG } from '@/assets/imgs/companies/tag/defi.svg'
import { ReactComponent as GaimingSVG } from '@/assets/imgs/companies/tag/gaiming.svg'
import { ReactComponent as NftSVG } from '@/assets/imgs/companies/tag/nft.svg'
import { ReactComponent as OtherSVG } from '@/assets/imgs/companies/tag/other.svg'
import { ReactComponent as ToolSVG } from '@/assets/imgs/companies/tag/tool.svg'
import { ReactComponent as WalletSVG } from '@/assets/imgs/companies/tag/wallet.svg'

export type IProjectCardSvgProps = {
  status: number
}
enum StatusType {
  'DeFi' = 2,
  'NFT' = 3,
  'Web3' = 4,
  'Gaiming' = 5,
  'DAO' = 6,
  'Wallet' = 7,
  'Tool' = 8,
  'Other' = 9,
}
const tagSvg = (status: number) => {
  switch (status) {
    case 2:
      return <Defi3SVG />
    case 3:
      return <NftSVG />
    case 4:
      return <Web3SVG />
    case 5:
      return <GaimingSVG />
    case 6:
      return <DaoSVG />
    case 7:
      return <WalletSVG />
    case 8:
      return <ToolSVG />
    case 9:
      return <OtherSVG />
    default:
      break
  }
}
const ProjectCardSvg: React.FC<IProjectCardSvgProps> = ({ status }) => {
  return (
    <Box
      px={10}
      sx={{
        // minWidth: 80,
        background: '#000',
        borderRadius: 20,
        height: 24,
        display: 'inline-flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {tagSvg(status)}
      <Typography variant="body2" color={'#FFF'} ml={6}>
        {StatusType[status]}
      </Typography>
    </Box>
  )
}

export default ProjectCardSvg
