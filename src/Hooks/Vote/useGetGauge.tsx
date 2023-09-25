import { getObjectFields } from '@mysten/sui.js'
import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useMemo } from 'react'
import { Gauge, gauges_df_id, get_gauge } from '@/Constants/API/vote'

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

export const useGetMulGauge = () => {
  const rpc = useRpc()
  const {data: gauge_ids} = useGetGaugeIDs()
  const gauges = useQueries({
    queries:
      gauge_ids?.map((id) => {
        return {
          queryKey: ['gauge', id],
          queryFn: () => get_gauge(rpc, id!),
          enabled: !!id,
        }
      }) ?? [],
  })
  return useMemo(() => {
    if (!gauge_ids) return { isLoading: true, data: null }
    if (gauges.length == 0) return { isLoading: false, data: [] }

    const isLoading = gauges.some((v) => v.isLoading)
    const ret: Gauge[] = []

    gauges.forEach(({ data }) => {
      if (!data) return { isLoading, data: [] }
      ret.push(data)
    })
    return { isLoading, data: ret.length ? ret : [] }
  }, [gauges])
}

export const useGetGauge = (type_x?: string, type_y?: string) => {
  const { data: gauge_ids } = useGetGaugeIDs()
  const { data: gauges } = useGetMulGauge(gauge_ids)

  return useMemo(
    () => gauges?.find((g) => g.type_x == type_x && g.type_y == type_y) ?? null,
    [gauge_ids, gauges],
  )
}
