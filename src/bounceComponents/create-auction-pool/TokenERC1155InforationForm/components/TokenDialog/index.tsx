import { useState } from 'react'
import { useModal, create, muiDialogV5 } from '@ebay/nice-modal-react'
import { Box, Stack, Typography, Grid, Button } from '@mui/material'
import CollectionSelect from '../CollectionSelect'
import NFTCard from '../NFTCard'
import { UserNFTCollection } from 'api/user/type'
import Dialog from 'bounceComponents/common/DialogBase'
import { use1155TokenList } from 'bounceHooks/auction/use1155TokenList'
import { useOptionDatas } from 'state/configOptions/hooks'

export interface BasicToken {
  address: string
  symbol: string
  name: string
  decimals: number
}

export interface TokenDialogProps {
  enableEth?: boolean
  onClose?: () => void
  chainId: number
}

const Loading = () => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center">
      <Typography variant="h4" sx={{ color: '#878A8E' }}>
        Loading
      </Typography>
    </Stack>
  )
}

const TokenDialog = create(({ chainId }: TokenDialogProps) => {
  const modal = useModal()
  const options = useOptionDatas()
  const backedChainId = options.chainInfoOpt?.find(i => i.ethChainId === chainId)?.id

  const { data: tokenList, loading } = use1155TokenList(backedChainId || '')
  const [nftList, setNftList] = useState<UserNFTCollection[]>([])
  const [resultNft, setResultNft] = useState<UserNFTCollection | null>(null)
  const handleResolve = (token: UserNFTCollection) => {
    modal.resolve(token)
    modal.hide()
  }
  const handleReject = () => {
    modal.reject(new Error('Rejected'))
    modal.hide()
  }
  const submitNft = () => {
    if (resultNft !== null) handleResolve(resultNft)
  }
  return (
    <Dialog
      title="Add NFT to the pool"
      {...muiDialogV5(modal)}
      onClose={handleReject}
      sx={{
        width: '860px'
      }}
      fullWidth
      contentStyle={{
        padding: '20px 24px'
      }}
    >
      {loading && (
        <Box sx={{ height: 300 }}>
          <Loading />
        </Box>
      )}
      {!loading && (
        <Box
          sx={{
            width: '100%',
            minHeight: '400px'
          }}
        >
          <CollectionSelect
            list={tokenList}
            onSelected={list => {
              setNftList(list)
              setResultNft(null)
            }}
          />
          {nftList.length > 0 && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: 300,
                overflowY: 'auto',
                paddingTop: '20px',
                '&::-webkit-scrollbar-thumb': {
                  background: '#D8DBE7',
                  borderRadius: '6px'
                },
                '&::-webkit-scrollbar': {
                  width: '6px',
                  borderRadius: '6px',
                  background: '#fff'
                }
              }}
            >
              <Grid container spacing={10}>
                {nftList.map((nft, j) => (
                  <Grid item xs={3} key={j}>
                    <NFTCard
                      nft={nft}
                      isSelect={resultNft?.tokenId === nft?.tokenId}
                      handleClick={() => {
                        setResultNft(nft)
                      }}
                      key={j}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {nftList.length > 0 && (
            <Stack direction="row" spacing={10} justifyContent="end" mt={30}>
              <Button disabled={resultNft === null} variant="contained" sx={{ width: 140 }} onClick={submitNft}>
                Confirm
              </Button>
            </Stack>
          )}
        </Box>
      )}
    </Dialog>
  )
})

export default TokenDialog
