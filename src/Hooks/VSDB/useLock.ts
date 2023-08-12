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
import { get_coins_key, useGetCoins } from '../Coin/useGetCoins'
import { payCoin } from '@/Utils/payCoin'
import useGetBalance, { get_balance_key } from '../Coin/useGetBalance'

type MutationProps = {
  depositValue: string
  extended_duration: string
}

export const useLock = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()
  const sdb_coins = useGetCoins(Coin.SDB, currentAccount?.address)
  const sdb_balance = useGetBalance(Coin.SDB, currentAccount?.address)

  return useMutation({
    mutationFn: async ({ depositValue, extended_duration }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      // shoueld refatorc
      if (!sdb_coins?.data?.pages || sdb_coins?.hasNextPage)
        throw new Error('getting Coins')
      if (!sdb_balance?.data?.totalBalance) throw new Error('getting balance')
      if (BigInt(depositValue) > BigInt(sdb_balance.data.totalBalance))
        throw new Error('Insufficient SDB balance')

      const txb = new TransactionBlock()
      const coin_sdb = payCoin(
        txb,
        sdb_coins.data.pages[0],
        depositValue,
        false,
      )
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
