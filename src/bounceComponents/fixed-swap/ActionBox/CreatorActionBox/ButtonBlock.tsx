import SwitchNetworkButton from '../../SwitchNetworkButton'
import ConnectWalletButton from './ConnectWalletButton'
import { FixedSwapPoolProp, PoolStatus } from 'api/pool/type'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'
import { useCreatorClaim } from 'bounceHooks/auction/useCreatorClaim'
import { useActiveWeb3React } from 'hooks'
import { ChainId } from 'constants/chain'
import { useCallback, useMemo } from 'react'
import useIsAllTokenSwapped from 'bounceHooks/auction/useIsAllTokenSwapped'
import { LoadingButton } from '@mui/lab'
import { show } from '@ebay/nice-modal-react'
import { hideDialogConfirmation, showRequestConfirmDialog, showWaitingTxDialog } from 'utils/auction'
import DialogTips from 'bounceComponents/common/DialogTips'

const ButtonBlock = ({ poolInfo }: { poolInfo: FixedSwapPoolProp }) => {
  const { account, chainId } = useActiveWeb3React()
  const chainConfig = useChainConfigInBackend('id', poolInfo.chainId)
  const chainOfPool = chainConfig?.ethChainId as ChainId
  const isCurrentChainEqualChainOfPool = useMemo(() => chainId === chainOfPool, [chainId, chainOfPool])

  const isAllTokenSwapped = useIsAllTokenSwapped(poolInfo)

  const { run: claim, submitted } = useCreatorClaim(poolInfo.poolId, poolInfo.name)

  const successDialogContent = useMemo(() => {
    const hasToken0ToClaim = poolInfo.currencyCurrentTotal0.greaterThan('0')
    const token1ToClaimText = `${poolInfo.currencyCurrentTotal1.toSignificant()} ${poolInfo.token1.symbol}`
    const token0ToClaimText = hasToken0ToClaim
      ? ` and ${poolInfo.currencyCurrentTotal0.toSignificant()} ${poolInfo.token0.symbol}`
      : ''
    return `You have successfully claimed ${token1ToClaimText}${token0ToClaimText}`
  }, [poolInfo.currencyCurrentTotal0, poolInfo.currencyCurrentTotal1, poolInfo.token0.symbol, poolInfo.token1.symbol])

  const toClaim = useCallback(
    async (isCancel: boolean) => {
      showRequestConfirmDialog()
      try {
        const { transactionReceipt } = await claim()

        const ret = new Promise((resolve, rpt) => {
          showWaitingTxDialog(() => {
            hideDialogConfirmation()
            rpt()
          })
          transactionReceipt.then(curReceipt => {
            resolve(curReceipt)
          })
        })
        ret
          .then(() => {
            hideDialogConfirmation()
            show(DialogTips, {
              iconType: 'success',
              againBtn: 'Close',
              title: 'Congratulations!',
              content: isCancel
                ? '`You have successfully cancelled the pool and claimed your tokens`'
                : successDialogContent
            })
          })
          .catch()
      } catch (error) {
        const err: any = error
        hideDialogConfirmation()
        show(DialogTips, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: typeof err === 'string' ? err : err?.error?.message || err?.message || 'Something went wrong',
          onAgain: () => toClaim(isCancel)
        })
      }
    },
    [claim, successDialogContent]
  )

  if (!account) {
    return <ConnectWalletButton />
  }

  if (!isCurrentChainEqualChainOfPool) {
    return <SwitchNetworkButton targetChain={chainOfPool} />
  }

  if (poolInfo.status === PoolStatus.Closed && !poolInfo.creatorClaimed) {
    return (
      <LoadingButton
        variant="contained"
        fullWidth
        loading={submitted.complete || submitted.submitted}
        onClick={() => toClaim(false)}
      >
        {!isAllTokenSwapped ? 'Claim your unswapped tokens and fund raised' : 'Claim fund raised'}
      </LoadingButton>
    )
  }

  if (poolInfo.status === PoolStatus.Upcoming) {
    return (
      <LoadingButton
        variant="outlined"
        fullWidth
        sx={{ mt: 24, mb: 12 }}
        loading={submitted.complete || submitted.submitted}
        onClick={() => toClaim(true)}
      >
        Cancel & Claim tokens
      </LoadingButton>
    )
  }

  return null
}

export default ButtonBlock
