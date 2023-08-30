import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  SuiObjectChangeCreated,
  TransactionBlock,
  getExecutionStatusType,
  getObjectChanges,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { payCoin } from '@/Utils/payCoin'
import { add_liquidity, amm_package, create_lp } from '@/Constants/API/pool'
import { queryClient } from '@/App'
import { SettingInterface } from '@/Components/SettingModal'

type AddLiquidityMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  lp_id: string | null
  input_x_value: string
  input_y_value: string
}

export const useAddLiquidity = () => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()
  // TODO
  const setting: SettingInterface = {
    gasBudget: '1000000',
    expiration: '30',
    slippage: '200',
  }

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
      const txb = new TransactionBlock()

      // coin_x
      const coins_x = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: pool_type_x,
      })
      const coin_x = payCoin(txb, coins_x, input_x_value, pool_type_x)
      const deposit_x_min =
        ((BigInt('10000') - BigInt(setting.slippage)) * BigInt(input_x_value)) /
        BigInt('10000')
      // coni_y
      const coins_y = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: pool_type_y,
      })
      const coin_y = payCoin(txb, coins_y, input_y_value, pool_type_y)
      const deposit_y_min =
        ((BigInt('10000') - BigInt(setting.slippage)) * BigInt(input_y_value)) /
        BigInt('10000')
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
          showObjectChanges: true,
          showEvents: true,
        },
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Vesting Vsdb Tx fail')
      }

      return getObjectChanges(res)?.find(
        (obj) =>
          obj.type == 'created' && obj.objectType == `${amm_package}::pool::LP`,
      ) as SuiObjectChangeCreated
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['pool', params.pool_id])
      toast.success('Add Liquidity Success!')
    },
    onError: (_err: Error) => {
      console.log(_err)
      toast.error('Oops! Have some error')
    },
  })
}
