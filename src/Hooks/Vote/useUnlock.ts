import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import {
  Gauge,
  clear_voting_state,
  reset_,
  reset_exit,
  voting_entry,
} from '@/Constants/API/vote'
import { unlock } from '@/Constants/API/vsdb'
type MutationArgs = {
  vsdb: string
  reset?: Gauge[]
}

export const useUnlock = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb, reset }: MutationArgs) => {
      if (!currentAccount) throw new Error('no Wallet Account')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      //main logic
      if (reset) {
        let potato = voting_entry(txb, vsdb)
        if (reset.length > 0) {
          for (const gauge of reset) {
            potato = reset_(
              txb,
              potato,
              vsdb,
              gauge.id,
              gauge.bribe,
              gauge.type_x,
              gauge.type_y,
            )
          }
        }
        //revoke the votes
        reset_exit(txb, potato, vsdb)
        // clear the tags
        clear_voting_state(txb, vsdb)
      }

      unlock(txb, vsdb)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Tx Failed')
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['gauge'])
      toast.success('reset Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
