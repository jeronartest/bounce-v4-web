import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Box, Typography, Grid, Pagination } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import Slide from '@mui/material/Slide'
import React, { useEffect, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import CloseIcon from 'assets/imgs/common/closeIcon.svg'
import NoData from 'bounceComponents/common/NoData'
import { NFTCard } from 'pages/market/nftAuctionPool/index'
import { usePagination } from 'ahooks'
import { Params } from 'ahooks/lib/usePagination/types'
import { getPools } from 'api/market'
import { routes } from 'constants/routes'
import { getLabelById } from 'utils'
import { useOptionDatas } from 'state/configOptions/hooks'
import FooterPc from 'components/Footer/FooterPc'
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface DialogParams {
  open: boolean
  handleClose: () => void
}
const NFTDialog = styled(Dialog)(({ theme }) => ({
  '&.MuiDialog-root': {
    top: theme.height.header
  },
  '.MuiModal-backdrop': {
    top: theme.height.header,
    height: `calc(100% - ${theme.height.header})`
  },
  '.MuiPaper-root': {
    position: 'relative',
    top: theme.height.header,
    height: `calc(100% - 60px)`
  },
  '.MuiDialog-paper': {
    borderRadius: '30px 30px 0 0',
    backgroundColor: 'var(--ps-text-8)'
  }
}))
interface TitleProps {
  title: string
  handleClose: () => void
}
const DialogTitle = (props: TitleProps) => {
  const { title, handleClose } = props
  return (
    <Box
      sx={{
        position: 'relative',
        height: 140,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          lineHeight: '28px',
          fontFamily: `'Public Sans'`,
          fontSize: 28,
          fontWeight: 600
        }}
      >
        {title}
      </Typography>
      <img
        src={CloseIcon}
        style={{
          position: 'absolute',
          right: 72,
          top: '50%',
          marginTop: -30,
          width: 60,
          height: 60,
          cursor: 'pointer'
        }}
        onClick={() => {
          handleClose && handleClose()
        }}
        alt=""
        srcSet=""
      />
    </Box>
  )
}
const initialValues = {
  searchText: '',
  searchType: 0,
  sortBy: 0,
  tokenFromAddress: '',
  tokenFromSymbol: '',
  tokenFromLogoURI: '',
  tokenFromDecimals: '',
  poolStatus: 0,
  auctionType: 5,
  chain: 2
}
const defaultIdeaPageSize = 16
const NFTAuctionListDialog = (props: DialogParams) => {
  const { open, handleClose } = props
  const optionDatas = useOptionDatas()

  const {
    pagination: poolsPagination,
    data: poolsData,
    run
  } = usePagination<any, Params>(
    async ({
      current,
      pageSize,
      category,
      chainId,
      creatorAddress,
      creatorName,
      orderBy,
      poolId,
      poolName,
      poolStatusFrontend,
      token0Address
    }) => {
      if (!chainId) {
        return Promise.reject(new Error('No ChainId'))
      }

      const resp = await getPools({
        offset: (current - 1) * pageSize,
        limit: pageSize,
        category: category,
        chainId: chainId,
        tokenType: 2, // erc20:1, nft:2
        creatorAddress: creatorAddress,
        creatorName: creatorName,
        orderBy: orderBy === 0 ? 'openTs' : 'createTs',
        poolId: poolId,
        poolName: poolName,
        poolStatusFrontend: poolStatusFrontend === 0 ? null : poolStatusFrontend,
        token0Address: token0Address
      })
      return {
        list: resp.data.fixedSwapNftList.list,
        total: resp.data.fixedSwapNftList.total
      }
    },
    {
      manual: true,
      defaultPageSize: defaultIdeaPageSize
    }
  )
  const handleSubmit = useCallback(
    (values: typeof initialValues) =>
      run({
        current: 1,
        pageSize: 16,
        category: values.auctionType,
        chainId: values.chain,
        creatorAddress: values.searchType === 3 ? values.searchText : '',
        creatorName: values.searchType === 2 ? values.searchText : '',
        orderBy: values.sortBy,
        poolId: values.searchType === 1 ? values.searchText : '',
        poolName: values.searchType === 0 ? values.searchText : '',
        poolStatusFrontend: values.poolStatus,
        token0Address: values.tokenFromAddress
      }),
    [run]
  )
  useEffect(() => {
    open && handleSubmit(initialValues)
  }, [handleSubmit, open])
  const handlePageChange = (_: any, p: number) => {
    poolsPagination.changeCurrent(p)
  }
  return (
    <NFTDialog
      fullScreen={true}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <DialogTitle title={'NFT  Auction Space'} handleClose={handleClose} />
        <Box
          sx={{
            width: '100%'
          }}
        >
          <Box mb={160}>
            {poolsData?.total > 0 ? (
              <Grid container spacing={18}>
                {poolsData?.list?.map((fixedSwaptem: any, index: number) => (
                  <Grid item xs={3} sm={3} md={3} lg={3} xl={3} key={index}>
                    <Box
                      component={'a'}
                      target="_blank"
                      href={routes.auction.fixedSwapNft
                        .replace(
                          ':chainShortName',
                          getLabelById(fixedSwaptem.chainId, 'shortName', optionDatas?.chainInfoOpt || [])
                        )
                        .replace(':poolId', fixedSwaptem.poolId)}
                    >
                      <NFTCard nft={fixedSwaptem} hiddenStatus={true} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <NoData />
            )}
            {poolsData?.total >= defaultIdeaPageSize && (
              <Box mt={58} display={'flex'} justifyContent={'center'}>
                <Pagination
                  onChange={handlePageChange}
                  count={Math.ceil(poolsData?.total / defaultIdeaPageSize) || 0}
                  variant="outlined"
                  siblingCount={0}
                />
              </Box>
            )}
          </Box>
          <FooterPc />
        </Box>
      </DialogContent>
    </NFTDialog>
  )
}
export default NFTAuctionListDialog
