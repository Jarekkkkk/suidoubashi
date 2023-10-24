import { Rewards, Stake } from '@/Constants/API/vote'
import { useGetAllGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetAllRewards } from '@/Hooks/Vote/useGetRewards'
import { useGetAllStake } from '@/Hooks/Vote/useGetStake'
import { useWalletKit } from '@mysten/wallet-kit'
import React, { useContext, PropsWithChildren } from 'react'

const RewardsContext = React.createContext<RewardsContext>({
  rewardsData: undefined,
  stakeData: undefined,
  fetching: false,
})
export const useRewardsContext = () => useContext(RewardsContext)

const RewardsContainer = ({ children }: PropsWithChildren) => {
  const gauge = useGetAllGauge()
  const { currentAccount } = useWalletKit()
  const stakes = useGetAllStake(
    currentAccount?.address,
    gauge.data,
    gauge.isLoading,
  )
  const rewards = useGetAllRewards(gauge.data)

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
  readonly rewardsData: Rewards[] | undefined
  readonly stakeData: Stake[] | undefined
  readonly fetching: boolean
}

export default RewardsContainer
