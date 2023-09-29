import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import { claim_rewards } from '@/Constants/API/vote'

type MutationArgs = {
  gauge_id: string
  gauge_type_x: string
  gauge_type_y: string
}

export const useClaimRewards = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      gauge_id,
      gauge_type_y,
      gauge_type_x,
    }: MutationArgs) => {
      if (!currentAccount) throw new Error('no Wallet Account')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      claim_rewards(txb, gauge_id, gauge_type_x, gauge_type_y)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Tx Failed')
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['balance'])
      queryClient.invalidateQueries(['stake', params.gauge_id])
      toast.success('Votes Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
