export enum Coin {
  BTC = '0x88c37940184dd3df14922d248a884777d23cbe3933e6af3b47c2d194d7ec8603::mock_btc::MOCK_BTC',
  ETH = '0x88c37940184dd3df14922d248a884777d23cbe3933e6af3b47c2d194d7ec8603::mock_eth::MOCK_ETH',
  USDC = '0x88c37940184dd3df14922d248a884777d23cbe3933e6af3b47c2d194d7ec8603::mock_usdc::MOCK_USDC',
  USDT = '0x88c37940184dd3df14922d248a884777d23cbe3933e6af3b47c2d194d7ec8603::mock_usdt::MOCK_USDT',
  SUI = '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
  SDB = '0x032828cb98ef08295c02ec7860e6e25304c0f4fb1f6949dec29688448d0f1f08::sdb::SDB',
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
