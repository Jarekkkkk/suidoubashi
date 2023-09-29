import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { queryClient } from '@/App'
import { merge } from '@/Constants/API/vsdb'

type MutationProps = {
  vsdb: string
  mergedVsdb: string
}

export const useMerge = (setIsShowMergeVSDBModal: Function) => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb, mergedVsdb }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!isValidSuiObjectId(vsdb) || !isValidSuiObjectId(mergedVsdb))
        throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      merge(txb, vsdb, mergedVsdb)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Increase Unlock Amount tx fail')
      }

      return mergedVsdb
    },
    onSuccess: (_, params) => {
      queryClient.setQueryData(
        ['get-vsdbs'],
        (vsdb_ids?: string[]) =>
          [...(vsdb_ids ?? [])].filter((id) => id !== params.mergedVsdb),
      )

      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['vsdb', params.mergedVsdb])
      toast.success('Merge VSDB Successfully!')
    },
    onError: (_err: Error) => toast.error('Oops! Have some error'),
  })
}
