import React, { useState, useContext } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'
import { TransactionBlock } from '@mysten/sui.js'
import { lock } from '@/Constants/API/vsdb'

import useRpc from '@/Hooks/useRpc'
import { formatBalance } from '@/Utils/format'
import { payCoin } from '@/Utils/payCoin'
import { useGetMulBalance } from '@/Hooks/Coin/useGetBalance'

import { useGetCoins } from '@/Hooks/Coin/useGetCoins'
import {
  useGetMulVsdb,
  useGetTotalVsdbID,
  useGetVsdb,
} from '@/Hooks/VSDB/useGetVSDB'
import { Button, Coincard, NFTCard } from '@/Components'

import { Coin, Coins } from '@/Constants/coin'
import { useMintSDB } from '@/Hooks/VSDB/useMintSDB'
import { useIncreaseUnlockTime } from '@/Hooks/VSDB/useIncreaseUnlockTime'
import { useRevive } from '@/Hooks/VSDB/useRevive'
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
  const balances = useGetMulBalance(Coins, currentAccount?.address)

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

  const vsdb_ids = useGetTotalVsdbID(walletAddress)

  // multiple VSDB fetching
  const nft = useGetMulVsdb(walletAddress, vsdb_ids.data?.pages[0]?.data)
  // singel Vsdb fetching
  const vsdb = useGetVsdb(walletAddress, nft[0]?.data?.id)

  // mutation
  const mint_sdb = useMintSDB()
  const increase_unlocked_time = useIncreaseUnlockTime()
  const revive = useRevive()

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
      <Button
        styleType='tonal'
        text='Increase Unlocked Time'
        onClick={() => {
          if (vsdb?.data?.id)
            increase_unlocked_time.mutate({
              vsdb: vsdb.data.id,
              extended_duration: '1904800',
            })
        }}
      />
      <Button
        styleType='filled'
        text='revive'
        onClick={() => {
          if (vsdb?.data?.id)
            revive.mutate({
              vsdb: vsdb.data.id,
              withdrawl: '0',
              extended_duration: '604800',
            })
        }}
      />
      {balances.map((balance, idx) => (
        <Coincard
          key={idx}
          coinIcon={Coins[idx].logo}
          coinName={Coins[idx].name}
          coinValue={formatBalance(balance?.data?.totalBalance ?? '0', 9)}
        />
      ))}
      <div style={{ display: 'flex' }}>
        {nft.map((nft) => {
          const vsdb = !nft?.isLoading && nft?.data ? nft.data : null
          return (
            vsdb && (
              <NFTCard
                key={vsdb.id}
                nftImg={
                  'https://cdn.dribbble.com/userupload/9136133/file/original-d341189818151d42d21356b6ffca165a.jpg?resize=2273x1720'
                }
                level={vsdb?.level ?? '0'}
                expValue={parseInt(vsdb?.experience ?? '0')}
                sdbValue = {parseInt(vsdb?.balance ?? "0")}
                vesdbValue={parseInt(vsdb?.vesdb ?? '0')}
                address={vsdb?.id ?? '0x00'}
                onCardNextChange={handleFetchData}
                onCardPrevChange={handleFetchData}
              />
            )
          )
        })}
      </div>
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
