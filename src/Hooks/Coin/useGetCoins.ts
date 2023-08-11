import { useInfiniteQuery } from '@tanstack/react-query';
import useRpc from '../useRpc';
import { Coin } from '@/Constants/coin';

const MAX_COINS_PER_REQUEST = 10;

export const get_coins_key = (address: string, coinType:string)=>["get-coins", address, coinType]

export function useGetCoins(
	coinType: Coin,
	address?: string | null,
	maxCoinsPerRequest = MAX_COINS_PER_REQUEST,
) {
	const rpc = useRpc()
	return useInfiniteQuery(
		['get-coins', address, coinType],
		({ pageParam }) =>
			rpc.getCoins({
				owner: address!,
				coinType,
				//cursor: pageParam ? pageParam.cursor : null,
				//limit: maxCoinsPerRequest,
			}),
		{
			getNextPageParam: ({ hasNextPage, nextCursor }) =>
				hasNextPage
					? {
							cursor: nextCursor,
					  }
					: false,
			enabled: !!address,
		},
	);
}
