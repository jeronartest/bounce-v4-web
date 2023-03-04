import {
  Button,
  Stack,
  OutlinedInput,
  Box,
  Typography,
  FormControlLabel,
  Avatar,
  Alert,
  AlertTitle
} from '@mui/material'
import { Field, Form, Formik } from 'formik'
import React, { SetStateAction } from 'react'
import * as Yup from 'yup'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

import { show } from '@ebay/nice-modal-react'
import { parseUnits } from 'ethers/lib/utils.js'

import { useContractRead, erc20ABI, useAccount, useNetwork } from 'wagmi'
import { useRouter } from 'next/router'
import { AllocationStatus, Token } from '../types'
import FakeOutlinedInput from '../FakeOutlinedInput'
import TokenDialog from '../TokenDialog'
import { ActionType, useValuesDispatch, useValuesState } from '../ValuesProvider'
import Radio from '../Radio'
import RadioGroupFormItem from '../RadioGroupFormItem'

import LogoSVG from 'assets/imgs/components/logo.svg'

import FormItem from 'bounceComponents/common/FormItem'
import { formatNumber } from '@/utils/web3/number'
import Tooltip from 'bounceComponents/common/Tooltip'
import { SupportedChainId } from '@/constants/web3/chains'
import TokenImage from 'bounceComponents/common/TokenImage'

interface FormValues {
  tokenFromAddress: string
  tokenFromSymbol: string
  tokenFromLogoURI?: string
  tokenFromDecimals: string
  tokenToAddress: string
  tokenToSymbol: string
  tokenToLogoURI?: string
  tokenToDecimals: string | number
  swapRatio: string
  poolSize: string
  allocationStatus: AllocationStatus
  allocationPerWallet: string
}

const AuctionParametersForm = (): JSX.Element => {
  const validationSchema = Yup.object({
    tokenToSymbol: Yup.string()
      .required('Token is required')
      .test(
        'DIFFERENT_TOKENS',
        'Please choose a different token',
        (_, context) => context.parent.tokenFromAddress !== context.parent.tokenToAddress
      ),
    swapRatio: Yup.number()
      .positive('Swap ratio must be positive')
      .typeError('Please input valid number')
      .required('Swap ratio is required'),
    poolSize: Yup.number()
      // .typeError('Please input valid number')
      // .max(balance.to || 0, 'Pool size cannot be greater than your balance')
      .required('Amount is required')
      .test(
        'POOL_SIZE_LESS_THAN_BALANCE',
        'Pool size cannot be greater than your balance',
        value => !value || (balance && balance.gte(parseUnits(String(value), valuesState.tokenFrom.decimals)))
      ),
    allocationStatus: Yup.string().oneOf(Object.values(AllocationStatus)),
    allocationPerWallet: Yup.number()
      .when('allocationStatus', {
        is: AllocationStatus.Limited,
        then: Yup.number().typeError('Please input valid number').required('Allocation per wallet is required')
      })
      .when('allocationStatus', {
        is: AllocationStatus.Limited,
        then: Yup.number()
          .typeError('Please input valid number')
          .test(
            'GREATER_THAN_POOL_SIZE',
            'Allocation per wallet cannnot be greater than pool size times swap ratio',
            (value, context) =>
              !context.parent.poolSize ||
              !context.parent.swapRatio ||
              value <= context.parent.poolSize * context.parent.swapRatio
          )
      })
  })

  const valuesState = useValuesState()
  const valuesDispatch = useValuesDispatch()

  const internalInitialValues: FormValues = {
    tokenFromAddress: valuesState.tokenFrom.address || '',
    tokenFromSymbol: valuesState.tokenFrom.symbol || '',
    tokenFromLogoURI: valuesState.tokenFrom.logoURI || '',
    tokenFromDecimals: String(valuesState.tokenFrom.decimals || ''),
    tokenToAddress: valuesState.tokenTo.address || '',
    tokenToSymbol: valuesState.tokenTo.symbol || '',
    tokenToLogoURI: valuesState.tokenTo.logoURI || '',
    tokenToDecimals: String(valuesState.tokenTo.decimals || ''),
    swapRatio: valuesState.swapRatio || '',
    poolSize: valuesState.poolSize || '',
    allocationStatus: valuesState.allocationStatus || AllocationStatus.NoLimits,
    allocationPerWallet: valuesState.allocationPerWallet || ''
  }

  const router = useRouter()

  const { chain } = useNetwork()

  const showTokenDialog = (
    chainId: SupportedChainId,
    values: FormValues,
    setValues: (values: SetStateAction<FormValues>, shouldValidate?: boolean) => void
  ) => {
    show<Token>(TokenDialog, { enableEth: true, chainId })
      .then(res => {
        console.log('TokenDialog Resolved: ', res)
        setValues({
          ...values,
          tokenToAddress: res.address,
          tokenToSymbol: res.symbol,
          tokenToLogoURI: res.logoURI,
          tokenToDecimals: res.decimals
        })
      })
      .catch(err => {
        console.log('TokenDialog Rejected: ', err)
      })
  }

  const { address, isConnected } = useAccount()

  const { data: balance } = useContractRead({
    address: valuesState.tokenFrom.address as `0x${string}`,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: !!valuesState.tokenFrom.address && isConnected
  })

  return (
    <Box sx={{ mt: 52 }}>
      <Typography variant="h2">Auction Parameters</Typography>
      <Typography sx={{ color: 'var(--ps-gray-700)', mt: 5, mb: 42 }}>Fixed Price Auction</Typography>

      <Formik
        initialValues={internalInitialValues}
        onSubmit={values => {
          console.log('on submit')
          valuesDispatch({
            type: ActionType.CommitAuctionParameters,
            payload: {
              tokenTo: {
                address: values.tokenToAddress,
                logoURI: values.tokenToLogoURI,
                symbol: values.tokenToSymbol,
                decimals: values.tokenToDecimals
              },
              swapRatio: values.swapRatio,
              poolSize: values.poolSize,
              allocationPerWallet: values.allocationPerWallet,
              allocationStatus: values.allocationStatus
            }
          })
        }}
        validationSchema={validationSchema}
      >
        {({ setValues, values, setFieldValue }) => {
          return (
            <Stack component={Form} spacing={32} noValidate>
              <Alert severity="warning" sx={{ borderRadius: 20 }}>
                <Typography variant="body1">
                  Bounce protocol does not support inflationary and deflationary tokens.
                </Typography>
              </Alert>

              {/* Token to */}
              <Box>
                <Stack direction="row" spacing={8} sx={{ mb: 20 }}>
                  <Typography variant="h3" sx={{ fontSize: 16 }}>
                    Funding Currency
                  </Typography>

                  <Tooltip title="Please do not select deflationary or inflationary token ">
                    <HelpOutlineIcon sx={{ color: 'var(--ps-gray-700)' }} />
                  </Tooltip>
                </Stack>

                <Stack spacing={20} direction="row" sx={{ width: '100%' }}>
                  <FormItem
                    name="tokenToSymbol"
                    label="Select Token"
                    required
                    sx={{ flex: 1 }}
                    startAdornment={<TokenImage alt={values.tokenToSymbol} src={values.tokenToLogoURI} size={32} />}
                  >
                    <FakeOutlinedInput
                      disabled
                      onClick={() => {
                        if (isConnected) {
                          showTokenDialog(chain?.id, values, setValues)
                        }
                      }}
                    />
                  </FormItem>
                </Stack>
              </Box>

              {/* Swap Ratio */}
              <Box>
                <Typography variant="h3" sx={{ fontSize: 16, mb: 8 }}>
                  Swap Ratio
                </Typography>

                <Stack direction="row" alignItems="center" spacing={15}>
                  <Typography>1 {values.tokenFromSymbol} =</Typography>

                  <FormItem name="swapRatio" placeholder="0.00" required sx={{ flex: 1 }}>
                    <OutlinedInput
                      endAdornment={
                        <>
                          <TokenImage alt={values.tokenToSymbol} src={values.tokenToLogoURI} size={24} />
                          <Typography sx={{ ml: 8 }}>{values.tokenToSymbol}</Typography>
                        </>
                      }
                    />
                  </FormItem>
                </Stack>
              </Box>

              {/* Pool Size */}
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 8 }}>
                  <Stack direction="row" spacing={8}>
                    <Typography variant="h3" sx={{ fontSize: 16 }}>
                      Amount
                    </Typography>

                    <Tooltip title="The amount of tokens that you want to put in for auction">
                      <HelpOutlineIcon sx={{ color: 'var(--ps-gray-700)' }} />
                    </Tooltip>
                  </Stack>

                  {values.tokenFromSymbol && (
                    <Typography>
                      Balance:{' '}
                      {balance
                        ? `${formatNumber(balance.toString(), {
                            unit: values.tokenFromDecimals,
                            decimalPlaces: 2
                          })}
                      ${values.tokenFromSymbol}`
                        : '-'}
                    </Typography>
                  )}
                </Stack>

                <FormItem name="poolSize" placeholder="0.00" required sx={{ flex: 1 }}>
                  <OutlinedInput
                    endAdornment={
                      <>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mr: 20, minWidth: 60 }}
                          disabled={!balance}
                          onClick={() => {
                            setFieldValue(
                              'poolSize',
                              formatNumber(balance.toString(), {
                                unit: values.tokenFromDecimals,
                                shouldSplitByComma: false,
                                decimalPlaces: 2
                              })
                            )
                          }}
                        >
                          Max
                        </Button>
                        <TokenImage alt={values.tokenFromSymbol} src={values.tokenFromLogoURI} size={24} />
                        <Typography sx={{ ml: 8 }}>{values.tokenFromSymbol}</Typography>
                      </>
                    }
                  />
                </FormItem>
              </Box>

              {/* Allocation per Wallet */}
              <Box>
                <Stack direction="row" spacing={8}>
                  <Typography variant="h3" sx={{ fontSize: 16 }}>
                    Allocation per Wallet
                  </Typography>

                  <Tooltip title="You can set a maximum allocation per wallet to prevent monopoly activities during the token swap.">
                    <HelpOutlineIcon sx={{ color: 'var(--ps-gray-700)' }} />
                  </Tooltip>
                </Stack>

                <Field component={RadioGroupFormItem} row sx={{ mt: 10 }} name="allocationStatus">
                  <FormControlLabel
                    value={AllocationStatus.NoLimits}
                    control={<Radio disableRipple />}
                    label="No Limits"
                  />
                  <FormControlLabel
                    value={AllocationStatus.Limited}
                    control={<Radio disableRipple />}
                    label="Limited"
                  />
                </Field>

                <FormItem name="allocationPerWallet" required sx={{ flex: 1 }}>
                  <OutlinedInput
                    sx={{ mt: 10 }}
                    disabled={values.allocationStatus === AllocationStatus.NoLimits}
                    endAdornment={
                      <>
                        <TokenImage alt={values.tokenToSymbol} src={values.tokenToLogoURI} size={24} />
                        <Typography sx={{ ml: 8 }}>{values.tokenToSymbol}</Typography>
                      </>
                    }
                  />
                </FormItem>
              </Box>

              <Stack direction="row" spacing={10} justifyContent="end">
                <Button
                  variant="outlined"
                  sx={{ width: 140 }}
                  onClick={() => {
                    router.back()
                  }}
                >
                  Cancel
                </Button>

                <Button type="submit" variant="contained" sx={{ width: 140 }}>
                  Next
                </Button>
              </Stack>
            </Stack>
          )
        }}
      </Formik>
    </Box>
  )
}

export default AuctionParametersForm
