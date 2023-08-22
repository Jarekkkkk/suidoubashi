export enum Coin {
  BTC = '0x1ac92893a60f8b56f2feffd748dfa8a3d4c4604c05cccc943d2ecd1056959a9c::mock_btc::MOCK_BTC',
  ETH = '0x1ac92893a60f8b56f2feffd748dfa8a3d4c4604c05cccc943d2ecd1056959a9c::mock_eth::MOCK_ETH',
  USDC = '0x1ac92893a60f8b56f2feffd748dfa8a3d4c4604c05cccc943d2ecd1056959a9c::mock_usdc::MOCK_USDC',
  USDT = '0x1ac92893a60f8b56f2feffd748dfa8a3d4c4604c05cccc943d2ecd1056959a9c::mock_usdt::MOCK_USDT',
  SUI = '0x2::sui::SUI',
  SDB = '0x754697d70a05a1cd90518bca6ed389e651681db36605db6ac2180e94834bc6d7::sdb::SDB',
}

import { CoinIcon } from '@/Assets/icon'

export interface CoinInterface {
  type: Coin
  logo: any
  name: string
  decimals: number
}

export const Coins: CoinInterface[] = [
  {
    type: Coin.BTC,
    logo: <CoinIcon.BTCIcon />,
    decimals: 8,
    name: 'BTC',
  },
  {
    type: Coin.ETH,
    logo: <CoinIcon.WETHIcon />,
    decimals: 9,
    name: 'ETH',
  },
  {
    type: Coin.USDC,
    logo: <CoinIcon.USDCIcon />,
    decimals: 6,
    name: 'USDC',
  },
  {
    type: Coin.USDT,
    logo: <CoinIcon.USDTIcon />,
    decimals: 6,
    name: 'USDT',
  },
  {
    type: Coin.SUI,
    logo: <CoinIcon.SUIIcon />,
    decimals: 9,
    name: 'SUI',
  },
  {
    type: Coin.SDB,
    logo: <CoinIcon.SDBIcon />,
    decimals: 9,
    name: 'SDB',
  },
]
