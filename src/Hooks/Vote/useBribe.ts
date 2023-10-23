import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import { bribe } from '@/Constants/API/vote'
import { payCoin } from '@/Utils/payCoin'
import { check_network } from '@/Utils'

type MutationArgs = {
  rewards: string
  type_x: string
  type_y: string
  input_type: string
  input_value: string
}

export const useBribe = (setting: SettingInterface, clearInput: Function) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({
      rewards,
      input_value,
      type_x,
      type_y,
      input_type,
    }: MutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      const coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: input_type,
      })
      const coin = payCoin(txb, coins, input_value, input_type)
      bribe(txb, rewards, coin, type_x, type_y, input_type)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Bribe Tx Failed')
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['balance'])
      queryClient.refetchQueries(['rewards-bribe'])
      toast.success('Bribes Successfully')
      clearInput()
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
