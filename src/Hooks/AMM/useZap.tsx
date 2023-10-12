import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  TransactionBlock,
  getExecutionStatusError,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { payCoin } from '@/Utils/payCoin'
import {
  create_lp,
  get_output,
  zap_optimized_input_,
  zap_x,
  zap_y,
} from '@/Constants/API/pool'
import { SettingInterface } from '@/Components/SettingModal'
import { extract_err_message } from '@/Utils'

type ZapMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  reserve_x: string
  reserve_y: string
  stable: boolean
  fee: string
  lp_id: string | null
  input_type: string
  input_value: string
}

export const useZap = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      pool_id,
      pool_type_x,
      pool_type_y,
      reserve_x,
      reserve_y,
      stable,
      fee,
      lp_id,
      input_type,
      input_value,
    }: ZapMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      // coin_x
      const coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: input_type,
      })
      const coin = payCoin(txb, coins, input_value, input_type)

      const swapped_x = stable
        ? BigInt(input_value) / BigInt(2)
        : zap_optimized_input_(
            pool_type_x === input_type ? reserve_x : reserve_y,
            input_value,
            fee,
          )

      const output = await get_output(
        rpc,
        currentAccount.address,
        pool_id,
        pool_type_x,
        pool_type_y,
        input_type,
        swapped_x,
      )

      const deposit_x_min =
        (BigInt(Math.round(1000 - parseFloat(setting.slippage) * 10)) *
          (BigInt(input_value) - swapped_x)) /
        BigInt('1000')

      const deposit_y_min =
        (BigInt(Math.round(1000 - parseFloat(setting.slippage) * 10)) *
          BigInt(output)) /
        BigInt('1000')

      // LP
      let lp = lp_id
        ? txb.object(lp_id)
        : create_lp(txb, pool_id, pool_type_x, pool_type_y)
      if (pool_type_x === input_type) {
        zap_x(txb, pool_id, pool_type_x, pool_type_y, coin, lp, 0, 0)
      } else {
        zap_y(txb, pool_id, pool_type_x, pool_type_y, coin, lp, 0, 0)
      }

      if (lp_id == null) {
        txb.transferObjects([lp], txb.pure(currentAccount.address))
      }

      const signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: { showEffects: true },
      })

      if (getExecutionStatusType(res) == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          const code = extract_err_message(err)
          if (code == '103') throw new Error('Slippage Error')
        }
        throw new Error('Zap Liquidity Tx fail')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['balance'])
      queryClient.invalidateQueries(['pool', params.pool_id])
      toast.success('Success!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
