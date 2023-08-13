import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { amm_package } from '@/Constants/API/pool'
import { getObjectFields } from '@mysten/sui.js'

export const useGetMulLP = (
  address: string,
  type_x: string,
  type_y: string,
) => {
  const rpc = useRpc()
  return useQuery(
    ['lp', type_x, type_y],
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
        lp_balance: lp_balance.fields.value,
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
          MatchAll: [
            { StructType: `${amm_package}::pool::LP<${type_x}, ${type_y}>` },
          ],
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
