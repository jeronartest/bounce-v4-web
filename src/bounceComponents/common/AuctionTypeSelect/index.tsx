import { MenuItem, Select } from '@mui/material'
import FormItem from '../FormItem'
import { PoolType } from 'api/pool/type'

export default function AuctionTypeSelect({
  curPoolType,
  setCurPoolType
}: {
  curPoolType: PoolType | 0
  setCurPoolType: (type: PoolType) => void
}) {
  return (
    <FormItem name="auctionType" label="Auction type" sx={{ width: 190 }}>
      <Select
        defaultValue={PoolType.FixedSwap}
        value={curPoolType}
        onChange={e => setCurPoolType(e.target.value as PoolType)}
      >
        <MenuItem value={0}>Auction Type</MenuItem>
        <MenuItem value={PoolType.FixedSwap}>Fixed Price</MenuItem>
        <MenuItem value={PoolType.fixedSwapNft}>Fixed Swap NFT</MenuItem>
        <MenuItem value={PoolType.Lottery}>Random Selection</MenuItem>
      </Select>
    </FormItem>
  )
}
