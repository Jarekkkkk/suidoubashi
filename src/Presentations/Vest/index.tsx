import { useContext } from 'react';
import { PageContainer, Button, Loading } from '@/Components';
import { VestContext } from '@/Containers/Vest';
import Image from '@/Assets/image';
import { Icon } from '@/Assets/icon';
import { required_exp } from '@/Utils/game';

import VestCardComponent from './_VestCard';
import CreateVSDBModal from './_CreateVSDBModal';
import DepositVSDBModal from './_DepositVSDBModal';
import MergeVSDBModal from './_MergeVSDBModal';
import WithdrawVSDBModal from './_WithdrawVSDBModal';

import * as styles from './index.styles'
import BigNumber from 'bignumber.js';

const VestPresentation = () => {
  const {
		data,
		handleIncreaseUnlockedTime,
		handleIncreaseUnlockedAmount,
		handleRevival,
		handleUnlock,
		isShowCreateVSDBModal,
		isShowDepositVSDBModal,
		isShowMergeVSDBModal,
		isShowWithdrawVSDBModal,
		setIsShowCreateVSDBModal,
		setIsShowDepositVSDBModal,
		setIsShowMergeVSDBModal,
		setIsShowWithdrawVSDBModal,
	} = useContext(VestContext);

	return (
		<PageContainer title='Vest' titleImg={Image.pageBackground_1}>
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
								onClick={() => setIsShowMergeVSDBModal(true)}
							/>
							<Button
								styletype='filled'
								text='Create VSDB'
								icon={<Icon.SquareAddIcon />}
								onClick={() => setIsShowCreateVSDBModal(true)}
							/>
						</div>
						<div className={styles.contentSection}>
							{
								data && data.map((item, idx) => {
									if (!item) return <div key={idx} className={styles.vestCardLoadingContainer}><Loading /></div>;

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
										setIsShowDepositVSDBModal={setIsShowDepositVSDBModal}
										setIsShowWithdrawVSDBModal={setIsShowWithdrawVSDBModal}
									/>
								)})
							}
						</div>
					</div>
				)
			}
			<CreateVSDBModal
				isShowCreateVSDBModal={isShowCreateVSDBModal}
				setIsShowCreateVSDBModal={setIsShowCreateVSDBModal}
			/>
			<DepositVSDBModal
				isShowCreateVSDBModal={isShowDepositVSDBModal}
				setIsShowCreateVSDBModal={setIsShowDepositVSDBModal}
			/>
			<MergeVSDBModal
				isShowCreateVSDBModal={isShowMergeVSDBModal}
				setIsShowCreateVSDBModal={setIsShowMergeVSDBModal}
			/>
			<WithdrawVSDBModal
				isShowCreateVSDBModal={isShowWithdrawVSDBModal}
				setIsShowCreateVSDBModal={setIsShowWithdrawVSDBModal}
			/>
		</PageContainer>
	)
};

export default VestPresentation;