import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { Coin, CoinInterface, Coins } from '@/Constants/coin'
import { useMemo } from 'react'
import { normalizeStructTag } from '@mysten/sui.js'

export function get_balance_key(type: Coin, address: string) {
  return ['get-balance', address, type]
}

export type Balance = {
  coinType: string
  coinName: string
  totalBalance: string
}

export default function useGetBalance(coinType: Coin, address?: string | null) {
  const res = useGetAllBalance(undefined, address)
  return useMemo(
    () => res.data?.find((bal) => bal.coinType == coinType),
    [res, coinType],
  )
}

export function useGetAllBalance(
  coin_types: CoinInterface[] = Coins,
  address?: string | null,
) {
  const rpc = useRpc()
  return useQuery(
    ['balance'],
    async () => {
      const res = await rpc.getAllBalances({
        owner: address!,
      })

      if (!res.length) return []

      const objs = new Map()
      res.forEach((r) =>
        objs.set(normalizeStructTag(r.coinType), r.totalBalance),
      )
      return coin_types.map((c) =>
        objs.has(c.type)
          ? {
              coinType: c.type,
              coinName: c.name,
              totalBalance: objs.get(c.type),
            }
          : { coinType: c.type, coinName: c.name, totalBalance: '0' },
      )
    },
    {
      enabled: !!address,
    },
  )
}
