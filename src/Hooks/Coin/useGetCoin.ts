import { useInfiniteQuery } from '@tanstack/react-query';
import useRpc from '../useRpc';

const MAX_COINS_PER_REQUEST = 10;

export function useGetCoins(
	coinType: string,
	address?: string | null,
	maxCoinsPerRequest = MAX_COINS_PER_REQUEST,
) {
	const rpc = useRpc()
	return useInfiniteQuery(
		['get-coins', address, coinType, maxCoinsPerRequest],
		({ pageParam }) =>
			rpc.getCoins({
				owner: address!,
				coinType,
				cursor: pageParam ? pageParam.cursor : null,
				limit: maxCoinsPerRequest,
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
