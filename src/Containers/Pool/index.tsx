import { Button } from '@/Components'
import { Coin } from '@/Constants/coin'
import { useRemoveLiquidity } from '@/Hooks/AMM/removeLiquidity'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useGetMulLP } from '@/Hooks/AMM/useGetLP'
import {
  useGetMulPool,
  useGetPool,
  useGetPoolIDs,
} from '@/Hooks/AMM/useGetPool'
import { useSwap } from '@/Hooks/AMM/useSwap'
import { useZap } from '@/Hooks/AMM/useZap'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { useWalletKit } from '@mysten/wallet-kit'
import React, { useState, useContext, PropsWithChildren, useMemo } from 'react'

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
  const pools = useGetMulPool(pool_ids?.data)
  const pool = useGetPool(pool_ids?.data?.[0])
  // balance
  const balance_x = useGetBalance(Coin.SDB, currentAccount?.address)
  // LP
  const lps = useGetMulLP(currentAccount?.address)

  // find corresponding LP
  const lp = useMemo(
    () =>
      lps?.data?.find(
        (lp) =>
          lp.type_x == pool?.data?.type_x &&
          lp.type_y == pool?.data?.type_y &&
          pool?.data,
      ),
    [lps?.data, pool?.data],
  )

  //mutation
  const add_liquidity = useAddLiquidity()
  const zap = useZap()
  const withdraw = useRemoveLiquidity()
  const swap = useSwap()

  const handleAddLiquidity = () => {
    if (pools[0]?.data && balance_x?.coinType) {
      const pool = pools[0].data
      add_liquidity.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        is_type_x: pool.type_x == balance_x?.coinType,
        lp_id: lp ? lp.id : null,
        input_a_value: '3147131016',
        input_b_value: '1000000000',
      })
    }
  }


  const handleZap = () => {
    if (pool?.data && balance_x?.coinType) {
      zap.mutate({
        pool_id: pool.data.id,
        pool_type_x: pool?.data.type_x,
        pool_type_y: pool?.data.type_y,
        reserve_x: pool?.data.reserve_x,
        reserve_y: pool?.data.reserve_y,
        fee: pool?.data.fee.fee_percentage,
        is_type_x: pool?.data?.type_x == balance_x.coinType,
        lp_id: lp ? lp.id : null,
        input_value: '10000000000',
      })
    }
  }

  const handleWithdraw = () => {
    if (pools[0]?.data && lp) {
      const pool = pools[0].data
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
    if (pools[0]?.data && balance_x?.coinType) {
      const pool = pools[0].data
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
        text='SDB/SUI LP'
        onClick={handleAddLiquidity}
      />
      <Button styletype='filled' text='Lock SDB' onClick={() => { }} />
      <Button styletype='filled' text='Zap' onClick={handleZap} />
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
