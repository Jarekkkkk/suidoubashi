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

import { fetchIcon, fetchBalance } from '@/Constants/index'
import * as constantsStyles from '@/Constants/constants.styles'
import * as styles from './index.styles'
import { cx } from '@emotion/css'
import { CoinFormat, formatBalance } from '@/Utils/format'


const PoolPresentation = () => {
  const {
    fetching,
    poolsData,
    allBalanceData,
    searchInput,
    handleOnInputChange,
  } = usePoolContext()


  if (fetching)
    return (
      <PageContainer title='Pool' titleImg={Image.pageBackground_2}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!poolsData)
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

  const renderRow = (cell: {
    columns: any
    poolsData: any
    allBalanceData: any
  }) => {
    return poolsData.map((pool) => {
      const _poolCoins = pool.name.split('-')
      const _poolCoinX = fetchIcon(_poolCoins[0])
      const _poolCoinY = fetchIcon(_poolCoins[1])
      const _walletCoinX = fetchBalance(
        allBalanceData,
        _poolCoins[0],
      )!.totalBalance
      const _walletCoinY = fetchBalance(
        allBalanceData,
        _poolCoins[1],
      )!.totalBalance

      return columns.map((column, idx) => {
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
            return <div key={idx}>12.34 %</div>
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
      <div className={styles.slognContent}>
        Provide Liquidity to SuiDoBashi ecosystem and earn weekly rewards
      </div>
      <div className={constantsStyles.LoadingContainer}>
        <Input
          value={searchInput}
          onChange={handleOnInputChange}
          placeholder='SDB, SUI, 0x12...'
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
