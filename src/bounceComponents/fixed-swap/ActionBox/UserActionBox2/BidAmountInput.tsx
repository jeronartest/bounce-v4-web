import { useCallback, useMemo } from 'react'
import { Button, Typography } from '@mui/material'
import { BigNumber } from 'bignumber.js'
import PoolInfoItem from '../../PoolInfoItem'
import TokenImage from 'bounceComponents/common/TokenImage'
import NumberInput from 'bounceComponents/common/NumberInput'
import { formatNumber } from 'utils/number'
import { getUserSwappedAmount1, getUserSwappedUnits1 } from 'utils/auction'
import { FixedSwapPoolProp } from 'api/pool/type'
import { useCurrencyBalance } from 'state/wallet/hooks'
import { useActiveWeb3React } from 'hooks'
import { CurrencyAmount } from 'constants/token'

interface BidAmountInputProps {
  bidAmount: string
  setBidAmount: (value: string) => void
  poolInfo: FixedSwapPoolProp
}

const BidAmountInput = ({ bidAmount, setBidAmount, poolInfo }: BidAmountInputProps) => {
  const { account } = useActiveWeb3React()
  const userToken1Balance = useCurrencyBalance(account || undefined, poolInfo.currencyAmountTotal0.currency)

  const availableAmount1 = useMemo(
    () => poolInfo.currencyAmountTotal1.subtract(poolInfo.currencySwappedTotal1),
    [poolInfo.currencyAmountTotal1, poolInfo.currencySwappedTotal1]
  )

  const hasBidLimit = useMemo(() => new BigNumber(poolInfo.maxAmount1PerWallet).gt(0), [poolInfo.maxAmount1PerWallet])

  // const isJoined = useIsUserJoinedPool()

  const userSwappedAmount1Units = useMemo(() => {
    const userSwappedAmount1 = getUserSwappedAmount1(
      poolInfo?.participant.swappedAmount0 || 0,
      poolInfo.token0.decimals,
      poolInfo.token1.decimals,
      poolInfo.ratio
    )

    // console.log('userSwappedAmount1.toString(): ', userSwappedAmount1.toString())

    // return new BigNumber(parseUnits(userSwappedAmount1.toString(), poolInfo.token1.decimals).toString())
    return getUserSwappedUnits1(userSwappedAmount1, poolInfo.token1.decimals)
  }, [poolInfo.ratio, poolInfo.token0.decimals, poolInfo.token1.decimals, poolInfo?.participant.swappedAmount0])

  const leftAllocationToken1 = useMemo(
    () =>
      hasBidLimit
        ? poolInfo.currencyMaxAmount1PerWallet.subtract(
            CurrencyAmount.fromRawAmount(
              poolInfo.currencyMaxAmount1PerWallet.currency,
              userSwappedAmount1Units.toString()
            )
          )
        : poolInfo.currencyAmountTotal1.subtract(poolInfo.currencySwappedTotal1),
    [
      hasBidLimit,
      poolInfo.currencyMaxAmount1PerWallet,
      poolInfo.currencyAmountTotal1,
      poolInfo.currencySwappedTotal1,
      userSwappedAmount1Units
    ]
  )

  const handleMaxButtonClick = useCallback(() => {
    // console.log('___ leftAmount1InPool: ', availableAmount1.toString())
    // console.log('___ token1Balance: ', token1Balance.toString())
    // console.log('___ leftAllocationToken1: ', leftAllocationToken1.toString())

    const minimum = [userToken1Balance, availableAmount1, leftAllocationToken1].reduce((pre, cur) => {
      return !pre ? cur : cur?.greaterThan(pre) ? pre : cur
    }, userToken1Balance)

    setBidAmount(minimum?.toSignificant(64, { groupSeparator: '' }) || '0')
  }, [availableAmount1, leftAllocationToken1, setBidAmount, userToken1Balance])

  const formattedTokenWillGet = bidAmount
    ? formatNumber(new BigNumber(bidAmount).div(poolInfo.ratio), { unit: 0 })
    : '0'

  return (
    <>
      <NumberInput
        sx={{ mt: 12 }}
        fullWidth
        value={bidAmount}
        placeholder={`Enter ${poolInfo.token0.symbol} amount`}
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

      <PoolInfoItem title="Token you will receive" sx={{ mt: 8 }}>
        {formattedTokenWillGet} {poolInfo.token0.symbol}
      </PoolInfoItem>
    </>
  )
}

export default BidAmountInput
