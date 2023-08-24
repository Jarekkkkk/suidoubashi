import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { Coin, CoinInterface, Coins } from '@/Constants/coin'
import { useMemo } from 'react'

export function get_balance_key(type: Coin, address: string) {
  return ['get-balance', address, type]
}

export type Balance = {
  coinType: string
  totalBalance: string
}

export default function useGetBalance(coinType: Coin, address?: string) {
  const res = useGetAllBalance(undefined, address)

  return useMemo(
    () => res.data?.find((bal) => bal.coinType == coinType) ?? null,
    [res, coinType],
  )
}

export function useGetAllBalance(
  coin_types: CoinInterface[] = Coins,
  address?: string,
) {
  const rpc = useRpc()
  return useQuery(
    ['balance', address],
    async () => {
      const res = await rpc.getAllBalances({
        owner: address!,
      })

      if (!res.length) return []

      return res
        .filter((bal) => coin_types.some((c) => c.type == bal.coinType))
        .map((bal) => ({
          coinType: bal.coinType,
          totalBalance: bal.totalBalance,
        })) as Balance[]
    },
    {
      enabled: !!address,
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
