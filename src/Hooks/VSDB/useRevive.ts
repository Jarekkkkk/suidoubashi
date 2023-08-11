import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation } from '@tanstack/react-query'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { revive } from '@/Constants/API/vsdb'
import { queryClient } from '@/App'
import { get_vsdb_key } from './useGetVSDB'

type MutationProps = {
  vsdb: string
  withdrawl: string
  extended_duration: string
}

export const useRevive = () => {
  const rpc = useRpc()

  const { signTransactionBlock, currentAccount } = useWalletKit()
  return useMutation({
    mutationFn: async ({
      vsdb,
      withdrawl,
      extended_duration,
    }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      revive(txb, vsdb, withdrawl, extended_duration)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Mint SDB tx fail')
      }

      console.log(res)
      return 'success'
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: get_vsdb_key(currentAccount!.address, params.vsdb),
      })
    },
    onError: (err: Error) => console.error(err),
  })
}