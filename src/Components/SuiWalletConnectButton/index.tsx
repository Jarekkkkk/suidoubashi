import { useEffect } from 'react';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { formatAddress } from '@mysten/sui.js';
import UserModule from '@/Modules/User';

import * as styles from './index.styles';

const SuiWalletConnectButton = () => {
  const ConnectToWallet = () => {
    const { currentAccount } = useWalletKit();


    useEffect(() => {
      if (currentAccount === null) {
        UserModule.removeUserToken();
      } else {
        UserModule.setUserToken(currentAccount.address)
      }
    }, [currentAccount]);

    return (
      <ConnectButton
        className={styles.buttonStyle}
        connectText={'Connect Wallet'}
        connectedText={currentAccount && `Connected: ${formatAddress(currentAccount.address)}`}
      />
    );
  }

  return <ConnectToWallet />;
};

export default SuiWalletConnectButton;
