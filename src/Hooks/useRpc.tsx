import { useContext, useMemo } from 'react'

import { Connection, JsonRpcProvider, mainnetConnection } from '@mysten/sui.js'
import { createContext } from 'react'

export enum Network {
  LOCAL = 'LOCAL',
  DEVNET = 'DEVNET',
  TESTNET = 'TESTNET',
  MAINNET = 'MAINNET',
}
const blast_testnet = {
  fullnode: 'https://sui-testnet.public.blastapi.io',
  websocket: 'wss://sui-testnet.public.blastapi.io',
  faucet: 'https://sui-testnet.public.blastapi.io/gas',
}

export const api_key = import.meta.env.VITE_NETWORK_KEY as string
const blockvision = {
  fullnode: `https://sui-testnet.blockvision.org/v1/${api_key}`,
  Websocket: `wss://sui-testnet.blockvision.org/v1/${api_key}`,
  faucet: `https://sui-testnet.public.blastapi.io/${api_key}/gas`,
}

const ENDPOINTS: Record<Network, Connection> = {
  [Network.LOCAL]: new Connection(blast_testnet),
  [Network.DEVNET]: new Connection(blockvision),
  [Network.TESTNET]: new Connection(blast_testnet),
  [Network.MAINNET]: mainnetConnection,
}

export const defaultNetwork = Network.TESTNET

export function getEndpoint(network: Network | string): string {
  if (Object.keys(ENDPOINTS).includes(network)) {
    return ENDPOINTS[network as Network].fullnode
  }
  return network
}

const defaultRpcMap: Map<Network | string, JsonRpcProvider> = new Map()

export const getRpcClient = (network: Network) => {
  const existingClient = defaultRpcMap.get(network)
  if (existingClient) return existingClient

  const provider = new JsonRpcProvider(ENDPOINTS[network])
  defaultRpcMap.set(network, provider)
  return provider
}

export const NetworkContext = createContext<
  [Network, (network: Network) => void]
>([Network.TESTNET, () => null])

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
