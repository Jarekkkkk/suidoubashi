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
import { increase_unlock_amount } from '@/Constants/API/vsdb'
import { get_coins_key } from '../Coin/useGetCoins'
import { Coin } from '@/Constants/coin'
import { payCoin } from '@/Utils/payCoin'
import { get_balance_key } from '../Coin/useGetBalance'

type MutationProps = {
  vsdb: string
  depositValue: string
}

export const useIncreaseUnlockAmount = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb, depositValue }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      const sdb_coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: Coin.SDB,
      })
      const sdb = payCoin(txb, sdb_coins, depositValue, false)
      increase_unlock_amount(txb, vsdb, sdb)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Increase Unlock Amount tx fail')
      }

      return "success"
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: get_vsdb_key(currentAccount!.address, params.vsdb),
      })
      queryClient.invalidateQueries({
        queryKey: get_balance_key(Coin.SDB, currentAccount!.address),
      })
    },
    onError: (err: Error) => console.error(err),
  })
}
