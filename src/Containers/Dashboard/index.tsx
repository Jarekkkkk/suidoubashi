import React, { useState, useContext } from 'react'
import { useWalletKit } from '@mysten/wallet-kit'

import { formatBalance } from '@/Utils/format'
import { useGetMulBalance } from '@/Hooks/Coin/useGetBalance'

import {
  useGetMulVsdb,
  useGetVsdb,
  useGetVsdbIDs,
} from '@/Hooks/VSDB/useGetVSDB'
import { Button, Coincard, NFTCard } from '@/Components'

import { Coins } from '@/Constants/coin'
import { useMintSDB } from '@/Hooks/VSDB/useMintSDB'
import { useIncreaseUnlockTime } from '@/Hooks/VSDB/useIncreaseUnlockTime'
import { useRevive } from '@/Hooks/VSDB/useRevive'
import { useLock } from '@/Hooks/VSDB/useLock'
import { useIncreaseUnlockAmount } from '@/Hooks/VSDB/useIncreaseUnlockAmount'
import { useMerge } from '@/Hooks/VSDB/useMerge'

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

  const { currentAccount } = useWalletKit()
  const walletAddress = currentAccount?.address

  // -- Balances
  const balances = useGetMulBalance(Coins, currentAccount?.address)

  const vsdb_ids = useGetVsdbIDs(walletAddress)
  // multiple VSDB fetching
  const nft = useGetMulVsdb(walletAddress, vsdb_ids?.data)

  // single Vsdb fetching
  const vsdb = useGetVsdb(walletAddress, nft[0]?.data?.id)

  // mutation
  const mint_sdb = useMintSDB()
  const lock = useLock()
  const increase_unlocked_time = useIncreaseUnlockTime()
  const increase_unlocked_amount = useIncreaseUnlockAmount()
  const merge = useMerge()
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
        styletype='filled'
        text='Mint SDB'
        onClick={() => mint_sdb.mutate()}
      />
      {mint_sdb.isLoading && <div>Loading</div>}
<<<<<<< HEAD
      <Button
        styletype='outlined'
=======
      {/*     <Button
        styleType='outlined'
>>>>>>> 70fcc47 ([front_end] LP hooks setup)
        text='Lock VSDB'
        onClick={() =>
          lock.mutate({
            depositValue: '100000000000',
            extended_duration: '604800',
          })
        }
      />
      <Button
        styletype='tonal'
        text='Increase Unlocked Time'
        onClick={() => {
          if (vsdb?.data?.id)
            increase_unlocked_time.mutate({
              vsdb: '0xd58dfec7b6d6a2ed05f520514663fa7bd7855ae3b60ee87a4002e13e3fd980cb',
              extended_duration: '12804800',
            })
        }}
      />
      <Button
        styletype='filled'
        text='Increase Unlocked Amount'
        onClick={() => {
          if (vsdb?.data?.id)
            increase_unlocked_amount.mutate({
              vsdb: '0x1bea82b0770e0631f685d359f5ff3f4f4d78d7cd49767c2ffe34698409c51e50',
              depositValue: '500000000000',
            })
        }}
      />
      <Button
        styletype='tonal'
        text='Merge'
        onClick={() => {
          if (vsdb?.data?.id)
            merge.mutate({
              vsdb: '0x1bea82b0770e0631f685d359f5ff3f4f4d78d7cd49767c2ffe34698409c51e50',
              mergedVsdb:
                '0xd61ddfbc0b4aa49ad019026ee6e8ee938475c1dc4a82fc4384861b18c0753f85',
            })
        }}
      />
      <Button
        styletype='outlined'
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
<<<<<<< HEAD
=======
      {balances.map((balance, idx) => (
        <Coincard
          key={idx}
          coinIcon={Coins[idx].logo}
          coinName={Coins[idx].name}
          coinValue={formatBalance(balance?.data?.totalBalance ?? '0', 9)}
        />
      ))}
      <div>
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
                sdbValue={parseInt(vsdb?.balance ?? '0')}
                vesdbValue={parseInt(vsdb?.vesdb ?? '0')}
                address={vsdb?.id ?? '0x00'}
                onCardNextChange={handleFetchData}
                onCardPrevChange={handleFetchData}
              />
            )
          )
        })}
      </div>*/}
>>>>>>> 70fcc47 ([front_end] LP hooks setup)
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
