import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  TransactionBlock,
  getExecutionStatus,
  getExecutionStatusError,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import { claim_rewards } from '@/Constants/API/vote'
import { check_network } from '@/Utils'

type MutationArgs = {
  gauge_id: string
  stake_id: string
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
      stake_id,
      gauge_type_y,
      gauge_type_x,
    }: MutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      claim_rewards(txb, gauge_id, stake_id, gauge_type_x, gauge_type_y)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: { showEffects: true },
      })

      if (getExecutionStatus(res)?.status == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          if (err == 'InsufficientGas') throw new Error('InsufficientGas')
        }
        throw new Error('Claim Rewards Tx Failed')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['balance'])
      queryClient.invalidateQueries(['Stake'])
      toast.success('Claim SDB rewards Successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
