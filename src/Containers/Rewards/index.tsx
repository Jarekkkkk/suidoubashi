import { Rewards, Stake } from '@/Constants/API/vote'
import { useGetMulGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetMulRewards } from '@/Hooks/Vote/useGetRewards'
import { useGetMulStake } from '@/Hooks/Vote/useGetStake'
import React, { useContext, PropsWithChildren } from 'react'

const RewardsContext = React.createContext<RewardsContext>({
  rewardsData: null,
  stakeData: null,
  fetching: false,
})
export const useRewardsContext = () => useContext(RewardsContext)

const RewardsContainer = ({ children }: PropsWithChildren) => {
  const gauge = useGetMulGauge()
  const stakes = useGetMulStake(gauge.data)
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
  readonly stakeData: Stake[] | null
  readonly fetching: boolean
}

export default RewardsContainer
