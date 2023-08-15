import React, {
	PropsWithChildren,
} from 'react';
import { useWalletKit } from '@mysten/wallet-kit'

import { useGetMulVsdb, useGetVsdbIDs } from '@/Hooks/VSDB/useGetVSDB';
import { useIncreaseUnlockTime } from '@/Hooks/VSDB/useIncreaseUnlockTime';
import { useIncreaseUnlockAmount } from '@/Hooks/VSDB/useIncreaseUnlockAmount';
import { useRevive } from '@/Hooks/VSDB/useRevive';
import { useUnlock } from '@/Hooks/VSDB/useUnlock';

import { Vsdb } from '@/Constants/API/vsdb';

export const VestContext = React.createContext<VestContext>({
	data: [],
	handleIncreaseUnlockedTime: () => {},
	handleIncreaseUnlockedAmount: () => {},
	handleRevival: () => {},
	handleUnlock: () => {},
});

const handleIncreaseUnlockedTime = (nftDataId: any) => {
	if (nftDataId) {
		const increase_unlocked_time = useIncreaseUnlockTime();

		increase_unlocked_time.mutate({
			vsdb: '0xd58dfec7b6d6a2ed05f520514663fa7bd7855ae3b60ee87a4002e13e3fd980cb',
			extended_duration: '12804800',
		})
	}
};

const handleIncreaseUnlockedAmount = (nftDataId: any) => {
	if (nftDataId) {
		const increase_unlocked_amount = useIncreaseUnlockAmount();

		increase_unlocked_amount.mutate({
			vsdb: '0x1bea82b0770e0631f685d359f5ff3f4f4d78d7cd49767c2ffe34698409c51e50',
			depositValue: '500000000000',
		})
	}
};

const handleRevival = (nftDataId: { data: { id: any; }; }) => {
	if (nftDataId) {
		const revive = useRevive();

		revive.mutate({
			vsdb: nftDataId.data.id,
			withdrawl: '0',
			extended_duration: '604800',
		})
	}
};

const handleUnlock = (nftDataId: { data: { id: any; }; }) => {
	if (nftDataId) {
		const unlock = useUnlock();

		unlock.mutate({
			vsdb: nftDataId.data.id,
		})
	}
}

const VestContainer = ({ children }: PropsWithChildren) => {
	const { currentAccount } = useWalletKit();
	const walletAddress = currentAccount?.address;
	const vsdbIdList = useGetVsdbIDs(walletAddress).data;
	const nftList = useGetMulVsdb(walletAddress, vsdbIdList);

	return (
		<VestContext.Provider
			value={{
				data: nftList.map((nft) => nft.data),
				handleIncreaseUnlockedTime,
				handleIncreaseUnlockedAmount,
				handleRevival,
				handleUnlock,
			}}
		>
			{children}
		</VestContext.Provider>
	);
};

interface VestContext {
	readonly data: (Vsdb | undefined)[] | undefined,
	handleIncreaseUnlockedTime: Function,
	handleIncreaseUnlockedAmount: Function,
	handleRevival: Function,
	handleUnlock: Function,
}

export default VestContainer;