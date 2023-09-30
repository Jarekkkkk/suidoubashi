import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { LP, amm_package, get_claimable_x } from '@/Constants/API/pool'
import {
  getObjectFields,
  getObjectType,
  normalizeStructTag,
} from '@mysten/sui.js'
import { useMemo } from 'react'

export const useGetLP = (
  address?: string | null,
  type_x?: string,
  type_y?: string,
) => {
  const lps = useGetAllLP(address)

  return useMemo(() => {
    if (!lps?.data) return undefined
    return (
      lps?.data.find((lp) => lp.type_x == type_x && lp.type_y == type_y) ?? null
    )
  }, [lps])
}

export const useGetAllLP = (address?: string | null) => {
  const rpc = useRpc()
  return useQuery(
    ['LP'],
    async () => {
      const res = await rpc.getOwnedObjects({
        owner: address!,
        filter: {
          MatchAll: [{ StructType: `${amm_package}::pool::LP` }],
        },
        options: { showType: true, showContent: true },
      })

      if (res.data.length == 0) return []

      return res.data.map((lp) => {
        const { id, lp_balance, claimable_x, claimable_y } = getObjectFields(
          lp,
        ) as any
        const type = getObjectType(lp)

        const [X, Y] =
          type
            ?.slice(type.indexOf('<') + 1, type.indexOf('>'))
            .split(',')
            .map((t) => t.trim()) ?? []

        return {
          id: id.id,
          type_x: normalizeStructTag(X),
          type_y: normalizeStructTag(Y),
          lp_balance: lp_balance,
          claimable_x,
          claimable_y,
        } as LP
      })
    },
    {
      enabled: !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}
