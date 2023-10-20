import { SuiPriceServiceConnection } from '@pythnetwork/pyth-sui-js'
import { useQuery } from '@tanstack/react-query'

const PriceFeedIDs = {
  SUI: '0x50c67b3fd225db8912a424dd4baed60ffdde625ed2feaaf283724f9608fea266', //SUI
  USDC: '0x41f3625971ca2ed2263e78573fe5ce23e13d2558ed3f2e47ab0f84fb9e7ae722', // USDC
  USDT: '0x1fc18861232290221461220bd4e2acd1dcdfbc89c84092c93c18bdc7756c1588', // usdt
  ETH: '0xd77bfe9814f5a4718e1420881093efa8c0fe1a783472899f27ad4c7a58ef4d27', //eth
  BTC: '0xf9c0172ba10dfa4d19088d94f5bf61d3b54d5bd7483a322a982e1373ee8ea31b', // btc
}

const connection = new SuiPriceServiceConnection(
  'https://hermes-beta.pyth.network',
) // See Hermes endpoints section below for other endpoints

export const useGetPrice = () => {
  return useQuery(['price'], async () => {
    const priceFeeds = await connection.getLatestPriceFeeds(
      Object.values(PriceFeedIDs),
    )
    let res: {
      [key: string]: number | null
    } = {}
    if (priceFeeds) {
      Object.keys(PriceFeedIDs).forEach((symbol, idx) => {
        const price = priceFeeds[idx].getPriceNoOlderThan(60)
        res[symbol] = price?.price
          ? parseInt(price.price) * 10 ** price.expo
          : null
      })
    }

    return res
  })
}
