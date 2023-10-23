import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
  getExecutionStatusError,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { increase_unlock_time } from '@/Constants/API/vsdb'
import { check_network } from '@/Utils'
import { SettingInterface } from '@/Components/SettingModal'

type MutationProps = {
  vsdb: string
  extended_duration: string
}

export const useIncreaseUnlockTime = (
  setting: SettingInterface,
  setIsShowDepositVSDBModal: Function,
) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()

  const { signTransactionBlock, currentAccount } = useWalletKit()
  return useMutation({
    mutationFn: async ({ vsdb, extended_duration }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))
      increase_unlock_time(txb, vsdb, extended_duration)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: { showEffects: true },
      })

      if (getExecutionStatusType(res) == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          if (err == 'InsufficientGas') throw new Error('InsufficientGas')
        }
        throw new Error('Increase Unlock Time tx fail')
      }

      return 'success'
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      toast.success('Increase lockup duration Successfully!')
      setIsShowDepositVSDBModal(false)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
