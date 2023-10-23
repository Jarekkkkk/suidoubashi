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
import { queryClient } from '@/App'
import { merge } from '@/Constants/API/vsdb'
import { check_network } from '@/Utils'

type MutationProps = {
  vsdb: string
  mergedVsdb: string
}

export const useMerge = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb, mergedVsdb }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      if (!isValidSuiObjectId(vsdb) || !isValidSuiObjectId(mergedVsdb))
        throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      merge(txb, vsdb, mergedVsdb)
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
        throw new Error('Merge tx fail')
      }

      return mergedVsdb
    },
    onSuccess: (_, params) => {
      queryClient.setQueryData(['get-vsdbs'], (vsdb_ids?: string[]) =>
        [...(vsdb_ids ?? [])].filter((id) => id !== params.mergedVsdb),
      )

      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['vsdb', params.mergedVsdb])
      toast.success('Merge VSDB Successfully!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
