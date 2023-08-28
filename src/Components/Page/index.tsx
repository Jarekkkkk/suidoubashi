import { useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useGetAllBalance } from '@/Hooks/Coin/useGetBalance'
import { useGetVsdb, useGetVsdbIDs } from '@/Hooks/VSDB/useGetVSDB'
import { useGetMulLP } from '@/Hooks/AMM/useGetLP'
//import { Pool } from '@/Constants/API/pool'
import UserModule from '@/Modules/User'
import { useWalletKit } from '@mysten/wallet-kit'

import { Coins } from '@/Constants/coin'
import { Sidebar, ControlBar } from '@/Components'
import * as styles from './index.styles'
//import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'

interface Props {
  children: any
}
const PageComponent = (props: Props) => {
  const { children } = props
  const location = useLocation()
  const isDashboard = location.pathname === '/'
  const [currentVsdbId, setCurrentVsdbId] = useState(0)
  const [poolDataList, _] = useState()

  const { isConnected } = useWalletKit()
  const walletAddress = UserModule.getUserToken()

  if (!walletAddress && !isDashboard) {
    window.location.href = '/'
  }

  const { data: vsdbList } = useGetVsdbIDs(walletAddress)
  const currentNFTInfo = useGetVsdb(
    walletAddress,
    vsdbList === undefined
      ? undefined
      : !vsdbList.length
      ? null
      : vsdbList[currentVsdbId],
  )

  const { data: bal, isLoading: isCoinDataLoading } = useGetAllBalance(
    Coins,
    walletAddress,
  )
  const { data: lPList, isLoading: isLpDataLoading } =
    useGetMulLP(walletAddress)
  //const poolIDList = useGetPoolIDs()
  //const poolList = poolIDList && useGetMulPool(poolIDList.data)
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
              <Sidebar />
            </div>
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
          <Sidebar />
          <div className={styles.content}>{children}</div>
          <ControlBar
            isPrevBtnDisplay={currentVsdbId !== 0}
            isNextBtnDisplay={
              (vsdbList && currentVsdbId < Number(vsdbList?.length) - 1) ||
              false
            }
            poolDataList={poolDataList}
            nftInfo={currentNFTInfo}
            coinData={bal}
            lpData={lPList}
            handleFetchNFTData={handleFetchNFTData}
            isLpDataLoading={isLpDataLoading}
            isCoinDataLoading={isCoinDataLoading}
          />
        </div>
      </div>
    )
  )
}
export default PageComponent
