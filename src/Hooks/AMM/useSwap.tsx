import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  CoinBalance,
  SUI_TYPE_ARG,
  TransactionBlock,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { payCoin } from '@/Utils/payCoin'
import { Swap, amm_package, swap_for_x, swap_for_y } from '@/Constants/API/pool'
import { SettingInterface } from '@/Constants/setting'
import { queryClient } from '@/App'
import { contentSection } from '@/Presentations/Vest/index.styles'

type SwapMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  is_type_x: boolean
  input_value: string
  output_value: string
}

export const useSwap = () => {
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
      is_type_x,
      input_value,
      output_value,
    }: SwapMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')

      // should refacotr
      const txb = new TransactionBlock()
      const input_type = is_type_x ? pool_type_x : pool_type_y
      // coin_x
      const coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: input_type,
      })
      const coin = payCoin(txb, coins, input_value, input_type == SUI_TYPE_ARG)

      const output_min =
        ((BigInt('10000') - BigInt(setting.slippage)) * BigInt(output_value)) /
        BigInt('10000')

      if (is_type_x) {
        swap_for_y(txb, pool_id, pool_type_x, pool_type_y, coin, output_min)
      } else {
        swap_for_x(txb, pool_id, pool_type_x, pool_type_y, coin, output_min)
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

      return res.events?.find((e) =>
        e.type.startsWith(`${amm_package}::event::Swap`),
      )?.parsedJson as Swap
    },
    onSuccess: ({ input, output }, { is_type_x, pool_type_x, pool_type_y }) => {
      console.log(input)
      console.log(output)
      //ipnut
      queryClient.setQueryData(
        [
          'get-balance',
          currentAccount!.address,
          is_type_x ? pool_type_x : pool_type_y,
        ],
        (balance?: CoinBalance) =>
          balance && {
            ...balance,
            totalBalance: (
              BigInt(balance.totalBalance) - BigInt(input)
            ).toString(),
          },
      )
      //output
      queryClient.setQueryData(
        [
          'get-balance',
          currentAccount!.address,
          is_type_x ? pool_type_y : pool_type_x,
        ],
        (balance?: CoinBalance) =>
          balance
            ? {
                ...balance,
                totalBalance: (
                  BigInt(balance.totalBalance) + BigInt(output)
                ).toString(),
              }
            : ({
                totalBalance: output,
                coinType: is_type_x ? pool_type_y : pool_type_x,
                coinObjectCount: 1,
                lockedBalance: {},
              } as CoinBalance),
      )
    },
    onError: (err: Error) => {
      console.log(err)
    },
  })
}
