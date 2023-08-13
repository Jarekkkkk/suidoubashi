import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  SUI_TYPE_ARG,
  SuiObjectChangeCreated,
  TransactionBlock,
  getExecutionStatusType,
  getObjectChanges,
} from '@mysten/sui.js'
import { payCoin } from '@/Utils/payCoin'
import { add_liquidity } from '@/Constants/API/pool'
import { SettingInterface } from '@/Constants/setting'

type AddLiquidityMutationArgs = {
  pool_id: string
  lp_id: string | null,
  is_type_x: boolean
  coin_x_type: string
  coin_y_type: string
  coin_x_value: string
  coin_y_value: string
}

export const useAddLiquidity = () => {
  const rpc = useRpc()
  console.log(SUI_TYPE_ARG)
  const { signTransactionBlock, executeTransactionBlock, currentAccount } =
    useWalletKit()
  // TODO
  const setting: SettingInterface = {
    gasBudget: "1000000",
    expiration: "30",
    slippage: "200"
  }

  return useMutation({
    mutationFn: async ({
      pool_id,
      is_type_x,
      coin_x_type,
      coin_y_type,
      coin_x_value,
      coin_y_value,
    }: AddLiquidityMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      // should refacotr

      const txb = new TransactionBlock()

      // coin_x
      const coins_x = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: coin_x_type,
      })
      const coin_x = payCoin(
        txb,
        coins_x,
        coin_x_value,
        coin_x_type == SUI_TYPE_ARG,
      )
      const deposit_x_min = ( BigInt("1") - BigInt(setting.slippage) / BigInt("10000")) * BigInt(coin_x_value)
      // coni_y
      const coins_y = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: coin_y_type,
      })
      const coin_y = payCoin(
        txb,
        coins_y,
        coin_y_value,
        coin_y_type == SUI_TYPE_ARG,
      )
      const deposit_y_min = ( BigInt("1") - BigInt(setting.slippage) / BigInt("10000")) * BigInt(coin_y_value)

      if(is_type_x){
        add_liquidity(txb, pool_id, coin_x_type, coin_y_type, coin_x, coin_y, lp, deposit_x_min, deposit_y_min);
      }else{
        add_liquidity(txb, pool_id, coin_y_type, coin_x_type, coin_y, coin_x, lp, deposit_y_min, deposit_x_min);
      }

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: {
          showObjectChanges: true,
        },
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Vesting Vsdb Tx fail')
      }

      return getObjectChanges(res)?.find(
        (obj) =>
          obj.type == 'created' &&
          obj.objectType == `${vsdb_package}::vsdb::Vsdb`,
      ) as SuiObjectChangeCreated
    },
    onSuccess: () => {},
    onError: () => {},
  })
}
