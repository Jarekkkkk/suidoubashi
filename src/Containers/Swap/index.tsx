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
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'
import { Pool } from '@/Constants/API/pool'
import { useGetAllBalance, Balance } from '@/Hooks/Coin/useGetBalance'
import { useSwap } from '@/Hooks/AMM/useSwap'

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
  fetchPrice: () => {},
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


  const fetchPrice = (sort: boolean) => {
    if (sort) {
      const price = Number(pool?.reserve_x) / Number(pool?.reserve_y)
      return `
					1 ${Coins.filter((coin) => coin.type === pool?.type_x)[0]?.name} =
					${isNaN(price) ? '0' : price.toFixed(5)} ${Coins.filter(
            (coin) => coin.type === pool?.type_y,
          )[0]?.name}
				`
    } else {
      const price = Number(pool?.reserve_y) / Number(pool?.reserve_x)
      return `
					1 ${Coins.filter((coin) => coin.type === pool?.type_y)[0]?.name} =
${isNaN(price) ? '0' : price.toFixed(5)} ${Coins.filter(
        (coin) => coin.type === pool?.type_x,
      )[0]?.name}
				`
    }
  }

  const handleOnCoinInputFirstChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
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
        fetchPrice,
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
  fetchPrice: Function
  pool: Pool | null
}

export default SwapContainer
