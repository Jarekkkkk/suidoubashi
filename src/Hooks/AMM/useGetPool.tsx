import { Pool, get_pool, pools_df_id } from '@/Constants/API/pool'
import { getObjectFields } from '@mysten/sui.js'
import { useQueries, useQuery } from '@tanstack/react-query'
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
  return useMemo(() => {
    if (!pool_ids) return { isLoading: true, data: null }
    if (pools.length == 0) return { isLoading: false, data: [] }

    const isLoading = pools.some((v) => v.isLoading)
    const ret: Pool[] = []

    pools.forEach(({ data }) => {
      if (!data) return { isLoading, data: [] }
      ret.push(data)
    })
    return { isLoading, data: ret.length ? ret : [] }
  }, [pools])
}

export const useGetPool = (pool_id?: string) => {
  const rpc = useRpc()
  return useQuery(['pool', pool_id], () => get_pool(rpc, pool_id!), {
    enabled: !!pool_id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}
