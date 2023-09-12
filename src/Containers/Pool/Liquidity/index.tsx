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
  handleWithdraw: Function,
  handleAddLiquidity: Function,
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

  const lp = useGetLP(walletAddress, poolData?.type_x, poolData?.type_y)

  const add_liquidity = useAddLiquidity()

  const withdraw = useRemoveLiquidity()

  const handleWithdraw = () => {
    if (poolData && lp) {
      withdraw.mutate({
        pool_id: poolData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        lp_id: lp.id,
        withdrawl: (BigInt(lp.lp_balance) / BigInt('10')).toString(),
      })
    }
  }

  const handleAddLiquidity = () => {
    if (poolData && lp !== undefined) {
      add_liquidity.mutate({
        pool_id: poolData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        lp_id: lp ? lp.id : null,
        input_x_value: '100000000',
        input_y_value: '100000000',
      })
    }
  }

  return (
    <LiquidityContext.Provider
      value={{
        walletAddress,
        poolData: poolData,
        fetching: isPoolDataLoading,
        error,
        setError,
        handleWithdraw,
        handleAddLiquidity,
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
  handleWithdraw: Function,
  handleAddLiquidity: Function,
  setError: Function,
}

export default LiquidityContainer
