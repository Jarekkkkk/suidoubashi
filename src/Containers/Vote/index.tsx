import React, {
  useState,
  useContext,
  useCallback,
  PropsWithChildren,
  ChangeEvent,
} from 'react'
import { fetchCoinByType, regexEn } from '@/Constants/index'
import { useGetMulGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetVoter } from '@/Hooks/Vote/useGetVoter'
import { Gauge, Rewards, Voter } from '@/Constants/API/vote'
import { useGetMulRewards } from '@/Hooks/Vote/useGetRewards'

const VoteContext = React.createContext<VoteContext>({
  gaugeData: null,
  voterData: null,
  rewardsData: null,
  fetching: false,
  searchInput: '',
  handleOnInputChange: () => {},
})
export const useVoteContext = () => useContext(VoteContext)

const VoteContainer = ({ children }: PropsWithChildren) => {
  const [searchInput, setSearchInput] = useState('')

  const gauge = useGetMulGauge()
  const voter = useGetVoter()
  const rewards = useGetMulRewards(
    gauge.data?.map((g) => g.rewards) ?? [],
    gauge.isLoading || voter.isLoading,
  )

	const _gaugeData = gauge.data?.filter((data) => {
		const _x = fetchCoinByType(data.type_x)!.name;
		const _y = fetchCoinByType(data.type_y)!.name;
		const coinName = _x.concat('-', _y);

		return new RegExp(searchInput, 'ig').test(coinName)
	});

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
  readonly gaugeData: Gauge[] | null | undefined
  readonly fetching: boolean
  readonly voterData: Voter | null | undefined
  readonly rewardsData: Rewards[] | null
  searchInput: string
  handleOnInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}
export default VoteContainer
