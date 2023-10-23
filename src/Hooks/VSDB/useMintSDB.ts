import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import {
  TransactionBlock,
  getExecutionStatusError,
  getExecutionStatusType,
  isValidSuiAddress,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { useWalletKit } from '@mysten/wallet-kit'
import { mint_sdb } from '@/Constants/API/vsdb'
import { check_network } from '@/Utils'

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
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      mint_sdb(txb)
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
        throw new Error('Mint SDB tx fail')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['balance'])
      toast.success('Mint 100 SDB Successfully!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
