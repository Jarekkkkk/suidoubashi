import { Button } from '@/Components'
import { Coin } from '@/Constants/coin'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useGetLP } from '@/Hooks/AMM/useGetLP'
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { useWalletKit } from '@mysten/wallet-kit'
import React, { useState, useContext, PropsWithChildren } from 'react'

const PoolContext = React.createContext<PoolContext>({
  data: null,
  fetching: false,
})
export const usePoolContext = () => useContext(PoolContext)

const PoolContainer = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(false)

  const { currentAccount } = useWalletKit()
  const pool_ids = useGetPoolIDs()
  const pools = useGetMulPool(pool_ids?.data)
  const add_liquidity = useAddLiquidity()

  //coins
  const balance_x = useGetBalance(Coin.SDB, currentAccount?.address)

  const lp = useGetLP(currentAccount?.address, pools[0]?.data?.type_x, pools[0]?.data?.type_y)
  console.log(lp?.data)
  const handleAddLiquidity = () => {
    if (pools[0]?.data && balance_x.data?.coinType) {
      const pool = pools[0].data
      add_liquidity.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        is_type_x: pool.type_x == balance_x.data?.coinType,
        lp_id: null,
        coin_x_value: '20000000000',
        coin_y_value: '5000000000',
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
      <Button styleType='filled' text='Mint SDB' onClick={handleAddLiquidity} />
      {children}
    </PoolContext.Provider>
  )
}

interface PoolContext {
  readonly data: [] | null
  readonly fetching: boolean
}

export default PoolContainer
