import React, { useState, useContext } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'
import { SUI_TYPE_ARG, TransactionBlock } from '@mysten/sui.js'
import { get_vsdb, lock, mint_sdb } from '@/Constants/API/vsdb'

import useRpc from '@/Hooks/useRpc'
import { formatBalance, payCoin } from '@/Utils/coin'
import { useGetBalance } from '@/Hooks/Coin/useGetBalance'


import { useGetCoins } from '@/Hooks/Coin/useGetCoin'
import { useGetVSDB } from '@/Hooks/VSDB/useGetVSDB'
import { Button, Coincard } from '@/Components'
import { CoinIcon } from '@/Assets/icon'

const devnet_coins = {
  BTC: '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_btc::MOCK_BTC',
  ETH: '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_eth::MOCK_ETH',
  USDC: '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_usdc::MOCK_USDC',
  USDT: '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_usdt::USDT',
  SDB: '0x2cbce1ca3f0a0db8ec8e920eeb4602bf88c1dbb639edcb3c7cd4c579a7be77c5::sdb::SDB',
}

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

  const { currentAccount, signTransactionBlock } = useWalletKit()
  const walletAddress =
    currentAccount?.address ??
    '0x0b3fc768f8bb3c772321e3e7781cac4a45585b4bc64043686beb634d65341798'

  const btc_balance = useGetBalance(devnet_coins.BTC, walletAddress)

  //  console.log("--- balances ---")
  //  const balance = useGetBalance(devnet_coins.BTC, walletAddress)
  //  if(!(balance.isLoading || balance.isFetching) && balance?.data) console.log(balance.data)
  //  console.log("--- coins ---")
  //  const coins = useGetCoins(devnet_coins.BTC, walletAddress)
  //  if(!(coins.isLoading || coins.isFetching || coins.hasNextPage) && coins?.data){ console.log(coins.data.pages.flatMap((page)=>page.data))}

  console.log('--- vsdb ---')
  const vsdb = useGetVSDB(walletAddress)
  if (!(vsdb.isFetching || vsdb.isLoading || vsdb.hasNextPage) && vsdb?.data)
    console.log(vsdb.data)
  console.log(vsdb?.data?.pages.length)

  const mint_sdb_action = async () => {
    const txb = new TransactionBlock()
    mint_sdb(txb, walletAddress)
    let signed_tx = await signTransactionBlock({ transactionBlock: txb })
    const res = await provider.executeTransactionBlock({
      transactionBlock: signed_tx.transactionBlockBytes,
      signature: signed_tx.signature,
      options: {
        showEffects: true,
      },
    })
    console.log(res)
  }
  const sdb_coins = useGetCoins(devnet_coins.SDB, walletAddress)
  const lock_vsdb_action = async () => {
    if (sdb_coins?.data) {
      const txb = new TransactionBlock()
      const sdb_coin = payCoin(
        txb,
        sdb_coins.data.pages[0],
        1000000000000,
        false,
      )
      lock(txb, sdb_coin, '604800')
      let signed_tx = await signTransactionBlock({ transactionBlock: txb })
      const res = await provider.executeTransactionBlock({
        transactionBlock: signed_tx.transactionBlockBytes,
        signature: signed_tx.signature,
        options: {
          showEffects: true,
        },
      })
      console.log(res)
    }
  }

  const handleFetchData = () => {}

  if (!walletAddress) return <div>"No Wallet Address"</div>
  return (
    <DashboardContext.Provider
      value={{
        data,
        fetching,
        walletAddress,
        handleFetchData,
      }}
    >
      <Button
        styleType='filled'
        text='Mint SDB'
        onClick={() => mint_sdb_action()}
      />
      <Button
        styleType='outlined'
        text='Lock VSDB'
        onClick={() => lock_vsdb_action()}
      />
      {btc_balance?.data && (
        <Coincard
          coinIcon={<CoinIcon.USDCIcon />}
          coinName={'BTC'}
          coinValue={formatBalance(btc_balance.data?.totalBalance, 6)}
        />
      )}
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
