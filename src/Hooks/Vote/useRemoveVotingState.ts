import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import {
  TransactionBlock,
  getExecutionStatus,
  getExecutionStatusError,
} from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import {
  Gauge,
  VotingState,
  clear_voting_state,
  reset_,
  reset_exit,
  voting_entry,
} from '@/Constants/API/vote'
import { check_network } from '@/Utils'
import { round_down_week } from '@/Utils/vsdb'
type MutationArgs = {
  vsdb: string
  voting_state: VotingState
  reset: Gauge[]
}

export const useRemoveVotingState = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({ vsdb, voting_state, reset }: MutationArgs) => {
      if (!currentAccount?.address) throw new Error('no wallet address')
      if (!check_network(currentAccount)) throw new Error('Wrong Network')
      if (!!voting_state.unclaimed_rewards.length)
        throw new Error('Unclaimed Rewards')
      if (
        round_down_week(Number(voting_state.last_voted)) ==
        round_down_week(Date.now() / 1000)
      )
        throw new Error(
          'Vote and reset in same epoch. Please wait for next epoch',
        )

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))

      //main logic
      if (reset.length > 0) {
        let potato = voting_entry(txb, vsdb)
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
        //revoke the votes
        reset_exit(txb, potato, vsdb)
      }
      // clear the tags
      clear_voting_state(txb, vsdb)

      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await rpc.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: { showEffects: true },
      })

      if (getExecutionStatus(res)?.status == 'failure') {
        const err = getExecutionStatusError(res)
        if (err) {
          if (err == 'InsufficientGas') throw new Error('InsufficientGas')
        }
        throw new Error('Unlock Tx Failed')
      }
    },
    onSuccess: (_, params) => {
      queryClient.invalidateQueries(['vsdb', params.vsdb])
      queryClient.invalidateQueries(['get-vsdbs', currentAccount!.address])
      if (params.reset) queryClient.invalidateQueries(['gauge'])
      toast.success('Burn VSDB NFT and unlock Successfully')
    },
    onError: (err: Error) => {
      toast.error(err.message)
    },
  })
}
