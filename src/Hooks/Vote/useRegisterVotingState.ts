
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { TransactionBlock } from '@mysten/sui.js'
import { useWalletKit } from '@mysten/wallet-kit'
import { toast } from 'react-hot-toast'
import { get_vsdb_key } from '../VSDB/useGetVSDB'
import { initialize_voting_state } from '@/Constants/API/vote'

interface MutationProps {
  vsdb: string
}

const useRegisterVotingState = () => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb }: MutationProps) => {
      const txb = new TransactionBlock()
      initialize_voting_state(txb, vsdb)
      const signed_tx = await signTransactionBlock({ transactionBlock: txb })

      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (res.effects?.status.status == 'failure') throw Error
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries({
        queryKey: get_vsdb_key(currentAccount!.address, params.vsdb),
      })
      toast.success('Initiazlie successfully !')
    },
    onError: (_: Error) => toast.error('Oops! Have some error'),
  })
}

export default useRegisterVotingState
