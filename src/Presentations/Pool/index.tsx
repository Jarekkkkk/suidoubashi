
import { Link } from 'react-router-dom'
import {
  PageContainer,
  Input,
  Button,
  Loading,
  Empty,
	ReactTable,
} from '@/Components'
import { Balance } from '@/Hooks/Coin/useGetBalance'
import { Coins } from '@/Constants/coin'
import { usePoolContext } from '@/Containers/Pool'
import Image from '@/Assets/image'
import { Icon } from '@/Assets/icon'

import * as styles from './index.styles'
import { cx } from '@emotion/css'

const fetchIcon = (name: string) => Coins.find((coin) => coin.name === name)
const fetchBalance = (BalanceData: Balance[] | undefined, coinName: string) => BalanceData?.find((balance) => balance.coinName === coinName)

const PoolPresentation = () => {
	const {
		fetching,
		poolsData, allBalanceData,
		searchInput, handleOnInputChange,
	} = usePoolContext();

	if (fetching) return (
		<PageContainer title='Pool' titleImg={Image.pageBackground_2}>
			<div className={styles.poolpContainer}>
				<Loading />
			</div>
		</PageContainer>
	)

	if (!poolsData) return (
		<PageContainer title='Pool' titleImg={Image.pageBackground_2}>
			<div className={styles.poolpContainer}>
				<Empty content='Oops! No Data.' />
			</div>
		</PageContainer>
	)

	const columns = [
		{
			id: 'pool',
			name: 'pool',
			Header: 'Pool',
			width: 110,
		},
		{
			id: 'wallet',
			name: 'wallet',
			Header: 'Wallet',
			width: 110,
		},
		{
			id: 'pool_amount',
			name: 'pool_amount',
			Header: 'Total Pool Amount',
			width: 110,
		},
		{
			id: 'apr',
			name: 'apr',
			Header: 'APR',
			width: 110,
		},
		{
			id: 'manage',
			name: 'manage',
			Header: 'Manage',
		}
	];


  const renderRow = (cell: { columns: any; poolsData: any; allBalanceData: any }) => {
		return poolsData.map((pool) => {
			const _poolCoins = pool.name.split('-');
			const _poolCoinX = fetchIcon(_poolCoins[0]);
			const _poolCoinY = fetchIcon(_poolCoins[1]);
			const _walletCoinX = fetchBalance(allBalanceData, _poolCoins[0])!.totalBalance;
			const _walletCoinY = fetchBalance(allBalanceData, _poolCoins[1])!.totalBalance;

			return columns.map((column, idx) => {
				switch (column.id) {
					case 'pool':
						return (
							<div key={idx} className={cx(styles.rowContent, styles.poolContent)}>
								<div className={styles.coinCombin}>
									{_poolCoinX!.logo && _poolCoinX!.logo}
									{_poolCoinY!.logo && _poolCoinY!.logo}
								</div>
								<div className={styles.columnContent}>
									<span className={styles.boldText}>{_poolCoinX!.name}/{_poolCoinY!.name}</span>
									<span className={styles.greyText}>Stable Pool</span>
								</div>
							</div>
						)
					case 'wallet':
						return (
							<div key={idx} className={cx(styles.columnContent, styles.coinContent)}>
								<div className={styles.rowContent}>
									<div className={styles.boldText}>{_walletCoinX}</div>
									<span className={styles.greyText}>{_poolCoinX!.name}</span>
								</div>
								<div className={styles.rowContent}>
									<div className={styles.boldText}>{_walletCoinY}</div>
									<span className={styles.greyText}>{_poolCoinY!.name}</span>
								</div>
							</div>
						)
					case 'pool_amount':
						return (
							<div key={idx} className={cx(styles.columnContent, styles.coinContent)}>
								<div className={styles.rowContent}>
									<div className={styles.boldText}>{pool.reserve_x}</div>
									<span className={styles.greyText}>{_poolCoinX!.name}</span>
								</div>
								<div className={styles.rowContent}>
									<div className={styles.boldText}>{pool.reserve_y}</div>
									<span className={styles.greyText}>{_poolCoinY!.name}</span>
								</div>
							</div>
						)
					case 'apr':
						return (
							<div key={idx}>12.34 %</div>
						)
					case 'manage':
						return (
							<Link to={`/pool/Liquidity?${pool.id}`} key={idx}>
								<Button
									styletype='outlined'
									text='Manage'
								/>
							</Link>
						)
					default:
						return null;
				}
			})
		});
	};

	return (
		<PageContainer title='Pool' titleImg={Image.pageBackground_2}>
			<div className={styles.slognContent}>
				Provide Liquidity to SuiDoBashi ecosystem and earn weekly rewards
			</div>
			<div className={styles.poolpContainer}>
				<Input
					value={searchInput}
					onChange={handleOnInputChange}
					placeholder='SDB, SUI, 0x12...'
					leftIcon={<Icon.SearchIcon className={styles.searchInputIcon} />}
				/>
				<ReactTable
					data={poolsData}
					columns={columns}
					renderRow={renderRow({columns, poolsData, allBalanceData})}
				/>
			</div>
		</PageContainer>
	)
};

export default PoolPresentation;