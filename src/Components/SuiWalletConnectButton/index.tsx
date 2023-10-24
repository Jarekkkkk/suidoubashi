import { useEffect, useState } from 'react';
import { ConnectButton, useWalletKit } from '@mysten/wallet-kit';
import { formatAddress } from '@mysten/sui.js';
import UserModule from '@/Modules/User';

import * as styles from './index.styles';

const SuiWalletConnectButton = () => {
  const ConnectToWallet = () => {
    const local_user = UserModule.getUserToken()
    const { currentAccount, selectAccount, accounts } = useWalletKit();
    const [loaded, setloaded] = useState(false)

    useEffect(() => {
      if (currentAccount) {
        if (!loaded) {
          const active_account = accounts.find((a) => a.address == local_user) ?? accounts[0]
          selectAccount(active_account)
          UserModule.setUserToken(active_account.address)
          setloaded(true)
        } else {
          UserModule.setUserToken(currentAccount.address)
        }
      }
    }, [currentAccount])

    return (
      <ConnectButton
        //@ts-ignore
        className={styles.buttonStyle}
        connectText={'Connect Wallet'}
        connectedText={currentAccount && `Connected: ${formatAddress(currentAccount.address)}`}
      />
    );
  }
  return <ConnectToWallet />;
};

export default SuiWalletConnectButton;
