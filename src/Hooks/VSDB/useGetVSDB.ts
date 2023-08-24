import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'

import { useMemo } from 'react'

import { Vsdb, get_vsdb } from '@/Constants/API/vsdb'

export const vsdb_package = import.meta.env.VITE_VSDB_PACKAGE as string

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
    if (!mul_vsdb.length) return []

    const ret: Vsdb[] = []
    mul_vsdb.forEach(({ data }) => {
      if (!data) return []
      ret.push(data)
    })

    if (!ret.length) return []
    return ret
  }, [mul_vsdb])
}
