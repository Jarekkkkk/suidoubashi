
import React, { useState, useContext, PropsWithChildren } from 'react'

const LiquidityContext = React.createContext<LiquidityContext>({
  data: null,
  fetching: false,
})

export const useLiquidityContext = () => useContext(LiquidityContext)

const LiquidityContainer = ({ children }: PropsWithChildren) => {
  const [data, _setData] = useState(null)
  const [fetching, _setFetching] = useState(false)

  return (
    <LiquidityContext.Provider
      value={{
        data,
        fetching,
      }}
    >
      {children}
    </LiquidityContext.Provider>
  )
}

interface LiquidityContext {
  readonly data: [] | null
  readonly fetching: boolean
}

export default LiquidityContainer
