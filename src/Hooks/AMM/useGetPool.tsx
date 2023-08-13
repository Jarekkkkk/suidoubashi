import { get_pool, pools_df_id } from '@/Constants/API/pool'
import { getObjectFields } from '@mysten/sui.js'
import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useMemo } from 'react'

export function useGetPoolIDs(address?: string | null) {
  const rpc = useRpc()
  return useQuery(
    ['get-pool-ids', address],
    async () => {
      const pools_ = await rpc.getDynamicFields({
        parentId: pools_df_id,
      })

      const promises = pools_.data.map((df) =>
        rpc.getDynamicFieldObject({ parentId: pools_df_id, name: df.name }),
      )

      return (await Promise.all(promises)).map(
        (pool) => getObjectFields(pool)?.value,
      )
    },
    {
      staleTime: 10 * 1000,
      enabled: !!address,
    },
  )
}

export const useGetMulPool = (pool_ids?: (string | undefined)[]) => {
  const rpc = useRpc()
  const pools = useQueries({
    queries:
      pool_ids?.map((id) => {
        return {
          queryKey: ['pool', id],
          queryFn: () => get_pool(rpc, id!),
          enabled: !!id,
        }
      }) ?? [],
  })
  return useMemo(
    () => (!pools.length ? [] : pools.map((data) => data)),
    [pools],
  )
}
