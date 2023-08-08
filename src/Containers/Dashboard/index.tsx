import React, { useState, useContext } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'
import { SUI_TYPE_ARG } from '@mysten/sui.js'

//import { get_vsdb } from '@/Constants/API/vsdb'
import useRpc from '@/Hooks/useRpc'
import coins_json from '@/../public/coins.json'
import { formatBalance, useGetCoinBalance } from '@/Hooks/coin'

export const DashboardContext = React.createContext<DashboardContext>({
  data: null,
  fetching: false,
  walletAddress: null,
  handleFetchData: () => {},
})

export const useDashboardContext = () => useContext(DashboardContext)

export const DashboardContainer = ({ children }: PropsWithChildren) => {
  const [data, setData] = useState(null)
  const [fetching, setFetching] = useState(false)
  const provider = useRpc()

  const wallet = useWalletKit()
  const walletAddress =
    wallet.currentAccount?.address ||
    '0x0b3fc768f8bb3c772321e3e7781cac4a45585b4bc64043686beb634d65341798'
  
  const type = `0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_btc::MOCK_BTC`
  const { data: balance, isLoading } = useGetCoinBalance(
    type,
    walletAddress,
  )

  if (!isLoading && balance?.totalBalance)
    console.log(formatBalance(balance.totalBalance, 8))

  const handleFetchData = async () => {
    const pkg =
      '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1'
    // const res = await get_vsdb(provider, walletAddress)
    const sui_bal = await provider.getBalance({
      owner: walletAddress,
      coinType: SUI_TYPE_ARG,
    })
    const btc_bal = await provider.getBalance({
      owner: walletAddress,
      coinType: `${pkg}::mock_btc::MOCK_BTC`,
    })
    const eth_bal = await provider.getBalance({
      owner: walletAddress,
      coinType: `${pkg}::mock_eth::MOCK_ETH`,
    })
    const usdc_bal = await provider.getBalance({
      owner: walletAddress,
      coinType: `${pkg}::mock_usdc::MOCK_USDC`,
    })
    const usdt_bal = await provider.getBalance({
      owner: walletAddress,
      coinType: `${pkg}::mock_usdt::MOCK_USDT`,
    })

    console.log('sui_bal: ', sui_bal)
    console.log('btc_bal: ', btc_bal)
    console.log('eth_bal: ', eth_bal)
    console.log('usdc_bal: ', usdc_bal)
    console.log('usdt_bal: ', usdt_bal)
  }

  return (
    <DashboardContext.Provider
      value={{
        data,
        fetching,
        walletAddress,
        handleFetchData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

interface DashboardContext {
  readonly data: [] | null
  readonly fetching: boolean
  readonly walletAddress: string | null
  handleFetchData: Function
}

export default DashboardContainer
