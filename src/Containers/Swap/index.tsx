import React, {
  useState,
  useContext,
  PropsWithChildren,
  useCallback,
  useMemo,
} from 'react'
import UserModule from '@/Modules/User'
import { CoinIcon } from '@/Assets/icon'
import { Coins, Coin, CoinInterface } from '@/Constants/coin'
import { regexNumber } from '@/Constants/index'
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'
import { Pool } from '@/Constants/API/pool'
import { useGetAllBalance, Balance } from '@/Hooks/Coin/useGetBalance'

const SwapContext = React.createContext<SwapContext>({
  coinData: undefined,
  isCoinDataLoading: false,
  error: undefined,
  coinInputFirst: '',
  coinTypeFirst: {
    type: Coin.SUI,
    logo: <CoinIcon.SUIIcon />,
    name: 'SUI',
    decimals: 9,
  },
  coinInputSecond: '',
  coinTypeSecond: {
    type: Coin.SDB,
    logo: <CoinIcon.SDBIcon />,
    name: 'SDB',
    decimals: 9,
  },
  handleOnCoinInputFirstChange: () => {},
  handleOnCoinInputSecondChange: () => {},
  isShowSelectModal: false,
  setIsShowSelectModal: () => {},
  setCoinTypeFirst: () => {},
  setCoinTypeSecond: () => {},
  setError: () => {},
  walletAddress: null,
  pool: null,
})

export const useSwapContext = () => useContext(SwapContext)

const SwapContainer = ({ children }: PropsWithChildren) => {
  const [error, setError] = useState<string>()
  const [coinInputFirst, setCoinInputFirst] = useState<string>('')
  const [coinTypeFirst, setCoinTypeFirst] = useState<CoinInterface>(
    Coins.filter((coin) => coin.name === 'SUI')[0],
  )
  const [coinInputSecond, setCoinInputSecond] = useState<string>('')
  const [coinTypeSecond, setCoinTypeSecond] = useState<CoinInterface>(
    Coins.filter((coin) => coin.name === 'SDB')[0],
  )
  const [isShowSelectModal, setIsShowSelectModal] = useState<boolean>(false)

  const walletAddress = UserModule.getUserToken()
  const { data: coinData, isLoading: isCoinDataLoading } = useGetAllBalance(
    Coins,
    walletAddress,
  )

  // pools
  const { data: pool_ids } = useGetPoolIDs()
  const { data: pools } = useGetMulPool(pool_ids)
  const pool = useMemo(
    () =>
      pools?.find(
        (p) =>
          (p.type_x == coinTypeFirst?.type &&
            p.type_y == coinTypeSecond?.type) ||
          (p.type_x == coinTypeSecond?.type && p.type_y == coinTypeFirst?.type),
      ) ?? null,
    [coinTypeFirst?.type, coinTypeSecond?.type, pools],
  )

  const handleOnCoinInputFirstChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = regexNumber.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputFirst(value)
    },
    [setCoinInputFirst],
  )

  const handleOnCoinInputSecondChange = useCallback(
    (value: string) => {
      setCoinInputSecond(value)
    },
    [setCoinInputSecond],
  )

  return (
    <SwapContext.Provider
      value={{
        coinData,
        isCoinDataLoading,
        coinInputFirst,
        coinTypeFirst,
        coinInputSecond,
        coinTypeSecond,
        handleOnCoinInputFirstChange,
        handleOnCoinInputSecondChange,
        isShowSelectModal,
        setIsShowSelectModal,
        setCoinTypeFirst,
        setCoinTypeSecond,
        error,
        setError,
        walletAddress,
        pool,
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

interface SwapContext {
  readonly coinData: Balance[] | undefined
  readonly isCoinDataLoading: boolean
  readonly error: string | undefined
  coinInputFirst: string
  coinTypeFirst: CoinInterface | undefined
  coinInputSecond: string
  coinTypeSecond: CoinInterface | undefined
  handleOnCoinInputFirstChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleOnCoinInputSecondChange: (v: string) => void
  isShowSelectModal: boolean
  setIsShowSelectModal: Function
  setCoinTypeFirst: Function
  setCoinTypeSecond: Function
  setError: Function
  walletAddress: string | null
  pool: Pool | null
}

export default SwapContainer
