import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { claim_rewards, delete_stake, unstake } from '@/Constants/API/vote'
import { SettingInterface } from '@/Components/SettingModal'

type UnstakeArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  gauge_id: string
  lp_id: string
  stake_id: string
  value: string
}

export const useUnStake = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      pool_id,
      pool_type_x,
      pool_type_y,
      gauge_id,
      stake_id,
      lp_id,
      value,
    }: UnstakeArgs) => {
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
        stake_id,
        value,
      )
      claim_rewards(txb, gauge_id, stake_id, pool_type_x, pool_type_y)
      delete_stake(txb, stake_id, pool_type_x, pool_type_y)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Tx Failed')
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['pool', params.pool_id])
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['Stake'])
      toast.success('Unstake Liquidity Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
