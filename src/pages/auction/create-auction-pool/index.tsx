import { useEffect, useState } from 'react'
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
import { useRequest } from 'ahooks'
import { toast } from 'react-toastify'

import FormItem from 'bounceComponents/common/FormItem'
import RoundedContainer from 'bounceComponents/create-auction-pool/RoundedContainer'
import { userGetBindAddress } from 'api/user'
import { ReactComponent as RepeatSVG } from 'assets/imgs/icon/repeat.svg'
import { Link, useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import { useQueryParams } from 'hooks/useQueryParams'
import { ChainId, ChainListMap } from 'constants/chain'
import { useActiveWeb3React } from 'hooks'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useWalletModalToggle } from 'state/application/hooks'

const WrongWalletToastContent = ({ isBoundAddressLessThan3 }: { isBoundAddressLessThan3?: boolean }) => (
  <>
    <Typography component="span">
      {!isBoundAddressLessThan3
        ? `Please use the 3 wallet addresses have already been bound to your account or switch to a new account.`
        : `Please use the wallet address that already bound to your account, or bind a new address.`}
    </Typography>
    &nbsp;
    <Link to={routes.profile.account.settings}>
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
  const navigate = useNavigate()
  const { redirect } = useQueryParams()

  const { account, active, chainId } = useActiveWeb3React()
  const walletModalToggle = useWalletModalToggle()
  const switchNetwork = useSwitchNetwork()

  const handleCancel = () => {
    window.history.go(-1)
  }

  const handleSubmit = (values: any) => {
    navigate(`${routes.auction.createAuctionPool}/${values.auctionType}/${chainId}?redirect=${redirect}`)
  }

  const [addressFieldValue, setAddressFieldValue] = useState('')

  const { data: userBindAddressData } = useRequest(
    () => {
      return userGetBindAddress({
        limit: 100,
        offset: 0
      })
    },
    { ready: !!account }
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
    if (active && !isAddressReadyToCreatePool && typeof isBoundAddressLessThan3 !== 'undefined') {
      toast.error(<WrongWalletToastContent isBoundAddressLessThan3={isBoundAddressLessThan3} />)
    }
  }, [active, isAddressReadyToCreatePool, isBoundAddressLessThan3])

  return (
    <section>
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

                <FormItem error={!active}>
                  <Select<ChainId>
                    value={chainId}
                    displayEmpty
                    onChange={event => {
                      // switchChain(Number(event.target.value))
                      // connect({ connector: metaMaskConnector })
                      if (account) {
                        switchNetwork(Number(event.target.value))
                      } else {
                        walletModalToggle()
                      }
                    }}
                    renderValue={value => {
                      if (!value) {
                        return <em>Not Connected</em>
                      }
                      return chainId ? ChainListMap[chainId]?.name : ''
                    }}
                  >
                    <MenuItem value={ChainId.MAINNET}>Ethereum</MenuItem>
                    <MenuItem value={ChainId.GÖRLI}>Goerli</MenuItem>
                    <MenuItem value={ChainId.BSC}>BSC</MenuItem>
                    <MenuItem value={ChainId.ARBITRUM}>Arbitrum</MenuItem>
                  </Select>
                  {!account && <FormHelperText error={!account}>Please connect to your wallet</FormHelperText>}
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
                          {account ? (
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
                              walletModalToggle()
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
                  {account ? (
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
                        walletModalToggle()
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
