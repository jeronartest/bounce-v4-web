import React, { useMemo, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { commify, formatUnits, parseUnits } from 'ethers/lib/utils.js'
import { useCountDown, useRequest } from 'ahooks'
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi'
import { BigNumber } from 'bignumber.js'
import Image from 'next/image'
import PoolInfoItem from '../../PoolInfoItem'
import SwitchNetworkButton from '../../SwitchNetworkButton'
import BidButton from './BidButton'
import { ActionState } from '.'
import TokenImage from '@/components/common/TokenImage'
import { formatNumber } from '@/utils/web3/number'
import { balanceOfCall } from '@/utils/web3/contractCalls/erc20'
import { useErc20Contract } from '@/hooks/web3/useContractHooks/useContract'
import usePoolInfo from '@/hooks/auction/useNftPoolInfo'
import { NATIVE_TOEN_ADDRESS } from '@/constants/auction'
import NumberInput from '@/components/common/NumberInput'
import usePoolWithParticipantInfo from '@/hooks/auction/use1155PoolWithParticipantInfo'
import { PoolStatus } from '@/api/pool/type'
import useChainConfigInBackend from '@/hooks/web3/useChainConfigInBackend'

import RotateSVG from 'assets/imgs/auction/rotate.svg'
import ErrorSVG from 'assets/imgs/auction/error.svg'
import ErrorOutlineSVG from 'assets/imgs/icon/error_outline.svg'
import { getUserNftSwappedAmount1 } from '@/utils/auction'

export interface BidBlockProps {
  setAction: React.Dispatch<React.SetStateAction<ActionState>>
  action: 'To_Confirm_Notice' | 'Bid'
  setBidAmount: React.Dispatch<React.SetStateAction<string>>
  bidAmount: string
}

interface ToConfirmButtonProps {
  disabled?: boolean
  onClick: () => void
}

const ToConfirmButton = ({ disabled, onClick }: ToConfirmButtonProps) => {
  const { data: poolInfo } = usePoolInfo()

  const [countdown, { days, hours, minutes, seconds }] = useCountDown({
    targetDate: poolInfo.openAt * 1000
  })

  return (
    <Button variant="contained" fullWidth sx={{ mt: 24, mb: 12, px: 40 }} onClick={onClick} disabled={disabled}>
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
    </Button>
  )
}

const BidBlock = ({ setAction, action, setBidAmount, bidAmount }: BidBlockProps): JSX.Element => {
  const { address: account } = useAccount()
  const { chain } = useNetwork()

  const { data: poolInfo } = usePoolInfo()
  const { data: poolWithParticipantInfo } = usePoolWithParticipantInfo()

  const chainConfig = useChainConfigInBackend('id', poolInfo?.chainId)
  const chainOfPool = chainConfig.ethChainId
  const isCurrentChainEqualChainOfPool = chain?.id && chain.id === chainOfPool

  const isJoined =
    poolWithParticipantInfo?.participant &&
    poolWithParticipantInfo?.participant.swappedAmount0 !== '' &&
    poolWithParticipantInfo?.participant.swappedAmount0 !== '0'
  const isToken1Native = poolInfo.token1.address === NATIVE_TOEN_ADDRESS

  const userSwappedAmount1 = isJoined
    ? getUserNftSwappedAmount1(
        poolWithParticipantInfo?.participant.swappedAmount0,
        poolInfo.ratio,
        poolInfo.token1.decimals
      )
    : // new BigNumber(
      //     new BigNumber(
      //       formatUnits(poolWithParticipantInfo?.participant.swappedAmount0, poolInfo.token0.decimals).toString(),
      //     )
      //       .times(poolInfo.ratio)
      //       .toFixed(poolInfo.token1.decimals),
      //   )
      new BigNumber(0)

  const userSwappedAmount1Units = new BigNumber(
    parseUnits(userSwappedAmount1.toString(), poolInfo.token1.decimals).toString()
  )

  const formattedTokenWillGet = bidAmount ? new BigNumber(bidAmount).div(poolInfo.ratio).toFormat() : '0'

  const formatedMMaxAmount1PerWallet = poolInfo.maxAmount1PerWallet
    ? formatNumber(poolInfo.maxAmount1PerWallet, {
        unit: poolInfo.token1.decimals,
        decimalPlaces: 2
      })
    : ''

  const erc20Contract = useErc20Contract(poolInfo.token1.address)

  const { data: erc20Token1Balance } = useRequest(async () => balanceOfCall(erc20Contract, account), {
    ready: !!erc20Contract,
    refreshDeps: [account, erc20Contract]
  })
  const { data: nativeToken1BalanceResult } = useBalance({
    address: account,
    enabled: isToken1Native,
    watch: false
  })

  const token1Balance = useMemo(
    () =>
      isToken1Native
        ? new BigNumber(nativeToken1BalanceResult?.value.toString()) || new BigNumber(0)
        : new BigNumber(erc20Token1Balance?.toString()) || new BigNumber(0),
    [erc20Token1Balance, isToken1Native, nativeToken1BalanceResult?.value]
  )

  const formattedToken1Balance =
    token1Balance && token1Balance.toString() !== 'NaN'
      ? formatNumber(token1Balance.toString(), { unit: poolInfo.token1.decimals, decimalPlaces: 2 })
      : '-'

  console.log('token1Balance: ', token1Balance.toString())

  const hasBidLimit = new BigNumber(poolInfo.maxAmount1PerWallet).gt(0)

  const availableAmount1 = new BigNumber(poolInfo.amountTotal1).minus(new BigNumber(poolInfo.currentTotal1))
  const leftAllocationToken1 = hasBidLimit
    ? new BigNumber(poolInfo.maxAmount1PerWallet).minus(userSwappedAmount1Units)
    : new BigNumber(poolInfo.amountTotal1)

  const handleMaxButtonClick = () => {
    if (!formattedToken1Balance) return

    const _token1Balance = new BigNumber(token1Balance.toString())

    // console.log('___ leftAmount1InPool: ', availableAmount1.toString())
    // console.log('___ _token1Balance: ', _token1Balance.toString())
    // console.log('___ leftAllocationToken1: ', leftAllocationToken1.toString())

    const minimum = BigNumber.min(_token1Balance, availableAmount1, leftAllocationToken1)

    console.log('minimum:', minimum.toString())

    setBidAmount(
      commify(
        formatNumber(minimum.toString(), {
          unit: poolInfo.token1.decimals,
          decimalPlaces: poolInfo.token1.decimals,
          shouldSplitByComma: false
        })
      )
    )
  }

  const isToken1BalanceLte0 = token1Balance.lte(0)

  console.log('bidAmount: ', bidAmount)
  // return null

  const isBidAmountGtToken1Balance = new BigNumber(
    bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals).toString() : '0'
  ).gt(token1Balance)

  const isBidAmountGtAvailableAmount1 = new BigNumber(
    bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals).toString() : '0'
  ).gt(availableAmount1)

  const isBidAmountGtLeftAllocationToken1 = new BigNumber(
    bidAmount ? parseUnits(bidAmount, poolInfo.token1.decimals).toString() : '0'
  ).gt(leftAllocationToken1)

  const isUserSwappedAmount1GteLeftAllocationToken1 = userSwappedAmount1Units.gte(leftAllocationToken1)

  const isBalanceInsufficient = isBidAmountGtToken1Balance || isBidAmountGtAvailableAmount1 || isToken1BalanceLte0
  const isLimitExceeded = isBidAmountGtLeftAllocationToken1 || isUserSwappedAmount1GteLeftAllocationToken1

  const isBidButtonDisabled =
    !bidAmount || poolInfo.status !== PoolStatus.Live || isBalanceInsufficient || isLimitExceeded

  // console.log('_isBidAmountGtToken1Balance: ', isBidAmountGtToken1Balance)
  // console.log('_isBidAmountGtAvailableAmount1: ', isBidAmountGtAvailableAmount1)
  // console.log('_isBidAmountGtLeftAllocationToken1: ', isBidAmountGtLeftAllocationToken1)
  // console.log(
  //   '>>>>>>>> isUserSwappedAmount1GteLeftAllocationToken1: ',
  //   isBidAmountGtLeftAllocationToken1,
  //   userSwappedAmount1Units.toString(),
  //   leftAllocationToken1.toString(),
  // )

  // console.log('userSwappedAmount1Units: ', userSwappedAmount1Units.toString())
  // console.log('maxAmount1PerWallet: ', new BigNumber(poolInfo?.maxAmount1PerWallet || '0').toString())

  // const isMaxAmount1Exceeded =
  //   userSwappedAmount1.gt(0) &&
  //   poolInfo?.maxAmount1PerWallet &&
  //   new BigNumber(poolInfo?.maxAmount1PerWallet).gt(0) &&
  //   userSwappedAmount1Units.gte(new BigNumber(poolInfo?.maxAmount1PerWallet))

  // console.log('userSwappedAmount1Units: ', userSwappedAmount1Units.toString())
  // console.log('maxAmount1PerWallet: ', new BigNumber(poolInfo?.maxAmount1PerWallet || '0').toString())

  return (
    <Box sx={{ mt: 36 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Your Bid Amount</Typography>

        <Typography>
          Balance: {formattedToken1Balance} {poolInfo.token1.symbol}
        </Typography>
      </Box>
      <NumberInput
        sx={{ mt: 12 }}
        fullWidth
        value={bidAmount}
        placeholder="Enter"
        onUserInput={value => {
          setBidAmount(value)
        }}
        endAdornment={
          <>
            <Button size="small" variant="outlined" sx={{ mr: 20, minWidth: 60 }} onClick={handleMaxButtonClick}>
              Max
            </Button>
            <TokenImage alt={poolInfo.token1.symbol} src={poolInfo.token1.largeUrl} size={24} />
            <Typography sx={{ ml: 8 }}>{poolInfo.token1.symbol}</Typography>
          </>
        }
      />

      {hasBidLimit && (
        <PoolInfoItem
          title="Bid amount limit"
          sx={{ mt: 8, color: isUserSwappedAmount1GteLeftAllocationToken1 ? '#F53030' : 'black' }}
        >
          {userSwappedAmount1.toFormat(2)} {poolInfo.token1.symbol} / {formatedMMaxAmount1PerWallet}{' '}
          {poolInfo.token1.symbol}
        </PoolInfoItem>
      )}

      <PoolInfoItem title="Token you will recieve" sx={{ mt: 8 }}>
        {formattedTokenWillGet} {poolInfo.token0.symbol}
      </PoolInfoItem>

      {!isCurrentChainEqualChainOfPool ? (
        <SwitchNetworkButton targetChain={chainConfig.ethChainId} />
      ) : !isBalanceInsufficient ? (
        !isLimitExceeded ? (
          action === 'Bid' ? (
            isJoined ? (
              <Stack direction="row" spacing={8} sx={{ mt: 24, mb: 12 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    setAction('Bid_Or_Regret')
                  }}
                >
                  Cancel
                </Button>
                <BidButton disabled={isBidButtonDisabled} bidAmount={bidAmount} setAction={setAction} />
              </Stack>
            ) : (
              <BidButton
                sx={{ mt: 24, mb: 12 }}
                disabled={isBidButtonDisabled}
                bidAmount={bidAmount}
                setAction={setAction}
              />
            )
          ) : isJoined ? (
            <Stack direction="row" spacing={8} sx={{ mt: 24, mb: 12 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  setAction('Bid_Or_Regret')
                }}
              >
                Cancel
              </Button>
              <ToConfirmButton
                disabled={isBidButtonDisabled}
                onClick={() => {
                  setAction('Confirm_Notice')
                }}
              />
            </Stack>
          ) : (
            <ToConfirmButton
              disabled={isBidButtonDisabled}
              onClick={() => {
                setAction('Confirm_Notice')
              }}
            />
          )
        ) : (
          <Button variant="contained" fullWidth sx={{ mt: 24, mb: 12, px: 40 }} disabled>
            Limit exceeded
          </Button>
        )
      ) : (
        <Button variant="contained" fullWidth sx={{ mt: 24, mb: 12, px: 40 }} disabled>
          Insufficient balance
        </Button>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {chain.id !== chainConfig.ethChainId ? (
          <>
            <Image src={ErrorSVG} alt="Error Icon" width={20} height={20} />
            <Typography variant="body2" sx={{ ml: 8 }}>
              Oops! Wrong network
            </Typography>
          </>
        ) : poolInfo.status !== PoolStatus.Upcoming ? (
          <>
            <Image src={RotateSVG} alt="Rotate Icon" width={20} height={20} />
            <Typography variant="body2" sx={{ ml: 8 }}>
              If you regret about your bid you can get fund back later
            </Typography>
          </>
        ) : null}
      </Box>
    </Box>
  )
}

export default BidBlock
