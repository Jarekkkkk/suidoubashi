import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import {
  TransactionBlock,
  getExecutionStatusType,
  isValidSuiAddress,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { useWalletKit } from '@mysten/wallet-kit'
import { mint_sdb } from '@/Constants/API/vsdb'

export const useMintSDB = () => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()
  return useMutation({
    mutationFn: async () => {
      if (
        !currentAccount?.address ||
        !isValidSuiAddress(currentAccount.address)
      )
        throw new Error('no wallet address')

      const txb = new TransactionBlock()
      mint_sdb(txb, currentAccount.address)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Mint SDB tx fail')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['balance'])
      toast.success('Mint 100 SDB Successfully!')
    },
    onError: (_: Error) => toast.error('Oops! Have some error'),
  })
}
