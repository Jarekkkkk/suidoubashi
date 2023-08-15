export enum Coin {
  BTC = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_btc::MOCK_BTC',
  ETH = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_eth::MOCK_ETH',
  USDC = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_usdc::MOCK_USDC',
  USDT = '0xd60d2e85c82048a43a67fb90a5f7e0d47c466a8444ec4fa1a010da29034dfbe1::mock_usdt::MOCK_USDT',
  SUI = '0x2::sui::SUI',
  SDB = '0x6fe46b9ab46be33d41159656faaccada37cbe256eeb60c949b02b143a2d3857a::sdb::SDB',
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
