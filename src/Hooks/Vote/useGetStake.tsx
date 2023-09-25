import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { get_stake_balance } from '@/Constants/API/vote'

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
