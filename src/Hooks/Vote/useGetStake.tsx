import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { Stake, vote_package } from '@/Constants/API/vote'
import { useMemo } from 'react'
import {
  getObjectFields,
  getObjectType,
  normalizeStructTag,
} from '@mysten/sui.js'

export const useGetAllStake = (address?: string | null) => {
  const rpc = useRpc()
  return useQuery(
    ['Stake'],
    async () => {
      const res = await rpc.getOwnedObjects({
        owner: address!,
        filter: {
          MatchAll: [{ StructType: `${vote_package}::gauge::Stake` }],
        },
        options: { showType: true, showContent: true },
      })

      if (res.data.length == 0) return []

      return res.data.map((stake) => {
        const { id, stakes, pending_sdb } = getObjectFields(stake) as any
        const type = getObjectType(stake)

        const [X, Y] =
          type
            ?.slice(type.indexOf('<') + 1, type.indexOf('>'))
            .split(',')
            .map((t) => t.trim()) ?? []

        return {
          id: id.id,
          type_x: normalizeStructTag(X),
          type_y: normalizeStructTag(Y),
          stakes,
          pending_sdb,
        } as Stake
      })
    },
    {
      enabled: !!address,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}
export const useGetStake = (
  address: string | null,
  type_x?: string,
  type_y?: string,
) => {
  const stakes = useGetAllStake(address)

  return useMemo(() => {
    if (!stakes?.data) return undefined
    return (
      stakes?.data.find(
        (stake) => stake.type_x == type_x && stake.type_y == type_y,
      ) ?? null
    )
  }, [stakes])
}
