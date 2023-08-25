import BigNumber from 'bignumber.js'
import { NFTCard, Tabs, Coincard, Loading, Empty } from '@/Components'
import { Coins } from '@/Constants/coin'
import { formatBalance } from '@/Utils/format'
import { LP, Pool } from '@/Constants/API/pool'
import { Vsdb } from '@/Constants/API/vsdb'

import * as styles from './index.styles'
import { Balance } from '@/Hooks/Coin/useGetBalance'

interface Props {
  nftInfo: {
    data: Vsdb | undefined
    isLoading: boolean
    isFetching: boolean
  }
  poolDataList: Pool[] | undefined
  coinData: Balance[] | undefined
  lpData: LP[] | undefined
  handleFetchNFTData: (e: any) => void
  isPrevBtnDisplay: boolean
  isNextBtnDisplay: boolean
  isCoinDataLoading: boolean
  isLpDataLoading: boolean
}

const fetchIcon = (type: string) => Coins.find((coin) => coin.type === type)

const ControlBarComponent = (props: Props) => {
  const {
    nftInfo,
    coinData,
    lpData,
    poolDataList,
    handleFetchNFTData,
    isPrevBtnDisplay,
    isNextBtnDisplay,
    isCoinDataLoading,
    isLpDataLoading,
  } = props

  const tabDataKeys = [
    {
      id: 0,
      title: 'Coin',
      children: isCoinDataLoading ? (
        <div className={styles.cardLoadingContent}>
          <Loading />
        </div>
      ) : coinData && !!coinData.length ? (
        coinData
          ?.sort((prev, next) => {
            const _prevIdx = fetchIcon(prev.coinType)?.decimals || 0
            const _nextIdx = fetchIcon(next.coinType)?.decimals || 0

            return Number(
              BigInt(next.totalBalance) *
                BigInt('10') ** BigInt((9 - _nextIdx).toString()) -
                BigInt(prev.totalBalance) *
                  BigInt('10') ** BigInt((9 - _prevIdx).toString()),
            )
          })
          .map((balance, idx) => {
            const _coinIdx = fetchIcon(balance.coinType)
            return (
              <Coincard
                key={idx}
                coinXIcon={_coinIdx!.logo}
                coinXName={_coinIdx!.name}
                coinXValue={formatBalance(
                  balance.totalBalance,
                  _coinIdx!.decimals,
                )}
              />
            )
          })
      ) : (
        <Empty content={'No Supported Coins'} />
      ),
    },
    {
      id: 1,
      title: 'LP',
      children: isLpDataLoading ? (
        <div className={styles.cardLoadingContent}>
          <Loading />
        </div>
      ) : lpData && lpData.length > 1 ? (
        lpData?.map((data, idx) => {
          if (!data || !poolDataList)
            return (
              <div className={styles.cardLoadingContent}>
                <Loading />
              </div>
            )
          const _coinXIdx = fetchIcon(data.type_x)
          const _coinYIdx = fetchIcon(data.type_y)
          const { lp_supply, reserve_x, reserve_y } = poolDataList.find(
            (p) => p.type_x == data.type_x && p.type_y == data.type_y,
          )
          const percentage = BigNumber(data.lp_balance).div(lp_supply)
          const x = percentage
            .multipliedBy(reserve_x)
            .shiftedBy(-_coinXIdx!.decimals)
            .decimalPlaces(3)
            .toString()
          const y = percentage
            .multipliedBy(reserve_y)
            .shiftedBy(-_coinYIdx!.decimals)
            .decimalPlaces(3)
            .toString()

          return (
            <Coincard
              key={idx}
              coinXIcon={_coinXIdx!.logo}
              coinXName={_coinXIdx!.name}
              coinXValue={x}
              coinYIcon={_coinYIdx!.logo}
              coinYName={_coinYIdx!.name}
              coinYValue={y}
            />
          )
        })
      ) : (
        <Empty content={'No Deposited Liquidity'} />
      ),
    },
    {
      id: 2,
      title: 'Stake',
      children: <Empty content={'No Staked Liquidity'} />,
    },
  ]

  return (
    <div className={styles.barContainer}>
      {
        nftInfo.isLoading && nftInfo.isFetching ? (
          <div className={styles.loadingContent}>
            <Loading />
          </div>
        ) : !nftInfo.data ? (
          <div className={styles.loadingContent}>
            <Empty content="No Data" />
          </div>
        ) : (
          <NFTCard
            isPrevBtnDisplay={isPrevBtnDisplay}
            isNextBtnDisplay={isNextBtnDisplay}
            nftImg={nftInfo?.data?.display?.image_url}
            level={nftInfo?.data?.level}
            expValue={parseInt(nftInfo?.data?.experience)}
            sdbValue={parseInt(nftInfo?.data?.balance)}
            vesdbValue={parseInt(nftInfo?.data?.vesdb)}
            address={nftInfo?.data?.id}
            handleFetchNFTData={handleFetchNFTData}
          />
        )
      }
      <Tabs links={tabDataKeys} />
    </div>
  )
}

export default ControlBarComponent
