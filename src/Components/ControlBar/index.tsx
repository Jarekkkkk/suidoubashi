import BigNumber from 'bignumber.js'
import { NFTCard, Tabs, Coincard, Loading, Empty } from '@/Components'
import { Coins } from '@/Constants/coin'
import { formatBalance } from '@/Utils/format'
import { LP, Pool } from '@/Constants/API/pool'
import { Vsdb } from '@/Constants/API/vsdb'

import * as styles from './index.styles'
import { Balance } from '@/Hooks/Coin/useGetBalance'
import { Stake } from '@/Constants/API/vote'

interface Props {
  nftInfo: {
    data: Vsdb | undefined | null
    isLoading: boolean
  }
  poolDataList: Pool[] | undefined | null
  coinData: Balance[] | undefined
  lpData: LP[] | undefined
  stakeData: Stake[] | null
  handleFetchNFTData: (e: any) => void
  isPrevBtnDisplay: boolean
  isNextBtnDisplay: boolean
  isCoinDataLoading: boolean
  isLpDataLoading: boolean
  isPoolDataLoading: boolean
  isStakeDataLoading: boolean
}

const fetchIcon = (type: string) => Coins.find((coin) => coin.type === type)

const ControlBarComponent = (props: Props) => {
  const {
    nftInfo,
    coinData,
    lpData,
    stakeData,
    poolDataList,
    handleFetchNFTData,
    isPrevBtnDisplay,
    isNextBtnDisplay,
    isCoinDataLoading,
    isLpDataLoading,
    isPoolDataLoading,
    isStakeDataLoading,
  } = props

  const tabData = [
    {
      id: 0,
      title: 'Coin',
      children: (
        !coinData ? (
          <Empty content={'No Supported Coins'} />
        ) : coinData?.sort((prev, next) => {
         const _prevIdx = fetchIcon(prev.coinType)!.decimals
          const _nextIdx = fetchIcon(next.coinType)!.decimals

          return Number(
            BigInt(next.totalBalance) *
              BigInt('10') ** BigInt((9 - _nextIdx).toString()) -
              BigInt(prev.totalBalance) *
                BigInt('10') ** BigInt((9 - _prevIdx).toString()),
          )
        }).map((balance, idx) => {
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
      )
    },
    {
      id: 1,
      title: 'LP',
      children: (
        lpData && poolDataList && !!lpData.length ? (
          lpData.map((data, idx) => {
            const _coinXIdx = fetchIcon(data.type_x)
            const _coinYIdx = fetchIcon(data.type_y)

            if (!_coinXIdx || !_coinYIdx) return
            const { lp_supply, reserve_x, reserve_y } = poolDataList.find(
              (p) => p.type_x == data.type_x && p.type_y == data.type_y,
            ) ?? { lp_supply: 0, reserve_x: 0, reserve_y: 0 }

            const percentage = BigNumber(data.lp_balance).div(lp_supply)
            const x = percentage
              .multipliedBy(reserve_x)
              .shiftedBy(-_coinXIdx.decimals)
              .decimalPlaces(3)
              .toString()
            const y = percentage
              .multipliedBy(reserve_y)
              .shiftedBy(-_coinYIdx.decimals)
              .decimalPlaces(3)
              .toString()

            return (
              <Coincard
                key={idx}
                coinXIcon={_coinXIdx.logo}
                coinXName={_coinXIdx.name}
                coinXValue={x}
                coinYIcon={_coinYIdx.logo}
                coinYName={_coinYIdx.name}
                coinYValue={y}
              />
            )
          })
        ) : (
          <Empty content={'No Deposited Liquidity'} />
        )
      )
    },
    {
      id: 2,
      title: 'Stake',
      children:
        stakeData && poolDataList && !!stakeData.length ? (
          stakeData
            .filter((s) => Number(s.stakes) > 0)
            .map((data, idx) => {
              const _coinXIdx = fetchIcon(data.type_x)
              const _coinYIdx = fetchIcon(data.type_y)

              if (!_coinXIdx || !_coinYIdx) return
              const { lp_supply, reserve_x, reserve_y } = poolDataList.find(
                (p) => p.type_x == data.type_x && p.type_y == data.type_y,
              ) ?? { lp_supply: 0, reserve_x: 0, reserve_y: 0 }

              const percentage = BigNumber(data.stakes).div(lp_supply)
              const x = percentage
                .multipliedBy(reserve_x)
                .shiftedBy(-_coinXIdx.decimals)
                .decimalPlaces(3)
                .toString()
              const y = percentage
                .multipliedBy(reserve_y)
                .shiftedBy(-_coinYIdx.decimals)
                .decimalPlaces(3)
                .toString()

              return (
                <Coincard
                  key={idx}
                  coinXIcon={_coinXIdx.logo}
                  coinXName={_coinXIdx.name}
                  coinXValue={x}
                  coinYIcon={_coinYIdx.logo}
                  coinYName={_coinYIdx.name}
                  coinYValue={y}
                />
              )
            })
        ) : (
          <Empty content={'No Deposited Liquidity'} />
        ),
    },
  ]

  return (
    <div className={styles.barContainer}>
      {
        nftInfo.isLoading ? (
          <div className={styles.loadingContent}>
            <Loading />
          </div>
        ) :
        !nftInfo.data ? (
          <div className={styles.loadingContent}>
            <Empty content='No Data' />
          </div>
        ) : (
          <NFTCard
            isPrevBtnDisplay={isPrevBtnDisplay}
            isNextBtnDisplay={isNextBtnDisplay}
            nftImg={nftInfo.data.display.image_url}
            level={nftInfo.data.level}
            expValue={parseInt(nftInfo.data.experience)}
            sdbValue={parseInt(nftInfo.data.balance)}
            vesdbValue={parseInt(nftInfo.data.vesdb)}
            address={nftInfo.data.id}
            handleFetchNFTData={handleFetchNFTData}
          />
        )
      }
      {
        isCoinDataLoading || isLpDataLoading || isPoolDataLoading || isStakeDataLoading || isPoolDataLoading ? (
          <div className={styles.cardLoadingContent}>
            <Loading />
          </div>
        ) : (
          <Tabs
            isLoading={isCoinDataLoading}
            links={tabData}
            styletype='default'
          />
        )
      }
    </div>
  )
}

export default ControlBarComponent
