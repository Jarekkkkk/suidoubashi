import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'

export function useGetBalance(coinType: string, address?: string | null) {
  const rpc = useRpc()
  return useQuery(
    ['get-balance', address, coinType],
    async () => {
      return await rpc.getBalance({
        owner: address!,
        coinType
      })
    },
    {
      enabled: !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}
