import { useMutation } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatusType } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { payCoin } from '@/Utils/payCoin'
import { add_liquidity, create_lp } from '@/Constants/API/pool'
import { queryClient } from '@/App'
import { SettingInterface } from '@/Components/SettingModal'
import { stake_all } from '@/Constants/API/farm'

type MutationArgs = {
  pool_id: string
  pool_type_x: string
  pool_type_y: string
  farm_id: string
  lp_id: string | null
  input_x_value: string
  input_y_value: string
}

export const useDepoistAndStake = () => {
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
      farm_id,
      input_x_value,
      input_y_value,
    }: MutationArgs) => {
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

      stake_all(txb, farm_id, pool_id, pool_type_x, pool_type_y, lp)

      // return id first time deposit
      if (lp_id == null) {
        txb.transferObjects([lp], txb.pure(currentAccount.address))
      }

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Vesting Vsdb Tx fail')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['pool', params.pool_id])
      queryClient.invalidateQueries(['LP'])
      queryClient.invalidateQueries(['farm',params.farm_id])
      queryClient.invalidateQueries(['stake-balance',params.farm_id])
      toast.success('Add Liquidity and Stake Success!')
    },
    onError: (_err: Error) => {
      console.log(_err)
      toast.error('Oops! Have some error')
    },
  })
}
