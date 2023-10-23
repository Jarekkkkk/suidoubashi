import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import {
  Gauge,
  Stake,
  get_pending_sdb,
  vote_package,
} from '@/Constants/API/vote'
import { useMemo } from 'react'
import {
  getObjectFields,
  getObjectType,
  normalizeStructTag,
} from '@mysten/sui.js'

export const useGetAllStake = (
  address?: string | null,
  gauges?: Gauge[] | null,
  isLoading?: boolean,
) => {
  const rpc = useRpc()
  return useQuery(
    ['Stake', address],
    async () => {
      const res = await rpc.getOwnedObjects({
        owner: address!,
        filter: {
          MatchAll: [{ StructType: `${vote_package}::gauge::Stake` }],
        },
        options: { showType: true, showContent: true },
      })
      if (res.data.length == 0 || !gauges) return []

      const stake = res.data.map((stake) => {
        let { id, stakes } = getObjectFields(stake) as any
        const type = getObjectType(stake)

        const [X, Y] =
          type
            ?.slice(type.indexOf('<') + 1, type.indexOf('>'))
            .split(',')
            .map((t) => normalizeStructTag(t.trim())) ?? []
        return {
          id: id.id,
          type_x: X,
          type_y: Y,
          stakes,
          pending_sdb: '0',
        } as Stake
      })

      Promise.all(
        stake.map(async (stake) => {
          const gauge = gauges.find(
            (g) => g.type_x == stake.type_x && g.type_y == stake.type_y,
          )
          if (gauge) {
            return await get_pending_sdb(
              rpc,
              address!,
              gauge.id,
              stake.id,
              stake.type_x,
              stake.type_y,
            )
          }
          return '0'
        }),
      ).then((data) =>
        data.forEach(
          (pending_sdb, idx) => (stake[idx].pending_sdb = pending_sdb),
        ),
      )
      return stake
    },
    {
      enabled: !!address && !!gauges?.length && !isLoading,
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
