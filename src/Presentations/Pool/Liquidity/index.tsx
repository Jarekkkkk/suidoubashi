import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { cx, css } from '@emotion/css'
import BigNumber from 'bignumber.js'

import {
  PageContainer,
  InputSection,
  Input,
  Tabs,
  Button,
  Loading,
  Empty,
} from '@/Components'
import { useLiquidityContext } from '@/Containers/Pool/Liquidity'
import { Coins, CoinInterface } from '@/Constants/coin'
import { Icon } from '@/Assets/icon'
import Image from '@/Assets/image'
import useGetBalance from '@/Hooks/Coin/useGetBalance'

import * as styles from './index.styles'
import * as poolStyles from '../index.styles'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useRemoveLiquidity } from '@/Hooks/AMM/removeLiquidity'
import { useGetLP } from '@/Hooks/AMM/useGetLP'
import { useZap } from '@/Hooks/AMM/useZap'

const fetchIcon = (type: string) => Coins.find((coin) => coin.type === type)

const LiquidityPresentation = () => {
  const { walletAddress, poolData, fetching, error, setError } =
    useLiquidityContext()

  if (fetching)
    return (
      <PageContainer title='Liquidity' titleImg={Image.pageBackground_1}>
        <div className={poolStyles.poolpContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!poolData) return <Empty content='Oops! No Data.' />

  const _coins = poolData?.name.split('-')

  const [coinInputFirst, setCoinInputFirst] = useState<string>('')
  const [coinTypeFirst, setCoinTypeFirst] = useState<CoinInterface>(
    Coins.filter((coin) => coin.name === _coins[0])[0],
  )
  const [coinInputSecond, setCoinInputSecond] = useState<string>('')
  const [coinTypeSecond, setCoinTypeSecond] = useState<CoinInterface>(
    Coins.filter((coin) => coin.name === _coins[1])[0],
  )

  const [coinInputSingle, setCoinInputSingle] = useState('')

  const coinTypeFirstBalance =
    coinTypeFirst && useGetBalance(coinTypeFirst.type, walletAddress)
  const coinTypeSecondBalance =
    coinTypeSecond && useGetBalance(coinTypeSecond.type, walletAddress)

  const _poolCoinX = fetchIcon(poolData.type_x)
  const _poolCoinY = fetchIcon(poolData.type_y)

  const handleOnCoinInputFirstChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputFirst(value)
      if (poolData.reserve_x == '0') {
        setCoinInputSecond(value)
      } else {
        const price =
          (Number(poolData.reserve_y) / Number(poolData.reserve_x)) *
          10 ** (coinTypeFirst.decimals - coinTypeSecond.decimals) *
          parseFloat(value)
        setCoinInputSecond(isNaN(price) ? '' : price.toFixed(6))
      }
    },
    [setCoinInputFirst],
  )

  const handleOnCoinInputSecondChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputSecond(value)
      if (poolData.reserve_x == '0') {
        setCoinInputFirst(value)
      } else {
        const price =
          (Number(poolData.reserve_x) / Number(poolData.reserve_y)) *
          10 ** (coinTypeSecond.decimals - coinTypeFirst.decimals) *
          parseFloat(value)
        setCoinInputFirst(isNaN(price) ? '' : price.toFixed(6))
      }
    },
    [setCoinInputSecond],
  )

  const handleOnCoinInputSingleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = /^-?\d*\.?\d*$/.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputSingle(value)
    },
    [setCoinInputSingle],
  )

  const lp = useGetLP(walletAddress, poolData?.type_x, poolData?.type_y)
  const add_liquidity = useAddLiquidity()
  const handleAddLiquidity = () => {
    if (poolData && lp !== undefined) {
      add_liquidity.mutate({
        pool_id: poolData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        lp_id: lp ? lp.id : null,
        input_x_value: (
          Number(coinInputFirst) *
          10 ** coinTypeFirst.decimals
        ).toString(),
        input_y_value: (
          Number(coinInputSecond) *
          10 ** coinTypeSecond.decimals
        ).toString(),
      })
    }
  }

  const zap = useZap()
  const handleZap = () => {
    if (poolData && lp) {
      const {
        id,
        type_x,
        type_y,
        reserve_x,
        reserve_y,
        stable,
        fee: { fee_percentage },
      } = poolData
      zap.mutate({
        pool_id: id,
        pool_type_x: type_x,
        pool_type_y: type_y,
        reserve_x: reserve_x,
        reserve_y: reserve_y,
        stable,
        fee: fee_percentage,
        lp_id: lp ? lp.id : null,
        input_type: coinTypeFirst.type,
        input_value: (
          Number(coinInputSingle) *
          10 ** coinTypeFirst.decimals
        ).toString(),
      })
    }
  }

  const withdraw = useRemoveLiquidity()
  const handleWithdraw = () => {
    if (poolData && lp) {
      withdraw.mutate({
        pool_id: poolData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        lp_id: lp.id,
        withdrawl: lp.lp_balance,
      })
    }
  }

  const tabDataKeys = [
    {
      id: 0,
      title: 'Pair',
      children: (
        <>
          <div className={poolStyles.lightGreyText}>
            <Icon.NoticeIcon />
            Deposit pair of Coins into Pool.
          </div>
          <div>
            <div
              className={cx(
                poolStyles.columnContent,
                css({
                  marginTop: '25px',
                }),
              )}
            >
              <div className={poolStyles.greyText}>Liquidity</div>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <div>
                  <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                    <div className={poolStyles.boldText}>
                      {poolData.reserve_x}
                    </div>
                    <div className={poolStyles.lightGreyText}>
                      {_poolCoinX!.name}
                    </div>
                  </div>
                  <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                    <div className={poolStyles.boldText}>
                      {poolData.reserve_x}
                    </div>
                    <div className={poolStyles.lightGreyText}>
                      {_poolCoinX!.name}
                    </div>
                  </div>
                </div>
                <div>
                  <div className={poolStyles.lightGreyText}>APY</div>
                  <div className={poolStyles.boldText}>
                    {poolData.reserve_x}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.inputContent}>
              <InputSection
                balance={
                  coinTypeFirstBalance
                    ? BigNumber(coinTypeFirstBalance.totalBalance)
                        .shiftedBy(-coinTypeFirst.decimals)
                        .toFormat()
                    : '...'
                }
                titleChildren={
                  <div>
                    {coinTypeFirst.logo}
                    <span>{coinTypeFirst.name}</span>
                  </div>
                }
                inputChildren={
                  <>
                    <Input
                      value={coinInputFirst}
                      onChange={(e) => {
                        if (coinTypeFirstBalance?.totalBalance) {
                          handleOnCoinInputFirstChange(e)
                          if (
                            parseFloat(e.target.value) *
                              Math.pow(10, coinTypeFirst.decimals) >
                            Number(coinTypeFirstBalance.totalBalance)
                          ) {
                            setError('Insufficient Balance')
                          } else {
                            setError('')
                          }
                        }
                      }}
                      placeholder={`${coinTypeFirst.name} Value`}
                      // disabled={isLoading}
                    />
                  </>
                }
              />
              <InputSection
                balance={
                  coinTypeSecondBalance
                    ? BigNumber(coinTypeSecondBalance.totalBalance)
                        .shiftedBy(-coinTypeSecond.decimals)
                        .toFormat()
                    : '...'
                }
                titleChildren={
                  <div>
                    {coinTypeSecond.logo}
                    <span>{coinTypeSecond.name}</span>
                  </div>
                }
                inputChildren={
                  <>
                    <Input
                      value={coinInputSecond}
                      onChange={(e) => {
                        if (coinTypeSecondBalance?.totalBalance) {
                          handleOnCoinInputSecondChange(e)
                          if (
                            parseFloat(e.target.value) * Math.pow(10, 9) >
                            Number(coinTypeSecondBalance.totalBalance)
                          ) {
                            setError('Insufficient Balance')
                          } else {
                            setError('')
                          }
                        }
                      }}
                      placeholder={`${coinTypeSecond.name} Value`}
                      // disabled={isLoading}
                    />
                  </>
                }
              />
            </div>
            <div className={styles.buttonContent}>
              <Button
                styletype='filled'
                text='USDC/USDT LP  Deposit'
                onClick={() => handleAddLiquidity()}
              />
              <Button
                styletype='filled'
                disabled={true}
                text='Deposit & Stake'
                onClick={() => handleAddLiquidity()}
              />
            </div>
          </div>
        </>
      ),
    },
    {
      id: 1,
      title: 'Single',
      children: (
        <>
          <div className={poolStyles.lightGreyText}>
            <Icon.NoticeIcon />
            Deposit Liquidity to earn rewards.
          </div>
          <div className={styles.inputContent}>
            <InputSection
              balance={
                coinTypeFirstBalance
                  ? BigNumber(coinTypeFirstBalance.totalBalance)
                      .shiftedBy(-coinTypeFirst.decimals)
                      .toFormat()
                  : '...'
              }
              titleChildren={
                <div>
                  {coinTypeFirst.logo}
                  <span>{coinTypeFirst.name}</span>
                  <Icon.SwapIcon
                    className={styles.icon}
                    onClick={() => {
                      setCoinTypeFirst(coinTypeSecond)
                      setCoinTypeSecond(coinTypeFirst)
                    }}
                  />
                </div>
              }
              inputChildren={
                <>
                  <Input
                    value={coinInputSingle}
                    onChange={(e) => {
                      if (coinTypeFirstBalance?.totalBalance) {
                        handleOnCoinInputSingleChange(e)
                        if (
                          parseFloat(e.target.value) *
                            Math.pow(10, coinTypeFirst.decimals) >
                          Number(coinTypeFirstBalance.totalBalance)
                        ) {
                          setError('Insufficient Balance')
                        } else {
                          setError('')
                        }
                      }
                    }}
                    placeholder={`${coinTypeFirst.name} Value`}
                    // disabled={isLoading}
                  />
                </>
              }
            />
          </div>
          <div className={styles.buttonContent}>
            <Button styletype='filled' text='Zap' onClick={() => handleZap()} />
            <Button
              disabled={true}
              styletype='filled'
              text='Zap & Stake'
              onClick={() => ({})}
            />
          </div>
        </>
      ),
    },
  ]

  return (
    <PageContainer
      title='Liquidity'
      titleImg={Image.pageBackground_1}
      prevChildren={
        <Link to='/pool' className={styles.prevButton}>
          <Icon.PrevIcon />
        </Link>
      }
    >
      <div className={cx(poolStyles.rowContent, styles.liquidityContainer)}>
        <div className={cx(poolStyles.columnContent, styles.leftContent)}>
          <div className={cx(styles.shadowContent, poolStyles.columnContent)}>
            <div className={cx(poolStyles.boldText, styles.title)}>
              <Icon.PoolIcon />
              <span>Pool</span>
            </div>
            <div className={poolStyles.lightGreyText}>Your Coins in Pool.</div>
            <div className={styles.coinContent}>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <span className={poolStyles.boldText}>
                  {_poolCoinX?.logo}
                  <span className={styles.textMarginLeft}>
                    {_poolCoinX!.name}
                  </span>
                </span>
                <div className={poolStyles.boldText}>{poolData.reserve_x}</div>
              </div>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <span className={poolStyles.boldText}>
                  {_poolCoinY?.logo}
                  <span className={styles.textMarginLeft}>
                    {_poolCoinY!.name}
                  </span>
                </span>
                <div className={poolStyles.boldText}>{poolData.reserve_y}</div>
              </div>
              <div className={styles.buttonContent}>
                <Button
                  styletype='filled'
                  text='Withdraw'
                  onClick={() => handleWithdraw()}
                />
                <Button
                  styletype='filled'
                  text='Stake'
                  onClick={() => handleWithdraw()}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className={cx(styles.shadowContent, poolStyles.columnContent)}>
            <div className={cx(poolStyles.boldText, styles.title)}>
              <Icon.StakeIcon />
              <span>Stake</span>
            </div>
            <div className={poolStyles.lightGreyText}>Staked Liquidity.</div>
            <br />
            <div className={poolStyles.greyText}>
              Your Balance
              <div className={cx(poolStyles.boldText, styles.textMarginLeft)}>
                {poolData.reserve_x}
              </div>
            </div>
            <div className={styles.coinContent}>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <span className={poolStyles.boldText}>
                  {_poolCoinX?.logo}
                  <span className={styles.textMarginLeft}>
                    {_poolCoinX!.name}
                  </span>
                </span>
                <div className={poolStyles.boldText}>{poolData.reserve_x}</div>
              </div>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <span className={poolStyles.boldText}>
                  {_poolCoinY?.logo}
                  <span className={styles.textMarginLeft}>
                    {_poolCoinY!.name}
                  </span>
                </span>
                <div className={poolStyles.boldText}>{poolData.reserve_y}</div>
              </div>
              <div className={styles.infoContent}>
                <div className={poolStyles.lightGreyText}>
                  To receive underlying pair of coins from your staked pool,
                  please unstake and withdraw.
                </div>
                <div className={poolStyles.greyText}>
                  Make sure to claim any rewards before withdrawing.
                </div>
              </div>
              <div className={styles.buttonContent}>
                <Button
                  styletype='filled'
                  disabled={true}
                  text='Unstake'
                  onClick={() => handleWithdraw()}
                />
                <Button
                  styletype='filled'
                  text='Unstake & Withdraw'
                  onClick={() => handleWithdraw()}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
        <div className={cx(poolStyles.columnContent, styles.rightContent)}>
          <div className={cx(styles.shadowContent, poolStyles.columnContent)}>
            <div className={cx(poolStyles.boldText, styles.title)}>
              <span>Deposit</span>
            </div>
            <div className={poolStyles.greyText}>
              Deposit Liquidity to earn rewards.
            </div>
            <Tabs
              isLoading={fetching}
              links={tabDataKeys}
              styletype='ellipse'
            />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default LiquidityPresentation
