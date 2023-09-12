import { useCallback } from 'react'
import { Button } from '@/Components'
import { Pool } from '@/Constants/API/pool'
import { Coin, Coins } from '@/Constants/coin'
import UserModule from '@/Modules/User'
import { useRemoveLiquidity } from '@/Hooks/AMM/removeLiquidity'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useGetLP } from '@/Hooks/AMM/useGetLP'
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'
import { useSwap } from '@/Hooks/AMM/useSwap'
import { useZap } from '@/Hooks/AMM/useZap'
import useGetBalance, { useGetAllBalance, Balance } from '@/Hooks/Coin/useGetBalance'
import React, { useState, useContext, PropsWithChildren, useMemo, ChangeEvent } from 'react'

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

  // pool
  const pool_ids = useGetPoolIDs()
  const { data: pools, isLoading: isAllPoolLoading } = useGetMulPool(pool_ids?.data)
  // balance
  const balance_x = useGetBalance(Coin.SDB, walletAddress)

  // Balance
  const { data: allBalance, isLoading: isAllBalanceLoading } = useGetAllBalance(
    Coins,
    walletAddress,
  )

  // LP
  //const { data: lps } = useGetAllLP(currentAccount?.address)

  // ipnut
  const [coinInput, _setCoinInput] = useState<Coin>(Coin.USDC)
  const [coinInput2, _setCoinInput2] = useState<Coin>(Coin.SDB)

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
  const lp = useGetLP(walletAddress, pool?.type_x, pool?.type_y)
  //mutation
  const add_liquidity = useAddLiquidity()
  const zap = useZap()
  const withdraw = useRemoveLiquidity()
  const swap = useSwap()

  const _poolsData = pools?.filter((pool) => new RegExp(searchInput, 'ig').test(pool.name));

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

  const handleOnInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\D*\.?\D*$/.test(value)
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
      <Button
        styletype='filled'
        text='USDC/USDT LP pair Deposit'
        onClick={handleAddLiquidity}
      />
      <Button
        styletype='filled'
        text={zap.isLoading ? '...' : 'Zap single Deposit'}
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
  readonly poolsData: Pool[] | undefined
  readonly allBalanceData: Balance[] | undefined
  readonly fetching: boolean
  searchInput: string,
  handleOnInputChange: (e: ChangeEvent<HTMLInputElement>) => void,
}

export default PoolContainer
