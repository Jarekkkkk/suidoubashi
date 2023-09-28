import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { TransactionBlock } from '@mysten/sui.js'
import { initialize_amm } from '@/Constants/API/pool'
import { useWalletKit } from '@mysten/wallet-kit'
import { toast } from 'react-hot-toast'

interface MutationProps {
  vsdb: string
}

const useRegisterAMMState = () => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock} = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb }: MutationProps) => {
      const txb = new TransactionBlock()
      initialize_amm(txb, vsdb)
      const signed_tx = await signTransactionBlock({ transactionBlock: txb })

      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (res.effects?.status.status == 'failure') throw Error
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      toast.success('Initiazlie successfully !')
    },
    onError: (_: Error) => toast.error('Oops! Have some error'),
  })
}

export default useRegisterAMMState
