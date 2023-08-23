import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWalletKit } from '@mysten/wallet-kit';

import { useGetMulBalance } from '@/Hooks/Coin/useGetBalance';
import {
  useGetVsdb,
  useGetVsdbIDs,
} from '@/Hooks/VSDB/useGetVSDB';
import { useGetMulLP } from '@/Hooks/AMM/useGetLP';
import { Pool } from '@/Constants/API/pool';

import { Coins } from '@/Constants/coin';
import { Sidebar, ControlBar } from '@/Components';
import * as styles from './index.styles';
import { useGetMulPool, useGetPoolIDs } from '@/Hooks/AMM/useGetPool';

interface Props {
	children: any,
}
const PageComponent = (props: Props) => {
	const { children } = props;
	const location = useLocation();
	const isDashboard = location.pathname === '/';
	const [currentVsdbId, setCurrentVsdbId] = useState(0);
	const [poolDataList, setPoolDataList] = useState();

  const { currentAccount } = useWalletKit();
	const walletAddress = currentAccount?.address;

  const vsdbList = useGetVsdbIDs(walletAddress);
	const currentNFTInfo = useGetVsdb(walletAddress, vsdbList.data?.[currentVsdbId]);

  const currentNFTIBalances = useGetMulBalance(Coins, currentAccount?.address);

  const lPList = useGetMulLP(currentAccount?.address);
	const poolIDList = useGetPoolIDs();
	const poolList = poolIDList && useGetMulPool(poolIDList.data);

	const handleFetchNFTData = (mode: string) => {
		if (vsdbList.data && vsdbList.data.length > 0 && currentVsdbId < vsdbList.data.length) {
			if (mode === 'next') {
				const _vsdbId = currentVsdbId + 1;
				setCurrentVsdbId(_vsdbId);
			};

			if (mode === 'prev') {
				const _vsdbId = currentVsdbId - 1;
				setCurrentVsdbId(_vsdbId);
			};
		}
	};

	useEffect(() => {
		if (poolList[0] && poolList[0]?.isSuccess) {
			const _poolDataList: (Pool)[] = [];

			poolList.map((pool) => pool.data && _poolDataList.push(pool.data));

			setPoolDataList(_poolDataList);
		}
	}, [poolList[0]?.isSuccess]);

	return (
		!isDashboard ? (
			<div className={styles.layoutContainer}>
				<div className={styles.mainContent}>
					<Sidebar isOpen={true} />
					<div className={styles.content}>
						{children}
					</div>
					<ControlBar
						isPrevBtnDisplay={currentVsdbId !== 0}
						isNextBtnDisplay={vsdbList?.data && currentVsdbId < (Number(vsdbList?.data.length) - 1) || false}
						poolDataList={poolDataList}
						nftInfo={currentNFTInfo}
						coinData={currentNFTIBalances}
						lpData={lPList.data}
						handleFetchNFTData={handleFetchNFTData}
					/>
				</div>
			</div>
		) : (
			<>
				{
					currentAccount?.address &&
						<div className={styles.dashboardMainContent}>
							<div className={styles.sidebarContent}>
								<Sidebar isOpen={true} />
							</div>
						</div>
				}
				{children}
			</>
		)
	);
};
export default PageComponent;
