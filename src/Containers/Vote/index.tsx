import React, {
  useState,
  useContext,
  useCallback,
  PropsWithChildren,
  ChangeEvent,
} from 'react'
import { regexEn } from '@/Constants/index'
import { useGetAllGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetVoter } from '@/Hooks/Vote/useGetVoter'
import { Gauge, Rewards, Voter } from '@/Constants/API/vote'
import { useGetAllRewards, useGetBribeRewards } from '@/Hooks/Vote/useGetRewards'
import { Coins, fetchCoinByType } from '@/Constants/coin'

const VoteContext = React.createContext<VoteContext>({
  gaugeData: undefined,
  voterData: null,
  rewardsData: undefined,
  pool_bribesData: undefined,
  fetching: false,
  searchInput: '',
  handleOnInputChange: () => { },
})
export const useVoteContext = () => useContext(VoteContext)

const VoteContainer = ({ children }: PropsWithChildren) => {
  const [searchInput, setSearchInput] = useState('')

  const gauge = useGetAllGauge()
  const voter = useGetVoter()
  const rewards = useGetAllRewards(
    gauge.data
  )
  const pool_bribes = useGetBribeRewards(gauge.data, rewards.data)

  const _gaugeData = gauge.data?.filter((data) => {
    const _x = fetchCoinByType(data.type_x)?.name ?? Coins[0].name
    const _y = fetchCoinByType(data.type_y)?.name ?? Coins[0].name
    const coinName = _x.concat('-', _y)

    return new RegExp(searchInput, 'ig').test(coinName)
  })

  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value

      const isValid = regexEn.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setSearchInput(value.toUpperCase())
    },
    [setSearchInput],
  )

  return (
    <VoteContext.Provider
      value={{
        gaugeData: _gaugeData,
        voterData: voter.data,
        rewardsData: rewards.data,
        pool_bribesData: pool_bribes.data,
        fetching: gauge.isLoading || voter.isLoading || rewards.isLoading,
        searchInput,
        handleOnInputChange,
      }}
    >
      {children}
    </VoteContext.Provider>
  )
}

interface VoteContext {
  readonly gaugeData: Gauge[] | undefined
  readonly fetching: boolean
  readonly voterData: Voter | null | undefined
  readonly rewardsData: Rewards[] | undefined
  readonly pool_bribesData: { type: string, value: string }[][] | undefined
  searchInput: string
  handleOnInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}
export default VoteContainer
