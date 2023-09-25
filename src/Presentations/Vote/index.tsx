import { Slider } from '@blueprintjs/core'
import Image from '@/Assets/image'
import { Icon, CoinIcon } from '@/Assets/icon'
import {
	PageContainer, ReactTable,
	Input, Button, Loading, Empty,
	CoinCombin,
} from '@/Components'
import { fetchIcon, fetchBalance } from '@/Constants/index'
import * as constantsStyles from '@/Constants/constants.styles'
import { useVoteContext } from '@/Containers/Vote'

import * as styles from './index.styles'
import { cx } from '@emotion/css'
import { Key } from 'react'

const VotePresentation = () => {
	const {
		searchInput, handleOnInputChange,
	} = useVoteContext();

	const data = [{id: 1}, {id: 2}];

	const columnsList = [
		{
			id: 'pool',
			Header: 'Pool',
		},
		{
			id: 'totalVotes',
			Header: 'Total Votes',
		},
		{
			id: 'rewards',
			Header: 'Rewards',
		},
		{
			id: 'apr',
			Header: 'APR',
		},
		{
			id: 'weights',
			Header: 'Weights',
		}
	];

	const renderRow = (columns: any[], data: any[]) => {
		return data.map((d: any) => {

			return columns.map((column: { id: any }, idx: Key | null | undefined) => {
				switch (column.id) {
					case 'pool':
						return (
							<CoinCombin
								key={idx}
								poolCoinX={fetchIcon('ETH')}
								poolCoinY={fetchIcon('SUI')}
								stable={false}
							/>
						)
					case 'totalVotes':
						return (
							<div className={cx(styles.VestTableContent, constantsStyles.columnContent)}>
								<div className={constantsStyles.boldText}>12345.67</div>
								<div className={constantsStyles.greyText}>0.01 %</div>
							</div>
						)
					case 'rewards':
						return (
							<div className={cx(styles.VestTableContent, constantsStyles.columnContent)}>
								<div className={constantsStyles.boldText}>$ 1,234.56</div>
								<div className={cx(constantsStyles.rowContent, constantsStyles.greyText)}>
									<span>123,456.0000</span>
									<CoinIcon.WETHIcon className={styles.smallIcon} />
								</div>
								<div className={cx(constantsStyles.rowContent, constantsStyles.greyText)}>
									<span>123,456.00</span>
									<CoinIcon.SUIIcon className={styles.smallIcon} />
								</div>
							</div>
						)
					case 'apr':
						return (
							<div className={constantsStyles.boldText}>12.34%</div>
						)
					case 'weights':
						return (
							<Slider />
						)
					default:
						return null;
				}
			})
		})
	};

	return (
		<PageContainer title='Vote' titleImg={Image.pageBackground_1}>
			<div className={styles.voteWrapper}>
				<div className={styles.topContainer}>
					<div className={styles.inputContent}>
						<Input
							value={searchInput}
							onChange={handleOnInputChange}
							placeholder='SDB, SUI...'
							leftIcon={<Icon.SearchIcon className={styles.searchInputIcon} />}
						/>
						<div className={constantsStyles.greyText}>
							Make sure you vote in each epoch, otherwise you lose all the underlying bribes.
						</div>
					</div>
					<div className={styles.infoContent}>
						<div className={styles.infoTitle}>Epoch 1</div>
						<div>
							<div>Finished in </div>
							<div className={styles.yellowText}>6d 23h 30s </div>
						</div>
					</div>
				</div>
				<ReactTable
					data={data}
					columns={columnsList}
					renderRow={renderRow(columnsList, data, )}
				/>
				<div className={styles.bottomVoteContent}>
					<div className={styles.bottomVoteTitle}>VeSDB used:</div>
					<div className={styles.bottomVotePercent}>90%</div>
					<Button
						styletype='filled'
						text='Vote'
						onClick={() => {}}
					/>
				</div>
			</div>
		</PageContainer>
	)
};

export default VotePresentation;2