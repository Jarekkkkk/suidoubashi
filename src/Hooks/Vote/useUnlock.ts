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
import { check_network } from '@/Utils'
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
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

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
        throw new Error('Unlock Tx Failed')
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['get-vsdbs'])
      if (params.reset) queryClient.invalidateQueries(['gauge'])
      toast.success('Burn VSDB NFT and unlock Successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
