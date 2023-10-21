import React, {
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'

import UserModule from '@/Modules/User'

import { useGetPool } from '@/Hooks/AMM/useGetPool'
import { Pool } from '@/Constants/API/pool'
import { Coins, CoinInterface, fetchCoinByType } from '@/Constants/coin'
import { useGetGauge } from '@/Hooks/Vote/useGetGauge'
import { Gauge } from '@/Constants/API/vote'

export const LiquidityContext = React.createContext<LiquidityContext>({
  walletAddress: null,
  poolData: null,
  gaugeData: null,
  fetching: false,
  error: undefined,
  setError: () => { },
  coinInputX: '',
  coinTypeX: Coins[0],
  coinInputY: '',
  coinTypeY: Coins[1],
  coinInputSingle: '',
  setCoinInputX: () => { },
  setCoinInputY: () => { },
  setCoinInputSingle: () => { },
  setCoinTypeX: () => { },
  setCoinTypeY: () => { },
})

export const useLiquidityContext = () => useContext(LiquidityContext)


const LiquidityContainer = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState<string>()
  const location = useLocation()
  const _poolId = location.search.split('?')[1]

  const walletAddress = UserModule.getUserToken()

  if (!walletAddress) return null

  const { data: poolData, isLoading: isPoolDataLoading } = useGetPool(_poolId)

  const [coinInputX, setCoinInputX] = useState<string>('')
  const [coinTypeX, setCoinTypeX] = useState<CoinInterface>(Coins[0])
  const [coinInputY, setCoinInputY] = useState<string>('')
  const [coinTypeY, setCoinTypeY] = useState<CoinInterface>(Coins[1])
  const [coinInputSingle, setCoinInputSingle] = useState('')

  const gauge = useGetGauge(poolData?.type_x, poolData?.type_y)

  useEffect(() => {
    setCoinTypeX(fetchCoinByType(poolData?.type_x))
    setCoinTypeY(fetchCoinByType(poolData?.type_y))
  }, [poolData])

  return (
    <LiquidityContext.Provider
      value={{
        walletAddress,
        poolData: poolData,
        gaugeData: gauge,
        fetching: isPoolDataLoading,
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
  readonly gaugeData: Gauge | null
  readonly fetching: boolean
  readonly error: string | undefined
  walletAddress: string | null
  setError: Function
  coinInputX: string
  coinTypeX: CoinInterface
  coinInputY: string
  coinTypeY: CoinInterface
  coinInputSingle: string
  setCoinInputX: Function
  setCoinInputY: Function
  setCoinInputSingle: Function
  setCoinTypeX: Function
  setCoinTypeY: Function
}

export default LiquidityContainer
