import { useContext, useMemo } from 'react'

import {
  Connection,
  JsonRpcProvider,
  devnetConnection,
  localnetConnection,
  testnetConnection,
  mainnetConnection
} from '@mysten/sui.js'
import { createContext, useState } from 'react'

export enum Network {
  LOCAL = 'LOCAL',
  DEVNET = 'DEVNET',
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET'
}
const vincagame_options = {
  fullnode: 'https://fullnode.devnet.vincagame.com',
  websocket: 'https://fullnode.devnet.vincagame.com',
  faucet: 'https://fullnode.devnet.vincagame.com/gas',
}

const ENDPOINTS: Record<Network, Connection> = {
  [Network.LOCAL]: localnetConnection,
  [Network.DEVNET]: devnetConnection,
  [Network.TESTNET]: testnetConnection,
  [Network.MAINNET]: mainnetConnection
}

export const defaultNetwork = Network.DEVNET

export function getEndpoint(network: Network | string): string {
  if (Object.keys(ENDPOINTS).includes(network)) {
    return ENDPOINTS[network as Network].fullnode
  }
  return network
}

const defaultRpcMap: Map<Network | string, JsonRpcProvider> = new Map()

export const getRpcClient = (network: Network | string) => {
  const existingClient = defaultRpcMap.get(network)
  if (existingClient) return existingClient

  const provider = new JsonRpcProvider(ENDPOINTS[Network[network]])
  defaultRpcMap.set(network, provider)
  return provider
}

export const NetworkContext = createContext<
  [Network | string, (network: Network | string) => void]
>(['', () => null])

export function useNetwork(): [string, (network: Network | string) => void] {
  const [network, setNetwork] = useState<Network | string>(defaultNetwork)
  return [network, setNetwork]
}
export const defaultOptions = {
  showType: true,
  showContent: true,
  showOwner: true,
  showPreviousTransaction: true,
  showStorageRebate: true,
  showDisplay: true,
}

const useRpc = (): JsonRpcProvider => {
  const [network] = useContext(NetworkContext)
  return useMemo(() => {
    if (network) {
      return getRpcClient(network)
    } else {
      return getRpcClient(defaultNetwork)
    }
  }, [network])
}

export default useRpc
