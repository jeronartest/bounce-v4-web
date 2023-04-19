import { useCallback, useMemo, useState } from 'react'
import { useModal, create, muiDialogV5 } from '@ebay/nice-modal-react'
import { Box, Stack, Grid, Button } from '@mui/material'
import { UserNFTCollection } from 'api/user/type'
import Dialog from 'bounceComponents/common/DialogBase'
import { use721TokenList } from 'bounceHooks/auction/use721TokenList'
import { useOptionDatas } from 'state/configOptions/hooks'
import { BounceAnime } from 'bounceComponents/common/BounceAnime'
import { toast } from 'react-toastify'
import { useERC721MultiOwner } from 'hooks/useNFTTokenBalance'
import { useActiveWeb3React } from 'hooks'
import NFTCard from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/NFTCard'
import CollectionSelect from 'bounceComponents/create-auction-pool/TokenERC1155InforationForm/components/CollectionSelect'

interface TokenDialogProps {
  enableEth?: boolean
  onClose?: () => void
  chainId: number
  singleSelection?: boolean
  maximumSelection?: number
}

const Token721Dialog = create(({ chainId, singleSelection, maximumSelection }: TokenDialogProps) => {
  const modal = useModal()
  const options = useOptionDatas()
  const backedChainId = options.chainInfoOpt?.find(i => i.ethChainId === chainId)?.id

  const { account } = useActiveWeb3React()
  const { data: tokenList, loading } = use721TokenList(backedChainId || '')
  const [curNftList, setCurNftList] = useState<UserNFTCollection[]>([])
  const [resultNft, setResultNft] = useState<UserNFTCollection[]>([])

  const curNftAddress = useMemo(() => curNftList?.[0]?.contractAddr, [curNftList])
  const ownerIds = useERC721MultiOwner(
    curNftAddress,
    account || undefined,
    curNftList.map(i => i.tokenId.toString()),
    chainId
  )
  const filterNftList = useMemo(() => {
    if (ownerIds.loading) {
      return curNftList
    }

    return curNftList.filter(i => ownerIds.ownerIds.includes(i.tokenId.toString()))
  }, [curNftList, ownerIds.loading, ownerIds.ownerIds])

  const resultNftHandler = useCallback(
    (token: UserNFTCollection) => {
      const hasIndex = resultNft.findIndex(i => i === token)
      const _ret = [...resultNft]
      if (hasIndex >= 0) {
        _ret.splice(hasIndex, 1)
        if (singleSelection) {
          setResultNft([])
          return
        }
      } else {
        if (maximumSelection && _ret.length >= maximumSelection) {
          toast(`Maximum selection is ${maximumSelection}`)
          return
        }
        _ret.push(token)
        if (singleSelection) {
          setResultNft([token])
          return
        }
      }
      setResultNft(_ret)
    },
    [maximumSelection, resultNft, singleSelection]
  )

  const handleResolve = (token: UserNFTCollection[]) => {
    modal.resolve(token)
    modal.hide()
  }
  const handleReject = () => {
    modal.reject(new Error('Rejected'))
    modal.hide()
  }
  const submitNft = () => {
    if (resultNft.length) handleResolve(resultNft)
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
        <Box sx={{ height: 300 }} display={'flex'} alignItems="center" justifyContent="center">
          <BounceAnime />
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
              setCurNftList(list)
              setResultNft([])
            }}
          />
          {filterNftList.length > 0 && (
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
              <Grid container>
                {filterNftList.map((nft, j) => (
                  <Grid item xs={3} key={j}>
                    <NFTCard
                      nft={nft}
                      isSelect={nft?.tokenId ? resultNft.map(item => item.tokenId).includes(nft.tokenId) : false}
                      handleClick={() => {
                        resultNftHandler(nft)
                      }}
                      key={j}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {filterNftList.length > 0 && (
            <Stack direction="row" spacing={10} justifyContent="end" mt={30}>
              <Button disabled={!resultNft.length} variant="contained" sx={{ width: 140 }} onClick={submitNft}>
                Confirm
              </Button>
            </Stack>
          )}
        </Box>
      )}
    </Dialog>
  )
})

export default Token721Dialog
