import { useContext } from 'react';
import { PageContainer, Button, Loading } from '@/Components';
import { VestContext } from '@/Containers/Vest';
import Image from '@/Assets/image';
import { Icon } from '@/Assets/icon';
import { required_exp } from '@/Utils/game';

import VestCardComponent from './_VestCard';

import * as styles from './index.styles'
import BigNumber from 'bignumber.js';

const VestPresentation = () => {
  const {
		data,
		handleIncreaseUnlockedTime,
		handleIncreaseUnlockedAmount,
		handleRevival,
		handleUnlock,
	} = useContext(VestContext);

	return (
		<PageContainer title='Vest' titleImg={Image.Background}>
			{
				!data ? (
					<Loading />
				) : (
					<div className={styles.controlContainer}>
						<div className={styles.buttonSection}>
							<Button
								styletype='filled'
								text='Merge VSDB'
								icon={<Icon.FileIcon />}
								onClick={() => {}}
								disabled
							/>
							<Button
								styletype='filled'
								text='Create VSDB'
								icon={<Icon.SquareAddIcon />}
								onClick={() => {}}
								disabled
							/>
						</div>
						<div className={styles.contentSection}>
							{
								data && data.map((item, idx) => {
									if (!item) return <div className={styles.vestCardLoadingContainer}><Loading /></div>;

									return (
									<VestCardComponent
										key={idx}
										nftId={item.id}
										nftImg={item?.display?.image_url}
										level={item.level}
										expValue={parseInt(item.experience) / required_exp(parseInt(item.level) + 1)}
										vesdbValue={parseInt(item.vesdb) / parseInt(item.balance)}
										lockSdbValue={BigNumber(item.balance).shiftedBy(-9).decimalPlaces(3).toFormat()}
										expiration={new Date(Number(item.end) * 1000).toLocaleDateString('en-ZA')}
										handleIncreaseUnlockedTime={handleIncreaseUnlockedTime}
										handleIncreaseUnlockedAmount={handleIncreaseUnlockedAmount}
										handleRevival={handleRevival}
										handleUnlock={handleUnlock}
									/>
								)})
							}
						</div>
					</div>
				)
			}
		</PageContainer>
	)
};

export default VestPresentation;