import { useState } from 'react';
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

const SwapPresentation = () => {
	const {
		coinData, isCoinDataLoading,
		coinInputFirst, coinInputSecond,
		coinTypeFirst, coinTypeSecond,
		setCoinTypeFirst, setCoinTypeSecond,
		isShowSelectModal, setIsShowSelectModal,
		handleOnCoinInputFirstChange, handleOnCoinInputSecondChange,
	} = useSwapContext();

	const [isSecond, setIsSecond] = useState<boolean>(false);
	const _coinTypeFirstTotalBalance = coinData?.filter((coin) => coin.coinName === coinTypeFirst?.name)[0].totalBalance;
	const _coinTypeSecondTotalBalance = coinData?.filter((coin) => coin.coinName === coinTypeSecond?.name)[0].totalBalance;
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


	if (isCoinDataLoading) return (
		<PageContainer title='Swap' titleImg={Image.pageBackground_1}>
			<div className={styles.swapContainer}>
				<Loading />
			</div>
		</PageContainer>
	);

	if (!coinTypeFirst || !coinTypeSecond) return <Empty content='Oops!' />

	return (
		<PageContainer title='Swap' titleImg={Image.pageBackground_1}>
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
								onChange={handleOnCoinInputFirstChange}
								placeholder={`${coinTypeFirst.name} Value`}
								// disabled={isLoading}
							/>
						</>
					}
				/>
				<Icon.ArrowDownIcon className={styles.arrowDownIcon} />
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
								onChange={handleOnCoinInputSecondChange}
								placeholder={`${coinTypeSecond.name} Value`}
								// disabled={isLoading}
							/>
						</>
					}
				/>
				<div className={styles.swapButton}>
					<Button
						text='Swap'
						styletype='filled'
						onClick={() => {}}
						// disabled={!!error}
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