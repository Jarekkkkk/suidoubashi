
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useRpc from '../useRpc'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock, getExecutionStatus } from '@mysten/sui.js'
import { toast } from 'react-hot-toast'
import { SettingInterface } from '@/Components/SettingModal'
import { Gauge, reset_, vote_, vote_entry, vote_exit, voting_entry } from '@/Constants/API/vote'

type MutationArgs = {
  vsdb: string
  reset: Gauge[],
  vote: Gauge[],
  voting_weights: string[]
}

export const useStake = (setting: SettingInterface) => {
  const rpc = useRpc()
  const queryClient = useQueryClient()
  const { signTransactionBlock, currentAccount } = useWalletKit()

  return useMutation({
    mutationFn: async ({vsdb, reset, vote, voting_weights
    }: MutationArgs) => { 
      if (!currentAccount) throw new Error('no Wallet Account')

      const txb = new TransactionBlock()
      txb.setGasBudget(Number(setting.gasBudget))
      
      //main logic
      let potato = voting_entry(txb, vsdb)

      for(const gauge of reset ){
          potato =  reset_(txb,potato,vsdb,gauge.id, gauge.bribe,gauge.type_x,gauge.type_y)
      }
      
      const pools = vote.map((g)=>g.pool)
      vote_entry(txb,potato,vsdb, pools, voting_weights )

      for(const gauge of vote){
        potato = vote_(txb, potato, vsdb, gauge.id, gauge.bribe, gauge.rewards, gauge.type_x, gauge.type_y)
      }

      vote_exit(txb, potato, vsdb)


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
      toast.success('Votes Successfully')
    },
    onError: (err) => {
      console.log(err)
      toast.error('Oops! Have some error')
    },
  })
}
