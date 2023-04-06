import { useCountDown, useRequest } from 'ahooks'
import React from 'react'
import { useAccount } from 'wagmi'
import { Box, SxProps, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import { hide, show } from '@ebay/nice-modal-react'
import { parseUnits } from '@ethersproject/units'

import { BigNumber } from 'bignumber.js'
import { ContractTransaction } from 'ethers'
import { ActionState } from '.'
import { useErc20Contract, useFixedSwapContract } from '@/hooks/web3/useContractHooks/useContract'
import { getFixedSwapContractAddress } from '@/utils/web3/contract'
import { swapCall } from '@/utils/web3/contractCalls/fixedSwap'
import { allowanceCall, approveCall } from '@/utils/web3/contractCalls/erc20'
import { PoolStatus, PoolType } from '@/api/pool/type'
import { getUserWhitelistProof } from '@/api/user'
import useChainConfigInBackend from '@/hooks/web3/useChainConfigInBackend'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import { NATIVE_TOEN_ADDRESS } from '@/constants/auction'
import DialogConfirmation from 'bounceComponents/common/DialogConfirmation'
import { DialogProps as DialogTipsProps, id } from 'bounceComponents/common/DialogTips'

export interface BidButtonProps {
  bidAmount?: string
  disabled?: boolean
  setAction: React.Dispatch<React.SetStateAction<ActionState>>
  sx?: SxProps
}

const BidButton = ({ bidAmount, disabled, setAction, sx }: BidButtonProps): JSX.Element => {
  const { address: account, isConnected } = useAccount()

  const { data: poolInfo, run: getPoolInfo } = usePoolInfo()

  const parsedBidAmount = bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals) : undefined

  const isToken1Native = poolInfo.token1.address === NATIVE_TOEN_ADDRESS

  const fixedSwapContract = useFixedSwapContract()
  const erc20Contract = useErc20Contract(poolInfo.token1.address)

  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: poolInfo.openAt * 1000,
    onEnd: getPoolInfo
  })

  // TODO: collect poolId, chainId into a context
  const router = useRouter()
  const { poolId, chainShortName } = router.query

  const chainConfigInBackend = useChainConfigInBackend('shortName', chainShortName)
  const fixedSwapContractAddress = getFixedSwapContractAddress(chainConfigInBackend.ethChainId)

  const { run: swap, loading: isSwapping } = useRequest(
    async () => {
      // Generate proof
      let proofArr = []

      if (poolInfo.enableWhiteList) {
        const {
          data: { proof: rawProofStr }
        } = await getUserWhitelistProof({
          address: account,
          category: PoolType.FixedSwap,
          chainId: chainConfigInBackend?.id,
          poolId: String(poolId)
        })

        const rawProofJson = JSON.parse(rawProofStr)

        if (Array.isArray(rawProofJson)) {
          proofArr = rawProofJson.map(rawProof => `0x${rawProof}`)
        }
      }

      // Check allowance
      // If token1 is not native and allowance is lower than amount to swap, then approve token.
      if (!isToken1Native) {
        const allowance = await allowanceCall(erc20Contract, account, fixedSwapContractAddress)

        if (allowance.lt(parsedBidAmount)) {
          show(DialogConfirmation, {
            title: 'Bounce requests wallet approval',
            subTitle: 'Please manually interact with your wallet. Ease enable Bounce to access your tokens.'
          })
          const approvalReceipt = await approveCall(erc20Contract, fixedSwapContractAddress, parsedBidAmount)

          if (!approvalReceipt) {
            return Promise.reject(new Error('Failed to approve'))
          }
        }
      }

      // Swap
      show(DialogConfirmation, {
        title: 'Bounce requests wallet interaction',
        subTitle: 'Please open your wallet and confirm in the transaction activity to proceed your order.'
      })

      let tx: ContractTransaction

      if (poolInfo.token1.address === NATIVE_TOEN_ADDRESS) {
        tx = await swapCall(fixedSwapContract, Number(poolId), parsedBidAmount, proofArr, parsedBidAmount)
      } else {
        tx = await swapCall(fixedSwapContract, Number(poolId), parsedBidAmount, proofArr)
      }

      show(DialogConfirmation, {
        title: 'Bounce waiting for transaction settlement',
        subTitle:
          'Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement.'
      })

      return tx.wait(1)
    },
    {
      manual: true,
      ready:
        !!fixedSwapContract &&
        (isToken1Native || !!erc20Contract) &&
        !!chainConfigInBackend?.id &&
        isConnected &&
        !!parsedBidAmount,
      onSuccess: () => {
        hide(DialogConfirmation)
        show<any, DialogTipsProps>(id, {
          iconType: 'success',
          againBtn: 'Close',
          title: 'Congratulations!',
          content: `You have successfully bid ${bidAmount} ${poolInfo.token0.symbol}`
        })
        setAction('Bid_Or_Regret')
      },
      onError: (error: Error & { reason: string }) => {
        console.log('swap error: ', error)
        hide(DialogConfirmation)
        show<any, DialogTipsProps>(id, {
          iconType: 'error',
          againBtn: 'Try Again',
          cancelBtn: 'Cancel',
          title: 'Oops..',
          content: 'Something went wrong',
          onAgain: swap
        })
      },
      onFinally: () => {
        hide(DialogConfirmation)
        getPoolInfo()
      }
    }
  )

  return (
    <LoadingButton
      variant="contained"
      fullWidth
      sx={{ ...sx }}
      loading={isSwapping}
      disabled={disabled || poolInfo.status !== PoolStatus.Live}
      onClick={swap}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: poolInfo.status === PoolStatus.Upcoming ? 'space-between' : 'center'
        }}
      >
        <Typography component="span" sx={{ width: 'fit-content' }}>
          Place a Bid
        </Typography>

        {poolInfo.status === PoolStatus.Upcoming && countdown > 0 ? (
          <Typography component="span">
            {days}d : {hours}h : {minutes}m : {seconds}s
          </Typography>
        ) : null}
      </Box>
    </LoadingButton>
  )
}

export default BidButton
