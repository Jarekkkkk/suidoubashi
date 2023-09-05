import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import {
  PageContainer,
  InputSection,
  Input,
  Button,
  Loading,
  Empty,
} from '@/Components'
import { useSwapContext } from '@/Containers/Swap'
import { usePageContext } from '@/Components/Page'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'

import SelectCoinModal from './_SelectCoinModal'
import * as styles from './index.styles'
import useGetBalance from '@/Hooks/Coin/useGetBalance'
import { get_output } from '@/Constants/API/pool'
import useRpc from '@/Hooks/useRpc'
import { SLIPPAGE_STORAGE_NAME } from '@/Modules/Setting'

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
    handleSwap,
    fetchPrice,
    pool,
    handleOnCoinInputFirstChange,
    handleOnCoinInputSecondChange,
  } = useSwapContext();

  const { currentNFTInfo } = usePageContext();

  console.log('currentNFTInfo', currentNFTInfo)

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
  const [slippage, setSlippage] = useState('')
  const minimum_received = useMemo(
    () =>
      ((1 - parseFloat(slippage) / 100) * Number(coinInputSecond)).toFixed(
        coinTypeSecond?.decimals,
      ),
    [slippage, coinInputSecond],
  )
  const [isLoading, setisLoading] = useState(false)
  useEffect(() => {
    async function get_output_() {
      if (pool && walletAddress && coinTypeFirst) {
        setisLoading(true)
        const res = await get_output(
          rpc,
          walletAddress,
          pool.id,
          pool?.type_x,
          pool?.type_y,
          coinTypeFirst?.type,
          coinInputFirst,
        )
        setisLoading(false)
        handleOnCoinInputSecondChange(res)
      }
    }
    get_output_()
    setSlippage(localStorage.getItem(SLIPPAGE_STORAGE_NAME) || '')
  }, [pool, walletAddress, coinTypeFirst, coinInputFirst])

  if (isCoinDataLoading)
    return (
      <PageContainer title='Swap' titleImg={Image.pageBackground_1}>
        <div className={styles.swapContainer}>
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
                      parseFloat(e.target.value) * Math.pow(10, 9) >
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
        <div className={styles.infoContent}>
          <div className={styles.bonusText}>
            Bonus label<span>12%</span>
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
            <span>{minimum_received + ' ' + coinTypeSecond.name}</span>
          </div>
        </div>
        <div className={styles.swapButton}>
          <Button
            text='Swap'
            styletype='filled'
            onClick={handleSwap}
            disabled={!!error || !coinInputFirst || !coinInputSecond}
            // isLoading={isLoading}
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
