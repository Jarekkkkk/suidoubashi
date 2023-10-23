import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
  getExecutionStatusError,
} from '@mysten/sui.js'
import { revive } from '@/Constants/API/vsdb'
import { queryClient } from '@/App'
import { check_network } from '@/Utils'
import { SettingInterface } from '@/Components/SettingModal'

type MutationProps = {
  vsdb: string
  extended_duration: string
}

export const useRevive = (setting: SettingInterface) => {
  const rpc = useRpc()

  const { signTransactionBlock, currentAccount } = useWalletKit()
  return useMutation({
    mutationFn: async ({ vsdb, extended_duration }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))
      revive(txb, vsdb, extended_duration)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: { showEffects: true },
      })

      if (getExecutionStatusType(res) == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          if (err == 'InsufficientGas') throw new Error('InsufficientGas')
        }
        throw new Error('Revive tx fail')
      }
      return 'success'
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['balance'])
      toast.success('Revive VSDB NFT successfully!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
