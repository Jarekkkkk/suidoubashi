import {
  ChangeEvent,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react'
import { Pool } from '@/Constants/API/pool'
import { regexEn } from '@/Constants/index'
import UserModule from '@/Modules/User'
import React from 'react'
import { Balance, useGetAllBalance } from '@/Hooks/Coin/useGetBalance'
import { Coins } from '@/Constants/coin'
import { useGetAllGauge } from '@/Hooks/Vote/useGetGauge'
import { Gauge } from '@/Constants/API/vote'
import { useGetAllPool } from '@/Hooks/AMM/useGetPool'

const PoolContext = React.createContext<PoolContext>({
  poolsData: undefined,
  gaugeData: undefined,
  allBalanceData: undefined,
  fetching: false,
  searchInput: '',
  handleOnInputChange: () => { },
})

export const usePoolContext = () => useContext(PoolContext)

const PoolContainer = ({ children }: PropsWithChildren) => {
  const [searchInput, setSearchInput] = useState('')

  const walletAddress = UserModule.getUserToken()
  if (!walletAddress) return null


  const { data: pools, isLoading: isAllPoolLoading } = useGetAllPool()
  const { data: allBalance, isLoading: isAllBalanceLoading } = useGetAllBalance(
    Coins,
    walletAddress,
  )

  const { data: gaugeData, isLoading: isAllGaugeLoading } = useGetAllGauge()

  const _poolsData = pools?.filter((pool) =>
    new RegExp(searchInput, 'ig').test(pool.name),
  )

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
    <PoolContext.Provider
      value={{
        poolsData: _poolsData,
        gaugeData: gaugeData,
        allBalanceData: allBalance,
        fetching: isAllPoolLoading || isAllBalanceLoading || isAllGaugeLoading,
        searchInput,
        handleOnInputChange,
      }}
    >
      {children}
    </PoolContext.Provider>
  )
}

interface PoolContext {
  readonly poolsData: Pool[] | undefined
  readonly gaugeData: Gauge[] | undefined
  readonly allBalanceData: Balance[] | undefined
  readonly fetching: boolean
  searchInput: string
  handleOnInputChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default PoolContainer
