import { get_pools, pools_df_id } from '@/Constants/API/pool'
import { getObjectFields } from '@mysten/sui.js'
import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useMemo } from 'react'

export function useGetPoolIDs() {
  const rpc = useRpc()
  return useQuery(
    ['get-pool-ids'],
    async () => {
      const pools_ = await rpc.getDynamicFields({
        parentId: pools_df_id,
      })

      const promises = pools_.data.map((df) =>
        rpc.getDynamicFieldObject({ parentId: pools_df_id, name: df.name }),
      )

      return (await Promise.all(promises)).map(
        (pool) => getObjectFields(pool)?.value as string,
      )
    },
    {
      staleTime: 24 * 60 * 60 * 1000,
      cacheTime: 24 * 60 * 60 * 1000,
      enabled: !!pools_df_id,
    },
  )
}
export const useGetAllPool = () => {
  const rpc = useRpc()
  const { data: pool_ids } = useGetPoolIDs()
  return useQuery(['pools'], async () => get_pools(rpc, pool_ids!), {
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
    enabled: !!pool_ids,
  },)
}
export const useGetPool = (pool_id?: string) => {
  const pools = useGetAllPool()
  return useMemo(() => pools.isLoading ? ({ data: null, isLoading: true }) : { data: pools.data?.find((p) => p.id == pool_id), isLoading: false }, [pool_id, pools])
}
