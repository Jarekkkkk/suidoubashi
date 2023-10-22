import { Link } from 'react-router-dom'
import {
  PageContainer,
  Input,
  Button,
  Loading,
  Empty,
  ReactTable,
  CoinCombin,
} from '@/Components'
import { usePoolContext } from '@/Containers/Pool'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'
import * as constantsStyles from '@/Constants/constants.styles'
import * as styles from './index.styles'
import { cx } from '@emotion/css'
import { CoinFormat, formatBalance } from '@/Utils/format'
import { Pool } from '@/Constants/API/pool'
import { useGetPrice } from '@/Hooks/useGetPrice'
import { fetchIcon } from '@/Constants/coin'
import { Balance } from '@/Hooks/Coin/useGetBalance'

const PoolPresentation = () => {
  const {
    fetching,
    poolsData,
    gaugeData,
    allBalanceData,
    searchInput,
    handleOnInputChange,
  } = usePoolContext()

  const price = useGetPrice()

  const fetchBalance = (
    BalanceData: Balance[] | undefined,
    coinName: string,
  ) => BalanceData?.find((balance) => balance.coinName === coinName)

  if (fetching)
    return (
      <PageContainer title='Pool' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!poolsData || !gaugeData)
    return (
      <PageContainer title='Pool' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Empty content='Oops! No Data.' />
        </div>
      </PageContainer>
    )

  const columns = [
    {
      id: 'pool',
      Header: 'Pool',
    },
    {
      id: 'wallet',
      Header: 'Wallet',
    },
    {
      id: 'pool_amount',
      Header: 'Total Pool Amount',
    },
    {
      id: 'apr',
      Header: 'APR',
    },
    {
      id: 'manage',
      Header: 'Manage',
    },
  ]

  const renderRow = ({ columns, poolsData, allBalanceData }: any) => {
    return poolsData.map((pool: Pool) => {
      const _poolCoins = pool.name.split('-')
      const _poolCoinX = fetchIcon(_poolCoins[0])
      const _poolCoinY = fetchIcon(_poolCoins[1])
      const _walletCoinX = fetchBalance(
        allBalanceData,
        _poolCoins[0],
      )?.totalBalance ?? "0"
      const _walletCoinY = fetchBalance(
        allBalanceData,
        _poolCoins[1],
      )?.totalBalance ?? "0"

      const gauge = gaugeData.find((g) => g.pool == pool.id)
      const price_x =
        price.data &&
          _poolCoinX?.name &&
          price.data.hasOwnProperty(_poolCoinX.name)
          ? price.data[_poolCoinX.name]
          : 0
      const price_y =
        price.data &&
          _poolCoinY?.name &&
          price.data.hasOwnProperty(_poolCoinY.name)
          ? price.data[_poolCoinY.name]
          : 0
      const price_sdb =
        price.data && price.data.hasOwnProperty('SDB') ? price.data['SDB'] : 0
      const apr =
        ((Number(gauge?.reward_rate ?? 0) *
          86400 *
          365 *
          10 ** -9 *
          price_sdb) /
          (Number(pool.reserve_x) *
            10 ** -(_poolCoinX?.decimals ?? 0) *
            price_x +
            Number(pool.reserve_y) *
            10 ** -(_poolCoinY?.decimals ?? 0) *
            price_y)) *
        100

      return columns.map((column: any, idx: any) => {
        switch (column.id) {
          case 'pool':
            return (
              <CoinCombin
                key={idx}
                poolCoinX={_poolCoinX}
                poolCoinY={_poolCoinY}
                isPool
                stable={pool.stable}
              />
            )
          case 'wallet':
            return (
              <div
                key={idx}
                className={cx(
                  constantsStyles.columnContent,
                  styles.coinContent,
                )}
              >
                <div className={constantsStyles.rowContent}>
                  <div className={constantsStyles.boldText}>
                    {formatBalance(
                      _walletCoinX,
                      _poolCoinX!.decimals,
                      CoinFormat.FULL,
                    )}
                  </div>
                  <span className={constantsStyles.greyText}>
                    {_poolCoinX!.name}
                  </span>
                </div>
                <div className={constantsStyles.rowContent}>
                  <div className={constantsStyles.boldText}>
                    {formatBalance(
                      _walletCoinY,
                      _poolCoinY!.decimals,
                      CoinFormat.FULL,
                    )}
                  </div>
                  <span className={constantsStyles.greyText}>
                    {_poolCoinY!.name}
                  </span>
                </div>
              </div>
            )
          case 'pool_amount':
            return (
              <div
                key={idx}
                className={cx(
                  constantsStyles.columnContent,
                  styles.coinContent,
                )}
              >
                <div className={constantsStyles.rowContent}>
                  <div className={constantsStyles.boldText}>
                    {formatBalance(
                      pool.reserve_x,
                      _poolCoinX!.decimals,
                      CoinFormat.FULL,
                    )}
                  </div>
                  <span className={constantsStyles.greyText}>
                    {_poolCoinX!.name}
                  </span>
                </div>
                <div className={constantsStyles.rowContent}>
                  <div className={constantsStyles.boldText}>
                    {formatBalance(
                      pool.reserve_y,
                      _poolCoinY!.decimals,
                      CoinFormat.FULL,
                    )}
                  </div>
                  <span className={constantsStyles.greyText}>
                    {_poolCoinY!.name}
                  </span>
                </div>
              </div>
            )
          case 'apr':
            return (
              <div style={{ fontWeight: 'bold' }} key={idx}>
                {!isNaN(apr) ? apr.toFixed(4) : "0"} %
              </div>
            )
          case 'manage':
            return (
              <Link to={`/pool/Liquidity?${pool.id}`} key={idx}>
                <Button styletype='outlined' text='Manage' />
              </Link>
            )
          default:
            return null
        }
      })
    })
  }

  return (
    <PageContainer title='Pool' titleImg={Image.pageBackground_2}>
      {/**
      <div className={styles.slognContent}>
        Provide Liquidity to SuiDoBashi ecosystem and earn weekly rewards
      </div>**/}
      <div className={constantsStyles.LoadingContainer}>
        <Input
          value={searchInput}
          onChange={handleOnInputChange}
          placeholder='SDB, SUI, USDC...'
          leftIcon={<Icon.SearchIcon className={styles.searchInputIcon} />}
        />
        <ReactTable
          data={poolsData}
          columns={columns}
          renderRow={renderRow({ columns, poolsData, allBalanceData })}
        />
      </div>
    </PageContainer>
  )
}

export default PoolPresentation
