import { useMemo } from 'react'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { styled, Button, Box, useTheme, Typography } from '@mui/material'
import { NetworkContextName } from '../../constants'
import useENSName from '../../hooks/useENSName'
import { useWalletModalToggle } from '../../state/application/hooks'
import { isTransactionRecent, useAllTransactions } from '../../state/transactions/hooks'
import { TransactionDetails } from '../../state/transactions/reducer'
import { shortenAddress } from '../../utils'
import WalletModal from 'components/Modal/WalletModal/index'
import Spinner from 'components/Spinner'
// import { ReactComponent as Web3StatusIconSvg } from 'assets/imgs/profile/yellow_avatar.svg'
import useBreakpoint from 'hooks/useBreakpoint'

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

  if (account) {
    return (
      <Box
        onClick={toggleWalletModal}
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
              fontWeight: '700',
              lineHeight: '16px',
              fontSize: { xs: 9, sm: 14 },
              color: theme.palette.text.primary
            }}
          >
            {ENSName || shortenAddress(account)}
          </Typography>
        )}
      </Box>
    )
  } else if (error) {
    return (
      <ActionButton
        sx={{
          width: isDownSm ? '128px' : '140px',
          height: isDownSm ? '28px' : '36px',
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
          height: isDownSm ? '28px' : '36px',
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
