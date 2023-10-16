import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { create_stake, stake_all } from '@/Constants/API/vote'
import { SettingInterface } from '@/Components/SettingModal'

type StakeFarmMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  gauge_id: string
  lp_id: string
  stake_id: string | null
}

export const useStake = (setting: SettingInterface) => {
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
      stake_id,
    }: StakeFarmMutationArgs) => {
      if (!currentAccount) throw new Error('no Wallet Account')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      let stake = stake_id
        ? txb.pure(stake_id)
        : create_stake(txb, gauge_id, pool_type_x, pool_type_y)

      stake_all(
        txb,
        gauge_id,
        pool_id,
        pool_type_x,
        pool_type_y,
        txb.object(lp_id),
        stake,
      )

      if (stake_id == null) {
        txb.transferObjects([stake], txb.pure(currentAccount.address))
      }

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
      queryClient.invalidateQueries(['Stake'])
      toast.success('Stake Liquidity Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
