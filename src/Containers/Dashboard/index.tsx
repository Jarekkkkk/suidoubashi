import React, { useState, useContext } from 'react';
import { useWalletKit } from '@mysten/wallet-kit';
import { Connection, JsonRpcProvider } from '@mysten/sui.js';

import { localnetConnection } from '@/Constants';
import { get_vsdb } from '@/Constants/API/vsdb';

export const DashboardContext = React.createContext<DashboardContext>({
    data: null,
    fetching: false,
    walletAddress: null,
		handleFetchData: () => {},
});

export const useDashboardContext = () => useContext(DashboardContext);

export const DashboardContainer = ({ children }: PropsWithChildren) => {
	const [data, setData] = useState(null);
	const [fetching, setFetching] = useState(false);

	const wallet = useWalletKit();
	const walletAddress = wallet.currentAccount?.address || null;

	const handleFetchData = async () => {
		const provider = new JsonRpcProvider(new Connection(localnetConnection))
		// const res = await get_vsdb(provider, walletAddress)

		console.log('provider', provider)
	};

	return (
		<DashboardContext.Provider
			value={{
					data,
					fetching,
					walletAddress,
					handleFetchData,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
};


interface DashboardContext {
    readonly data: [] | null,
    readonly fetching: boolean,
    readonly walletAddress: string | null,
		handleFetchData: Function,
}

export default DashboardContainer;