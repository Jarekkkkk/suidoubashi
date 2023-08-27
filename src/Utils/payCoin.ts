import { PaginatedCoins, SUI_TYPE_ARG, TransactionBlock } from '@mysten/sui.js'
export function payCoin(
  txb: TransactionBlock,
  coins: PaginatedCoins,
  value: string,
  coinType: string
) {
  let fundingCoin: ReturnType<TransactionBlock['splitCoins']>
  if (coinType == SUI_TYPE_ARG) {
    fundingCoin = txb.splitCoins(txb.gas, [txb.pure(value)])
  } else {
    const [firstCoin, ...otherCoins] = coins.data
    const firstCoinInput = txb.object(firstCoin.coinObjectId)
    if (otherCoins.length) {
      txb.mergeCoins(
        firstCoinInput,
        otherCoins.map((coin) => txb.object(coin.coinObjectId)),
      )
    }
    fundingCoin = txb.splitCoins(firstCoinInput, [txb.pure(value)])
  }
  return fundingCoin
}
