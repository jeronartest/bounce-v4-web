import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  MenuItem,
  Stack,
  Typography,
  Select,
  FormHelperText,
  TextField,
  InputAdornment
} from '@mui/material'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { useRequest } from 'ahooks'
import { show } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'

import Head from 'next/head'
import FormItem from 'bounceComponents/common/FormItem'
import RoundedContainer from 'bounceComponents/create-auction-pool/RoundedContainer'
import { CHAIN_NAMES, SupportedChainId } from '@/constants/web3/chains'
import ConnectWalletDialog from 'bounceComponents/common/ConnectWalletDialog'
import { userGetBindAddress } from 'api/user'
import { ReactComponent as RepeatSVG } from 'assets/imgs/icon/repeat.svg'
import useEagerConnect from 'bounceHooks/web3/useEagerConnect'

const WrongWalletToastContent = ({ isBoundAddressLessThan3 }: { isBoundAddressLessThan3?: boolean }) => (
  <>
    <Typography component="span">
      {!isBoundAddressLessThan3
        ? `Please use the 3 wallet addresses have already been bound to your account or switch to a new account.`
        : `Please use the wallet address that already bound to your account, or bind a new address.`}
    </Typography>
    &nbsp;
    <Link href="/profile/account/settings">
      <Typography component="span" sx={{ color: '#2663FF', textDecorationLine: 'underline' }}>
        Go to account setting
      </Typography>
    </Link>
  </>
)

const validationSchema = Yup.object({
  auctionType: Yup.string().required('Auction Type is required')
})

const initialValues = {
  auctionType: 'fixed-price'
}

const CreateAuctionPoolIntroPage = () => {
  const router = useRouter()
  const { redirect } = router.query

  useEagerConnect()

  const { isConnected, address: account } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const handleCancel = () => {
    router.back()
  }

  const handleSubmit = (values: any) => {
    router.push(`/auction/create-auction-pool/${values.auctionType}?redirect=${redirect}`)
  }

  const [addressFieldValue, setAddressFieldValue] = useState('')

  const { data: userBindAddressData } = useRequest(
    () => {
      return userGetBindAddress({
        limit: 100,
        offset: 0
      })
    },
    { ready: isConnected }
  )

  const isAddressReadyToCreatePool = !!userBindAddressData?.data.list.find(item => item.address === account)

  const isBoundAddressLessThan3 = userBindAddressData?.data ? userBindAddressData?.data.list.length < 3 : undefined

  useEffect(() => {
    if (!account) {
      return setAddressFieldValue('')
    }

    setAddressFieldValue(account)
  }, [account])

  useEffect(() => {
    if (isConnected && !isAddressReadyToCreatePool && typeof isBoundAddressLessThan3 !== 'undefined') {
      toast.error(<WrongWalletToastContent isBoundAddressLessThan3={isBoundAddressLessThan3} />)
    }
  }, [isAddressReadyToCreatePool, isBoundAddressLessThan3, isConnected])

  return (
    <section>
      <Head>
        <title>Auction Pool | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>

      <RoundedContainer maxWidth="md">
        <Stack alignItems="center">
          <Box sx={{ py: 60, maxWidth: 540 }}>
            <Typography variant="h1" sx={{ mb: 48 }}>
              Create Auction Pool
            </Typography>

            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
              <Stack component={Form} spacing={20}>
                <Typography variant="h3">Select Creation Type</Typography>

                <FormItem name="auctionType" label="Auction Type" required>
                  <Select>
                    <MenuItem value="fixed-price">Fixed Price Auction</MenuItem>
                  </Select>
                </FormItem>

                <FormItem error={!isConnected}>
                  <Select<SupportedChainId | string>
                    value={chain?.id || ''}
                    displayEmpty
                    onChange={event => {
                      // switchChain(Number(event.target.value))
                      // connect({ connector: metaMaskConnector })
                      if (isConnected) {
                        switchNetwork(Number(event.target.value))
                      } else {
                        show(ConnectWalletDialog)
                      }
                    }}
                    renderValue={value => {
                      if (!value) {
                        return <em>Not Connected</em>
                      }
                      return CHAIN_NAMES[value]
                    }}
                  >
                    <MenuItem value={SupportedChainId.MAINNET}>Ethereum</MenuItem>
                    {/* <MenuItem value={SupportedChainId.GOERLI}>Goerli</MenuItem> */}
                    <MenuItem value={SupportedChainId.BSC}>BSC</MenuItem>
                    <MenuItem value={SupportedChainId.ARBITRUM}>Arbitrum</MenuItem>
                  </Select>
                  {!isConnected && <FormHelperText error={!isConnected}>Please connect to your wallet</FormHelperText>}
                </FormItem>

                <TextField
                  label="Wallet for creation"
                  variant="outlined"
                  value={addressFieldValue}
                  inputProps={{ readOnly: true }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', columnGap: 10 }}
                        >
                          {isConnected ? (
                            isAddressReadyToCreatePool ? (
                              <Box
                                sx={{
                                  px: 12,
                                  py: 4,
                                  height: 26,
                                  color: '#2DAB50',
                                  background: '#E4FFEC',
                                  borderRadius: 20
                                }}
                              >
                                Linked √
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  px: 12,
                                  py: 4,
                                  height: 26,
                                  color: '#F53030',
                                  background: '#FFF4F5',
                                  borderRadius: 20
                                }}
                              >
                                Wrong X
                              </Box>
                            )
                          ) : null}
                          <Button
                            sx={{
                              px: 12,
                              py: 4,
                              height: 26,
                              minWidth: 'unset',
                              color: '#2DAB50',
                              background: '#D6DFF6'
                            }}
                            onClick={() => {
                              show(ConnectWalletDialog)
                            }}
                          >
                            <RepeatSVG width="20px" />
                          </Button>
                        </Box>
                      </InputAdornment>
                    )
                  }}
                />

                <Typography sx={{ color: 'var(--ps-gray-700)', pt: 12, pb: 20 }}>
                  A fixed price auction, is a type of auction where the price for the assets being auctioned is
                  pre-determined and agreed upon by the auctioneer and participants. This type of auction is typically
                  used when the auctioneer has a specific value target for the assets being sold.
                </Typography>

                <Stack direction="row" spacing={10} justifyContent="end">
                  {isConnected ? (
                    <>
                      <Button variant="outlined" sx={{ width: 140 }} onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ width: 140 }}
                        disabled={!isAddressReadyToCreatePool}
                      >
                        Next
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      sx={{ width: 140 }}
                      onClick={() => {
                        show(ConnectWalletDialog)
                      }}
                    >
                      Connect
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Formik>
          </Box>
        </Stack>
      </RoundedContainer>
    </section>
  )
}

export default CreateAuctionPoolIntroPage
