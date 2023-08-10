import { PaginatedCoins, TransactionBlock } from '@mysten/sui.js'
import BigNumber from 'bignumber.js'

export enum CoinFormat {
  ROUNDED = 'ROUNDED',
  FULL = 'FULL',
}
export function formatBalance(
  balance: bigint | number | string,
  decimals: number,
  format: CoinFormat = CoinFormat.ROUNDED,
) {
  if (!balance) return ''
  let postfix = ''
  let bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals)
  if (format === CoinFormat.FULL) {
    return bn.toFormat()
  }
  if (bn.gte(1_000_000_000)) {
    bn = bn.shiftedBy(-9)
    postfix = ' B'
  } else if (bn.gte(1_000_000)) {
    bn = bn.shiftedBy(-6)
    postfix = ' M'
  } else if (bn.gte(1_000)) {
    bn = bn.shiftedBy(-3)
    postfix = ' K'
  }
  if (bn.gte(1)) {
    bn = bn.decimalPlaces(3, BigNumber.ROUND_DOWN)
  }
  return bn.toFormat() + postfix
}

export function payCoin(
  txb: TransactionBlock,
  coins: PaginatedCoins,
  value: number,
  isSui: boolean
) {
  let fundingCoin: ReturnType<TransactionBlock['splitCoins']>
  if (isSui) {
    fundingCoin = txb.splitCoins(txb.gas, [txb.pure(value)])
  }
  const [firstCoin, ...otherCoins] = coins.data
  const firstCoinInput = txb.object(firstCoin.coinObjectId)
  if (otherCoins.length) {
    txb.mergeCoins(
      firstCoinInput,
      otherCoins.map((coin) => txb.object(coin.coinObjectId)),
    )
  }
  fundingCoin = txb.splitCoins(firstCoinInput, [txb.pure(value)])
  return fundingCoin
}
