import moment from 'moment'

import { Dashboard, Swap, Pool, Vest, Vote, Rewards, Bridge } from '@/Scenes'

import { Icon } from '@/Assets/icon'
import { Balance } from '@/Hooks/Coin/useGetBalance'
import { Coins } from '@/Constants/coin'

export const END_POINT_OPTIONS = {
  fullnode: 'https://fullnode.devnet.vincagame.com',
  websocket: 'https://fullnode.devnet.vincagame.com',
  faucet: 'https://fullnode.devnet.vincagame.com/gas',
}

export const localnetConnection = {
  fullnode: 'http://127.0.0.1:9000',
  faucet: 'http://127.0.0.1:9123/gas',
}

export const generateSideBarLinks = () => [
  {
    key: 'Swap',
    path: '/swap',
    element: <Swap />,
    title: 'Swap',
    icon: <Icon.SwapIcon />,
    isHidden: false,
  },
  {
    key: 'Pool',
    path: '/pool',
    element: <Pool />,
    title: 'Pool',
    icon: <Icon.PoolIcon />,
    isHidden: false,
  },
  {
    key: 'Vest',
    path: '/vest/',
    element: <Vest />,
    title: 'Vest',
    icon: <Icon.VestIcon />,
    isHidden: false,
  },
  {
    key: 'Vote',
    path: '/vote',
    element: <Vote />,
    title: 'Vote',
    icon: <Icon.VoteIcon />,
    isHidden: false,
  },
  {
    key: 'Rewards',
    path: '/rewards',
    element: <Rewards />,
    title: 'Rewards',
    icon: <Icon.RewardsIcon />,
    isHidden: true,
  },
  {
    key: 'Bridge',
    path: '/bridge',
    element: <Bridge />,
    title: 'Bridge',
    icon: <Icon.BridgeIcon />,
    isHidden: false,
  },
]

export const generateLinks = () => [
  {
    key: 'Dashboard',
    path: '/',
    exact: true,
    element: <Dashboard />,
  },
  {
    key: 'Swap',
    path: '/swap/:action?',
    element: <Swap />,
    title: 'Swap',
  },
  {
    key: 'Pool',
    path: '/pool/:action?',
    element: <Pool />,
    title: 'Pool',
  },
  {
    key: 'Vest',
    path: '/vest/:action?',
    element: <Vest />,
    title: 'Vest',
  },
  {
    key: 'Vote',
    path: '/vote/:action?',
    element: <Vote />,
    title: 'Vote',
  },
  {
    key: 'Rewards',
    path: '/rewards/:action?',
    element: <Rewards />,
    title: 'Rewards',
  },
  {
    key: 'Bridge',
    path: '/bridge',
    element: <Bridge />,
    title: 'Bridge',
  },
]

export const vsdbTimeSettingOptions = [
  {
    label: '6 weeks',
    value: moment().add(42, 'days').toDate().toDateString(),
  },
  {
    label: '12 weeks',
    value: moment().add(84, 'days').toDate().toDateString(),
  },
  {
    label: '18 weeks',
    value: moment().add(126, 'days').toDate().toDateString(),
  },
  {
    label: '24 weeks',
    value: moment().add(168, 'days').toDate().toDateString(),
  },
]


export const fetchIcon = (name: string) => Coins.find((coin) => coin.name === name);

export const fetchBalance = (BalanceData: Balance[] | undefined, coinName: string) => BalanceData?.find((balance) => balance.coinName === coinName);
