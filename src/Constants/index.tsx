import moment from 'moment'
import { Dashboard, Swap, Pool, Vest, Vote, Rewards, Bribe } from '@/Scenes'
import { Icon } from '@/Assets/icon'

export const generateSideBarLinks = [
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
    path: '/vest',
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
    isHidden: false,
  },
  {
    key: 'Bribe',
    path: '/bribe',
    element: <Bribe />,
    title: 'Bribe',
    icon: <Icon.StakeIcon />,
    isHidden: false,
  },
]

export const generateLinks = [
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
    key: 'Bribe',
    path: '/bribe',
    element: <Bribe />,
    title: 'Bribe',
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

export const regexEn = /^[A-Za-z]+$/

export const regexNumber = /^-?\d*\.?\d*$/

export const zeroAddress =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
