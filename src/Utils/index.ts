import { SUI_TESTNET_CHAIN, WalletAccount } from '@mysten/wallet-standard'
export function extract_err_message(err: string) {
  const regex = /(\d+)\)/

  const match = err.match(regex)

  if (match) {
    return match[1]
  } else {
    throw new Error('No Error Code')
  }
}

export function check_network(account: WalletAccount) {
  return account.chains[0] == SUI_TESTNET_CHAIN
}
