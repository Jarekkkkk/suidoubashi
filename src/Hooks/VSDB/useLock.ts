import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation } from '@tanstack/react-query'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
} from '@mysten/sui.js'
import {  lock } from '@/Constants/API/vsdb'
import { queryClient } from '@/App'
import { get_vsdb_key } from './useGetVSDB'
import { Coin } from '@/Constants/coin'
import { useGetCoins } from '../Coin/useGetCoins'
import { payCoin } from '@/Utils/payCoin'
import useGetBalance from '../Coin/useGetBalance'

type MutationProps = {
  vsdb: string
  depositValue: string
  extended_duration: string
}

export const useLock = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()
  const sdb_coins = useGetCoins(Coin.SDB, currentAccount?.address)
  const sdb_balance = useGetBalance(Coin.SDB, currentAccount?.address)

  return useMutation({
    mutationFn: async ({ vsdb, depositValue,extended_duration }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')
      if(!sdb_coins?.data?.pages || sdb_coins?.hasNextPage) throw new Error("getting Coins")
      if(!sdb_balance?.data?.totalBalance ) throw new Error("getting balance")
      if(BigInt(depositValue) > BigInt(sdb_balance.data.totalBalance)) throw new Error("Insufficient SDB balance")

      const txb = new TransactionBlock()
      const coin_sdb = payCoin(
        txb,
        sdb_coins.data.pages[0],
        1000000000000,
        false,
      )
      lock(txb, coin_sdb, extended_duration)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Vesting Vsdb Tx fail')
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
