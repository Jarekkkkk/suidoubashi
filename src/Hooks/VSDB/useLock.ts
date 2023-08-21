import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation } from '@tanstack/react-query'
import {
  TransactionBlock,
  getExecutionStatusType,
  getObjectChanges,
  SuiObjectChangeCreated,
} from '@mysten/sui.js'
import { lock, vsdb_package } from '@/Constants/API/vsdb'
import { queryClient } from '@/App'
import { Coin } from '@/Constants/coin'
import { get_coins_key } from '../Coin/useGetCoins'
import { payCoin } from '@/Utils/payCoin'
import { get_balance_key } from '../Coin/useGetBalance'

type MutationProps = {
  deposit_value: string
  extended_duration: string
}

export const useLock = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ deposit_value, extended_duration }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      // should refacotr

      const txb = new TransactionBlock()
      const sdb_coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: Coin.SDB,
      })
      const coin_sdb = payCoin(txb, sdb_coins, deposit_value, false)
      lock(txb, coin_sdb, extended_duration)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: {
          showObjectChanges: true,
        },
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Vesting Vsdb Tx fail')
      }

      return getObjectChanges(res)?.find(
        (obj) =>
          obj.type == 'created' &&
          obj.objectType == `${vsdb_package}::vsdb::Vsdb`,
      ) as SuiObjectChangeCreated
    },
    onSuccess: (new_vsdb) => {
      queryClient.setQueryData(
        ['get-vsdbs', currentAccount!.address],
        (vsdb_ids?: string[]) => [...(vsdb_ids ?? []), new_vsdb.objectId],
      )
      queryClient.invalidateQueries({
        queryKey: get_coins_key(currentAccount!.address, Coin.SDB),
      })
      queryClient.invalidateQueries({
        queryKey: get_balance_key(Coin.SDB, currentAccount!.address),
      })
    },
    onError: (err: Error) => console.error(err),
  })
}
