import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { Spinner } from '@blueprintjs/core'
import { Coins } from '@/Constants/coin'
import {
  PageContainer,
  InputSection,
  Input,
  Button,
  Loading,
  Empty,
  Error,
} from '@/Components'
import { useSwapContext } from '@/Containers/Swap'
import { usePageContext } from '@/Components/Page'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'

import SelectCoinModal from './_SelectCoinModal'
import * as constantsStyles from '@/Constants/constants.styles'
import * as styles from './index.styles'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { get_output } from '@/Constants/API/pool'
import useRpc from '@/Hooks/useRpc'
import { useSwap } from '@/Hooks/AMM/useSwap'

const SwapPresentation = () => {
  const {
    error,
    setError,
    walletAddress,
    coinData,
    isCoinDataLoading,
    coinInputFirst,
    coinInputSecond,
    coinTypeFirst,
    coinTypeSecond,
    setCoinTypeFirst,
    setCoinTypeSecond,
    isShowSelectModal,
    setIsShowSelectModal,
    pool,
    handleOnCoinInputFirstChange,
    handleOnCoinInputSecondChange,
  } = useSwapContext()

  const { currentNFTInfo, setting } = usePageContext()

  const rpc = useRpc()
  const [isSecond, setIsSecond] = useState<boolean>(false)
  const [isFetchPriceSortDesc, setIsFetchPriceSortDesc] =
    useState<boolean>(true)
  const _coinTypeFirstTotalBalance = coinData?.filter(
    (coin) => coin.coinName === coinTypeFirst?.name,
  )[0].totalBalance
  const _coinTypeSecondTotalBalance = coinData?.filter(
    (coin) => coin.coinName === coinTypeSecond?.name,
  )[0].totalBalance

  const coinTypeFirstBalance =
    coinTypeFirst && useGetBalance(coinTypeFirst.type, walletAddress)
  const coinTypeSecondBalance =
    coinTypeSecond && useGetBalance(coinTypeSecond.type, walletAddress)

  const _coinData = coinData?.filter((coin) => {
    switch (coin.coinName) {
      case coinTypeFirst!.name:
        return false
      case coinTypeSecond!.name:
        return false

      default:
        return true
    }
  })
  const minimum_received = useMemo(
    () => (1 - parseFloat(setting.slippage) / 100) * Number(coinInputSecond),
    [setting.slippage, coinInputSecond],
  )

  const fetchPrice = (sort: boolean) => {
    const coin_x = Coins.find((c) => c.type === coinTypeFirst?.type)
    const coin_y = Coins.find((c) => c.type === coinTypeSecond?.type)
    let price = 0
    if (coinInputFirst && getOutput) {
      if (getOutput === '0') {
        return 'No Liquidity'
      } else {
        price =
          (Number(getOutput) /
            (Number(coinInputFirst) * 10 ** coin_x!.decimals)) *
          10 ** (coin_x!.decimals - coin_y!.decimals)
      }
    }

    return sort
      ? `1${coin_x?.name} = ${price.toFixed(5)} ${coin_y?.name}`
      : `1${coin_y?.name} = ${(price == 0 ? 0 : 1 / price).toFixed(
          5,
        )} ${coin_x?.name}`
  }

  const [getOutputIsLoading, setGetOutpuIsLoading] = useState(false)

  const [getOutput, setGetOutput] = useState('')

  useEffect(() => {
    async function get_output_() {
      if (
        pool &&
        walletAddress &&
        coinInputFirst &&
        coinTypeFirst &&
        coinTypeSecond
      ) {
        setGetOutpuIsLoading(true)
        const res = await get_output(
          rpc,
          walletAddress,
          pool.id,
          pool?.type_x,
          pool?.type_y,
          coinTypeFirst?.type,
          Math.round(
            parseFloat(coinInputFirst) * 10 ** coinTypeFirst.decimals,
          ).toString(),
        )
        setGetOutpuIsLoading(false)
        setGetOutput(res)
        handleOnCoinInputSecondChange(
          (parseInt(res) / 10 ** coinTypeSecond.decimals).toString(),
        )
      }
    }
    get_output_()
  }, [pool, walletAddress, coinTypeFirst, coinInputFirst])

  const swap = useSwap()
  const handleSwap = () => {
    if (currentNFTInfo.isLoading) return
    console.log(currentNFTInfo.data)
    if (pool && coinTypeFirst && coinTypeSecond) {
      swap.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        is_type_x: pool.type_x == coinTypeFirst.type,
        input_value: Math.round(
          parseFloat(coinInputFirst) * 10 ** coinTypeFirst.decimals,
        ).toString(),
        output_value: Math.round(
          minimum_received * 10 ** coinTypeSecond.decimals,
        ).toString(),
        vsdb: ( currentNFTInfo.data?.amm_state ) ? currentNFTInfo!.data.id : null,
      })
    }
  }
  if (isCoinDataLoading)
    return (
      <PageContainer title='Swap' titleImg={Image.pageBackground_1}>
        <div className={constantsStyles.LoadingContainer}>
          <Loading />
        </div>
      </PageContainer>
    )

  if (!coinData || !coinTypeFirst || !coinTypeSecond)
    return <Empty content='Oops!' />

  return (
    <PageContainer title='Swap' titleImg={Image.pageBackground_1}>
      <div className={styles.slognContent}>
        Trade with VSDB NFT to earn Exp and enjoy fee deduction.
      </div>
      <div className={styles.swapContainer}>
        <InputSection
          balance={
            _coinTypeFirstTotalBalance
              ? BigNumber(_coinTypeFirstTotalBalance)
                  .shiftedBy(-coinTypeFirst.decimals)
                  .toFormat()
              : '...'
          }
          titleChildren={
            <div
              className={styles.coinButton}
              onClick={() => {
                setIsShowSelectModal(true)
                setIsSecond(false)
              }}
            >
              {coinTypeFirst.logo}
              <span>{coinTypeFirst.name}</span>
            </div>
          }
          inputChildren={
            <>
              <Input
                value={coinInputFirst}
                onChange={(e) => {
                  handleOnCoinInputFirstChange(e)

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
        <Icon.ArrowDownIcon
          className={styles.arrowDownIcon}
          onClick={() => {
            setCoinTypeFirst(coinTypeSecond)
            setCoinTypeSecond(coinTypeFirst)
          }}
        />
        <InputSection
          balance={
            _coinTypeSecondTotalBalance
              ? BigNumber(_coinTypeSecondTotalBalance)
                  .shiftedBy(-coinTypeSecond.decimals)
                  .toFormat()
              : '...'
          }
          titleChildren={
            <div
              className={styles.coinButton}
              onClick={() => {
                setIsShowSelectModal(true)
                setIsSecond(true)
              }}
            >
              {coinTypeSecond.logo}
              <span>{coinTypeSecond.name}</span>
            </div>
          }
          inputChildren={
            <>
              {getOutputIsLoading ? (
                <div className={styles.inputAnimation}>
                  <Spinner size={20} />
                </div>
              ) : (
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
                  disabled={getOutputIsLoading}
                />
              )}
            </>
          }
        />
        <div className={styles.infoContent}>
          <div className={styles.bonusText}>
            Fee Percentage Discount
            <span>{parseInt(currentNFTInfo.data?.level ?? '0') * 0.01} %</span>
          </div>
          <div className={styles.infoText}>
            Price
            {pool && (
              <span>
                {fetchPrice(isFetchPriceSortDesc)}
                <Icon.SwapCircleIcon
                  className={styles.switchPriceSortButton}
                  onClick={() => setIsFetchPriceSortDesc(!isFetchPriceSortDesc)}
                />
              </span>
            )}
          </div>
          <div className={styles.infoText}>
            Minimum Received
            <span>
              {minimum_received.toFixed(coinTypeSecond.decimals) +
                ' ' +
                coinTypeSecond.name}
            </span>
          </div>
        </div>
        {error && (
          <div className={styles.errorContent}>
            <Error errorText={error} />
          </div>
        )}
        <div className={styles.swapButton}>
          <Button
            text='Swap'
            styletype='filled'
            onClick={handleSwap}
            disabled={
              !!error ||
              !coinInputFirst ||
              !coinInputSecond ||
              getOutput === '0' ||
              getOutputIsLoading
            }
            isloading={swap.isLoading ? 1 : 0}
          />
        </div>
      </div>
      <SelectCoinModal
        isShow={isShowSelectModal}
        setIsShow={setIsShowSelectModal}
        coinData={_coinData}
        isCoinDataLoading={isCoinDataLoading}
        setCoinType={isSecond ? setCoinTypeSecond : setCoinTypeFirst}
      />
    </PageContainer>
  )
}

export default SwapPresentation
