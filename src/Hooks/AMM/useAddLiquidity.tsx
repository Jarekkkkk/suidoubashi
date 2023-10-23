import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  TransactionBlock,
  getExecutionStatusError,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { payCoin } from '@/Utils/payCoin'
import { add_liquidity, create_lp } from '@/Constants/API/pool'
import { queryClient } from '@/App'
import { SettingInterface } from '@/Components/SettingModal'
import { check_network, extract_err_message } from '@/Utils'

type AddLiquidityMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  lp_id: string | null
  input_x_value: string
  input_y_value: string
}

export const useAddLiquidity = (setting: SettingInterface) => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      pool_id,
      pool_type_x,
      pool_type_y,
      lp_id,
      input_x_value,
      input_y_value,
    }: AddLiquidityMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      // coin_x
      const coins_x = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: pool_type_x,
      })
      const coin_x = payCoin(txb, coins_x, input_x_value, pool_type_x)
      // coni_y
      const coins_y = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: pool_type_y,
      })
      const coin_y = payCoin(txb, coins_y, input_y_value, pool_type_y)

      const deposit_x_min =
        (BigInt(Math.round(1000 - parseFloat(setting.slippage) * 10)) *
          BigInt(input_x_value)) /
        BigInt('1000')

      const deposit_y_min =
        (BigInt(Math.round(1000 - parseFloat(setting.slippage) * 10)) *
          BigInt(input_y_value)) /
        BigInt('1000')

      // LO
      let lp = lp_id
        ? txb.pure(lp_id)
        : create_lp(txb, pool_id, pool_type_x, pool_type_y)

      add_liquidity(
        txb,
        pool_id,
        pool_type_x,
        pool_type_y,
        coin_x,
        coin_y,
        lp,
        deposit_x_min,
        deposit_y_min,
      )
      // return id first time deposit
      if (lp_id == null) {
        txb.transferObjects([lp], txb.pure(currentAccount.address))
      }

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: {
          showEffects: true,
        },
      })

      if (getExecutionStatusType(res) == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          if (err == 'InsufficientGas') throw new Error('InsufficientGas')
          const code = extract_err_message(err)
          if (code == '103') throw new Error('Slippage Error')
        }
        throw new Error('Add Liquidity Tx fail')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['pool', params.pool_id])
      queryClient.invalidateQueries(['balance'])
      toast.success('Adding Liquidity Successfully!')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
