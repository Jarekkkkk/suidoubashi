import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useMemo } from 'react'
import { Gauge, Rewards, get_rewards } from '@/Constants/API/vote'
import { useWalletKit } from '@mysten/wallet-kit'

export const useGetMulRewards = (
  rewards_ids: null | string[],
  gaugeIsLoading: boolean,
) => {
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()
  const rewards = useQueries({
    queries:
      rewards_ids?.map((id) => {
        return {
          queryKey: ['rewards', id],
          queryFn: () => get_rewards(rpc, currentAccount!.address, id),
          enabled: !!id && !!currentAccount?.address && !gaugeIsLoading,
          retry: false,
        }
      }) ?? [],
  })
  return useMemo(() => {
    if (!rewards_ids) return { isLoading: true, data: null }
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
  rewards_ids: any,
  type_x?: string,
  type_y?: string,
) => {
  const { data: rewards } = useGetMulRewards(rewards_ids)

  return useMemo(
    () =>
      rewards?.find((g) => g.type_x == type_x && g.type_y == type_y) ?? null,
    [rewards],
  )
}
