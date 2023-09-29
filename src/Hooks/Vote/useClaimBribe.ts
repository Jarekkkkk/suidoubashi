import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import { claim_bribes } from '@/Constants/API/vote'

type MutationArgs = {
  bribe: string
  rewards: string
  vsdb: string
  type_x: string
  type_y: string
  input_types: string[]
}

export const useClaimBribes = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      bribe,
      rewards,
      vsdb,
      type_x,
      type_y,
      input_types,
    }: MutationArgs) => {
      if (!currentAccount) throw new Error('no Wallet Account')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      for (const type of input_types) {
        claim_bribes(txb, bribe, rewards, vsdb, type_x, type_y, type)
      }
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Tx Failed')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['balance'])
      toast.success('Votes Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
