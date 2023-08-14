import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { Coin, CoinInterface } from '@/Constants/coin'
import { useMemo } from 'react'

export function get_balance_key(type: Coin, address: string) {
  return ['get-balance', address, type]
}

export default function useGetBalance(coinType: Coin, address?: string | null) {
  const rpc = useRpc()
  return useQuery(
    ['get-balance', address, coinType],
    async () => {
      return await rpc.getBalance({
        owner: address!,
        coinType,
      })
    },
    {
      enabled: !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}

export function useGetMulBalance(
  coin_types: CoinInterface[],
  address?: string,
) {
  const rpc = useRpc()
  const owned_balances = useQueries({
    queries: coin_types.map(({ type: coinType }) => {
      return {
        queryKey: ['get-balance', address, coinType],
        queryFn: () => rpc.getBalance({ owner: address!, coinType }),
        enabled: !!address,
      }
    }),
  })

  return useMemo(
    () =>
      !owned_balances.length
        ? []
        : owned_balances.map(({ data, isLoading, error }) => ({
            data,
            isLoading,
            error,
          })),
    [owned_balances],
  )
}
