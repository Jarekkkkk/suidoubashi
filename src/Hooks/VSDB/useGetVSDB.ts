import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'

import { useMemo } from 'react'

import { Vsdb, get_vsdb, vsdb_package } from '@/Constants/API/vsdb'

export function useGetVsdbIDs(address?: string | null) {
  const rpc = useRpc()
  return useQuery(
    ['get-vsdbs', address],
    async () => {
      const res = await rpc.getOwnedObjects({
        owner: address!,
        filter: {
          MatchAll: [{ StructType: `${vsdb_package}::vsdb::Vsdb` }],
        },
      })

      if (res.data.length == 0) return []

      return res.data.map((vsdb_d) => vsdb_d.data!.objectId)
    },
    {
      staleTime: 10 * 1000,
      enabled: !!address,
    },
  )
}

export const get_vsdb_key = (address: string | null, vsdb: string) => [
  'vsdb',
  address,
  vsdb,
]
export const useGetVsdb = (address?: string | null, vsdb?: string) => {
  const rpc = useRpc()
  return useQuery(
    ['vsdb', address, vsdb],
    () => get_vsdb(rpc, address!, vsdb!),
    {
      enabled: !!address && !!vsdb,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}

export const useGetMulVsdb = (
  address?: string,
  owned_vsdb?: (string | null)[],
) => {
  const rpc = useRpc()
  const mul_vsdb = useQueries({
    queries:
      owned_vsdb?.map((id) => {
        return {
          queryKey: ['vsdb', address, id],
          queryFn: () => get_vsdb(rpc, address!, id!),
          enabled: !!address && !!id,
        }
      }) ?? [],
  })

  return useMemo(() => {
    const isLoading = mul_vsdb.some((v) => v.isLoading) || !owned_vsdb
    const isFetching = mul_vsdb.some((v) => v.isFetching)
    const ret: Vsdb[] = []

    mul_vsdb.forEach(({ data }) => {
      if (!data) return { isLoading, data: [], isFetching }
      ret.push(data)
    })
    return { isLoading, isFetching, data: ret.length ? ret : [] }
  }, [mul_vsdb])
}
