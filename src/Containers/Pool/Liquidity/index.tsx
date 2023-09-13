import React, { useState, useContext, PropsWithChildren, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import UserModule from '@/Modules/User'

import { useRemoveLiquidity } from '@/Hooks/AMM/removeLiquidity'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useGetPool } from '@/Hooks/AMM/useGetPool'
import { useGetLP } from '@/Hooks/AMM/useGetLP'
import { Pool } from '@/Constants/API/pool'
import { useGetFarmIDs, useGetMulFarm } from '@/Hooks/Farm/useGetFarm'
import { Farm } from '@/Constants/API/farm'

const LiquidityContext = React.createContext<LiquidityContext>({
  walletAddress: null,
  poolData: null,
  farmData: null,
  fetching: false,
  error: undefined,
  setError: () => {},
})

export const useLiquidityContext = () => useContext(LiquidityContext)

const LiquidityContainer = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState<string>()
  const [fetching, _setFetching] = useState(false)
  const location = useLocation()
  const _poolId = location.search.split('?')[1]

  const walletAddress = UserModule.getUserToken()

  if (!walletAddress) return null

  const { data: poolData, isLoading: isPoolDataLoading } = useGetPool(_poolId)

  // find farm
  const { data: farmIds } = useGetFarmIDs()
  const { data: farmData, isLoading: isFarmDataLoading } =
    useGetMulFarm(farmIds)

  const farm = useMemo(
    () =>
      farmData?.find(
        (f) => f.type_x == poolData?.type_x && f.type_y == poolData.type_y,
      ) ?? null,
    [farmData, poolData],
  )

  return (
    <LiquidityContext.Provider
      value={{
        walletAddress,
        poolData: poolData,
        farmData: farm,
        fetching: isPoolDataLoading || isFarmDataLoading,
        error,
        setError,
      }}
    >
      {children}
    </LiquidityContext.Provider>
  )
}

interface LiquidityContext {
  readonly poolData: Pool | null | undefined
  readonly farmData: Farm | null
  readonly fetching: boolean
  readonly error: string | undefined
  walletAddress: string | null
  setError: Function
}

export default LiquidityContainer
