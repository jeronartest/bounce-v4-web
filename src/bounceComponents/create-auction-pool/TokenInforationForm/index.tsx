import React from 'react'
import { Button, Stack, Box, Typography, ButtonBase, Avatar } from '@mui/material'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'

import { show } from '@ebay/nice-modal-react'
import { useRouter } from 'next/router'
import { useAccount, useNetwork } from 'wagmi'
import type { Token } from '../types'
import TokenDialog from '../TokenDialog'
import FakeOutlinedInput from '../FakeOutlinedInput'
import { ActionType, useValuesDispatch, useValuesState } from '../ValuesProvider'
import FormItem from 'bounceComponents/common/FormItem'
import { ExplorerDataType, getExplorerLink } from '@/utils/web3/getExplorerLink'
import { SupportedChainId } from '@/constants/web3/chains'

import ErrorSVG from 'assets/imgs/icon/error_filled.svg'
import TokenImage from 'bounceComponents/common/TokenImage'

interface FormValues {
  tokenFromAddress: string
  tokenFromSymbol: string
  tokenFromLogoURI?: string
  tokenFromDecimals: string
}

const TokenInformationForm = (): JSX.Element => {
  const validationSchema = Yup.object({
    tokenFromSymbol: Yup.string().required('Token is required')
  })

  const values = useValuesState()
  const valuesDispatch = useValuesDispatch()

  const internalInitialValues: FormValues = {
    tokenFromAddress: values.tokenFrom.address || '',
    tokenFromSymbol: values.tokenFrom.symbol || '',
    tokenFromLogoURI: values.tokenFrom.logoURI || '',
    tokenFromDecimals: String(values.tokenFrom.decimals || '')
  }

  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const router = useRouter()

  const showTokenDialog = (chainId: SupportedChainId, setValues: (values: any, shouldValidate?: boolean) => void) => {
    show<Token>(TokenDialog, { chainId })
      .then(res => {
        console.log('TokenDialog Resolved: ', res)
        setValues({
          tokenFromAddress: res.address,
          tokenFromSymbol: res.symbol,
          tokenFromLogoURI: res.logoURI,
          tokenFromDecimals: res.decimals
        })
      })
      .catch(err => {
        console.log('TokenDialog Rejected: ', err)
      })
  }

  return (
    <Box sx={{ mt: 52 }}>
      <Typography variant="h2">Token Information</Typography>
      <Typography sx={{ color: 'var(--ps-gray-700)', mt: 5, mb: 42 }}>Fixed Price Auction</Typography>

      <Formik
        initialValues={internalInitialValues}
        onSubmit={values => {
          valuesDispatch({
            type: ActionType.CommitTokenImformation,
            payload: {
              tokenFrom: {
                address: values.tokenFromAddress,
                logoURI: values.tokenFromLogoURI,
                symbol: values.tokenFromSymbol,
                decimals: values.tokenFromDecimals
              }
            }
          })
        }}
        validationSchema={validationSchema}
      >
        {({ setValues, values }) => {
          return (
            <Stack component={Form} spacing={20} noValidate>
              <FormItem
                name="tokenFromSymbol"
                label="Select a token"
                required
                startAdornment={<TokenImage alt={values.tokenFromSymbol} src={values.tokenFromLogoURI} size={32} />}
              >
                <FakeOutlinedInput
                  disabled
                  onClick={() => {
                    if (isConnected) {
                      showTokenDialog(chain?.id, setValues)
                    }
                  }}
                />
              </FormItem>

              <FormItem name="tokenFromAddress" label="Token contact address">
                <FakeOutlinedInput disabled />
              </FormItem>

              <FormItem name="tokenFromDecimals" label="Token decimal">
                <FakeOutlinedInput disabled />
              </FormItem>

              <ButtonBase
                sx={{ width: 'fit-content', textDecorationLine: 'underline' }}
                disabled={!values.tokenFromAddress}
              >
                <a
                  href={getExplorerLink(chain?.id, values.tokenFromAddress, ExplorerDataType.TOKEN)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Typography sx={{ color: 'var(--ps-gray-700)' }}>View on etherscan</Typography>
                </a>
              </ButtonBase>

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

export default TokenInformationForm
