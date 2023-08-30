import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatusType } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import {
  LP,
  quote_remove_liquidity,
  amm_package,
  remove_liquidity,
  LiquidityRemoved,
} from '@/Constants/API/pool'
import { queryClient } from '@/App'
import { SettingInterface } from '@/Components/SettingModal'

type AddLiquidityMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  lp_id: string
  withdrawl: string
}

export const useRemoveLiquidity = () => {
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
      withdrawl,
    }: AddLiquidityMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      // should refacotr
      const txb = new TransactionBlock()
      txb.setGasBudget(BigInt(setting.gasBudget))

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
        txb.pure(lp_id),
        withdrawl,
        quote[0],
        quote[1],
      )

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

      return res.events?.find((e) =>
        e.type.startsWith(`${amm_package}::event::LiquidityRemoved`),
      )?.parsedJson as LiquidityRemoved
    },
    onSuccess: ({ withdrawl_x: _, withdrawl_y: __, lp_token }, params) => {
      queryClient.setQueryData(
        ['LP', currentAccount!.address],
        (lp_ids?: LP[]) => {
          let lps = lp_ids ?? []
          const lp_id = lps.findIndex((lp) => lp.id == params.lp_id)

          if (lp_id > -1) {
            let _bal = BigInt(lps[lp_id].lp_balance) - BigInt(lp_token)
            if (_bal == BigInt('0')) {
              lps.splice(lp_id, 1)
            } else {
              lps[lp_id].lp_balance = _bal.toString()
            }
          } else {
            throw new Error('No LP')
          }
          return lps
        },
      )

      toast.success('Remove Liquidity Success!')
    },
    onError: (_: Error) => {
      toast.error('Oops! Have some error')
    },
  })
}
