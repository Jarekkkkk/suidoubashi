import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { LP, amm_package } from '@/Constants/API/pool'
import { getObjectFields, getObjectType } from '@mysten/sui.js'

export const useGetMulLP = (address?: string | null) => {
  const rpc = useRpc()
  return useQuery(
    ['LP', address],
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
            type_x: X,
            type_y: Y,
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

export const useGetLP = (
  address?: string,
  type_x?: string,
  type_y?: string,
) => {
  const rpc = useRpc()
  return useQuery(
    ['LP', type_x, type_y],
    async () => {
      const res = await rpc.getOwnedObjects({
        owner: address!,
        filter: {
          MatchAll: [{ StructType: `${amm_package}::pool::LP` }],
        },
        options: { showType: true, showContent: true },
      })

      if (res.data.length == 0) return null
      const { id, lp_balance, claimable_x, claimable_y } = getObjectFields(
        res.data[0],
      ) as any

      return {
        id: id.id,
        lp_balance: lp_balance,
        claimable_x,
        claimable_y,
      }
    },
    {
      enabled: !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}
