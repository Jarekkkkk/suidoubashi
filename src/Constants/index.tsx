
import {
    Dashboard,
    Swap,
    Pool,
    Vest,
    Vote,
    Rewards,
    Bribe,
} from '@/Scenes'


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
