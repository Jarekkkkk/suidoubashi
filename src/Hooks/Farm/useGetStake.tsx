import { useQuery } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { get_farm_stake_balance } from '@/Constants/API/farm'
import { useWalletKit } from '@mysten/wallet-kit'

export const useGetStake = (
  farm_id?: string,
  type_x?: string,
  type_y?: string,
  lp_id?: string,
) => {
  const rpc = useRpc()
  const { currentAccount } = useWalletKit()
  const address = currentAccount?.address
  return useQuery(
    ['stake-balance', farm_id],
    () => get_farm_stake_balance(rpc, address!, farm_id!, type_x!, type_y!, lp_id!),
    {
      staleTime: 10 * 1000,
      enabled: !!address && !!rpc && !!farm_id && !!lp_id,
    },
  )
}
