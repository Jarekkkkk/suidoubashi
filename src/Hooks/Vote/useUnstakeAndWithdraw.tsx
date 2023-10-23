import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  TransactionBlock,
  getExecutionStatus,
  getExecutionStatusError,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import {
  claim_fees_player,
  create_lp,
  delete_lp,
  quote_remove_liquidity,
  remove_liquidity,
} from '@/Constants/API/pool'
import { claim_rewards, delete_stake, unstake } from '@/Constants/API/vote'
import { SettingInterface } from '@/Components/SettingModal'
import { check_network } from '@/Utils'

type MutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  gauge_id: string
  lp_id: string | null
  stake_id: string
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
      stake_id,
      withdrawl,
    }: MutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      let lp = lp_id
        ? txb.object(lp_id)
        : create_lp(txb, pool_id, pool_type_x, pool_type_y)
      unstake(
        txb,
        gauge_id,
        pool_id,
        pool_type_x,
        pool_type_y,
        lp,
        stake_id,
        withdrawl,
      )
      claim_rewards(txb, gauge_id, stake_id, pool_type_x, pool_type_y)
      delete_stake(txb, stake_id, pool_type_x, pool_type_y)
      const quote = await quote_remove_liquidity(
        rpc,
        currentAccount.address,
        pool_id,
        pool_type_x,
        pool_type_y,
        withdrawl,
      )

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
      if (lp_id != null)
        claim_fees_player(txb, pool_id, lp_id, pool_type_x, pool_type_y)

      // LP should withdraw all the fee revenue before burn it
      delete_lp(txb, lp, pool_type_x, pool_type_y)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: { showEffects: true },
      })

      if (getExecutionStatus(res)?.status == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          if (err == 'InsufficientGas') throw new Error('InsufficientGas')
        }
        throw new Error('Unstake & Withdraw Tx Failed')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['gauge', params.gauge_id])
      queryClient.invalidateQueries(['Stake'])
      toast.success('Unstake Liquidity & Withdraw Successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
