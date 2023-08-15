import { useEffect, useState } from 'react';
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
	const [currentVsdbId, setCurrentVsdbId] = useState(0);
	const [poolDataList, setPoolDataList] = useState();

  const { currentAccount } = useWalletKit();
	const walletAddress = currentAccount?.address;

  const vsdb_ids = useGetVsdbIDs(walletAddress);

	const _nftData = useGetVsdb(walletAddress, vsdb_ids?.data?.[currentVsdbId]);
  const balances = useGetMulBalance(Coins, currentAccount?.address);

  const lps = useGetMulLP(currentAccount?.address);
	const pool_ids = useGetPoolIDs();
	const pools = pool_ids && useGetMulPool(pool_ids.data);

	const handleFetchNFTData = (mode: string) => {
		if (vsdb_ids.data && vsdb_ids.data.length > 0 && currentVsdbId < vsdb_ids.data.length) {
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
		if (pools[0] && pools[0]?.isSuccess) {
			const _poolDataList: (Pool)[] = [];

			pools.map((pool) => pool.data && _poolDataList.push(pool.data));

			setPoolDataList(_poolDataList);
		}
	}, [pools[0]?.isSuccess]);

	return (
		<div className={styles.layoutContainer}>
			<div className={styles.mainContent}>
				<Sidebar isOpen={true} />
				<div className={styles.content}>
					{children}
				</div>
				<ControlBar
					isPrevBtnDisplay={currentVsdbId !== 0}
					isNextBtnDisplay={vsdb_ids?.data && currentVsdbId < (Number(vsdb_ids?.data.length) - 1) || false}
					poolDataList={poolDataList}
					nftData={_nftData.data}
					coinData={balances}
					lpData={lps.data}
					handleFetchNFTData={handleFetchNFTData}
				/>
			</div>
		</div>
	);
};
export default PageComponent;
