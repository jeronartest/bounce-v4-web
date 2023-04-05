import { Box, IconButton, Stack, styled, Typography } from '@mui/material'
import Image from 'next/image'
import React, { ReactNode } from 'react'
import { useRouter } from 'next/router'
import { show } from '@ebay/nice-modal-react'
import { LoadingButton } from '@mui/lab'
import { BigNumber } from 'bignumber.js'
import { useAccount, useNetwork } from 'wagmi'
import { AllocationStatus, CreationStep, ParticipantStatus } from '../types'
import { ActionType, useValuesDispatch, useValuesState } from '../ValuesProvider'
import EmptyNFTIcon from '../TokenERC1155InforationForm/components/NFTCard/emptyNFTIcon.png'
import { shortenAddress } from '@/utils/web3/address'
import ConnectWalletDialog from '@/components/common/ConnectWalletDialog'
import DialogTips from '@/components/common/DialogTips'
import useCreateFixedSwap1155Pool from '@/hooks/web3/useCreateFixedSwap1155Pool'
import { CHAIN_ICONS, CHAIN_NAMES } from '@/constants/web3/chains'
import TokenImage from '@/components/common/TokenImage'

import { ReactComponent as CloseSVG } from 'assets/imgs/components/close.svg'
import { ReactComponent as ZeroIcon } from 'assets/imgs/auction/zero-icon.svg'

import { formatNumber } from '@/utils/web3/number'

const NO_LIMIT_ALLOCATION = '0'

const ConfirmationSubtitle = styled(Typography)(({ theme }) => ({ color: theme.palette.grey[900], opacity: 0.5 }))

const ConfirmationInfoItem = ({ children, title }: { children: ReactNode; title?: ReactNode }): JSX.Element => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" columnGap={20}>
    {typeof title === 'string' ? <ConfirmationSubtitle>{title}</ConfirmationSubtitle> : title}
    {children}
  </Stack>
)

const CreatePoolButton = () => {
  const router = useRouter()
  const { redirect } = router.query

  const values = useValuesState()

  const { run, loading, refresh } = useCreateFixedSwap1155Pool(values.nftTokenFrom.contractAddr, {
    onSuccess: (receipt, chainShortName) => {
      console.log('receipt: ', receipt)
      const goToPoolInfoPage = () => {
        const createdEvent = receipt.events.find(e => e.event === 'Created')

        // console.log('chainShortName: ', chainShortName)

        if (!createdEvent) {
          router.push('/market/nftAuctionPool')
          return
        }

        const poolId = createdEvent.args.index.toString()

        router.push(`/auction/fixed-swap-nft/${chainShortName}/${poolId}`)
      }

      const handleCloseDialog = () => {
        if (redirect && typeof redirect === 'string') {
          router.push(redirect)
        }
      }

      show(DialogTips, {
        iconType: 'success',
        againBtn: 'To the pool',
        cancelBtn: 'Not now',
        title: 'Congratulations!',
        content: `You have successfully created the auction.`,
        onAgain: goToPoolInfoPage,
        onCancel: handleCloseDialog,
        onClose: handleCloseDialog
      })
    },
    onError: error => {
      console.log('>>>> create error: ', error)
      show(DialogTips, {
        iconType: 'error',
        againBtn: 'Try Again',
        cancelBtn: 'Cancel',
        title: 'Oops..',
        content: 'Something went wrong',
        onAgain: refresh
      })
    }
  })

  return (
    <LoadingButton
      fullWidth
      variant="contained"
      loading={loading}
      onClick={() => {
        console.log('run params>>>>', {
          whitelist: values.participantStatus === ParticipantStatus.Whitelist ? values.whitelist : [],
          poolSize: values.poolSize,
          swapRatio: values.swapRatio,
          allocationPerWallet:
            values.allocationStatus === AllocationStatus.Limited
              ? new BigNumber(values.allocationPerWallet).toString()
              : NO_LIMIT_ALLOCATION,
          startTime: values.startTime.unix(),
          endTime: values.endTime.unix(),
          delayUnlockingTime: values.shouldDelayUnlocking ? values.delayUnlockingTime.unix() : values.endTime.unix(),
          poolName: values.poolName,
          tokenFromAddress: values.nftTokenFrom.contractAddr,
          tokenFormDecimal: '',
          tokenToAddress: values.tokenTo.address,
          tokenToDecimal: values.tokenTo.decimals
        })
        run({
          whitelist: values.participantStatus === ParticipantStatus.Whitelist ? values.whitelist : [],
          poolSize: values.poolSize,
          swapRatio: values.swapRatio,
          allocationPerWallet:
            values.allocationStatus === AllocationStatus.Limited
              ? new BigNumber(values.allocationPerWallet).toString()
              : NO_LIMIT_ALLOCATION,
          startTime: values.startTime.unix(),
          endTime: values.endTime.unix(),
          delayUnlockingTime: values.shouldDelayUnlocking ? values.delayUnlockingTime.unix() : values.endTime.unix(),
          poolName: values.poolName,
          tokenFromAddress: values.nftTokenFrom.contractAddr,
          tokenFormDecimal: '',
          tokenToAddress: values.tokenTo.address,
          tokenToDecimal: values.tokenTo.decimals,
          tokenId: values.nftTokenFrom.tokenId
        })
      }}
    >
      Confirm
    </LoadingButton>
  )
}

const CreationConfirmation = () => {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  const values = useValuesState()
  const valuesDispatch = useValuesDispatch()

  const router = useRouter()
  const { auctionType } = router.query

  const showConnectWalletDialog = () => {
    show(ConnectWalletDialog)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <IconButton
        color="primary"
        aria-label="back"
        sx={{ width: 52, height: 52, border: '1px solid rgba(0, 0, 0, 0.27)', ml: 'auto', mr: 22 }}
        onClick={() => {
          // onClose()
          valuesDispatch({
            type: ActionType.HandleStep,
            payload: {
              activeStep: CreationStep.ADVANCED_SETTINGS
            }
          })
        }}
      >
        <CloseSVG />
      </IconButton>

      <Box sx={{ display: 'flex', flexDirection: 'column', pb: 48, width: 'fit-content' }}>
        <Typography variant="h2" sx={{ textAlign: 'center', mb: 42 }}>
          Creation confirmation
        </Typography>

        <Box sx={{ borderRadius: '20px', border: '1px solid #D7D6D9', px: 24, py: 30 }}>
          <Typography variant="h3" sx={{ fontSize: 16, mb: 24 }}>
            {values.poolName} Fixed-swap Pool
          </Typography>

          <Stack spacing={24}>
            <ConfirmationInfoItem title="Chain">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image src={CHAIN_ICONS[chain?.id]} alt={CHAIN_NAMES[chain?.id]} width={20} height={20} />
                <Typography sx={{ ml: 4 }}>{CHAIN_NAMES[chain?.id]}</Typography>
              </Box>
            </ConfirmationInfoItem>

            <Box>
              <Typography variant="h3" sx={{ fontSize: 14, mb: 12 }}>
                Token Information
              </Typography>

              <Stack spacing={15}>
                <ConfirmationInfoItem title="Token Contact address">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image src={CHAIN_ICONS[chain?.id]} alt={CHAIN_NAMES[chain?.id]} width={20} height={20} />
                    <Typography ml={4}>{shortenAddress(values.nftTokenFrom.contractAddr)}</Typography>
                  </Box>
                </ConfirmationInfoItem>
                <ConfirmationInfoItem title="Token Type">
                  <Typography>ERC1155</Typography>
                </ConfirmationInfoItem>
                <ConfirmationInfoItem title="Token symbol">
                  <Stack direction="row" spacing={8} alignItems="center">
                    <TokenImage
                      alt={values.nftTokenFrom.contractName}
                      src={values.nftTokenFrom.image || EmptyNFTIcon.src}
                      size={20}
                    />
                    <Typography>{values.nftTokenFrom.contractName || '--'}</Typography>
                  </Stack>
                </ConfirmationInfoItem>
                {/* <ConfirmationInfoItem title="Token decimal">
                  <Typography>{values.tokenFrom.decimals}</Typography>
                </ConfirmationInfoItem> */}
              </Stack>
            </Box>

            <Box>
              <Typography variant="h3" sx={{ fontSize: 14, mb: 12 }}>
                Auction Parameters
              </Typography>

              <Stack spacing={15}>
                <ConfirmationInfoItem title="Pool type">
                  <Typography>{auctionType}</Typography>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="To">
                  <Stack direction="row" spacing={8} alignItems="center">
                    <TokenImage alt={values.tokenTo.symbol} src={values.tokenTo.logoURI} size={20} />
                    <Typography>{values.tokenTo.symbol}</Typography>
                  </Stack>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="Swap Ratio">
                  <Typography>
                    1 {values.nftTokenFrom.contractName} ={' '}
                    {formatNumber(values.swapRatio, { unit: 0, decimalPlaces: 10 })} {values.tokenTo.symbol}
                  </Typography>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="Amount">
                  <Typography>{values.poolSize}</Typography>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="Allocation per Wallet">
                  <Typography>
                    {values.allocationStatus === AllocationStatus.NoLimits
                      ? 'No'
                      : `Limit ${Number(values.allocationPerWallet).toLocaleString()} NFT`}
                  </Typography>
                </ConfirmationInfoItem>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h3" sx={{ fontSize: 14, mb: 12 }}>
                Advanced Settings
              </Typography>

              <Stack spacing={15}>
                <ConfirmationInfoItem title="Pool duration">
                  <Typography>
                    From {values.startTime.format('MM.DD.Y HH:mm')} - To {values.endTime.format('MM.DD.Y HH:mm')}
                  </Typography>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="Participant">
                  <Typography>
                    {values.participantStatus === ParticipantStatus.Public ? 'Public' : 'Whitelist'}
                  </Typography>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="Delay Unlocking Token">
                  <Typography>
                    {values.delayUnlockingTime ? values.delayUnlockingTime.format('MM:DD:Y HH:mm') : 'No'}
                  </Typography>
                </ConfirmationInfoItem>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 32, width: '100%' }}>
          {isConnected ? (
            <CreatePoolButton />
          ) : (
            <LoadingButton fullWidth variant="contained" onClick={showConnectWalletDialog}>
              Connect Wallet
            </LoadingButton>
          )}

          <ConfirmationSubtitle sx={{ mt: 12, opacity: 1, color: '#908E96' }}>
            Transaction Fee is{' '}
            <span
              style={{
                textDecoration: 'line-through'
              }}
            >
              2.5%
            </span>
            <ZeroIcon
              style={{
                marginLeft: '6px',
                verticalAlign: 'middle'
              }}
            />
          </ConfirmationSubtitle>
        </Box>
      </Box>
    </Box>
  )
}

export default CreationConfirmation
