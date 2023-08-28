import { Button } from '@/Components'
import { Coin } from '@/Constants/coin'
import { useRemoveLiquidity } from '@/Hooks/AMM/removeLiquidity'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useGetAllLP, useGetLP } from '@/Hooks/AMM/useGetLP'
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'
import { useSwap } from '@/Hooks/AMM/useSwap'
import { useZap } from '@/Hooks/AMM/useZap'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { useWalletKit } from '@mysten/wallet-kit'
import React, {
  useState,
  useContext,
  PropsWithChildren,
  useMemo,
  useCallback,
} from 'react'

const PoolContext = React.createContext<PoolContext>({
  data: null,
  fetching: false,
})

export const usePoolContext = () => useContext(PoolContext)

const PoolContainer = ({ children }: PropsWithChildren) => {
  const [data, _setData] = useState(null)
  const [fetching, _setFetching] = useState(false)

  const { currentAccount } = useWalletKit()
  // pool
  const pool_ids = useGetPoolIDs()
  const { data: pools } = useGetMulPool(pool_ids?.data)
  // balance
  const balance_x = useGetBalance(Coin.SDB, currentAccount?.address)
  // LP
  const { data: lps } = useGetAllLP(currentAccount?.address)

  // ipnut
  const [input, setInput] = useState<string>('')
  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setInput(value)
    },
    [setInput],
  )
  const [coinInput, setCoinInput] = useState<Coin>(Coin.USDC)
  const [coinInput2, setCoinInput2] = useState<Coin>(Coin.SDB)

  // find corresponding PoolContext
  const pool = useMemo(() => {
    return (
      pools?.find(
        (p) =>
          (p.type_x == coinInput && p.type_y == coinInput2) ||
          (p.type_x == coinInput2 && p.type_y == coinInput),
      ) ?? null
    )
  }, [coinInput, coinInput2, pools])
  // find corresponding LP
  const lp = useGetLP(currentAccount?.address, pool?.type_x, pool?.type_y)
  //mutation
  const add_liquidity = useAddLiquidity()
  const zap = useZap()
  const withdraw = useRemoveLiquidity()
  const swap = useSwap()

  const handleAddLiquidity = () => {
    if (pool && lp !== undefined) {
      add_liquidity.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        lp_id: lp ? lp.id : null,
        input_x_value: '100000000',
        input_y_value: '100000000',
      })
    }
  }

  const handleZap = () => {
    if (pool && lp !== undefined) {
      zap.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        stable: pool.stable,
        reserve_x: pool.reserve_x,
        reserve_y: pool.reserve_y,
        fee: pool?.fee.fee_percentage,
        lp_id: lp ? lp.id : null,
        input_type: coinInput2,
        input_value: '100000000',
      })
    }
  }

  const handleWithdraw = () => {
    if (pools?.[0] && lp) {
      const pool = pools[0]
      withdraw.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        lp_id: lp.id,
        withdrawl: (BigInt(lp.lp_balance) / BigInt('10')).toString(),
      })
    }
  }

  const handleSwap = () => {
    if (pools?.[0] && balance_x?.coinType) {
      const pool = pools[0]
      swap.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        is_type_x: pool.type_x == balance_x.coinType,
        input_value: '1000000000',
        output_value: '0',
      })
    }
  }

  return (
    <PoolContext.Provider
      value={{
        data,
        fetching,
      }}
    >
      <Button
        styletype='filled'
        text='USDC/USDT LP'
        onClick={handleAddLiquidity}
      />
      <Button
        styletype='filled'
        text={zap.isLoading ? '...' : 'Zap'}
        disabled={zap.isLoading}
        onClick={handleZap}
      />
      <Button styletype='filled' text='Withdraw' onClick={handleWithdraw} />
      <Button styletype='filled' text='Swap' onClick={handleSwap} />
      {children}
    </PoolContext.Provider>
  )
}

interface PoolContext {
  readonly data: [] | null
  readonly fetching: boolean
}

export default PoolContainer
