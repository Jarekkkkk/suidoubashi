import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatusType } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { payCoin } from '@/Utils/payCoin'
import { swap_for_x, swap_for_y } from '@/Constants/API/pool'
import { queryClient } from '@/App'
import { check_network } from '@/Utils'

type SwapMutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  is_type_x: boolean
  input_value: string
  output_value: string
  vsdb: string | null
}

export const useSwap = (setCoinTypeFirst: Function) => {
  const rpc = useRpc()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      pool_id,
      pool_type_x,
      pool_type_y,
      is_type_x,
      input_value,
      output_value,
      vsdb,
    }: SwapMutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number('1000000'))
      const input_type = is_type_x ? pool_type_x : pool_type_y
      // coin_x
      const coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: input_type,
      })
      const coin = payCoin(txb, coins, input_value, input_type)
      if (is_type_x) {
        swap_for_y(
          txb,
          pool_id,
          pool_type_x,
          pool_type_y,
          coin,
          output_value,
          vsdb,
        )
      } else {
        swap_for_x(
          txb,
          pool_id,
          pool_type_x,
          pool_type_y,
          coin,
          output_value,
          vsdb,
        )
      }

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: {
          showEffects: true,
        },
      })
      console.log('res', res)
      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Swap Tx fail')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['balance'])
      queryClient.invalidateQueries(['pools'])
      queryClient.invalidateQueries(['gauges'])
      queryClient.invalidateQueries(['rewards'])
      if (params.vsdb) queryClient.invalidateQueries(['vsdb', params.vsdb])
      toast.success('Swap Successfully!')
      setCoinTypeFirst('')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
