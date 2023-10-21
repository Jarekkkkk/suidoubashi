import { getObjectFields } from '@mysten/sui.js'
import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useMemo } from 'react'
import { gauges_df_id, get_gauges } from '@/Constants/API/vote'

export function useGetGaugeIDs() {
  const rpc = useRpc()
  return useQuery(
    ['get-gauge-ids'],
    async () => {
      const gauges_ = await rpc.getDynamicFields({
        parentId: gauges_df_id,
      })

      const promises = gauges_.data.map((df) =>
        rpc.getDynamicFieldObject({ parentId: gauges_df_id, name: df.name }),
      )

      return (await Promise.all(promises)).map(
        (gauge) => getObjectFields(gauge)?.value as string,
      )
    },
    {
      staleTime: 24 * 60 * 60 * 1000,
      cacheTime: 24 * 60 * 60 * 1000,
      enabled: !!gauges_df_id,
    },
  )
}

export const useGetAllGauge = () => {
  const rpc = useRpc()
  const { data: gauge_ids } = useGetGaugeIDs()
  return useQuery(['gauges'], async () => get_gauges(rpc, gauge_ids!), {
    staleTime: 24 * 60 * 60 * 1000,
    cacheTime: 24 * 60 * 60 * 1000,
    enabled: !!gauge_ids,
  },)
}

export const useGetGauge = (type_x?: string, type_y?: string) => {
  const { data: gauges } = useGetAllGauge()
  return useMemo(
    () => gauges?.find((g) => g.type_x == type_x && g.type_y == type_y) ?? null,
    [gauges],
  )
}
