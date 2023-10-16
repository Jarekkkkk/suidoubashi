import { useState, createContext, useContext } from 'react'
import { useLocation } from 'react-router-dom'

import { useGetAllBalance } from '@/Hooks/Coin/useGetBalance'
import { useGetVsdb, useGetVsdbIDs } from '@/Hooks/VSDB/useGetVSDB'
import { Vsdb } from '@/Constants/API/vsdb'
import { useGetAllLP } from '@/Hooks/AMM/useGetLP'
import UserModule from '@/Modules/User'
import { useWalletKit } from '@mysten/wallet-kit'

import { generateSideBarLinks } from '@/Constants'
import { Coins } from '@/Constants/coin'
import { Sidebar, ControlBar, SettingModal } from '@/Components'
import * as styles from './index.styles'
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool'
import { SettingInterface, defaultSetting } from '../SettingModal'
import { useGetMulGauge } from '@/Hooks/Vote/useGetGauge'
import { useGetAllStake, useGetMulStake } from '@/Hooks/Vote/useGetStake'
import SettingModule from '@/Modules/Setting'

const PageContext = createContext<PageContext>({
  currentNFTInfo: {
    data: null,
    isLoading: false,
  },
  setting: defaultSetting,
})

export const usePageContext = () => useContext(PageContext)

interface Props {
  children: any
}
const PageComponent = (props: Props) => {
  const { children } = props
  const location = useLocation()
  const isDashboard = location.pathname === '/'
  const isHiddenPage = generateSideBarLinks.filter(
    (link) => link.path === location.pathname,
  )[0]?.isHidden

  // Wallet
  const { isConnected } = useWalletKit()
  const walletAddress = UserModule.getUserToken()
  if (isHiddenPage || (!walletAddress && !isDashboard)) {
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
  // stake
  //  const { data: stakes, isLoading: isStakeDataLoading } = useGetMulStake(gauges)
  const { data: stakes, isLoading: isStakeDataLoading } =
    useGetAllStake(walletAddress)
  // setting
  const [setting, setSetting] = useState<SettingInterface>({
    gasBudget: SettingModule.getGadBudgetToken() ?? defaultSetting.gasBudget,
    expiration: SettingModule.getExpirationToken() ?? defaultSetting.expiration,
    slippage: SettingModule.getSlippageToken() ?? defaultSetting.slippage,
  })

  if (isDashboard) {
    return (
      <>
        {isConnected && (
          <div className={styles.dashboardMainContent}>
            <div className={styles.sidebarContent}>
              <Sidebar
                isSettingOpen={isSettingOpen}
                setIsSettingOpen={setIsSettingOpen}
              />
            </div>
            <SettingModal
              setting={setting}
              handleSetting={(s) => setSetting(s)}
              isSettingOpen={isSettingOpen}
              setIsSettingOpen={setIsSettingOpen}
            />
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
          <Sidebar
            isSettingOpen={isSettingOpen}
            setIsSettingOpen={setIsSettingOpen}
          />
          <PageContext.Provider
            value={{
              currentNFTInfo: currentNFTInfo,
              setting: setting,
            }}
          >
            <div className={styles.content}>{children}</div>
          </PageContext.Provider>
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
            stakeData={stakes}
            handleFetchNFTData={handleFetchNFTData}
            isLpDataLoading={isLpDataLoading}
            isCoinDataLoading={isCoinDataLoading}
            isPoolDataLoading={pools.isLoading}
            isStakeDataLoading={isStakeDataLoading}
          />
          <SettingModal
            setting={setting}
            handleSetting={(s) => setSetting(s)}
            isSettingOpen={isSettingOpen}
            setIsSettingOpen={setIsSettingOpen}
          />
        </div>
      </div>
    )
  )
}
interface PageContext {
  readonly currentNFTInfo: {
    data: Vsdb | undefined | null
    isLoading: boolean
  }
  readonly setting: SettingInterface
}

export default PageComponent
