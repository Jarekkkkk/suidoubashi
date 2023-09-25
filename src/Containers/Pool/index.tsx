import { ChangeEvent, PropsWithChildren, useCallback, useContext, useState } from 'react'
import { Pool } from '@/Constants/API/pool'
import { regexEn } from '@/Constants/index'
import UserModule from '@/Modules/User'
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'
import React from 'react'
import { Balance, useGetAllBalance } from '@/Hooks/Coin/useGetBalance'
import { Coins } from '@/Constants/coin'

const PoolContext = React.createContext<PoolContext>({
  poolsData: undefined,
  allBalanceData: undefined,
  fetching: false,
  searchInput: '',
  handleOnInputChange: () => {},
})

export const usePoolContext = () => useContext(PoolContext)

const PoolContainer = ({ children }: PropsWithChildren) => {
  const [fetching, _setFetching] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const walletAddress = UserModule.getUserToken()
  if (!walletAddress) return null

  const pool_ids = useGetPoolIDs()
  const { data: pools, isLoading: isAllPoolLoading } = useGetMulPool(pool_ids?.data)
  const { data: allBalance, isLoading: isAllBalanceLoading } = useGetAllBalance(
    Coins,
    walletAddress,
  )


  const _poolsData = pools?.filter((pool) => new RegExp(searchInput, 'ig').test(pool.name));

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
        allBalanceData: allBalance,
        fetching: isAllPoolLoading || isAllBalanceLoading,
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
  readonly allBalanceData: Balance[] | undefined
  readonly fetching: boolean
  searchInput: string,
  handleOnInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

export default PoolContainer
