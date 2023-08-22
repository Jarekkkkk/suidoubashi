import React, { useState, useContext, useEffect, PropsWithChildren } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'

export const DashboardContext = React.createContext<DashboardContext>({
  walletAddress: '',
  handleFetchWallet: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

export const DashboardContainer = ({ children }: PropsWithChildren) => {
  const [walletAddress, setWalletAddress] = useState<String | undefined>();
  const { currentAccount } = useWalletKit();

  const handleFetchWallet = () => {
    setWalletAddress(currentAccount?.address)
  };

  useEffect(() => {
    handleFetchWallet();
  });

  return (
    <DashboardContext.Provider
      value={{
        walletAddress,
        handleFetchWallet,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
};

interface DashboardContext {
  readonly walletAddress: String | undefined,
  handleFetchWallet: Function,
};

export default DashboardContainer;
