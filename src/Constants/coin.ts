export enum Coin {
  BTC = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_btc::mock_btc',
  ETH = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_eth::MOCK_ETH',
  USDC = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_usdc::MOCK_USDC',
  USDT = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_usdt::USDT',
  SDB = '0x2cbce1ca3f0a0db8ec8e920eeb4602bf88c1dbb639edcb3c7cd4c579a7be77c5::sdb::SDB',
}

import BTCIcon from '@/Assets/icon/coin/btc.png'
import ETHIcon from '@/Assets/icon/coin/eth.png'
import USDCIcon from '@/Assets/icon/coin/usdc.png'
import USDTIcon from '@/Assets/icon/coin/usdt.png'
import SDBIcon from '@/Assets/icon/coin/sdb.png'

export interface CoinInterface {
  type: Coin,
  logo: any,
  name: string
}


export const Coins: CoinInterface[] = [
  {
    type: Coin.BTC,
    logo: BTCIcon,
    name: "BTC"
  },
  {
    type: Coin.ETH,
    logo: ETHIcon,
    name: "ETH"
  },
  {
    type: Coin.USDC,
    logo: USDCIcon,
    name: "USDC"
  },
  {
    type: Coin.USDT,
    logo: USDTIcon,
    name: "USDT"
  },
  {
    type: Coin.SDB,
    logo: SDBIcon,
    name: "SDB"
  },
]

