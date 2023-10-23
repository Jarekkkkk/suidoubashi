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
import { claim_bribes } from '@/Constants/API/vote'
import { check_network } from '@/Utils'

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
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      for (const type of input_types) {
        claim_bribes(txb, bribe, rewards, vsdb, type_x, type_y, type)
      }
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
        throw new Error('Claim Bribe Tx Failed')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['balance'])
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      toast.success('Claim Bribes Successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
