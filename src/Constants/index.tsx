
import {
    Dashboard,
    Swap,
    Pool,
    Vest,
    Vote,
    Rewards,
    Bribe,
} from '@/Scenes'

export const END_POINT_OPTIONS = {
	fullnode: "https://fullnode.devnet.vincagame.com",
	websocket: "https://fullnode.devnet.vincagame.com",
	faucet: "https://fullnode.devnet.vincagame.com/gas"
}

export const localnetConnection = {
	fullnode: 'http://127.0.0.1:9000',
	faucet: 'http://127.0.0.1:9123/gas',
};

export const generateSideBarLinks = () => [
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
        path: '/bribe/:action?',
        element: <Bribe />,
        title: 'Bribe',
    },
];

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
        key: 'Bribe',
        path: '/bribe/:action?',
        element: <Bribe />,
        title: 'Bribe',
    },
];