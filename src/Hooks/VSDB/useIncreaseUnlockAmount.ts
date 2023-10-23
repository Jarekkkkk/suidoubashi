import { useWalletKit } from '@mysten/wallet-kit'
import useRpc from '../useRpc'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TransactionBlock,
  isValidSuiObjectId,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { increase_unlock_amount } from '@/Constants/API/vsdb'
import { Coin } from '@/Constants/coin'
import { payCoin } from '@/Utils/payCoin'
import { check_network } from '@/Utils'

type MutationProps = {
  vsdb: string
  depositValue: string
}

export const useIncreaseUnlockAmount = (
  setIsShowDepositVSDBModal: Function,
) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb, depositValue }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      if (!isValidSuiObjectId(vsdb)) throw new Error('invalid VSDB ID')

      const txb = new TransactionBlock()
      const sdb_coins = await rpc.getCoins({
        owner: currentAccount.address,
        coinType: Coin.SDB,
      })
      const sdb = payCoin(txb, sdb_coins, depositValue, Coin.SDB)
      increase_unlock_amount(txb, vsdb, sdb)
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: { showBalanceChanges: true },
      })

      if (getExecutionStatusType(res) == 'failure') {
        throw new Error('Increase Unlock Amount tx fail')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['balance'])

      toast.success('Deposit SDB to VSDB NFT Successfully!')
      setIsShowDepositVSDBModal(false)
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
