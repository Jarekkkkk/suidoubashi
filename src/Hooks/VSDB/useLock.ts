import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import {
  TransactionBlock,
  getExecutionStatusType,
  getObjectChanges,
  SuiObjectChangeCreated,
  getExecutionStatusError,
} from '@mysten/sui.js'
import { lock, vsdb_package } from '@/Constants/API/vsdb'
import { Coin } from '@/Constants/coin'
import { payCoin } from '@/Utils/payCoin'
import { check_network } from '@/Utils'
import { SettingInterface } from '@/Components/SettingModal'

type MutationProps = {
  deposit_value: string
  extended_duration: string
}

export const useLock = (
  setting: SettingInterface,
  setIsShowCreateVSDBModal: Function,
) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ deposit_value, extended_duration }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      txb.setGasBudget(parseFloat(setting.gasBudget))
      const sdb_coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: Coin.SDB,
      })
      const coin_sdb = payCoin(txb, sdb_coins, deposit_value, Coin.SDB)
      lock(txb, coin_sdb, extended_duration)
      const signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: {
          showObjectChanges: true,
          showEffects: true,
        },
      })

      if (getExecutionStatusType(res) == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          if (err == 'InsufficientGas') throw new Error('InsufficientGas')
        }
        throw new Error('Create VSDB Tx fail')
      }

      return getObjectChanges(res)?.find(
        (obj) =>
          obj.type == 'created' &&
          obj.objectType == `${vsdb_package}::vsdb::Vsdb`,
      ) as SuiObjectChangeCreated
    },
    onSuccess: (new_vsdb) => {
      queryClient.setQueryData(['get-vsdbs'], (vsdb_ids?: string[]) => [
        ...(vsdb_ids ?? []),
        new_vsdb.objectId,
      ])
      queryClient.invalidateQueries(['balance'])
      toast.success('Create VSDB Successfully!')
      setIsShowCreateVSDBModal(false)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
