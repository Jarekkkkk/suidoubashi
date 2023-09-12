import { useState } from 'react'
import { Link } from 'react-router-dom';
import { cx, css } from '@emotion/css';
import BigNumber from 'bignumber.js';

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
import { Coins, Coin, CoinInterface } from '@/Constants/coin'
import { CoinIcon, Icon } from '@/Assets/icon'
import Image from '@/Assets/image'
import useGetBalance, { useGetAllBalance, Balance } from '@/Hooks/Coin/useGetBalance'

import * as styles from './index.styles'
import * as poolStyles from '../index.styles'


const fetchIcon = (type: string) => Coins.find((coin) => coin.type === type)

const LiquidityPresentation = () => {
  const {
    walletAddress, poolData, fetching,
    error, setError,
    handleWithdraw, handleAddLiquidity,
  } = useLiquidityContext()

	if (fetching) return (
		<PageContainer title='Liquidity' titleImg={Image.pageBackground_1}>
			<div className={poolStyles.poolpContainer}>
				<Loading />
			</div>
		</PageContainer>
	)

  if (!poolData) return <Empty content='Oops! No Data.' />

  const _coins = poolData?.name.split('-')

  const [coinInputFirst, setCoinInputFirst] = useState<string>('')
  const [coinTypeFirst, setCoinTypeFirst] = useState<CoinInterface>(Coins.filter((coin) => coin.name === _coins[0])[0])
  const [coinInputSecond, setCoinInputSecond] = useState<string>('')
  const [coinTypeSecond, setCoinTypeSecond] = useState<CoinInterface>(Coins.filter((coin) => coin.name === _coins[1])[0])

  const coinTypeFirstBalance = coinTypeFirst && useGetBalance(coinTypeFirst.type, walletAddress)
  const coinTypeSecondBalance = coinTypeSecond && useGetBalance(coinTypeSecond.type, walletAddress)

  const _poolCoinX = fetchIcon(poolData.type_x);
  const _poolCoinY = fetchIcon(poolData.type_y);

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
            <div className={cx(poolStyles.columnContent, css({
                marginTop: '25px',
              }))}>
              <div className={poolStyles.greyText}>Liquidity</div>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <div>
                  <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                    <div className={poolStyles.boldText}>{poolData.reserve_x}</div>
                    <div className={poolStyles.lightGreyText}>{_poolCoinX!.name}</div>
                  </div>
                  <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                    <div className={poolStyles.boldText}>{poolData.reserve_x}</div>
                    <div className={poolStyles.lightGreyText}>{_poolCoinX!.name}</div>
                  </div>
                </div>
                <div>
                  <div className={poolStyles.lightGreyText}>APY</div>
                  <div className={poolStyles.boldText}>{poolData.reserve_x}</div>
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
                text='USDC/USDT LP pair Deposit'
                onClick={() => handleAddLiquidity()}
              />
              <Button
                styletype='filled'
                text='Deposit & Stake'
                onClick={() => handleAddLiquidity()}
              />
            </div>
          </div>
        </>
      )
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
                    value={coinInputFirst}
                    onChange={(e) => {
                      if (coinTypeFirstBalance?.totalBalance) {
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
            <Button
              styletype='filled'
              text='USDC/USDT LP pair Deposit'
              onClick={() => handleAddLiquidity()}
            />
            <Button
              styletype='filled'
              text='Deposit & Stake'
              onClick={() => handleAddLiquidity()}
            />
          </div>
        </>
      )
    }
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
                  <span className={styles.textMarginLeft}>{_poolCoinX!.name}</span>
                </span>
                <div className={poolStyles.boldText}>{poolData.reserve_x}</div>
              </div>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <span className={poolStyles.boldText}>
                  {_poolCoinY?.logo}
                  <span className={styles.textMarginLeft}>{_poolCoinY!.name}</span>
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
              <div className={cx(poolStyles.boldText, styles.textMarginLeft)}>{poolData.reserve_x}</div>
            </div>
            <div className={styles.coinContent}>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <span className={poolStyles.boldText}>
                  {_poolCoinX?.logo}
                  <span className={styles.textMarginLeft}>{_poolCoinX!.name}</span>
                </span>
                <div className={poolStyles.boldText}>{poolData.reserve_x}</div>
              </div>
              <div className={cx(poolStyles.rowContent, styles.coinBlock)}>
                <span className={poolStyles.boldText}>
                  {_poolCoinY?.logo}
                  <span className={styles.textMarginLeft}>{_poolCoinY!.name}</span>
                </span>
                <div className={poolStyles.boldText}>{poolData.reserve_y}</div>
              </div>
              <div className={styles.infoContent}>
                <div className={poolStyles.lightGreyText}>
                  To receive underlying pair of coins from your staked pool, please unstake and withdraw.
                </div>
                <div className={poolStyles.greyText}>
                  Make sure to claim any rewards before withdrawing.
                </div>
              </div>
              <div className={styles.buttonContent}>
                <Button
                  styletype='filled'
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
            <div className={poolStyles.greyText}>Deposit Liquidity to earn rewards.</div>
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
};

export default LiquidityPresentation;