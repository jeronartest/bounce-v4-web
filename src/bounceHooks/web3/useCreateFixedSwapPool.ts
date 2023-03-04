import { useRequest } from 'ahooks'
import { parseEther, parseUnits } from 'ethers/lib/utils.js'
import { ContractReceipt } from 'ethers'
import { useAccount, useNetwork } from 'wagmi'
import { hide, show } from '@ebay/nice-modal-react'

import { BigNumber } from 'bignumber.js'
import { useErc20Contract, useFixedSwapContract } from './useContractHooks/useContract'
import { approveErc20TokenAllowance, getErc20TokenAllowance } from './useContractHooks/useErc20'
import useChainConfigInBackend from './useChainConfigInBackend'
import { getFixedSwapContractAddress } from '@/utils/web3/contract'
import { getPoolCreationSignature, getWhitelistMerkleTreeRoot } from '@/api/pool'
import { GetPoolCreationSignatureParams, GetWhitelistMerkleTreeRootParams, PoolType } from '@/api/pool/type'
import { NULL_BYTES } from '@/constants/web3/contracts'
import { createFixedSwapPoolCall } from '@/utils/web3/contractCalls/fixedSwap'
import DialogConfirmation from '@/components/common/DialogConfirmation'

interface Params {
  whitelist: string[]
  poolSize: string
  swapRatio: string
  allocationPerWallet: string
  startTime: number
  endTime: number
  delayUnlockingTime: number
  poolName: string
  tokenFromAddress: string
  tokenToAddress: string
  tokenFormDecimal: string | number
  tokenToDecimal: string | number
}

const useCreateFixedSwapPool = (
  token0Address: string,
  options?: {
    onSuccess?: (data: ContractReceipt, chainShortName: string) => void
    onError?: (error: Error) => void
  },
) => {
  const fixedSwapContract = useFixedSwapContract()
  const erc20Contract = useErc20Contract(token0Address)

  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  const chainConfigInBackend = useChainConfigInBackend('ethChainId', chain?.id)

  return useRequest(
    async (params: Params) => {
      if (!chainConfigInBackend.id) {
        return Promise.reject(new Error('No chain id in backend'))
      }

      if (!erc20Contract) {
        return Promise.reject('no erc20Contract')
      }
      if (!address) {
        return Promise.reject('no account')
      }

      const fixedSwapContractAddress = getFixedSwapContractAddress(chain?.id)

      const allowance = await getErc20TokenAllowance(erc20Contract, address, fixedSwapContractAddress)

      // console.log('>>>> allowance: ', allowance.toString())
      // console.log('>>>> parseEther(params.poolSize): ', parseEther(params.poolSize).toString())
      // console.log('>>>> allowance.lt(parseEther(params.poolSize)): ', allowance.lt(parseEther(params.poolSize)))

      const token0Units = parseUnits(params.poolSize, params.tokenFormDecimal)

      if (allowance.lt(token0Units)) {
        show(DialogConfirmation, {
          title: 'Bounce requests wallet approval',
          subTitle: 'Please manually interact with your wallet. Ease enable Bounce to access your tokens.',
        })

        const approvalReceipt = await approveErc20TokenAllowance(erc20Contract, fixedSwapContractAddress, token0Units)

        if (!approvalReceipt) {
          return Promise.reject(new Error('Failed to approve'))
        }

        // console.log('>>>> approvalReceipt: ', approvalReceipt)
      }
      show(DialogConfirmation, {
        title: 'Bounce requests wallet interaction',
        subTitle: 'Please open your wallet and confirm in the transaction activity to proceed your order.',
      })

      let merkleroot = ''

      if (params.whitelist.length > 0) {
        const whitelistParams: GetWhitelistMerkleTreeRootParams = {
          addresses: params.whitelist,
          category: PoolType.FixedSwap,
          chainId: chainConfigInBackend.id,
        }
        const { data } = await getWhitelistMerkleTreeRoot(whitelistParams)
        merkleroot = data.merkleroot
      }

      // console.log('>>>> merkleroot: ', merkleroot)

      const signatureParams: GetPoolCreationSignatureParams = {
        amountTotal0: parseUnits(params.poolSize, params.tokenFormDecimal).toString(),
        amountTotal1: new BigNumber(parseUnits(params.poolSize, params.tokenToDecimal).toString())
          .times(params.swapRatio)
          // Prevent exponential notation
          .toFixed(0, BigNumber.ROUND_DOWN),
        category: PoolType.FixedSwap,
        chainId: chainConfigInBackend.id,
        claimAt: params.delayUnlockingTime,
        closeAt: params.endTime,
        creator: address,
        maxAmount1PerWallet: parseUnits(params.allocationPerWallet, params.tokenToDecimal).toString(),
        merkleroot: merkleroot,
        name: params.poolName,
        openAt: params.startTime,
        token0: params.tokenFromAddress,
        token1: params.tokenToAddress,
      }

      const {
        data: { expiredTime, signature },
      } = await getPoolCreationSignature(signatureParams)

      // console.log('>>>> signature: ', signature)

      const contractCallParams = {
        name: signatureParams.name,
        token0: signatureParams.token0,
        token1: signatureParams.token1,
        amountTotal0: signatureParams.amountTotal0,
        amountTotal1: signatureParams.amountTotal1,
        openAt: signatureParams.openAt,
        claimAt: signatureParams.claimAt,
        closeAt: signatureParams.closeAt,
        maxAmount1PerWallet: signatureParams.maxAmount1PerWallet,
        whitelistRoot: merkleroot || NULL_BYTES,
      }

      console.log('>>> create pool contractCallParams: ', contractCallParams)

      show(DialogConfirmation, {
        title: 'Bounce requests wallet interaction',
        subTitle: 'Please open your wallet and confirm in the transaction activity to proceed your order.',
      })

      const tx = await createFixedSwapPoolCall(fixedSwapContract, contractCallParams, expiredTime, signature)

      show(DialogConfirmation, {
        title: 'Bounce waiting for transaction settlement',
        subTitle:
          'Bounce is engaging with blockchain transaction, please wait patiently for on-chain transaction settlement.',
      })

      return tx.wait(1)
    },
    {
      manual: true,
      ready: isConnected && !!fixedSwapContract && !!token0Address && typeof chainConfigInBackend.id === 'number',
      onSuccess: (data) => {
        console.log('Pool Creation Receipt: ', data)
        hide(DialogConfirmation)
        options?.onSuccess?.(data, chainConfigInBackend.shortName)
      },
      onError: (error) => {
        console.log('>>>> create pool error: ', error)
        hide(DialogConfirmation)
        options?.onError?.(error)
      },
      onFinally: () => {
        hide(DialogConfirmation)
      },
    },
  )
}

export default useCreateFixedSwapPool
