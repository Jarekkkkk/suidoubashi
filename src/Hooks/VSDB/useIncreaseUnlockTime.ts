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
import { get_vsdb_key } from './useGetVSDB'

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
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      increase_unlock_time(txb, vsdb, extended_duration)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Mint SDB tx fail')
      }

      return 'success'
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: get_vsdb_key(currentAccount!.address, params.vsdb),
      })
      toast.success('Deposit VSDB Success!')
      setIsShowDepositVSDBModal(false)
    },
    onError: (err: Error) => toast.error('Oops! Have some error'),
  })
}
