import { useMemo, useState } from 'react';
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
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'

import SelectCoinModal from './_SelectCoinModal'
import * as styles from './index.styles'
import { Coins } from '@/Constants/coin';
import useGetBalance from '@/Hooks/Coin/useGetBalance';
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool';
import { useSwap } from '@/Hooks/AMM/useSwap'

const SwapPresentation = () => {
	const {
		error, setError, walletAddress,
		coinData, isCoinDataLoading,
		coinInputFirst, coinInputSecond,
		coinTypeFirst, coinTypeSecond,
		setCoinTypeFirst, setCoinTypeSecond,
		isShowSelectModal, setIsShowSelectModal,
		handleOnCoinInputFirstChange, handleOnCoinInputSecondChange,
	} = useSwapContext();

	const [isSecond, setIsSecond] = useState<boolean>(false);
	const [isFetchPriceSortDesc, setIsFetchPriceSortDesc] = useState<boolean>(true);
	const _coinTypeFirstTotalBalance = coinData?.filter((coin) => coin.coinName === coinTypeFirst?.name)[0].totalBalance;
	const _coinTypeSecondTotalBalance = coinData?.filter((coin) => coin.coinName === coinTypeSecond?.name)[0].totalBalance;

	// pools
	const {data:pool_ids} = useGetPoolIDs()
	const {data: pools} = useGetMulPool(pool_ids)
	const pool = useMemo(()=>pools?.find((p)=>p.type_x == coinTypeFirst?.type && p.type_y == coinTypeSecond?.type || p.type_x == coinTypeSecond?.type && p.type_y == coinTypeFirst?.type) ?? null,[coinTypeFirst?.type, coinTypeSecond?.type])
	//

	const coinTypeFirstBalance = coinTypeFirst && useGetBalance(coinTypeFirst.type, walletAddress)
	const coinTypeSecondBalance = coinTypeSecond && useGetBalance(coinTypeSecond.type, walletAddress)

  const swap = useSwap();

	const handleSwap = () => {
    if (pool && coinTypeFirst?.type) {
      swap.mutate({
        pool_id: pool.id,
        pool_type_x: pool.type_x,
        pool_type_y: pool.type_y,
        is_type_x: pool.type_x == coinTypeFirst.type,
        input_value: coinInputFirst,
        output_value: coinInputSecond,
      })
    }
  };

	console.log('pool', pool);

	const _coinData = coinData?.filter((coin) => {
		switch (coin.coinName) {
			case coinTypeFirst!.name:
				return false;
			case coinTypeSecond!.name:
				return false;

			default:
				return true;
		}
	})

	const _fetchPrice = (sort: boolean) => {
		if (sort) {
			return (
				`
					1 ${Coins.filter((coin) => coin.type === pool?.type_x)[0]?.name} =
					${(Number(pool?.reserve_x) / Number(pool?.reserve_y)).toFixed(5)} ${Coins.filter((coin) => coin.type === pool?.type_y)[0]?.name}
				`
			)
		} else {
			return (
				`
					1 ${Coins.filter((coin) => coin.type === pool?.type_y)[0]?.name} =
					${(Number(pool?.reserve_y) / Number(pool?.reserve_x)).toFixed(5)} ${Coins.filter((coin) => coin.type === pool?.type_x)[0]?.name}
				`
			)
		}
	}


	if (isCoinDataLoading) return (
		<PageContainer title='Swap' titleImg={Image.pageBackground_1}>
			<div className={styles.swapContainer}>
				<Loading />
			</div>
		</PageContainer>
	);

	if (!coinData || !coinTypeFirst || !coinTypeSecond) return <Empty content='Oops!' />

	return (
		<PageContainer title='Swap' titleImg={Image.pageBackground_1}>
			<div className={styles.slognContent}>
				Trade with VSDB NFT  to earn Exp and enjoy fee deduction.
			</div>
			<div className={styles.swapContainer}>
				<InputSection
					balance={
						_coinTypeFirstTotalBalance
							? BigNumber(_coinTypeFirstTotalBalance).shiftedBy(-coinTypeFirst.decimals).toFormat()
							: '...'
					}
					titleChildren={
						<div
							className={styles.coinButton}
							onClick={() => {
								setIsShowSelectModal(true);
								setIsSecond(false);
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
										if (parseFloat(e.target.value) * Math.pow(10, 9) > Number(coinTypeFirstBalance.totalBalance)) {
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
						setCoinTypeFirst(coinTypeSecond);
						setCoinTypeSecond(coinTypeFirst);
					}}
				/>
				<InputSection
					balance={
						_coinTypeSecondTotalBalance
							? BigNumber(_coinTypeSecondTotalBalance).shiftedBy(-coinTypeSecond.decimals).toFormat()
							: '...'
					}
					titleChildren={
						<div
							className={styles.coinButton}
							onClick={() => {
								setIsShowSelectModal(true);
								setIsSecond(true);
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
									handleOnCoinInputSecondChange(e);

									if (coinTypeSecondBalance?.totalBalance) {
										if (parseFloat(e.target.value) * Math.pow(10, 9) > Number(coinTypeSecondBalance.totalBalance)) {
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
					<div className={styles.bonusText}>Bonus  label<span>12%</span></div>
					<div className={styles.infoText}>
						Price
						<span>
							{_fetchPrice(isFetchPriceSortDesc)}
							<Icon.SwapCircleIcon className={styles.switchPriceSortButton} onClick={() => setIsFetchPriceSortDesc(!isFetchPriceSortDesc)} />
						</span>
					</div>
					<div className={styles.infoText}>Minimum Received<span>1 SUI</span></div>
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
};

export default SwapPresentation;