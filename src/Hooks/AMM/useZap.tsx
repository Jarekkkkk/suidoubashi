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
import { create_lp, zap_x, zap_y } from '@/Constants/API/pool'
import { SettingInterface } from '@/Components/SettingModal'
import { check_network, extract_err_message } from '@/Utils'

type ZapMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
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
      lp_id,
      input_type,
      input_value,
    }: ZapMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      // coin_x
      const coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: input_type,
      })
      const coin = payCoin(txb, coins, input_value, input_type)

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
      toast.success('Zap liquidity successfully!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
