import { useContext } from 'react';

import { DashboardContext } from '@/Containers/Dashboard';
import { SuiWalletConnectButton } from '@/Components';

// import * as styles from './DashboardPresentation.styles'


const DashboardPresentation = () => {
    const { walletAddress } = useContext(DashboardContext);

    return (
        <div>
            <p>Dashboard</p>
            <SuiWalletConnectButton />
        </div>
    )
};

export default DashboardPresentation;
