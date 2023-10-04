export enum Coin {
  BTC = '0x2d352bb6be1e7789ae78bdfc100c870512825d1a57b9597302410a6108e451ad::mock_btc::MOCK_BTC',
  ETH = '0x2d352bb6be1e7789ae78bdfc100c870512825d1a57b9597302410a6108e451ad::mock_eth::MOCK_ETH',
  USDC = '0x2d352bb6be1e7789ae78bdfc100c870512825d1a57b9597302410a6108e451ad::mock_usdc::MOCK_USDC',
  USDT = '0x2d352bb6be1e7789ae78bdfc100c870512825d1a57b9597302410a6108e451ad::mock_usdt::MOCK_USDT',
  SUI = '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  SDB = '0x5335303848afc75af4887d64929283e580ed91b996fd2d4d61ebae243df822c3::sdb::SDB',
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
  {
    type: Coin.BTC,
    logo: <CoinIcon.BTCIcon />,
    decimals: 8,
    name: 'BTC',
  },
  {
    type: Coin.ETH,
    logo: <CoinIcon.WETHIcon />,
    decimals: 8,
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
]
