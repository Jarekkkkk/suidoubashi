import { useQueries } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useMemo } from 'react'
import { Gauge, Rewards, get_rewards } from '@/Constants/API/vote'
import { useWalletKit } from '@mysten/wallet-kit'

export const useGetMulRewards = (
  gauges: null | Gauge[],
  gaugeIsLoading: boolean,
) => {
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()
  const rewards = useQueries({
    queries:
      gauges?.map((gauge) => {
        return {
          queryKey: ['rewards', gauge.rewards],
          queryFn: () => get_rewards(rpc, currentAccount!.address, gauge),
          enabled: !!gauge && !!currentAccount?.address && !gaugeIsLoading,
        }
      }) ?? [],
  })
  return useMemo(() => {
    if (!gauges) return { isLoading: true, data: null }
    if (rewards.length == 0) return { isLoading: false, data: [] }

    const isLoading = rewards.some((v) => v.isLoading)
    const ret: Rewards[] = []

    rewards.forEach(({ data }) => {
      if (!data) return { isLoading, data: [] }
      ret.push(data)
    })
    return { isLoading, data: ret.length ? ret : [] }
  }, [rewards])
}

export const useGetRewards = (
  gauges: null | Gauge[],
  gaugeIsLoading: boolean,
  type_x?: string,
  type_y?: string,
) => {
  const { data: rewards } = useGetMulRewards(gauges, gaugeIsLoading)
  return useMemo(
    () =>
      rewards?.find((g) => g.type_x == type_x && g.type_y == type_y) ?? null,
    [rewards],
  )
}
