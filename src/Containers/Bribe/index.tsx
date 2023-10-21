import { Rewards } from '@/Constants/API/vote'
import { useGetAllGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetAllRewards } from '@/Hooks/Vote/useGetRewards'
import React, {
  useState,
  useContext,
  PropsWithChildren,
  useCallback,
} from 'react'

export const BribeContext = React.createContext<BribeContext>({
  rewardsData: undefined,
  fetching: false,
  coinInput: '',
  handleInputOnchange: () => { },
  clearInput: () => { },
})

export const useBribeContext = () => useContext(BribeContext)

export const BribeContainer = ({ children }: PropsWithChildren) => {
  const gauge = useGetAllGauge()
  const { data: rewardsData, isLoading: isRewardsDataLoading } =
    useGetAllRewards(gauge.data)

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

  const clearInput = () => setCoinInput('')

  return (
    <BribeContext.Provider
      value={{
        fetching: isRewardsDataLoading || gauge.isLoading,
        rewardsData,
        coinInput,
        handleInputOnchange,
        clearInput,
      }}
    >
      {children}
    </BribeContext.Provider>
  )
}

interface BribeContext {
  readonly rewardsData: Rewards[] | undefined
  readonly fetching: boolean
  coinInput: string
  handleInputOnchange: Function
  clearInput: Function
}

export default BribeContainer
