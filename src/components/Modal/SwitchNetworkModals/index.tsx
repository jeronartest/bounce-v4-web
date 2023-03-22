import { Box, MenuItem, styled, Typography } from '@mui/material'
import LogoText from 'components/LogoText'
import { ChainList } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { ApplicationModal } from 'state/application/actions'
import { useModalOpen, useSwitchNetworkModalToggle } from 'state/application/hooks'
import Modal from '..'

const StyleMenuItem = styled(MenuItem)({
  height: 60,
  borderRadius: 12,
  backgroundColor: 'var(--ps-gray-100)',
  '&:hover': {
    backgroundColor: 'var(--ps-gray-300)'
  }
})

export default function SwitchNetworkModals() {
  const switchModalOpen = useModalOpen(ApplicationModal.SWITCH_NETWORK)
  const toggleNetwork = useSwitchNetworkModalToggle()
  const { chainId } = useActiveWeb3React()
  const switchNetwork = useSwitchNetwork()

  return (
    <Modal customIsOpen={switchModalOpen} customOnDismiss={toggleNetwork} maxWidth="520px" closeIcon={true}>
      <Box width={'100%'} padding="32px">
        <Typography textAlign={'center'} variant="h3" fontWeight={500}>
          Switch Your Connected Chain
        </Typography>
        <Box
          sx={{
            mt: 20,
            display: 'grid',
            gridTemplateColumns: '50% 50%',
            gap: '15px'
          }}
        >
          {ChainList.map(item => (
            <StyleMenuItem
              onClick={() => {
                toggleNetwork()
                switchNetwork(item.id)
              }}
              key={item.id}
              disabled={chainId === item.id}
            >
              <LogoText logo={item.logo} text={item.name} />
            </StyleMenuItem>
          ))}
        </Box>
      </Box>
    </Modal>
  )
}
