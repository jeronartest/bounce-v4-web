import SwitchNetworkButton from '../../SwitchNetworkButton'
import ConnectWalletButton from './ConnectWalletButton'
import { FixedSwapPoolProp, PoolStatus } from 'api/pool/type'
import { useCreatorClaim } from 'bounceHooks/auction/useCreatorClaim'
import { useActiveWeb3React } from 'hooks'
import { useCallback, useMemo } from 'react'
import useIsAllTokenSwapped from 'bounceHooks/auction/useIsAllTokenSwapped'
import { LoadingButton } from '@mui/lab'
import { show } from '@ebay/nice-modal-react'
import { hideDialogConfirmation, showRequestConfirmDialog, showWaitingTxDialog } from 'utils/auction'
import DialogTips from 'bounceComponents/common/DialogTips'

const ButtonBlock = ({ poolInfo }: { poolInfo: FixedSwapPoolProp }) => {
  const { account, chainId } = useActiveWeb3React()
  const isCurrentChainEqualChainOfPool = useMemo(() => chainId === poolInfo.ethChainId, [chainId, poolInfo.ethChainId])

  const isAllTokenSwapped = useIsAllTokenSwapped(poolInfo)

  const { run: claim, submitted } = useCreatorClaim(poolInfo.poolId, poolInfo.name)

  const successDialogContent = useMemo(() => {
    const hasToken0ToClaim = poolInfo.currencySurplusTotal0.greaterThan('0')
    const token1ToClaimText = `${poolInfo.currencySwappedTotal1.toSignificant()} ${poolInfo.token1.symbol}`
    const token0ToClaimText = hasToken0ToClaim
      ? ` and ${poolInfo.currencySurplusTotal0.toSignificant()} ${poolInfo.token0.symbol}`
      : ''
    return `You have successfully claimed ${token1ToClaimText}${token0ToClaimText}`
  }, [poolInfo.currencySurplusTotal0, poolInfo.currencySwappedTotal1, poolInfo.token0.symbol, poolInfo.token1.symbol])

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
        console.error(err)
        hideDialogConfirmation()
        show(DialogTips, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: err?.error?.message || err?.data?.message || err?.message || 'Something went wrong',
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
    return <SwitchNetworkButton targetChain={poolInfo.ethChainId} />
  }

  if (poolInfo.status === PoolStatus.Closed && !poolInfo.creatorClaimed) {
    return (
      <LoadingButton
        variant="contained"
        fullWidth
        loadingPosition="start"
        loading={submitted.complete || submitted.submitted}
        onClick={() => toClaim(false)}
      >
        <span>{!isAllTokenSwapped ? 'Claim your unswapped tokens and fund raised' : 'Claim fund raised'}</span>
      </LoadingButton>
    )
  }

  if (poolInfo.status === PoolStatus.Upcoming) {
    return (
      <LoadingButton
        variant="outlined"
        fullWidth
        loadingPosition="start"
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
