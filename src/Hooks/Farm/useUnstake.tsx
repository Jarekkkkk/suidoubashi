import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { unstake_all } from '@/Constants/API/farm'
import { toast } from 'react-hot-toast'

type Unstakefarmmutationargs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  farm_id: string
  lp_id: string
}

export const useUnStakeFarm = () => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      pool_id,
      pool_type_x,
      pool_type_y,
      farm_id,
      lp_id,
    }: Unstakefarmmutationargs) => {
      if (!currentAccount) throw new Error('no Wallet Account')

      const txb = new TransactionBlock()
      unstake_all(txb, farm_id, pool_id, pool_type_x, pool_type_y, lp_id)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Tx Failed')
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['farm', params.farm_id])
      queryClient.invalidateQueries(['stake-balance', params.farm_id])
      toast.success('Unstake Liquidity Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
