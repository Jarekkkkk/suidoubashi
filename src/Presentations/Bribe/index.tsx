import { Popover } from '@blueprintjs/core'
import Image from '@/Assets/image'
import { Icon, CoinIcon } from '@/Assets/icon'
import {
	PageContainer, ReactTable,
	Input, Button, Loading, Empty,
	CoinCombin, InputSection,
} from '@/Components'
import { fetchIcon, fetchBalance } from '@/Constants/index'
import * as constantsStyles from '@/Constants/constants.styles'

import SelectPoolModal from './_SelectPoolModal'
import * as styles from './index.styles'
import { cx, css } from '@emotion/css'
import { useState } from 'react'

const _coinList = [
  {
    id: 0,
    text: 'USDC',
    icon: <CoinIcon.USDCIcon />,
  },
  {
    id: 1,
    text: 'SUI',
    icon: <CoinIcon.SUIIcon />,
  },
  {
    id: 2,
    text: 'USDT',
    icon: <CoinIcon.USDTIcon />,
  },
  {
    id: 3,
    text: 'SDB',
    icon: <CoinIcon.SDBIcon />,
  },
];

const _fakeCoinData = () => [
	{
		coinType: fetchIcon('ETH')?.type,
		coinName: 'ETH',
		totalBalance: '123'
	},
	{
		coinType: fetchIcon('SUI')?.type,
		coinName: 'SUI',
		totalBalance: '123'
	},
];

const BribePresentation = () => {
	const [isShow, setIsShow] = useState(false);
	const [coinType, setCoinType] = useState('ETH');
	const [coinInputFirst, setCoinInputFirst] = useState('');
	const coinTypeFirst = fetchIcon('ETH');
	const coinData = _fakeCoinData();

	const handleOnCoinInputFirstChange = (e) => {
		setCoinInputFirst(e);
	}

	return (
		<PageContainer title='Bribe' titleImg={Image.pageBackground_1}>
			<div className={styles.bribeWrapper}>
				<div className={styles.bribrContainer}>
					<div className={cx(constantsStyles.boldText, css({ marginBottom: '5px' }))}>Create Brides</div>
					<div className={constantsStyles.greyText}>Deposit Coins into Pool.</div>
					<div className={styles.inputContent}>
						<Input
							value={'123'}
							onChange={(e) => {}}
							placeholder='Choose Pool'
							rightElement={
								<div
									className={styles.arrowButton}
									onClick={() => {
										setIsShow(!isShow)
									}}
								/>
							}
							// disabled={isLoading}
						/>
					</div>
					<div className={styles.inputContent}>
						<InputSection
							balance='123'
							titleChildren={
								<div
									className={styles.coinButton}
									onClick={() => {}}
								>
									{coinTypeFirst!.logo}
									<span>{coinTypeFirst!.name}</span>
								</div>
							}
							inputChildren={
								<>
									<Input
										value={coinInputFirst}
										onChange={(e) => {
											handleOnCoinInputFirstChange(e)
										}}
										placeholder={`${coinTypeFirst!.name} Value`}
										// disabled={isLoading}
									/>
								</>
							}
						/>
					</div>
					<div className={styles.coinContent}>
						<div className={styles.coinBlock}>
							{
								_coinList.map((coin) => {
									const _coinData = coinData?.filter(((item: { coinName: string }) => item.coinName === coin.text))[0];
									const _coinIdx = coinData && fetchIcon(coinData.coinType);

									return (
										<Button
											onClick={() => {
												setCoinType(_coinIdx);
												setIsShow(false);
											}}
											styletype="outlined"
											text={coin.text}
											icon={coin.icon}
											key={coin.id}
											disabled={!_coinData}
											medium
										/>
								)})
							}
						</div>
					</div>
				</div>
				<SelectPoolModal
					isShow={isShow}
					setIsShow={setIsShow}
					coinData={coinData}
					isCoinDataLoading={false}
				/>
			</div>
		</PageContainer>
	)
};

export default BribePresentation;