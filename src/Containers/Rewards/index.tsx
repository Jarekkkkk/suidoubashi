import { Rewards, Stake } from '@/Constants/API/vote'
import { useGetMulGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetMulRewards, useGetRewards } from '@/Hooks/Vote/useGetRewards'
import { useGetMulStake } from '@/Hooks/Vote/useGetStake'
import React, { useState, useContext, PropsWithChildren } from 'react'

const RewardsContext = React.createContext<RewardsContext>({
  rewardsData: null,
  stakeData: null,
  fetching: false,
})
export const useRewardsContext = () => useContext(RewardsContext)

const RewardsContainer = ({ children }: PropsWithChildren) => {
  const [fetching, _setFetching] = useState(false)

  const gauge = useGetMulGauge()
  const stakes = useGetMulStake(gauge.data)
  const rewards = useGetMulRewards(
    gauge.data?.map((g) => g.rewards) ?? [],
    gauge.isLoading,
  )

  return (
    <RewardsContext.Provider
      value={{
        rewardsData: rewards.data,
        stakeData: stakes.data,
        fetching: stakes.isLoading ||rewards.isLoading,
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
