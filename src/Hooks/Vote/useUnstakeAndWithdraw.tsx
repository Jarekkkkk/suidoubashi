import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { quote_remove_liquidity, remove_liquidity } from '@/Constants/API/pool'
import { unstake } from '@/Constants/API/vote'
import { SettingInterface } from '@/Components/SettingModal'

type MutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  gauge_id: string
  lp_id: string
  withdrawl: string
}

export const useUnStakeAndWithdraw = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      pool_id,
      pool_type_x,
      pool_type_y,
      gauge_id,
      lp_id,
      withdrawl,
    }: MutationArgs) => {
      if (!currentAccount) throw new Error('no Wallet Account')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))
      unstake(
        txb,
        gauge_id,
        pool_id,
        pool_type_x,
        pool_type_y,
        lp_id,
        withdrawl,
      )
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

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Tx Failed')
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['gauge', params.gauge_id])
      queryClient.invalidateQueries(['stake', params.gauge_id])
      toast.success('Unstake Liquidity Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
