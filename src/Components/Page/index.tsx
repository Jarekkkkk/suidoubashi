import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useGetAllBalance } from '@/Hooks/Coin/useGetBalance'
import { useGetVsdb, useGetVsdbIDs } from '@/Hooks/VSDB/useGetVSDB'
import { useGetAllLP } from '@/Hooks/AMM/useGetLP'
import UserModule from '@/Modules/User'
import { useWalletKit } from '@mysten/wallet-kit'

import { Coins } from '@/Constants/coin'
import { Sidebar, ControlBar, SettingModal } from '@/Components'
import * as styles from './index.styles'
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'

interface Props {
  children: any
}
const PageComponent = (props: Props) => {
  const { children } = props
  const location = useLocation()
  const isDashboard = location.pathname === '/'
  // Wallet
  const { isConnected } = useWalletKit()
  const walletAddress = UserModule.getUserToken()
  if (!walletAddress && !isDashboard) {
    window.location.href = '/'
  }
  // Vsdb
  const [currentVsdbId, setCurrentVsdbId] = useState(0)
  const { data: vsdbList } = useGetVsdbIDs(walletAddress)
  const currentNFTInfo = useGetVsdb(
    walletAddress,
    vsdbList === undefined
      ? undefined
      : !vsdbList.length
      ? null
      : vsdbList[currentVsdbId],
  )
  // Balance
  const { data: bal, isLoading: isCoinDataLoading } = useGetAllBalance(
    Coins,
    walletAddress,
  )
  // Pool
  const { data: pool_ids } = useGetPoolIDs()
  const pools = useGetMulPool(pool_ids)
  const { data: lPList, isLoading: isLpDataLoading } =
    useGetAllLP(walletAddress)

  const [isSettingOpen, setIsSettingOpen] = useState(false)

  const handleFetchNFTData = (mode: string) => {
    if (vsdbList && vsdbList.length > 0 && currentVsdbId < vsdbList.length) {
      if (mode === 'next') {
        const _vsdbId = currentVsdbId + 1
        setCurrentVsdbId(_vsdbId)
      }
      if (mode === 'prev') {
        const _vsdbId = currentVsdbId - 1
        setCurrentVsdbId(_vsdbId)
      }
    }
  }
  if (isDashboard) {
    return (
      <>
        {isConnected && (
          <div className={styles.dashboardMainContent}>
            <div className={styles.sidebarContent}>
              <Sidebar isSettingOpen={isSettingOpen} setIsSettingOpen={setIsSettingOpen} />
            </div>
            <SettingModal isSettingOpen={isSettingOpen} setIsSettingOpen={setIsSettingOpen} />
          </div>
        )}
        {children}
      </>
    )
  }

  return (
    walletAddress && (
      <div className={styles.layoutContainer}>
        <div className={styles.mainContent}>
          <Sidebar isSettingOpen={isSettingOpen} setIsSettingOpen={setIsSettingOpen} />
          <div className={styles.content}>{children}</div>
          <ControlBar
            isPrevBtnDisplay={currentVsdbId !== 0}
            isNextBtnDisplay={
              (vsdbList && currentVsdbId < Number(vsdbList?.length) - 1) ||
              false
            }
            poolDataList={pools.data}
            nftInfo={currentNFTInfo}
            coinData={bal}
            lpData={lPList}
            handleFetchNFTData={handleFetchNFTData}
            isLpDataLoading={isLpDataLoading}
            isCoinDataLoading={isCoinDataLoading}
            isPoolDataLoading={pools.isLoading}
          />
          <SettingModal isSettingOpen={isSettingOpen} setIsSettingOpen={setIsSettingOpen} />
        </div>
      </div>
    )
  )
}
export default PageComponent
