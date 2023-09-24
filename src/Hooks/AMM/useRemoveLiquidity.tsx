import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatusType } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import {
  delete_lp,
  quote_remove_liquidity,
  remove_liquidity,
} from '@/Constants/API/pool'
import { queryClient } from '@/App'
import { SettingInterface } from '@/Components/SettingModal'

type MutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  lp_id: string
  withdrawl: string
}

export const useRemoveLiquidity = (setting: SettingInterface) => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      pool_id,
      pool_type_x,
      pool_type_y,
      lp_id,
      withdrawl,
    }: MutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      // should refacotr
      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      const quote = await quote_remove_liquidity(
        rpc,
        currentAccount.address,
        pool_id,
        pool_type_x,
        pool_type_y,
        withdrawl,
      )

      const lp = txb.object(lp_id)

      remove_liquidity(
        txb,
        pool_id,
        pool_type_x,
        pool_type_y,
        lp,
        withdrawl,
        quote[0],
        quote[1],
      )

      // LP should withdraw all the fee revenue before burn it
      delete_lp(txb, lp, pool_type_x, pool_type_y)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Vesting Vsdb Tx fail')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries()
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['pool', params.pool_id])
      toast.success('Remove Liquidity Success!')
    },
    onError: (err: Error) => {
      console.error(err)
      toast.error('Oops! Have some error')
    },
  })
}
