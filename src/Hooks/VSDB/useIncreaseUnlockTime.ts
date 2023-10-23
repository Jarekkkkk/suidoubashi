import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { increase_unlock_time } from '@/Constants/API/vsdb'
import { check_network } from '@/Utils'

type MutationProps = {
  vsdb: string
  extended_duration: string
}

export const useIncreaseUnlockTime = (setIsShowDepositVSDBModal: Function) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()

  const { signTransactionBlock, currentAccount } = useWalletKit()
  return useMutation({
    mutationFn: async ({ vsdb, extended_duration }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      increase_unlock_time(txb, vsdb, extended_duration)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Increase Unlock Time tx fail')
      }

      return 'success'
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      toast.success('Increase lockup duration Successfully!')
      setIsShowDepositVSDBModal(false)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
