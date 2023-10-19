import { Rewards, Stake } from '@/Constants/API/vote'
import { useGetMulGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetMulRewards } from '@/Hooks/Vote/useGetRewards'
import { useGetAllStake } from '@/Hooks/Vote/useGetStake'
import { useWalletKit } from '@mysten/wallet-kit'
import React, { useContext, PropsWithChildren } from 'react'

const RewardsContext = React.createContext<RewardsContext>({
  rewardsData: null,
  stakeData: undefined,
  fetching: false,
})
export const useRewardsContext = () => useContext(RewardsContext)

const RewardsContainer = ({ children }: PropsWithChildren) => {
  const gauge = useGetMulGauge()
  const { currentAccount } = useWalletKit()
  const stakes = useGetAllStake(
    currentAccount?.address,
    gauge.data,
    gauge.isLoading,
  )
  const rewards = useGetMulRewards(gauge.data, gauge.isLoading)

  return (
    <RewardsContext.Provider
      value={{
        rewardsData: rewards.data,
        stakeData: stakes.data,
        fetching: stakes.isLoading || rewards.isLoading,
      }}
    >
      {children}
    </RewardsContext.Provider>
  )
}

interface RewardsContext {
  readonly rewardsData: Rewards[] | null
  readonly stakeData: Stake[] | undefined
  readonly fetching: boolean
}

export default RewardsContainer
