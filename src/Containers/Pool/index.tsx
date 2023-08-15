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
import { useZap } from '@/Hooks/AMM/useZap'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { useLock } from '@/Hooks/VSDB/useLock'
import { useWalletKit } from '@mysten/wallet-kit'
import React, { useState, useContext, PropsWithChildren, useMemo } from 'react'

const PoolContext = React.createContext<PoolContext>({
  data: null,
  fetching: false,
})
export const usePoolContext = () => useContext(PoolContext)

const PoolContainer = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(false)

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
  const lock_sdb = useLock()
  const add_liquidity = useAddLiquidity()
  const zap = useZap()
  const withdraw = useRemoveLiquidity()

  const handleAddLiquidity = () => {
    if (pools[0]?.data && balance_x.data?.coinType) {
      const pool = pools[0].data
      add_liquidity.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        is_type_x: pool.type_x == balance_x.data?.coinType,
        lp_id: lp ? lp.id : null,
        coin_x_value: '1625352078',
        coin_y_value: '500000000',
      })
    }
  }

  const handleLock = () => {
    lock_sdb.mutate({
      depositValue: '50000000000000',
      extended_duration: '12096000',
    })
  }

  const handleZap = () => {
    if (pool?.data && balance_x?.data?.coinType) {
      zap.mutate({
        pool_id: pool?.data.id,
        pool_type_x: pool?.data.type_x,
        pool_type_y: pool?.data.type_y,
        is_type_x: pool?.data?.type_x == balance_x?.data?.coinType,
        lp_id: lp ? lp.id : null,
        coin_value: '500000000',
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

  const handleFetchData = () => {}
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
      <Button styletype='filled' text='Lock SDB' onClick={handleLock} />
      <Button styletype='filled' text='Zap' onClick={handleZap} />
      <Button styletype='filled' text='Withdraw' onClick={handleWithdraw} />
      {children}
    </PoolContext.Provider>
  )
}

interface PoolContext {
  readonly data: [] | null
  readonly fetching: boolean
}

export default PoolContainer
