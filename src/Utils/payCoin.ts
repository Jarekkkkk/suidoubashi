import { PaginatedCoins, TransactionBlock } from '@mysten/sui.js'
export function payCoin(
  txb: TransactionBlock,
  coins: PaginatedCoins,
  value: number,
  isSui: boolean,
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
