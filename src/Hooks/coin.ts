import { useQuery } from '@tanstack/react-query'
import {BigNumber} from 'bignumber.js'
import useRpc from './useRpc'
import { PaginatedCoins, CoinBalance } from '@mysten/sui.js'

export function useGetCoinBalance(type: string, account?: string | null) {
  const rpc = useRpc()

  return useQuery(
    ['balance', type],
    async () => {
      if (!account || !type) {
        return null
      }
      return (await rpc.getBalance({
        owner: account,
        coinType: type,
      })) as CoinBalance
    },
    {
      enabled: !!account,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}

export function useGetOwnedCoins(type: string, account?: string | null) {
  const rpc = useRpc()
  return useQuery(
    ['coins', account],
    async () => {
      if (!account || !type) {
        return null
      }

      return (await rpc.getCoins({
        owner: account,
        coinType: type,
      })) as PaginatedCoins
    },
    {
      enabled: !!account,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )
}

export enum CoinFormat {
    ROUNDED = 'ROUNDED',
    FULL = 'FULL',
}
export function formatBalance(
    balance: bigint | number | string,
    decimals: number,
    format: CoinFormat = CoinFormat.ROUNDED
) {
    if (!balance) return ""
    let postfix = '';
    let bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals);
    if (format === CoinFormat.FULL) {
        return bn.toFormat();
    }
    if (bn.gte(1_000_000_000)) {
        bn = bn.shiftedBy(-9);
        postfix = ' B';
    } else if (bn.gte(1_000_000)) {
        bn = bn.shiftedBy(-6);
        postfix = ' M';
    } else if (bn.gte(1_000)) {
        bn = bn.shiftedBy(-3);
        postfix = ' K';
    }
    if (bn.gte(1)) {
        bn = bn.decimalPlaces(3, BigNumber.ROUND_DOWN);
    }
    return bn.toFormat() + postfix;
}
