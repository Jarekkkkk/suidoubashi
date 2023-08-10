import React, { useState, useContext } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'
import { SUI_TYPE_ARG, TransactionBlock } from '@mysten/sui.js'
import { get_vsdb, lock, mint_sdb } from '@/Constants/API/vsdb'

import useRpc from '@/Hooks/useRpc'
import { formatBalance } from '@/Utils/format'
import { payCoin } from '@/Utils/payCoin'
import { useGetBalances } from '@/Hooks/Coin/useGetBalance'

import sdb_icon from '@/Assets/icon/coin/sdb.png'
import { useGetCoins } from '@/Hooks/Coin/useGetCoins'
import { useGetVSDB } from '@/Hooks/VSDB/useGetVSDB'
import { Button, Coincard, NFTCard } from '@/Components'

import { Coin, Coins } from '@/Constants/coin'
import { useMintSDB } from '@/Hooks/VSDB/useMintSDB'

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

  // -- Balances
  const balances = useGetBalances(Coins, currentAccount?.address)

  console.log('--- vsdb ---')
  const vsdb = useGetVSDB(walletAddress)
  if (!(vsdb.isFetching || vsdb.isLoading || vsdb.hasNextPage) && vsdb?.data)
    console.log(vsdb.data)

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
  const sdb_coins = useGetCoins(Coin.SDB, walletAddress)
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

  const mint_sdb = useMintSDB()

  const handleFetchData = () => {
    console.log('handle fetch data')
  }

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
        onClick={() => mint_sdb.mutate()}
      />
      {mint_sdb.isLoading && <div>Loading</div>}
      <Button
        styleType='outlined'
        text='Lock VSDB'
        onClick={() => lock_vsdb_action()}
      />
      {balances.map((balance, idx) => (
        <Coincard
          coinIcon={
            <img
              src={Coins[idx].logo}
              style={{ width: '32px', height: '32px' }}
            />
          }
          coinName={Coins[idx].name}
          coinValue={formatBalance(balance?.data?.totalBalance ?? '0', 9)}
        />
      ))}
      {/*vsdb?.data?.pages.length!! > 0 && (
        <NFTCard
          nftImg={vsdb.data?.pages[0]?.data[0].display?.['image_url'] ?? 'https://github.com/Jarekkkkk/SuiDouBashi_SC/blob/nfts/0.jpeg?raw=true'}
          level={vsdb.data?.pages[0]?.data[0].level ?? '0'}
          expValue={parseInt(vsdb.data?.pages[0]?.data[0].experience ?? '0')}
          vesdbValue={parseInt(vsdb.data?.pages[0]?.data[0].vesdb ?? '0')}
          address={vsdb.data?.pages[0]?.data[0].id ?? '0x00'}
          onCardNextChange={handleFetchData}
          onCardPrevChange={handleFetchData}
        />
      )*/}
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
