import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'

import { useMemo } from 'react'

import { Vsdb, get_vsdb, vsdb_package } from '@/Constants/API/vsdb'

export function useGetVsdbIDs(address?: string | null) {
  const rpc = useRpc()
  return useQuery(
    ['get-vsdbs'],
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


export const useGetVsdb = (address?: string | null, vsdb?: string | null) => {
  const rpc = useRpc()
  const res = useQuery(['vsdb', vsdb], () => get_vsdb(rpc, address!, vsdb!), {
    enabled: !!address && !!vsdb,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  return useMemo(() => {
    if (vsdb === undefined) return { isLoading: true, data: null }
    if (vsdb === null) return { isLoading: false, data: null }
    return { isLoading: res.isLoading, data: res.data }
  }, [address, vsdb, res])
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
          queryKey: ['vsdb', id],
          queryFn: () => get_vsdb(rpc, address!, id!),
          enabled: !!address && !!id,
        }
      }) ?? [],
  })

  return useMemo(() => {
    if (!owned_vsdb) return { isLoading: true, data: [] }
    if (owned_vsdb.length == 0) return { isLoading: false, data: [] }

    const isLoading = mul_vsdb.some((v) => v.isLoading)
    const ret: Vsdb[] = []

    mul_vsdb.forEach(({ data }) => {
      if (!data) return { isLoading, data: [] }
      ret.push(data)
    })
    return { isLoading, data: ret.length ? ret : [] }
  }, [mul_vsdb])
}
