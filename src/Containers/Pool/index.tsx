import {
  useGetMulPool,
  useGetPoolIDs,
} from '@/Hooks/AMM/useGetPool'
import React, {
  useState,
  useContext,
  PropsWithChildren,
} from 'react'

const PoolContext = React.createContext<PoolContext>({
  data: null,
  fetching: false,
})
export const usePoolContext = () => useContext(PoolContext)

const PoolContainer = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(false)

  const pool_ids = useGetPoolIDs()
  const pools = useGetMulPool(pool_ids?.data)



  const handleFetchData = () => {
    return
  }

  return (
    <PoolContext.Provider
      value={{
        data,
        fetching,
      }}
    >
      {children}
    </PoolContext.Provider>
  )
}

interface PoolContext {
  readonly data: [] | null
  readonly fetching: boolean
}

export default PoolContainer
