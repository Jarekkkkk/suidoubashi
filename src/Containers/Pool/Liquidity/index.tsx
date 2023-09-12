import React, { useState, useContext, PropsWithChildren } from 'react'
import { useLocation } from 'react-router-dom'

import UserModule from '@/Modules/User'

import { useRemoveLiquidity } from '@/Hooks/AMM/removeLiquidity'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useGetPool } from '@/Hooks/AMM/useGetPool'
import { useGetLP } from '@/Hooks/AMM/useGetLP'
import { Pool } from '@/Constants/API/pool'

const LiquidityContext = React.createContext<LiquidityContext>({
  walletAddress: null,
  poolData: null,
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

  return (
    <LiquidityContext.Provider
      value={{
        walletAddress,
        poolData: poolData,
        fetching: isPoolDataLoading,
        error,
        setError,
      }}
    >
      {children}
    </LiquidityContext.Provider>
  )
}

interface LiquidityContext {
  readonly poolData: Pool | null | undefined,
  readonly fetching: boolean,
  readonly error: string | undefined,
  walletAddress: string | null,
  setError: Function,
}

export default LiquidityContainer
