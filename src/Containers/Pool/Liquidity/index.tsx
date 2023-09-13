import React, { useState, useContext, PropsWithChildren, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import UserModule from '@/Modules/User'

import { useGetPool } from '@/Hooks/AMM/useGetPool'
import { Pool } from '@/Constants/API/pool'
import { Coins, CoinInterface } from '@/Constants/coin'
import { useGetFarmIDs, useGetMulFarm } from '@/Hooks/Farm/useGetFarm'
import { Farm } from '@/Constants/API/farm'

const LiquidityContext = React.createContext<LiquidityContext>({
  walletAddress: null,
  poolData: null,
  farmData: null,
  fetching: false,
  error: undefined,
  setError: () => {},
  coinInputX: '',
  coinTypeX: undefined,
  coinInputY: '',
  coinTypeY: undefined,
  coinInputSingle: '',
  setCoinInputX: () => {},
  setCoinInputY: () => {},
  setCoinInputSingle: () => {},
  setCoinTypeX: () => {},
  setCoinTypeY: () => {},
})

export const useLiquidityContext = () => useContext(LiquidityContext)

const fetchIcon = (type: string | undefined) => Coins.find((coin) => coin.type === type)

const LiquidityContainer = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState<string>()
  const location = useLocation()
  const _poolId = location.search.split('?')[1]

  const walletAddress = UserModule.getUserToken()

  if (!walletAddress) return null

  const { data: poolData, isLoading: isPoolDataLoading } = useGetPool(_poolId)

  const [coinInputX, setCoinInputX] = useState<string>('')
  const [coinTypeX, setCoinTypeX] = useState<CoinInterface | undefined>()
  const [coinInputY, setCoinInputY] = useState<string>('')
  const [coinTypeY, setCoinTypeY] = useState<CoinInterface | undefined>()
  const [coinInputSingle, setCoinInputSingle] = useState('')

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

  useEffect(() => {
    setCoinTypeX(fetchIcon(poolData?.type_x))
    setCoinTypeY(fetchIcon(poolData?.type_y))
  }, [poolData])

  return (
    <LiquidityContext.Provider
      value={{
        walletAddress,
        poolData: poolData,
        farmData: farm,
        fetching: isPoolDataLoading || isFarmDataLoading,
        error,
        setError,
        coinInputX,
        coinTypeX,
        coinInputY,
        coinTypeY,
        coinInputSingle,
        setCoinInputX,
        setCoinInputY,
        setCoinTypeX,
        setCoinTypeY,
        setCoinInputSingle,
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
  coinInputX: string,
  coinTypeX: CoinInterface | undefined,
  coinInputY: string,
  coinTypeY: CoinInterface | undefined,
  coinInputSingle: string,
  setCoinInputX: Function,
  setCoinInputY: Function,
  setCoinInputSingle: Function,
  setCoinTypeX: Function,
  setCoinTypeY: Function,
}

export default LiquidityContainer
