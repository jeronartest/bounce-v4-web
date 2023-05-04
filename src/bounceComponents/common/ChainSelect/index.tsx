import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { useOptionDatas } from 'state/configOptions/hooks'

export default function ChainSelect({ curChain, setCurChain }: { curChain: number; setCurChain: (v: number) => void }) {
  const optionDatas = useOptionDatas()

  return (
    <Select sx={{ width: 200, height: 38 }} value={curChain} onChange={e => setCurChain(Number(e.target?.value) || 0)}>
      <MenuItem key={0} value={0}>
        All Chains
      </MenuItem>
      {optionDatas?.chainInfoOpt?.map((item, index) => (
        <MenuItem key={index} value={item.id}>
          {item.chainName}
        </MenuItem>
      ))}
    </Select>
  )
}
