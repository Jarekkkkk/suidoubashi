import { ConnectButton, useWalletKit } from '@mysten/wallet-kit'
import { formatAddress } from '@mysten/sui.js'

import * as styles from './index.styles'

const SuiWalletConnectButton = () => {
  const ConnectToWallet = () => {
    const { currentAccount } = useWalletKit()

    return (
      <ConnectButton
        //@ts-ignore
        className={styles.buttonStyle}
        connectText={'Connect Wallet'}
        connectedText={
          currentAccount &&
          `Connected: ${formatAddress(currentAccount.address)}`
        }
      />
    )
  }
  return <ConnectToWallet />
}

export default SuiWalletConnectButton
