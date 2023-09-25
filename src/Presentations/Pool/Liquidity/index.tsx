import { useCallback, useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cx, css } from '@emotion/css'

import {
  PageContainer,
  InputSection,
  Input,
  Button,
  Loading,
  Error,
} from '@/Components'
import { LiquidityContext } from '@/Containers/Pool/Liquidity'
import { Icon } from '@/Assets/icon'
import Image from '@/Assets/image'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { CoinFormat, formatBalance } from '@/Utils/format'
import { regexNumber } from '@/Constants/index'

import * as styles from './index.styles'
import * as constantsStyles from '@/Constants/constants.styles'
import { useAddLiquidity } from '@/Hooks/AMM/useAddLiquidity'
import { useRemoveLiquidity } from '@/Hooks/AMM/useRemoveLiquidity'
import { useGetLP } from '@/Hooks/AMM/useGetLP'
import { useZap } from '@/Hooks/AMM/useZap'
import { lp_position } from '@/Utils/pool'
import { usePageContext } from '@/Components/Page'
import { useDepoistAndStake } from '@/Hooks/Vote/useDepositAndStake'
import { useUnStakeAndWithdraw } from '@/Hooks/Vote/useUnstakeAndWithdraw'
import { useGetStake } from '@/Hooks/Vote/useGetStake'
import { useStake } from '@/Hooks/Vote/useStake'
import { useUnStake } from '@/Hooks/Vote/useUnstake'
import { useZapAndStake } from '@/Hooks/Vote/useZapAndStake'

const LiquidityPresentation = () => {
  const {
    walletAddress,
    poolData,
    fetching,
    error,
    setError,
    gaugeData,
    coinInputX,
    coinTypeX,
    coinInputY,
    coinTypeY,
    coinInputSingle,
    setCoinInputX,
    setCoinInputY,
    setCoinInputSingle,
  } = useContext(LiquidityContext)

  const { setting } = usePageContext()

  const [isDepositSingle, setIsDepositSingle] = useState(false)
  const [singleType, setSingleType] = useState(coinTypeX)
  const singleTypeBalance = useGetBalance(singleType.type, walletAddress)
  const coinTypeXBalance = useGetBalance(coinTypeX.type, walletAddress)
  const coinTypeYBalance = useGetBalance(coinTypeY.type, walletAddress)

  const handleOnCoinInputXChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!poolData || !coinTypeX || !coinTypeY) return
      let value = e.target.value
      const isValid = regexNumber.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }

      setCoinInputX(value)
      if (poolData.reserve_x !== '0') {
        const price =
          (Number(poolData.reserve_y) / Number(poolData.reserve_x)) *
          10 ** (coinTypeX.decimals - coinTypeY.decimals) *
          parseFloat(value)
        setCoinInputY(isNaN(price) ? '' : price.toFixed(6))
      }
    },
    [setCoinInputX, poolData],
  )

  const handleOnCoinInputYChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!poolData) return
      let value = e.target.value
      const isValid = regexNumber.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputY(value)
      if (poolData.reserve_x !== '0') {
        const price =
          (Number(poolData.reserve_x) / Number(poolData.reserve_y)) *
          10 ** (coinTypeY.decimals - coinTypeX.decimals) *
          parseFloat(value)
        setCoinInputX(isNaN(price) ? '' : price.toFixed(6))
      }
    },
    [setCoinInputY, poolData],
  )

  const handleOnCoinInputSingleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value
      const isValid = regexNumber.test(value)
      if (!isValid) {
        value = value.slice(0, -1)
      }
      setCoinInputSingle(value)
    },
    [setCoinInputSingle],
  )

  const lp = useGetLP(walletAddress, poolData?.type_x, poolData?.type_y)

  const add_liquidity = useAddLiquidity(setting)
  const handleAddLiquidity = () => {
    if (poolData && lp !== undefined) {
      add_liquidity.mutate({
        pool_id: poolData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        lp_id: lp ? lp.id : null,
        input_x_value: Math.floor(
          Number(coinInputX) * 10 ** coinTypeX.decimals,
        ).toString(),
        input_y_value: Math.floor(
          Number(coinInputY) * 10 ** coinTypeY.decimals,
        ).toString(),
      })
    }
  }

  const zap = useZap(setting)
  const handleZap = () => {
    if (poolData) {
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
        input_type: singleType.type,
        input_value: (
          Number(coinInputSingle) *
          10 ** singleType.decimals
        ).toString(),
      })
    }
  }

  const deposit_and_stake = useDepoistAndStake(setting)
  const handleDepositAndStake = () => {
    if (poolData && gaugeData) {
      deposit_and_stake.mutate({
        pool_id: poolData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        gauge_id: gaugeData.id,
        lp_id: lp ? lp.id : null,
        input_x_value: (
          Number(coinInputX) *
          10 ** coinTypeX.decimals
        ).toString(),
        input_y_value: (
          Number(coinInputY) *
          10 ** coinTypeY.decimals
        ).toString(),
      })
    }
  }

  const zap_and_stake = useZapAndStake(setting)
  const handleZapAndStake = () => {
    if (poolData && gaugeData) {
      const {
        id,
        type_x,
        type_y,
        reserve_x,
        reserve_y,
        stable,
        fee: { fee_percentage },
      } = poolData
      zap_and_stake.mutate({
        pool_id: id,
        pool_type_x: type_x,
        pool_type_y: type_y,
        reserve_x: reserve_x,
        reserve_y: reserve_y,
        stable,
        fee: fee_percentage,
        gauge_id: gaugeData.id,
        lp_id: lp ? lp.id : null,
        input_type: singleType.type,
        input_value: (
          Number(coinInputSingle) *
          10 ** singleType.decimals
        ).toString(),
      })
    }
  }

  const { data: stake_bal } = useGetStake(
    gaugeData?.id,
    gaugeData?.type_x,
    gaugeData?.type_y,
    lp?.id,
  )

  const withdraw = useRemoveLiquidity(setting)
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
  const stake = useStake(setting)
  const handleStake = () => {
    if (poolData && lp && gaugeData) {
      stake.mutate({
        pool_id: poolData.id,
        gauge_id: gaugeData.id,
        pool_type_x: gaugeData.type_x,
        pool_type_y: gaugeData.type_y,
        lp_id: lp.id,
      })
    }
  }

  const unstake = useUnStake(setting)
  const handleUnstake = () => {
    if (poolData && lp && gaugeData && stake_bal) {
      unstake.mutate({
        pool_id: poolData.id,
        gauge_id: gaugeData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        lp_id: lp.id,
        value: stake_bal,
      })
    }
  }

  const unstake_and_withdraw = useUnStakeAndWithdraw(setting)
  const handleUnstakeAndWithdraw = () => {
    if (poolData && lp && gaugeData && stake_bal) {
      unstake_and_withdraw.mutate({
        pool_id: poolData.id,
        pool_type_x: poolData.type_x,
        pool_type_y: poolData.type_y,
        gauge_id: gaugeData?.id,
        lp_id: lp.id,
        withdrawl: stake_bal,
      })
    }
  }

  useEffect(() => {
    setSingleType(coinTypeX)
  }, [isDepositSingle])

  if (fetching) {
    return (
      <PageContainer title='Liquidity' titleImg={Image.pageBackground_1}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )
  }

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
      <div
        className={cx(constantsStyles.rowContent, styles.liquidityContainer)}
      >
        <div className={cx(constantsStyles.columnContent, styles.rightContent)}>
          <div
            className={cx(styles.shadowContent, constantsStyles.columnContent)}
          >
            <div className={cx(constantsStyles.boldText, styles.title)}>
              <span>Deposit</span>
            </div>
            <div className={constantsStyles.greyText}>
              Deposit Liquidity to earn rewards.
            </div>
            <div className={cx(styles.ellipseTabList)}>
              <span
                className={cx(styles.ellipseTabTitle, {
                  [styles.ellipseActiveTab]: !isDepositSingle,
                })}
                onClick={() => setIsDepositSingle(!isDepositSingle)}
              >
                Pair
              </span>
              <span
                className={cx(styles.ellipseTabTitle, {
                  [styles.ellipseActiveTab]: isDepositSingle,
                })}
                onClick={() => setIsDepositSingle(!isDepositSingle)}
              >
                Single
              </span>
            </div>
            <div>
              {!isDepositSingle ? (
                <>
                  <div
                    className={cx(
                      constantsStyles.lightGreyText,
                      css({ justifyContent: 'center' }),
                    )}
                  >
                    <Icon.NoticeIcon />
                    Deposit pair of Coins into Pool.
                  </div>
                  <div>
                    <div
                      className={cx(
                        constantsStyles.columnContent,
                        css({
                          marginTop: '25px',
                        }),
                      )}
                    >
                      <div className={constantsStyles.greyText}>Liquidity</div>
                      <div
                        className={cx(
                          constantsStyles.rowContent,
                          styles.coinBlock,
                        )}
                      >
                        <div>
                          <div
                            className={cx(
                              constantsStyles.rowContent,
                              styles.coinBlock,
                            )}
                          >
                            <div className={constantsStyles.boldText}>
                              {formatBalance(
                                poolData?.reserve_x ?? '0',
                                poolData?.decimal_x ?? 0,
                              )}
                            </div>
                            <div
                              className={cx(
                                constantsStyles.lightGreyText,
                                css({
                                  marginLeft: '5px',
                                }),
                              )}
                            >
                              {coinTypeX!.name}
                            </div>
                          </div>
                          <div
                            className={cx(
                              constantsStyles.rowContent,
                              styles.coinBlock,
                            )}
                          >
                            <div className={constantsStyles.boldText}>
                              {formatBalance(
                                poolData?.reserve_y ?? '0',
                                poolData?.decimal_y ?? 0,
                              )}
                            </div>
                            <div
                              className={cx(
                                constantsStyles.lightGreyText,
                                css({
                                  marginLeft: '5px',
                                }),
                              )}
                            >
                              {coinTypeY!.name}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className={constantsStyles.lightGreyText}>
                            APY
                          </div>
                          <div className={constantsStyles.boldText}>
                            {poolData?.reserve_x ?? '...'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.inputContent}>
                      <InputSection
                        balance={
                          coinTypeXBalance
                            ? formatBalance(
                                coinTypeXBalance.totalBalance,
                                coinTypeX.decimals,
                              )
                            : '...'
                        }
                        titleChildren={
                          <div>
                            {coinTypeX.logo}
                            <span>{coinTypeX.name}</span>
                          </div>
                        }
                        inputChildren={
                          <>
                            <Input
                              value={coinInputX}
                              onChange={(e) => {
                                if (coinTypeXBalance?.totalBalance) {
                                  handleOnCoinInputXChange(e)
                                  if (
                                    parseFloat(e.target.value) *
                                      Math.pow(10, coinTypeX.decimals) >
                                    Number(coinTypeXBalance.totalBalance)
                                  ) {
                                    setError('Insufficient Balance')
                                  } else {
                                    setError('')
                                  }
                                }
                              }}
                              placeholder={`${coinTypeX.name} Value`}
                              // disabled={isLoading}
                            />
                          </>
                        }
                      />
                      <InputSection
                        balance={
                          coinTypeYBalance
                            ? formatBalance(
                                coinTypeYBalance.totalBalance,
                                coinTypeY.decimals,
                              )
                            : '...'
                        }
                        titleChildren={
                          <div>
                            {coinTypeY.logo}
                            <span>{coinTypeY.name}</span>
                          </div>
                        }
                        inputChildren={
                          <>
                            <Input
                              value={coinInputY}
                              onChange={(e) => {
                                if (coinTypeYBalance?.totalBalance) {
                                  handleOnCoinInputYChange(e)
                                  if (
                                    parseFloat(e.target.value) *
                                      Math.pow(10, 9) >
                                    Number(coinTypeYBalance.totalBalance)
                                  ) {
                                    setError('Insufficient Balance')
                                  } else {
                                    setError('')
                                  }
                                }
                              }}
                              placeholder={`${coinTypeY.name} Value`}
                              // disabled={isLoading}
                            />
                          </>
                        }
                      />
                    </div>
                    {error && (
                      <div className={styles.errorContent}>
                        <Error errorText={error} />
                      </div>
                    )}
                    <div className={styles.buttonContent}>
                      <Button
                        styletype='filled'
                        text='Deposit'
                        onClick={() => handleAddLiquidity()}
                      />
                      <Button
                        styletype='filled'
                        disabled={!gaugeData}
                        text='Deposit & Stake'
                        onClick={() => handleDepositAndStake()}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={constantsStyles.lightGreyText}>
                    <Icon.NoticeIcon />
                    Deposit Single Type of Coins to add Liquidity.
                  </div>
                  {/**<div className={constantsStyles.lightGreyText}>
                    <Icon.NoticeIcon />
                    When depositing one type of Coins to stable pools <br/> there are some remaining coins returned !
                  </div>**/}
                  <div className={styles.inputContent}>
                    <InputSection
                      balance={
                        singleTypeBalance
                          ? formatBalance(
                              singleTypeBalance.totalBalance,
                              singleType.decimals,
                            )
                          : '...'
                      }
                      titleChildren={
                        <div>
                          {singleType.logo}
                          <span>{singleType.name}</span>
                          <Icon.SwapIcon
                            onClick={() => {
                              if (singleType.type === coinTypeX.type) {
                                setSingleType(coinTypeY)
                              } else {
                                setSingleType(coinTypeX)
                              }
                            }}
                          />
                        </div>
                      }
                      inputChildren={
                        <>
                          <Input
                            value={coinInputSingle}
                            onChange={(e) => {
                              if (singleTypeBalance?.totalBalance) {
                                handleOnCoinInputSingleChange(e)
                                if (
                                  parseFloat(e.target.value) *
                                    Math.pow(10, singleType.decimals) >
                                  Number(singleTypeBalance.totalBalance)
                                ) {
                                  setError('Insufficient Balance')
                                } else {
                                  setError('')
                                }
                              }
                            }}
                            placeholder={`${singleType.name} Value`}
                            // disabled={isLoading}
                          />
                        </>
                      }
                    />
                  </div>
                  {error && (
                    <div className={styles.errorContent}>
                      <Error errorText={error} />
                    </div>
                  )}
                  <div className={styles.buttonContent}>
                    <Button
                      styletype='filled'
                      text='Zap'
                      onClick={() => handleZap()}
                    />
                    <Button
                      disabled={!gaugeData}
                      styletype='filled'
                      text='Zap & Stake'
                      onClick={() => handleZapAndStake()}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={cx(constantsStyles.columnContent, styles.leftContent)}>
          <div
            className={cx(styles.shadowContent, constantsStyles.columnContent)}
          >
            <div className={cx(constantsStyles.boldText, styles.title)}>
              <Icon.PoolIcon />
              <span>Pool</span>
            </div>
            <div className={constantsStyles.lightGreyText}>
              Your Coins in Pool.
            </div>
            <div className={styles.coinContent}>
              <div className={cx(constantsStyles.rowContent, styles.coinBlock)}>
                <span className={constantsStyles.boldText}>
                  {coinTypeX.logo}
                  <span className={styles.textMarginLeft}>
                    {coinTypeX.name}
                  </span>
                </span>
                <div className={constantsStyles.boldText}>
                  {poolData && lp
                    ? lp_position(
                        poolData.reserve_x,
                        poolData.lp_supply,
                        lp.lp_balance,
                        coinTypeX.decimals,
                      )
                    : '0.00'}
                </div>
              </div>
              <div className={cx(constantsStyles.rowContent, styles.coinBlock)}>
                <span className={constantsStyles.boldText}>
                  {coinTypeY.logo}
                  <span className={styles.textMarginLeft}>
                    {coinTypeY.name}
                  </span>
                </span>
                <div className={constantsStyles.boldText}>
                  {poolData && lp
                    ? lp_position(
                        poolData.reserve_y,
                        poolData.lp_supply,
                        lp.lp_balance,
                        coinTypeY.decimals,
                      )
                    : '0.00'}
                </div>
              </div>
              <div className={styles.buttonContent}>
                <Button
                  styletype='filled'
                  text='Withdraw'
                  disabled={parseInt(lp?.lp_balance ?? '0') == 0}
                  onClick={() => handleWithdraw()}
                />
                <Button
                  styletype='filled'
                  text='Stake'
                  onClick={() => handleStake()}
                  disabled={!gaugeData || (lp?.lp_balance ?? '0') == '0'}
                />
              </div>
            </div>
          </div>
          <div
            className={cx(styles.shadowContent, constantsStyles.columnContent)}
          >
            <div className={cx(constantsStyles.boldText, styles.title)}>
              <Icon.StakeIcon />
              <span>Stake</span>
            </div>
            <div className={constantsStyles.lightGreyText}>
              Staked Liquidity.
            </div>
            <br />
            <div className={constantsStyles.greyText}>
              Your Balance
              <div
                className={cx(constantsStyles.boldText, styles.textMarginLeft)}
              >
                {formatBalance(stake_bal ?? '0', 9, CoinFormat.FULL)}
              </div>
            </div>
            <div className={styles.coinContent}>
              <div className={cx(constantsStyles.rowContent, styles.coinBlock)}>
                <span className={constantsStyles.boldText}>
                  {coinTypeX.logo}
                  <span className={styles.textMarginLeft}>
                    {coinTypeX.name}
                  </span>
                </span>
                <div className={constantsStyles.boldText}>
                  {poolData && stake_bal
                    ? lp_position(
                        poolData.reserve_x,
                        poolData.lp_supply,
                        stake_bal,
                        coinTypeX.decimals,
                      )
                    : '0.00'}
                </div>
              </div>
              <div className={cx(constantsStyles.rowContent, styles.coinBlock)}>
                <span className={constantsStyles.boldText}>
                  {coinTypeY.logo}
                  <span className={styles.textMarginLeft}>
                    {coinTypeY.name}
                  </span>
                </span>
                <div className={constantsStyles.boldText}>
                  {poolData && stake_bal
                    ? lp_position(
                        poolData.reserve_y,
                        poolData.lp_supply,
                        stake_bal,
                        coinTypeY.decimals,
                      )
                    : '0.00'}
                </div>
              </div>
              <div className={styles.infoContent}>
                <div className={constantsStyles.lightGreyText}>
                  To receive underlying pair of coins from your staked pool,
                  please unstake and withdraw.
                </div>
                <div className={constantsStyles.greyText}>
                  Make sure to claim any rewards before withdrawing.
                </div>
              </div>
              <div className={styles.buttonContent}>
                <Button
                  styletype='filled'
                  disabled={parseInt(stake_bal ?? '0') == 0}
                  text='Unstake'
                  onClick={() => handleUnstake()}
                />
                <Button
                  styletype='filled'
                  text='Unstake & Withdraw'
                  onClick={() => handleUnstakeAndWithdraw()}
                  disabled={parseInt(stake_bal ?? '0') == 0 || !gaugeData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default LiquidityPresentation
