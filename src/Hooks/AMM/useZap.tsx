import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { SettingInterface } from '@/Constants/setting'
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
  amm_package,
  create_lp,
  get_output,
  zap_optimized_input,
  zap_optimized_input_,
  zap_x,
  zap_y,
} from '@/Constants/API/pool'
import { queryClient } from '@/App'

type ZapMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  reserve_x: string
  reserve_y: string
  fee: string
  is_type_x: boolean
  lp_id: string | null
  input_value: string
}

export const useZap = () => {
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
      reserve_x,
      reserve_y,
      fee,
      is_type_x,
      lp_id,
      input_value,
    }: ZapMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      // should refacotr
      const txb = new TransactionBlock()

      // coin_x
      const input_type = is_type_x ? pool_type_x : pool_type_y
      const coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: input_type,
      })
      const coin = payCoin(txb, coins, input_value, input_type == SUI_TYPE_ARG)

      // pure function: can be local
      const swapped_x = zap_optimized_input_(
        is_type_x ? reserve_x : reserve_y,
        input_value,
        fee,
      )

      const deposit_x_min =
        ((BigInt('10000') - BigInt(setting.slippage)) *
          (BigInt(input_value) - swapped_x)) /
        BigInt('10000')

      // this should e in programable tx block
      const output = await get_output(
        rpc,
        currentAccount.address,
        pool_id,
        pool_type_x,
        pool_type_y,
        input_type,
        swapped_x,
      )

      console.log(swapped_x.toString(), input_value, output) //
      const deposit_y_min =
        ((BigInt('10000') - BigInt(setting.slippage)) * BigInt(output)) /
        BigInt('10000')
      // LO
      let lp = lp_id
        ? txb.object(lp_id)
        : create_lp(txb, pool_id, pool_type_x, pool_type_y)
      if (is_type_x) {
        zap_x(
          txb,
          pool_id,
          pool_type_x,
          pool_type_y,
          coin,
          lp,
          deposit_x_min,
          deposit_y_min,
        )
      } else {
        zap_y(
          txb,
          pool_id,
          pool_type_x,
          pool_type_y,
          coin,
          lp,
          deposit_y_min,
          deposit_x_min,
        )
      }

      // return id first time deposit
      if (lp_id == null) {
        txb.transferObjects([lp], txb.pure(currentAccount.address))
      }
      console.log(txb)
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
      console.log(deposit_x, deposit_y, lp_token)
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
