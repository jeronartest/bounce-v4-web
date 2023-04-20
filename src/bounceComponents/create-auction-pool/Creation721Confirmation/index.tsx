import { Box, IconButton, Stack, styled, Typography } from '@mui/material'
import Image from 'components/Image'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { show } from '@ebay/nice-modal-react'
import { LoadingButton } from '@mui/lab'
import { CreationStep, ParticipantStatus } from '../types'
import { ActionType, useAuctionInChain, useValuesDispatch, useValuesState } from '../ValuesProvider'
import DialogTips from 'bounceComponents/common/DialogTips'
import TokenImage from 'bounceComponents/common/TokenImage'

import { ReactComponent as CloseSVG } from 'assets/imgs/components/close.svg'
// import { ReactComponent as ZeroIcon } from 'assets/imgs/auction/zero-icon.svg'
import { useQueryParams } from 'hooks/useQueryParams'
import { useActiveWeb3React } from 'hooks'
import { ChainListMap } from 'constants/chain'
import { shortenAddress } from 'utils'
import { useWalletModalToggle } from 'state/application/hooks'
import { useCreateFixedSwap1155Pool } from 'hooks/useCreateFixedSwap1155Pool'
import {
  hideDialogConfirmation,
  showRequestApprovalDialog,
  showRequestConfirmDialog,
  showWaitingTxDialog
} from 'utils/auction'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'
import useChainConfigInBackend from 'bounceHooks/web3/useChainConfigInBackend'
import { useNFTApproveAllCallback } from 'hooks/useNFTApproveAllCallback'
import { FIXED_SWAP_NFT_CONTRACT_ADDRESSES } from '../../../constants'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import { useERC1155Balance } from 'hooks/useNFTTokenBalance'
import JSBI from 'jsbi'
import { ApprovalState } from 'hooks/useApproveCallback'

const ConfirmationSubtitle = styled(Typography)(({ theme }) => ({ color: theme.palette.grey[900], opacity: 0.5 }))

const ConfirmationInfoItem = ({ children, title }: { children: ReactNode; title?: ReactNode }): JSX.Element => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" columnGap={20}>
    {typeof title === 'string' ? <ConfirmationSubtitle>{title}</ConfirmationSubtitle> : title}
    {children}
  </Stack>
)

type TypeButtonCommitted = 'wait' | 'inProgress' | 'success'

const CreatePoolButton = () => {
  const { redirect } = useQueryParams()
  const navigate = useNavigate()
  const { account, chainId } = useActiveWeb3React()
  const values = useValuesState()
  const createFixedSwap1155Pool = useCreateFixedSwap1155Pool()
  const auctionInChainId = useAuctionInChain()
  const walletModalToggle = useWalletModalToggle()
  const switchNetwork = useSwitchNetwork()
  const auctionAccountBalance = useERC1155Balance(
    values.nftTokenFrom.contractAddr,
    account || undefined,
    values.nftTokenFrom.tokenId,
    auctionInChainId
  )

  const [buttonCommitted, setButtonCommitted] = useState<TypeButtonCommitted>()
  const chainConfigInBackend = useChainConfigInBackend('ethChainId', auctionInChainId)
  const [approvalState, approveCallback] = useNFTApproveAllCallback(
    values.nftTokenFrom.contractAddr,
    chainId === auctionInChainId ? FIXED_SWAP_NFT_CONTRACT_ADDRESSES[auctionInChainId] : undefined
  )

  const toCreate = useCallback(async () => {
    showRequestConfirmDialog()
    try {
      setButtonCommitted('wait')
      const { getPoolId, transactionReceipt } = await createFixedSwap1155Pool()
      setButtonCommitted('inProgress')

      const handleCloseDialog = () => {
        if (redirect && typeof redirect === 'string') {
          navigate(redirect)
        } else {
          navigate(routes.market.pools)
        }
      }

      const ret: Promise<string> = new Promise((resolve, rpt) => {
        showWaitingTxDialog(() => {
          hideDialogConfirmation()
          rpt()
          handleCloseDialog()
        })
        transactionReceipt.then(curReceipt => {
          const poolId = getPoolId(curReceipt.logs)
          if (poolId) {
            resolve(poolId)
            setButtonCommitted('success')
          } else {
            hideDialogConfirmation()
            show(DialogTips, {
              iconType: 'error',
              cancelBtn: 'Cancel',
              title: 'Oops..',
              content: 'The creation may have failed. Please check some parameters, such as the start time'
            })
            rpt()
          }
        })
      })
      ret
        .then(poolId => {
          const goToPoolInfoPage = () => {
            navigate(
              routes.auction.fixedSwapNft
                .replace(':chainShortName', chainConfigInBackend?.shortName || '')
                .replace(':poolId', poolId)
            )
          }

          hideDialogConfirmation()
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
        })
        .catch()
    } catch (error) {
      const err: any = error
      console.error(err)
      hideDialogConfirmation()
      setButtonCommitted(undefined)
      show(DialogTips, {
        iconType: 'error',
        againBtn: 'Try Again',
        cancelBtn: 'Cancel',
        title: 'Oops..',
        content: err?.error?.message || err?.data?.message || err?.message || 'Something went wrong',
        onAgain: toCreate
      })
    }
  }, [chainConfigInBackend?.shortName, createFixedSwap1155Pool, navigate, redirect])

  const toApprove = useCallback(async () => {
    showRequestApprovalDialog()
    try {
      const { transactionReceipt } = await approveCallback()
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
          toCreate()
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
        content:
          typeof err === 'string'
            ? err
            : err?.error?.message || err?.data?.message || err?.message || 'Something went wrong',
        onAgain: toApprove
      })
    }
  }, [approveCallback, toCreate])

  const confirmBtn: {
    disabled?: boolean
    loading?: boolean
    text?: string
    run?: () => void
  } = useMemo(() => {
    if (!account) {
      return {
        text: 'Connect wallet',
        run: walletModalToggle
      }
    }
    if (chainId !== auctionInChainId) {
      return {
        text: 'Switch network',
        run: () => switchNetwork(auctionInChainId)
      }
    }
    if (buttonCommitted !== undefined) {
      if (buttonCommitted === 'success') {
        return {
          text: 'Success',
          disabled: true
        }
      }
      return {
        text: 'Confirm',
        loading: true
      }
    }
    if (
      !auctionAccountBalance ||
      !values.poolSize ||
      JSBI.lessThan(JSBI.BigInt(auctionAccountBalance), JSBI.BigInt(values.poolSize))
    ) {
      return {
        text: 'Insufficient Balance',
        disabled: true
      }
    }
    if (approvalState !== ApprovalState.APPROVED) {
      if (approvalState === ApprovalState.PENDING) {
        return {
          text: `Approving use of ${values.nftTokenFrom.contractName || 'NFT'} ...`,
          loading: true
        }
      }
      if (approvalState === ApprovalState.UNKNOWN) {
        return {
          text: 'Loading...',
          loading: true
        }
      }
      if (approvalState === ApprovalState.NOT_APPROVED) {
        return {
          text: `Approve use of ${values.nftTokenFrom.contractName || 'NFT'}`,
          run: toApprove
        }
      }
    }
    return {
      run: toCreate
    }
  }, [
    account,
    approvalState,
    auctionAccountBalance,
    auctionInChainId,
    buttonCommitted,
    chainId,
    switchNetwork,
    toApprove,
    toCreate,
    values.nftTokenFrom.contractName,
    values.poolSize,
    walletModalToggle
  ])

  return (
    <LoadingButton
      fullWidth
      variant="contained"
      loadingPosition="start"
      loading={confirmBtn.loading}
      disabled={confirmBtn.disabled}
      onClick={confirmBtn.run}
    >
      {confirmBtn.text || 'Confirm'}
    </LoadingButton>
  )
}

const CreationConfirmation = () => {
  const { account } = useActiveWeb3React()

  const auctionChainId = useAuctionInChain()
  const toggleWalletModal = useWalletModalToggle()

  const values = useValuesState()
  const valuesDispatch = useValuesDispatch()
  const { auctionType } = useQueryParams()

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
            {values.poolName} English Auction Pool
          </Typography>

          <Stack spacing={24}>
            <ConfirmationInfoItem title="Chain">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image
                  src={ChainListMap[auctionChainId]?.logo || ''}
                  alt={ChainListMap[auctionChainId]?.name || ''}
                  width={20}
                  height={20}
                />
                <Typography sx={{ ml: 4 }}>{ChainListMap[auctionChainId]?.name || ''}</Typography>
              </Box>
            </ConfirmationInfoItem>

            <Box>
              <Typography variant="h3" sx={{ fontSize: 14, mb: 12 }}>
                Token Information
              </Typography>

              <Stack spacing={15}>
                <ConfirmationInfoItem title="Token Contact address">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Image
                      src={ChainListMap[auctionChainId]?.logo || ''}
                      alt={ChainListMap[auctionChainId]?.name || ''}
                      width={20}
                      height={20}
                    />
                    <Typography ml={4}>{shortenAddress(values.nft721TokenFrom?.[0]?.contractAddr || '')}</Typography>
                  </Box>
                </ConfirmationInfoItem>
                <ConfirmationInfoItem title="Token type">
                  <Typography>ERC721</Typography>
                </ConfirmationInfoItem>
                <ConfirmationInfoItem title="Token amount">
                  <Typography>{values.nft721TokenFrom.length}</Typography>
                </ConfirmationInfoItem>
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

                <ConfirmationInfoItem title="Price floor (Bundle price)">
                  <Typography>{values.priceFloor}</Typography>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="Prices each time">
                  <Typography>{values.pricesEachTime}</Typography>
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
                    From {values.startTime?.format('MM.DD.Y HH:mm')} - To {values.endTime?.format('MM.DD.Y HH:mm')}
                  </Typography>
                </ConfirmationInfoItem>

                <ConfirmationInfoItem title="Participant">
                  <Typography>
                    {values.participantStatus === ParticipantStatus.Public ? 'Public' : 'Whitelist'}
                  </Typography>
                </ConfirmationInfoItem>
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 32, width: '100%' }}>
          {account ? (
            <CreatePoolButton />
          ) : (
            <LoadingButton fullWidth variant="contained" onClick={toggleWalletModal}>
              Connect Wallet
            </LoadingButton>
          )}

          <ConfirmationSubtitle sx={{ mt: 12 }}>Transaction Fee is 2.5%</ConfirmationSubtitle>
        </Box>
      </Box>
    </Box>
  )
}

export default CreationConfirmation
