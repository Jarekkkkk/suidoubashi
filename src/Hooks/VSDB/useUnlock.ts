import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation } from '@tanstack/react-query'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { queryClient } from '@/App'
import { get_vsdb_key } from './useGetVSDB'
import { unlock } from '@/Constants/API/vsdb'

type MutationProps = {
  vsdb: string
}

export const useUnlock = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      unlock(txb, vsdb)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Increase Unlock Amount tx fail')
      }

      console.log(res)
      return vsdb
    },
    onSuccess: (_, params) => {
      queryClient.setQueryData(
        ['get-vsdbs', currentAccount!.address],
        (vsdb_ids?: string[]) =>
          [...(vsdb_ids ?? [])].filter((id) => id !== params.vsdb),
      )
      queryClient.removeQueries({
        queryKey: get_vsdb_key(currentAccount!.address, params.vsdb),
      })
    },
    onError: (err: Error) => console.error(err),
  })
}