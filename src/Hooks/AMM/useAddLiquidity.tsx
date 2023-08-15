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
import {
  LP,
  LiquidityAdded,
  add_liquidity,
  amm_package,
  create_lp,
} from '@/Constants/API/pool'
import { SettingInterface } from '@/Constants/setting'
import { queryClient } from '@/App'

type AddLiquidityMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  is_type_x: boolean
  lp_id: string | null
  coin_x_value: string
  coin_y_value: string
}

export const useAddLiquidity = () => {
  const rpc = useRpc()
  const { signTransactionBlock,  currentAccount } =
    useWalletKit()
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
      is_type_x,
      lp_id,
      coin_x_value,
      coin_y_value,
    }: AddLiquidityMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      // should refacotr

      const txb = new TransactionBlock()

      // coin_x
      const coins_x = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: pool_type_x,
      })
      const coin_x = payCoin(
        txb,
        coins_x,
        coin_x_value,
        pool_type_x == SUI_TYPE_ARG,
      )
      const deposit_x_min =
        ((BigInt('10000') - BigInt(setting.slippage)) * BigInt(coin_x_value)) /
        BigInt('10000')
      // coni_y
      const coins_y = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: pool_type_y,
      })
      const coin_y = payCoin(
        txb,
        coins_y,
        coin_y_value,
        pool_type_y == SUI_TYPE_ARG,
      )
      const deposit_y_min =
        ((BigInt('10000') - BigInt(setting.slippage)) * BigInt(coin_y_value)) /
        BigInt('10000')
      // LO
      let lp = lp_id
        ? txb.pure(lp_id)
        : create_lp(txb, pool_id, pool_type_x, pool_type_y)
      if (is_type_x) {
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
      } else {
        add_liquidity(
          txb,
          pool_id,
          pool_type_y,
          pool_type_x,
          coin_y,
          coin_x,
          lp,
          deposit_y_min,
          deposit_x_min,
        )
      }

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

      console.log(res)

      return {
        lp: getObjectChanges(res)?.find(
          (obj) =>
            obj.type == 'created' &&
            obj.objectType == `${amm_package}::pool::LP`,
        ) as SuiObjectChangeCreated,

        deposit: res.events?.find((e) =>
          e.type.startsWith(`${amm_package}::event::LiquidityAdded`),
        )?.parsedJson as LiquidityAdded,
      }
    },
    onSuccess: (
      { lp, deposit: { deposit_x, deposit_y, lp_token } },
      params,
    ) => {
      console.log(lp_token)
      queryClient.setQueryData(
        ['LP', currentAccount!.address],
        (lp_ids?: LP[]) => {
          let lps = lp_ids ?? []
          const lp_id = lps.findIndex(
            (lp) =>
              lp.type_x == params.pool_type_x &&
              lp.type_y == params.pool_type_y,
          )

          if (lp_id > -1) {
            lps[lp_id].lp_balance = (
              BigInt(lps[lp_id].lp_balance) + BigInt(lp_token)
            ).toString()
          } else {
            lps.push({
              id: lp?.objectId,
              claimable_x: '0',
              claimable_y: '0',
              lp_balance: lp_token,
            } as LP)
          }
          return lps
        },
      )
    },
    onError: (err: Error) => {
      console.log(err)
    },
  })
}
