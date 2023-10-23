import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import {
  TransactionBlock,
  getExecutionStatusError,
  getExecutionStatusType,
} from '@mysten/sui.js'
import { useWalletKit } from '@mysten/wallet-kit'
import { toast } from 'react-hot-toast'
import { initialize_voting_state } from '@/Constants/API/vote'
import { check_network } from '@/Utils'

interface MutationProps {
  vsdb: string
}

const useRegisterVotingState = () => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb }: MutationProps) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      const txb = new TransactionBlock()
      initialize_voting_state(txb, vsdb)
      const signed_tx = await signTransactionBlock({ transactionBlock: txb })

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
        throw new Error('Register Vote State Tx fail')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      toast.success('Initiazlie vote badge successfully !')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}

export default useRegisterVotingState
