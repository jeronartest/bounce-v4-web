import { useCallback, useMemo, useState } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { styled, Button, Box, useTheme, Typography, Popper, Stack, Link, MenuItem } from '@mui/material'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { getEtherscanLink, shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
// import { ReactComponent as Web3StatusIconSvg } from 'assets/imgs/profile/yellow_avatar.svg'
import useBreakpoint from 'hooks/useBreakpoint'
import Image from 'components/Image'
import { ChainList, ChainListMap } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore, IosShare, SettingsPowerOutlined } from '@mui/icons-material'
import Copy from 'components/essential/Copy'
import { setInjectedConnected } from 'utils/isInjectedConnectedPrev'
import { useETHBalance } from 'state/wallet/hooks'
import { Currency } from 'constants/token'
import { ClickAwayListener } from '@mui/base'
import Divider from 'components/Divider'
import { OutlinedCard } from 'components/Card'
import { clearAllTransactions } from 'state/transactions/actions'
import { renderTransactions } from 'components/Modal/WalletModal/AccountDetails'
import { AppDispatch } from 'state'
import { useDispatch } from 'react-redux'
import LogoText from 'components/LogoText'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import Tooltip from 'bounceComponents/common/Tooltip'

const ActionButton = styled(Button)(({ theme }) => ({
  fontSize: '14px',
  marginBottom: 0,
  [theme.breakpoints.down('sm')]: {
    maxWidth: 320,
    width: '100%',
    borderRadius: 49,
    marginBottom: 0
  }
}))

const StyledBtn = styled('button')(`
  background-color: rgb(232, 236, 251);
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  height: 32px;
  width: 32px;
  min-width: auto !important,
  color: rgb(13, 17, 28);
  border: none;
  outline: none;
`)

const StyledMenuItem = styled(MenuItem)({
  height: 40,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
})
const StyleNetworkMenuItem = styled(StyledMenuItem)({
  padding: '6px',
  backgroundColor: 'var(--ps-gray-100)',
  '&:hover': {
    backgroundColor: 'var(--ps-gray-300)'
  }
})
// const Web3StatusIcon = styled(Web3StatusIconSvg)(({ theme }) => ({
//   [theme.breakpoints.down('sm')]: {
//     height: '24px',
//     width: '24px'
//   }
// }))

// we want the latest one to come first, so return negative if a is after b
function newTransactionsFirst(a: TransactionDetails, b: TransactionDetails) {
  return b.addedTime - a.addedTime
}

function Web3StatusInner() {
  const { account, error } = useWeb3React()
  const { chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])
  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const toggleWalletModal = useWalletModalToggle()
  const isDownSm = useBreakpoint()
  const theme = useTheme()
  const { ENSName } = useENSName(account || undefined)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  if (account && chainId) {
    return (
      <ClickAwayListener
        onClickAway={() => {
          setAnchorEl(null)
        }}
      >
        <Box>
          <Button
            onClick={handleClick}
            sx={{
              cursor: 'pointer',
              borderRadius: 20,
              padding: '0 12px',
              minWidth: 64,
              border: '1px solid var(--ps-gray-900)',
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper
            }}
          >
            <Image height={22} style={{ marginRight: 4 }} src={ChainListMap[chainId]?.logo || ''} />
            {pending?.length ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 10, sm: 17 }, ml: { xs: 10, sm: 9 } }}>
                <Spinner color={theme.palette.text.primary} size={isDownSm ? '10px' : '16px'} />
                <Box component="span" sx={{ ml: 3 }}>
                  <Typography sx={{ fontSize: { xs: 9, sm: 14 }, ml: 8, color: theme.palette.text.primary }} noWrap>
                    {pending?.length} Pending
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography
                sx={{
                  lineHeight: '16px',
                  fontSize: { xs: 9, sm: 14 },
                  color: theme.palette.text.primary
                }}
              >
                {ENSName || shortenAddress(account)}
              </Typography>
            )}
            {anchorEl ? <ExpandLess /> : <ExpandMore />}
          </Button>
          <WalletPopper anchorEl={anchorEl} close={() => setAnchorEl(null)} />
        </Box>
      </ClickAwayListener>
    )
  } else if (error) {
    return (
      <ActionButton
        sx={{
          width: isDownSm ? '128px' : '140px',
          height: isDownSm ? '28px' : '40px',
          fontSize: isDownSm ? '12px' : '14px'
        }}
        onClick={toggleWalletModal}
      >
        {error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}
      </ActionButton>
    )
  } else {
    return (
      <ActionButton
        sx={{
          width: isDownSm ? '128px' : '140px',
          height: isDownSm ? '28px' : '40px',
          fontSize: isDownSm ? '12px' : '14px'
        }}
        onClick={toggleWalletModal}
      >
        Connect Wallet
      </ActionButton>
    )
  }
}

export default function Web3Status() {
  const { active, account } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  const { ENSName } = useENSName(account ?? undefined)

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal ENSName={ENSName ?? undefined} pendingTransactions={pending} confirmedTransactions={confirmed} />
    </>
  )
}

enum WalletView {
  MAIN,
  TRANSACTIONS,
  SWITCH_NETWORK
}

function WalletPopper({ anchorEl, close }: { anchorEl: null | HTMLElement; close: () => void }) {
  const open = !!anchorEl
  const theme = useTheme()
  const { deactivate, connector } = useWeb3React()
  const { account, chainId } = useActiveWeb3React()
  const { ENSName } = useENSName(account || undefined)
  const myETH = useETHBalance(account || undefined)
  const [curView, setCurView] = useState(WalletView.MAIN)
  const dispatch = useDispatch<AppDispatch>()
  const switchNetwork = useSwitchNetwork()

  const allTransactions = useAllTransactions()

  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const pendingTransactions = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
  const confirmedTransactions = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)

  const clearAllTransactionsCallback = useCallback(() => {
    if (chainId) dispatch(clearAllTransactions({ chainId }))
  }, [dispatch, chainId])

  if (!chainId || !account) return null
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      sx={{
        top: '20px !important',
        width: 320,
        zIndex: theme.zIndex.modal
      }}
    >
      <Box
        sx={{
          border: '1px solid rgb(210, 217, 238)',
          bgcolor: 'background.paper',
          borderRadius: '12px',
          padding: '16px',
          minHeight: 250
        }}
      >
        {WalletView.MAIN === curView && (
          <Box>
            <Box display={'flex'} justifyContent="space-between">
              <Box display={'flex'} alignItems="center">
                <Image height={22} style={{ marginRight: 4 }} src={chainId ? ChainListMap[chainId]?.logo || '' : ''} />
                <Box>
                  <Typography fontSize={12}>{shortenAddress(account || '')}</Typography>
                  <Typography fontSize={12}>{ENSName}</Typography>
                </Box>
              </Box>
              <Stack direction={'row'} spacing={8}>
                <Tooltip title="Copy address">
                  <StyledBtn>
                    <Copy toCopy={account || ''} />
                  </StyledBtn>
                </Tooltip>
                <Tooltip title="Explorer">
                  <StyledBtn>
                    <Link target={'_blank'} href={getEtherscanLink(chainId, account, 'address')}>
                      <IosShare sx={{ color: '#000', height: 18 }} />
                    </Link>
                  </StyledBtn>
                </Tooltip>
                <Tooltip title="Disconnect">
                  <StyledBtn>
                    <SettingsPowerOutlined
                      onClick={() => {
                        setInjectedConnected()
                        deactivate()
                        connector?.deactivate()
                        close()
                      }}
                      sx={{ color: '#000', height: 18 }}
                    />
                  </StyledBtn>
                </Tooltip>
              </Stack>
            </Box>
            <Box padding="20px 0">
              <Typography color={theme.palette.text.secondary} textAlign="center">
                ETH Balance
              </Typography>
              <Typography variant="h3" fontWeight={500} textAlign={'center'}>
                {myETH?.toSignificant()} {Currency.getNativeCurrency(chainId).symbol}
              </Typography>
            </Box>

            <Divider />

            <Box mt={15}>
              <StyledMenuItem
                onClick={() => {
                  setCurView(WalletView.SWITCH_NETWORK)
                }}
              >
                <Typography>Switch Network</Typography>
                <ChevronRight />
              </StyledMenuItem>
              <StyledMenuItem onClick={() => setCurView(WalletView.TRANSACTIONS)}>
                <Typography>Transactions</Typography>
                <ChevronRight />
              </StyledMenuItem>
            </Box>
          </Box>
        )}
        {curView === WalletView.TRANSACTIONS && (
          <Box>
            <Box pb={15} display={'flex'} justifyContent="space-between" alignItems={'center'}>
              <StyledBtn>
                <ChevronLeft onClick={() => setCurView(WalletView.MAIN)} />
              </StyledBtn>
              <Typography>Transactions</Typography>
            </Box>
            <Divider />
            <OutlinedCard style={{ border: 'none', marginTop: 15 }}>
              {!!pendingTransactions.length || !!confirmedTransactions.length ? (
                <Box display="grid" gap="16px" width="100%">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems={'center'}
                    width="100%"
                    fontWeight={500}
                  >
                    <Typography variant="inherit">Recent Transactions</Typography>
                    <Typography
                      fontSize={12}
                      sx={{
                        cursor: 'pointer'
                      }}
                      onClick={clearAllTransactionsCallback}
                    >
                      (clear all)
                    </Typography>
                  </Box>
                  <Box
                    display="grid"
                    sx={{
                      maxHeight: '50vh',
                      paddingRight: '15px',
                      marginRight: '-15px',
                      overflowY: 'auto'
                    }}
                  >
                    {renderTransactions(pendingTransactions)}
                    {renderTransactions(confirmedTransactions)}
                  </Box>
                </Box>
              ) : (
                <Box display="flex" width="100%" justifyContent="center" marginTop={15}>
                  <Typography fontSize={12}> Your transactions will appear here...</Typography>
                </Box>
              )}
            </OutlinedCard>
          </Box>
        )}
        {curView === WalletView.SWITCH_NETWORK && (
          <Box>
            <Box pb={15} display={'flex'} justifyContent="space-between" alignItems={'center'}>
              <StyledBtn>
                <ChevronLeft onClick={() => setCurView(WalletView.MAIN)} />
              </StyledBtn>
              <Typography>Switch Network</Typography>
            </Box>
            <Divider />
            <Box>
              <Box
                sx={{
                  mt: 20,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px'
                }}
              >
                {ChainList.map(item => (
                  <StyleNetworkMenuItem
                    onClick={() => {
                      switchNetwork(item.id)
                      setCurView(WalletView.MAIN)
                      close()
                    }}
                    key={item.id}
                    sx={{ border: chainId === item.id ? '1px solid' : 'none' }}
                    disabled={chainId === item.id}
                  >
                    <LogoText fontSize={12} logo={item.logo} text={item.name} />
                  </StyleNetworkMenuItem>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Popper>
  )
}
