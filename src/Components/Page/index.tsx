import { useEffect, useState } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { useGetMulBalance } from '@/Hooks/Coin/useGetBalance';
import {
  useGetMulVsdb,
  useGetVsdb,
  useGetVsdbIDs,
} from '@/Hooks/VSDB/useGetVSDB';

import { Coins } from '@/Constants/coin';
import { Sidebar, ControlBar } from '@/Components';
import * as styles from './index.styles';
interface Props {
	children: any,
}
const PageComponent = (props: Props) => {
	const { children } = props;
	const [currentVsdbId, setCurrentVsdbId] = useState(0);

  const { currentAccount } = useWalletKit();
	const walletAddress = currentAccount?.address;

  const vsdb_ids = useGetVsdbIDs(walletAddress);

	const _nftData = useGetVsdb(walletAddress, vsdb_ids?.data?.[currentVsdbId])
  const balances = useGetMulBalance(Coins, currentAccount?.address);

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

	console.log('balances', balances);

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
					nftData={_nftData}
					coinData={balances}
					handleFetchNFTData={handleFetchNFTData}
				/>
			</div>
		</div>
	);
};
export default PageComponent;
