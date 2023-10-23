import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import {
  Gauge,
  reset_,
  vote_,
  vote_entry,
  vote_exit,
  voting_entry,
} from '@/Constants/API/vote'
import { check_network } from '@/Utils'

type MutationArgs = {
  vsdb: string
  reset: Gauge[]
  vote: Gauge[]
  voting_weights: string[]
}

export const useVote = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb, reset, vote, voting_weights }: MutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      //main logic
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

      const pools = vote.map((g) => g.pool)
      potato = vote_entry(txb, potato, vsdb, pools, voting_weights)

      for (const gauge of vote) {
        potato = vote_(
          txb,
          potato,
          vsdb,
          gauge.id,
          gauge.bribe,
          gauge.rewards,
          gauge.type_x,
          gauge.type_y,
        )
      }

      vote_exit(txb, potato, vsdb)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: {
          showEffects: true,
        },
      })

      if (getExecutionStatus(res)?.status == 'failure')
        throw new Error('Vote Tx Failed')
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['gauge'])
      queryClient.invalidateQueries(['voter'])
      toast.success('Votes Successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
