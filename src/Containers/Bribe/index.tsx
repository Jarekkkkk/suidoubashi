import { Rewards } from '@/Constants/API/vote'
import { useGetMulGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetMulRewards } from '@/Hooks/Vote/useGetRewards'
import React, {
  useState,
  useContext,
  PropsWithChildren,
  useCallback,
} from 'react'

export const BribeContext = React.createContext<BribeContext>({
  rewardsData: null,
  fetching: false,
  coinInput: '',
  handleInputOnchange: () => {},
})

export const useBribeContext = () => useContext(BribeContext)

export const BribeContainer = ({ children }: PropsWithChildren) => {
  const gauge = useGetMulGauge()
  const { data: rewardsData, isLoading: isRewardsDataLoading } =
    useGetMulRewards(gauge.data, gauge.isLoading)

  const [coinInput, setCoinInput] = useState('')
  const handleInputOnchange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInput(value)
    },
    [setCoinInput],
  )

  return (
    <BribeContext.Provider
      value={{
        fetching: isRewardsDataLoading || gauge.isLoading,
        rewardsData,
        coinInput,
        handleInputOnchange,
      }}
    >
      {children}
    </BribeContext.Provider>
  )
}

interface BribeContext {
  readonly rewardsData: Rewards[] | null
  readonly fetching: boolean
  coinInput: string
  handleInputOnchange: Function
}

export default BribeContainer
