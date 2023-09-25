import { useQueries, useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { Gauge, Stake, get_stake_balance } from '@/Constants/API/vote'
import { useMemo } from 'react'

export const useGetMulStake = (gauges?: Gauge[] | null) => {
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()
  const stakes = useQueries({
    queries:
      gauges?.map((gauge) => {
        return {
          queryKey: ['stake', gauge!.id],
          queryFn: () =>
            get_stake_balance(
              rpc,
              currentAccount!.address,
              gauge!.id,
              gauge!.type_x,
              gauge!.type_y,
            ),
          enabled: !!gauge?.id && !!currentAccount?.address,
        }
      }) ?? [],
  })
  return useMemo(() => {
    if (!gauges) return { isLoading: true, data: null }
    if (stakes.length == 0) return { isLoading: false, data: [] }

    const isLoading = stakes.some((v) => v.isLoading)
    const ret: Stake[] = []

    stakes.forEach(({ data }, idx) => {
      if (!data) return { isLoading, data: [] }
      ret.push({
        type_x: gauges[idx].type_x,
        type_y: gauges[idx].type_y,
        stakes: data,
      })
    })
    return { isLoading, data: ret.length ? ret : [] }
  }, [stakes])
}

export const useGetStake = (
  gauge_id?: string,
  type_x?: string,
  type_y?: string,
  lp_id?: string,
) => {
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()
  const address = currentAccount?.address
  return useQuery(
    ['stake', gauge_id],
    () => get_stake_balance(rpc, address!, gauge_id!, type_x!, type_y!),
    {
      staleTime: 10 * 1000,
      enabled: !!address && !!rpc && !!gauge_id && !!lp_id,
    },
  )
}
