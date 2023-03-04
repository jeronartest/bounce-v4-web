import { ApiInstance } from '..'
import {
  GetPoolCreationSignatureParams,
  GetPoolCreationSignatureResponse,
  GetPoolHistoryParams,
  GetPoolHistoryResponse,
  GetPoolInfoParams,
  GetPoolInfoResponse,
  GetWhitelistMerkleTreeRootParams,
  GetWhitelistMerkleTreeRootResponse
} from './type'

/**
 * Get signature for auction pool creation
 */
export const getPoolCreationSignature = (params: GetPoolCreationSignatureParams) => {
  return ApiInstance.post<GetPoolCreationSignatureResponse>('/user/create_pool_sign', params)
}

/**
 * Get merkle tree root of whitelist
 */
export const getWhitelistMerkleTreeRoot = (params: GetWhitelistMerkleTreeRootParams) => {
  return ApiInstance.post<GetWhitelistMerkleTreeRootResponse>('/user/import_whitelist', params)
}

/**
 * Get info of single pool
 */
export const getPoolInfo = (params: GetPoolInfoParams) => {
  return ApiInstance.post<GetPoolInfoResponse>('/pools/pool', params)
}

/**
 * Get info of single pool
 */
export const getPoolHistory = (params: GetPoolHistoryParams) => {
  return ApiInstance.post<GetPoolHistoryResponse>('/pools/pool/activities', params)
}
