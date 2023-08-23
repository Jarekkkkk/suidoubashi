import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { get_vsdb_key } from './useGetVSDB'
import { increase_unlock_amount } from '@/Constants/API/vsdb'
import { Coin } from '@/Constants/coin'
import { payCoin } from '@/Utils/payCoin'
import { Balance } from '../Coin/useGetBalance'

type MutationProps = {
  vsdb: string
  depositValue: string
}

export const useIncreaseUnlockAmount = (
  setIsShowDepositVSDBModal: Function,
) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
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
        options: { showBalanceChanges: true },
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Increase Unlock Amount tx fail')
      }

      if(!res.balanceChanges) throw new Error("no balance changes")
      return res.balanceChanges
    },
    onSuccess: (balanceChanges, params) => {
      queryClient.invalidateQueries({
        queryKey: get_vsdb_key(currentAccount!.address, params.vsdb),
      })
      queryClient.setQueryData(['balance'], (balances?: Balance[]) => {
        if (!balances) return []
        balanceChanges?.forEach((bal) => {
          const balance = balances.find((b) => b.coinType == bal.coinType)
          if (balance)
            balance.totalBalance = (
              BigInt(balance.totalBalance) + BigInt(bal.amount)
            ).toString()
        })
        return [...balances]
      })
      setIsShowDepositVSDBModal(false)
    },
    onError: (err: Error) => console.error(err),
  })
}
