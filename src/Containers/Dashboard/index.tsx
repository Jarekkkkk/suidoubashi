import React, { useContext, PropsWithChildren } from 'react'
import UserModule from '@/Modules/User'

export const DashboardContext = React.createContext<DashboardContext>({
  walletAddress: null,
})

export const useDashboardContext = () => useContext(DashboardContext)

export const DashboardContainer = ({ children }: PropsWithChildren) => {
  const walletAddress = UserModule.getUserToken()

  return (
    <DashboardContext.Provider
      value={{
        walletAddress,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

interface DashboardContext {
  readonly walletAddress: String | null
}

export default DashboardContainer
