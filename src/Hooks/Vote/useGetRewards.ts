import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useMemo } from 'react'
import { Gauge, Rewards, get_bribes, get_rewards } from '@/Constants/API/vote'

export const useGetAllRewards = (
  gauges: null | Gauge[] | undefined,
) => {
  const rpc = useRpc()
  return useQuery(['rewards'], async () => get_rewards(rpc, gauges!), {
    enabled: !!gauges,
  },)
}

export const useGetRewards = (
  gauges: null | Gauge[],
  type_x?: string,
  type_y?: string,
) => {
  const { data: rewards } = useGetAllRewards(gauges)
  return useMemo(
    () =>
      rewards?.find((g) => g.type_x == type_x && g.type_y == type_y) ?? null,
    [rewards],
  )
}

export const useGetBribeRewards = (
  gauges?: Gauge[],
  rewards?: Rewards[]
) => {
  const rpc = useRpc()
  return useQuery(["rewards-bribe"], async () => get_bribes(rpc, rewards!, gauges!), {
    enabled: !!gauges && !!rewards
  },)
}
