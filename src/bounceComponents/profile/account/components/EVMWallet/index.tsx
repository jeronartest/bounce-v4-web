import { Box, Button, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import { show } from '@ebay/nice-modal-react'
import { useRequest } from 'ahooks'
import { toast } from 'react-toastify'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useSelector } from 'react-redux'
import SettingsBox from '../../SettingsBox'
import { ReactComponent as MetaMaskSVG } from './metamask.svg'
import ConnectWalletDialog from 'bounceComponents/common/ConnectWalletDialog'
import { bindAddress, userGetBindAddress } from 'api/user'
import { RootState } from '@/store'
import useEagerConnect from 'bounceHooks/web3/useEagerConnect'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'

export type IEVMWalletProps = {}

const EVMWallet: React.FC<IEVMWalletProps> = ({}) => {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const checkoutChainId = chainId => {
    const chainIdData = optionDatas?.chainInfoOpt?.filter(item => item.ethChainId === chainId)
    if (chainIdData) {
      return chainIdData[0]?.id
    }
    return
  }
  const { signMessageAsync } = useSignMessage()

  const chainConfigInBackend = useChainConfigInBackend('ethChainId', chain?.id)
  // const chainIdInBackEnd = checkoutChainId(chain?.id)
  // console.log('checkoutChainId>>', checkoutChainId(chain?.id))

  const { data: userBindAddressData, run: getBindAddress } = useRequest(
    () => {
      // console.log('chainID>>', chainId)

      return userGetBindAddress({
        chainId: chainConfigInBackend.id,
        limit: 3,
        offset: 0
      })
    },
    {
      // manual: true,
      refreshDeps: [chain?.id, chainConfigInBackend?.id],
      ready: !!chain?.id && !!chainConfigInBackend
    }
  )
  // useEffect(() => {
  //   getBindAddress(checkoutChainId(chain?.id))
  // }, [chain?.id, getBindAddress])

  const { run: bind_address } = useRequest(
    params => {
      return bindAddress(params)
    },
    {
      manual: true,
      onSuccess: res => {
        const { data, code } = res
        getBindAddress()
      },
      onError: (err: any) => {
        if (err.code === 10449) {
          toast.error('This wallet address has been bound, please change the wallet address binding')
        }
      }
    }
  )

  return (
    <SettingsBox title={'EVM Wallet'}>
      <Typography variant="body2" color={'var(--ps-gray-600)'}>
        {`Max 3, can't unbind`}
      </Typography>
      <Stack spacing={40} mt={30} mb={30}>
        {userBindAddressData?.data.list.map((item, index) => (
          <Box
            display={'flex'}
            sx={{ border: '1px solid #D7D6D9', borderRadius: 20 }}
            alignItems="center"
            height={60}
            px={20}
            key={index}
          >
            <MetaMaskSVG />
            <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
              <Typography variant="body2" color={'var(--ps-gray-700)'} ml={10}>
                {item.isDefault === 2 ? 'Default wallet' : 'Wallet'}
              </Typography>
              <Typography variant="body1" color={'var(--ps-gray-900)'} ml={10}>
                {item.address}
              </Typography>
            </Box>
            {item.isDefault === 2 ? (
              <></>
            ) : (
              <Box
                sx={{ cursor: 'pointer', ml: 'auto', alignSelf: 'auto' }}
                onClick={async () => {
                  if (isConnected) {
                    if (address !== item.address) {
                      toast.error('Please switch the set account')
                    } else {
                      try {
                        const signature = await signMessageAsync({ message: 'Make default' })
                        bind_address({
                          address: item.address,
                          chainId: item.chainId,
                          isDefault: 2,
                          message: 'Make default',
                          signature
                        })
                      } catch (error) {
                        toast.error('User Rejection')
                      }
                    }
                  } else {
                    show(ConnectWalletDialog)
                  }
                }}
              >
                <Typography variant="body1" color={'#2663FF'}>
                  Make default
                </Typography>
              </Box>
            )}
          </Box>
        ))}
      </Stack>
      {userBindAddressData?.data.total >= 3 ? (
        <Box pb={40} />
      ) : (
        <Button
          variant="contained"
          sx={{ width: 168, mb: 40 }}
          endIcon={<AddCircleOutlineRoundedIcon />}
          onClick={async () => {
            if (isConnected) {
              if (userBindAddressData?.data.list.filter(item => item.address === address).length > 0) {
                toast.error('This wallet address has been bound, please change the wallet address binding')
              } else {
                try {
                  const signature = await signMessageAsync({ message: 'Link wallet' })
                  bind_address({
                    address: address,
                    chainId: checkoutChainId(chain?.id),
                    isDefault: 1,
                    message: 'Link wallet',
                    signature
                  })
                } catch (error) {
                  toast.error('Please switch the set account')
                }
              }
            } else {
              show(ConnectWalletDialog)
            }
          }}
        >
          Link wallet
        </Button>
      )}
    </SettingsBox>
  )
}

export default EVMWallet
