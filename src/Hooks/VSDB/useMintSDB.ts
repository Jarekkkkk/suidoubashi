import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import {
  TransactionBlock,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { Coin } from '@/Constants/coin'
import { useWalletKit } from '@mysten/wallet-kit'
import { mint_sdb } from '@/Constants/API/vsdb'
import { queryClient } from '@/App'
import { get_balance_key } from '../Coin/useGetBalance'

export const useMintSDB = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()
  return useMutation({
    mutationFn: async () => {
      if (!currentAccount?.address) throw new Error('no wallet address')

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

      console.log(res)
      return 'success'
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: get_balance_key(Coin.SDB, currentAccount!.address)
      })
    },
    onError: (err: Error) => console.error(err),
  })
}
