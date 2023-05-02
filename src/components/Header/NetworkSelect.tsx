import { MenuItem, Box } from '@mui/material'
import LogoText from 'components/LogoText'
import Select from 'components/Select/Select'
import { useActiveWeb3React } from 'hooks'
import { ChainList, ChainListMap } from 'constants/chain'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'

export default function NetworkSelect() {
  const { chainId } = useActiveWeb3React()
  const isDownSm = useBreakpoint('sm')
  const switchNetwork = useSwitchNetwork()

  if (!chainId) return null

  return (
    <Box sx={{ width: 'auto' }}>
      <Select
        defaultValue={chainId ?? undefined}
        value={chainId ?? undefined}
        width="max-content"
        height={isDownSm ? '24px' : '44px'}
        style={{
          background: 'transparent',
          border: '1px solid var(--ps-border-1)',
          '& .Mui-disabled.MuiSelect-select.MuiInputBase-input': {
            paddingRight: isDownSm ? 0 : 10,
            color: theme => theme.palette.text.primary,
            WebkitTextFillColor: theme => theme.palette.text.primary
          },
          '&.Mui-focused': {
            borderColor: 'var(--ps-border-1)'
          }
        }}
        renderValue={() => <Image src={ChainListMap[chainId]?.logo || ''} style={{ marginRight: 6 }} width={24} />}
      >
        {ChainList.map(option => (
          <MenuItem
            onClick={() => {
              switchNetwork(option.id)
            }}
            value={option.id}
            key={option.id}
            selected={chainId === option.id}
          >
            {/* {isDownSm ? (
              <Image src={option.logo} style={{ height: 14, width: 'auto', margin: '5px 0 0' }} />
            ) : (
              <LogoText logo={option.logo} text={option.name} gapSize={'small'} fontSize={14} />
            )} */}
            <LogoText logo={option.logo} text={option.name} gapSize={'small'} fontSize={14} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  )
}
